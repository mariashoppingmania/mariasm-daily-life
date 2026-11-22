// Read only the channel's public tabs and the public Popular sorting command.
const headers = {'User-Agent':'Mozilla/5.0', 'Accept-Language':'en-US,en;q=0.9'};
const validId = value => /^[A-Za-z0-9_-]{11}$/.test(String(value));
const text = value => typeof value === 'string' ? value : value?.content ?? value?.simpleText ?? value?.runs?.map(run => run.text).join('') ?? '';

function* walk(value) {
  if (!value || typeof value !== 'object') return;
  yield value;
  for (const child of Object.values(value)) yield* walk(child);
}

function jsonAfter(html, marker) {
  const markerAt = html.indexOf(marker);
  if (markerAt < 0) throw Error('Public channel page is missing ' + marker);
  const start = html.indexOf('{', markerAt + marker.length);
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const char = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return JSON.parse(html.slice(start, i + 1));
  }
  throw Error('Incomplete public channel data');
}

export function channelEntries(data, tab) {
  const entries = new Map();
  for (const node of walk(data)) {
    let row;
    if (tab === 'shorts' && node.shortsLockupViewModel) {
      const short = node.shortsLockupViewModel;
      const id = short.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
      const metadata = short.overlayMetadata || {};
      const thumbnail = short.thumbnailViewModel?.thumbnailViewModel || short.thumbnailViewModel;
      row = {id, title:text(metadata.primaryText), views:text(metadata.secondaryText), duration:'', age:'', image:thumbnail?.image?.sources?.[0]?.url};
    } else if (tab === 'videos' && node.lockupViewModel?.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
      const video = node.lockupViewModel;
      const metadata = video.metadata?.lockupMetadataViewModel;
      const parts = metadata?.metadata?.contentMetadataViewModel?.metadataRows?.flatMap(row => row.metadataParts || []) || [];
      const views = parts.find(part => /views?/i.test(part.accessibilityLabel || '') || part.leadingIcon?.name === 'PLAY_ARROW_OUTLINED');
      const age = parts.find(part => /ago|premiered|streamed/i.test(part.accessibilityLabel || text(part.text)));
      const badge = [...walk(video.contentImage)].find(part => /^\d+:\d{2}(?::\d{2})?$/.test(part.thumbnailBadgeViewModel?.text || ''));
      row = {id:video.contentId, title:text(metadata?.title), views:text(views?.text), duration:badge?.thumbnailBadgeViewModel.text || '', age:age?.accessibilityLabel || text(age?.text)};
    } else if (tab === 'videos' && node.videoRenderer) {
      const video = node.videoRenderer;
      row = {id:video.videoId, title:text(video.title), views:text(video.viewCountText), duration:text(video.lengthText), age:text(video.publishedTimeText)};
    } else if (tab === 'shorts' && node.reelItemRenderer) {
      const short = node.reelItemRenderer;
      row = {id:short.videoId, title:text(short.headline), views:text(short.viewCountText), duration:'', age:'', image:short.thumbnail?.thumbnails?.[0]?.url};
    }
    if (!row || !validId(row.id) || !row.title || entries.has(row.id)) continue;
    row.title = row.title.trim();
    row.views = row.views.replace(/\u00a0/g, ' ').trim();
    if (/^no views$/i.test(row.views)) row.views = '0 views';
    if (/^[\d,.]+\s*[KMB]?$/i.test(row.views)) row.views += ' views';
    row.image = row.image ? row.image.split('?')[0] : 'https://img.youtube.com/vi/' + row.id + '/hqdefault.jpg';
    entries.set(row.id, row);
  }
  return [...entries.values()];
}

async function request(url, options = {}) {
  const response = await fetch(url, {...options, headers:{...headers,...options.headers}, signal:AbortSignal.timeout(25000)});
  if (!response.ok) throw Error('YouTube returned HTTP ' + response.status);
  return response;
}

export async function readPublicChannelTab(handle, tab) {
  const html = await (await request(handle + '/' + tab)).text();
  const initial = jsonAfter(html, 'var ytInitialData =');
  const latest = channelEntries(initial, tab);
  if (latest.length < 10) throw Error('Fewer than ten verified ' + tab);
  let popular = null;
  try {
    const chip = [...walk(initial)].map(node => node.chipViewModel || node.chipCloudChipRenderer).find(chip => chip && /^popular$/i.test(text(chip.text)));
    const command = chip?.tapCommand?.innertubeCommand || chip?.navigationEndpoint;
    const continuation = command?.continuationCommand?.token;
    if (!continuation && !command?.browseEndpoint) throw Error('Popular sorting command missing');
    const context = jsonAfter(html, '"INNERTUBE_CONTEXT":');
    const body = {context, ...(continuation ? {continuation} : command.browseEndpoint)};
    const data = await (await request('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    })).json();
    popular = channelEntries(data, tab).slice(0, 10);
    if (popular.length !== 10) throw Error('Incomplete Popular collection');
  } catch (error) {
    console.log('[YouTube refresh] Previous Popular snapshot retained for ' + tab + ': ' + error.message);
    popular = null;
  }
  return {latest, popular};
}
