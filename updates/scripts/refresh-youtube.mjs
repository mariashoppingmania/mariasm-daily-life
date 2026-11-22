// Refresh every home video collection from verified public channel data.
import fs from 'node:fs';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {readPublicChannelTab} from './read-youtube-channel.mjs';

const exec = promisify(execFile);
const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/site.json');
const site = JSON.parse(fs.readFileSync(file, 'utf8'));
const handle = String(site.youtube || '').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);
const labels = {shopping:'Shopping finds', beauty:'Beauty & fragrance', accessories:'Watches & accessories', style:'Personal style', life:'Daily life & travel'};
const duration = seconds => Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0') : '';

async function readTab(tab) {
  try { return await readPublicChannelTab(handle, tab); }
  catch (error) {
    console.log('[YouTube refresh] Public tab reader unavailable for ' + tab + ': ' + error.message);
    try {
      const {stdout} = await exec('yt-dlp', ['--flat-playlist','--playlist-end','40','--dump-json','--ignore-errors','--no-warnings','--socket-timeout','12','--retries','1',handle + '/' + tab], {timeout:90000,maxBuffer:6*1024*1024});
      const entries = new Map();
      for (const line of stdout.split(/\r?\n/).filter(Boolean)) {
        let value; try { value = JSON.parse(line); } catch { continue; }
        if (!/^[A-Za-z0-9_-]{11}$/.test(value.id) || !value.title) continue;
        entries.set(value.id, {id:value.id,title:value.title.trim(),duration:duration(value.duration),views:Number.isFinite(value.view_count) ? value.view_count + ' views' : '',age:'',image:'https://img.youtube.com/vi/' + value.id + '/hqdefault.jpg'});
      }
      if (entries.size < 10) throw Error('Incomplete fallback collection');
      return {latest:[...entries.values()],popular:null};
    } catch (fallback) {
      console.log('[YouTube refresh] Verified ' + tab + ' snapshot preserved: ' + fallback.message.slice(0, 180));
      return null;
    }
  }
}

function classify(video, prior) {
  const title = video.title.toLowerCase();
  if (/haul|shopping|amazon|asos|unbox|purchases/.test(title)) return 'shopping';
  if (/\bwatch(?:es)?\b|timepiece|bracelet|earrings?|necklace|jewellery|jewelry|handbag/.test(title)) return 'accessories';
  if (/makeup|make-up|perfume|fragrance|beauty|skincare|cosmetic/.test(title)) return 'beauty';
  if (/styling|outfit|ootd|try.on|lookbook|wardrobe/.test(title)) return 'style';
  return Object.hasOwn(labels, prior?.filter) ? prior.filter : 'life';
}

const [videos, shorts] = await Promise.all(['videos', 'shorts'].map(readTab));
if (videos) {
  const catalogue = new Map(site.videos.map(video => [video.id, video]));
  for (const video of [...videos.latest, ...(videos.popular || [])]) {
    const prior = catalogue.get(video.id);
    const filter = classify(video, prior);
    const item = {...prior, id:video.id, title:video.title, originalTitle:video.title, category:labels[filter], filter,
      description:prior?.description || '', duration:video.duration || prior?.duration || '',
      viewsLabel:video.views ? video.views.replace(/\s+views?$/i, '') : prior?.viewsLabel || 'See YouTube',
      publishedLabel:prior?.publishedAt ? prior.publishedLabel : video.age || prior?.publishedLabel || 'New on YouTube',
      image:video.image, source:'https://www.youtube.com/watch?v=' + video.id};
    if (video.views) {
      item.metricsCheckedOn = today;
      // Rounded public labels are kept as labels, never converted into exact counts.
      if (/^\d[\d,]* views?$/.test(video.views)) item.viewCount = Number(video.views.replace(/[^\d]/g, ''));
      else delete item.viewCount;
    }
    catalogue.set(video.id, item);
  }
  site.videos = [...catalogue.values()];
  site.newVideos = videos.latest.slice(0, 10).map(video => video.id);
  site.featuredVideo = site.newVideos[0];
  const shopping = videos.latest.filter(video => catalogue.get(video.id).filter !== 'life').slice(0, 4).map(video => video.id);
  const life = videos.latest.filter(video => catalogue.get(video.id).filter === 'life' && /sea|beach|trip|daily|garden|travel|escapade|day with|summer/i.test(video.title)).slice(0, 4).map(video => video.id);
  if (shopping.length === 4) site.shoppingVideos = shopping;
  if (life.length === 4) site.dailyLifeVideos = life;
  site.verifiedOn = today;
  site.videoScope = 'Public YouTube Videos tab; Shorts and live streams excluded. Freshness check ' + today + '.';
  if (videos.popular) {
    site.mostWatched = videos.popular.map(video => video.id);
    site.rankingVerifiedOn = today;
  }
}
if (shorts) {
  const previous = new Map([...site.shortsLatest, ...site.shortsPopular].map(short => [short.id, short]));
  const shortEntry = short => ({...previous.get(short.id), ...short, views:short.views || previous.get(short.id)?.views || 'View on YouTube'});
  site.shortsLatest = shorts.latest.slice(0, 10).map(shortEntry);
  site.shortsVerifiedOn = today;
  if (shorts.popular) {
    site.shortsPopular = shorts.popular.map(shortEntry);
    site.shortsPopularVerifiedOn = today;
  }
}
if (videos || shorts) {
  fs.writeFileSync(file, JSON.stringify(site, null, 2) + '\n');
  console.log('[YouTube refresh] All home collections refreshed. Video:', site.newVideos[0], '; Short:', site.shortsLatest[0].id, '; checked:', today);
}
