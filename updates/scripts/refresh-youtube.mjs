// Refresh the public YouTube Videos and Shorts tabs immediately before the Pages build.
// It preserves the last verified snapshot when the platform refuses discovery.
// No unofficial view counts, invented publication dates, or fake thumbnails.
import fs from 'node:fs';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';

const exec = promisify(execFile);
const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/site.json');
const site = JSON.parse(fs.readFileSync(file,'utf8'));
const handle=String(site.youtube||'').replace(/\/+$/,'');
const idPattern=/^[A-Za-z0-9_-]{11}$/;
const today = new Date().toISOString().slice(0,10);
const shortImage = id => 'https://img.youtube.com/vi/' + id + '/oardefault.jpg';
const videoImage = id => 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
const log = (...s) => console.log('[YouTube refresh]', ...s);

async function readTab(tab) {
  const url=handle+'/'+tab;
  try {
    const {stdout,stderr} = await exec('yt-dlp',[
      '--flat-playlist','--playlist-end','12','--dump-json',
      '--ignore-errors','--no-warnings','--no-check-certificates',
      '--socket-timeout','12','--retries','1',url
    ],{timeout:90000,maxBuffer:3*1024*1024});
    const records=stdout.split(/\r?\n/).filter(Boolean).flatMap(line=>{
      try{return [JSON.parse(line)]}catch{return []}
    });
    const used = new Set();
    const entries = records.map(v=>{
      let id=String(v.id||v.url||'').split('v=').pop();
      const title=typeof v.title==='string'?v.title.trim():'';
      if (!idPattern.test(id)||!title||used.has(id)) return null;
      used.add(id);
      return {id,title,duration:typeof v.duration==='number'?v.duration:null,
        timestamp:typeof v.timestamp==='number'?v.timestamp:null,
        uploadDate:typeof v.upload_date==='string'?v.upload_date:null};
    }).filter(Boolean).slice(0,10);
    if(entries.length<2) throw new Error('Not enough verified uploads in channel tab');
    log('Discovered',entries.length,tab,'first:',entries[0].id,JSON.stringify(entries[0].title));
    return entries;
  } catch(err) {
    log('Could not read',tab,'tab:',String(err.message).slice(0,230),'— existing snapshot preserved');
    return null;
  }
}
const videos=await readTab('videos');
if(videos){
  const before=new Map(site.videos.map(v=>[v.id,v]));
  const fmtDuration=n=>{
    if(!Number.isFinite(n)||n<=0)return 'Watch on YouTube';
    const sec=Math.floor(n),mm=Math.floor(sec/60),ss=String(sec%60).padStart(2,'0');
    return mm+':'+ss;
  };
  for(const v of videos){
    const original=before.get(v.id);
    if(original)continue;
    const date=v.timestamp?new Date(v.timestamp*1000).toISOString().slice(0,10):
      v.uploadDate?.match(/^\d{8}$/)?v.uploadDate.replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3'):null;
    const item={id:v.id,title:v.title,originalTitle:v.title,
      category:'Latest upload',filter:'life',description:'',
      duration:fmtDuration(v.duration),viewsLabel:'See YouTube',
      publishedLabel:date||'New on YouTube',image:videoImage(v.id),
      source:'https://www.youtube.com/watch?v='+v.id};
    if(date)item.publishedAt=date+'T12:00:00Z';
    before.set(v.id,item);
  }
  site.videos=[...before.values()];
  site.newVideos=videos.map(x=>x.id);
  site.featuredVideo=videos[0].id;
  site.verifiedOn=today;
  site.videoScope='Public YouTube Videos tab; Shorts and live streams excluded. Freshness check '+today+'.';
}
const shorts=await readTab('shorts');
if(shorts){
  const prior=new Map(site.shortsLatest.map(s=>[s.id,s]));
  site.shortsLatest=shorts.map(v=>prior.get(v.id)||{
    id:v.id,title:v.title,views:'View on YouTube',age:'',duration:'',
    image:shortImage(v.id)
  });
  site.shortsVerifiedOn=today;
}
if(videos||shorts){
  fs.writeFileSync(file,JSON.stringify(site,null,2)+'\n');
  log('Build will include refreshed channel data; video:',site.newVideos[0],'; short:',site.shortsLatest[0].id);
}else {
  log('Neither tab available. Deploy will keep the previous verified data and original verification dates.');
}
