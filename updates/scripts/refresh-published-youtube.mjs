// Refresh the channel sections while retaining every other published page and asset.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const [publishedDirectory, generatedDirectory, dataFile] = process.argv.slice(2);
if (!publishedDirectory || !generatedDirectory || !dataFile) {
  throw Error('Usage: refresh-published-youtube.mjs published-docs generated-docs site.json');
}
const destination = path.resolve(publishedDirectory, 'index.html');
const published = fs.readFileSync(destination, 'utf8');
const generated = fs.readFileSync(path.resolve(generatedDirectory, 'index.html'), 'utf8');
const site = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

function elementRange(html, tag, opening) {
  const start = html.search(opening);
  assert(start >= 0, 'Missing ' + opening);
  const tags = new RegExp('<\\/?' + tag + '\\b[^>]*>', 'g');
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(html));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return {start, end: tags.lastIndex};
  }
  throw Error('Unclosed element: ' + opening);
}
function replaceElement(html, tag, opening) {
  const old = elementRange(html, tag, opening);
  const fresh = elementRange(generated, tag, opening);
  return html.slice(0, old.start) + generated.slice(fresh.start, fresh.end) + html.slice(old.end);
}
let result = published;
for (const id of ['channel', 'new', 'most-watched', 'shorts', 'watch', 'photo-diary']) {
  result = replaceElement(result, 'section', new RegExp('<section\\b[^>]*\\bid="' + id + '"[^>]*>'));
}
// Refresh both topic rows: shopping discoveries and the daily-life diary.
const topicPattern = /<div\b[^>]*class="wrap topic-videos"[^>]*>/g;
const oldTopics = [...result.matchAll(topicPattern)].map(match => {
  const range = elementRange(result.slice(match.index), 'div', /^<div\b/);
  return {start:match.index, end:match.index + range.end};
});
const freshTopics = [...generated.matchAll(topicPattern)].map(match => {
  const range = elementRange(generated.slice(match.index), 'div', /^<div\b/);
  return generated.slice(match.index, match.index + range.end);
});
assert.equal(oldTopics.length, 2, 'Expected shopping and daily-life rows');
assert.equal(freshTopics.length, oldTopics.length);
for (let index = oldTopics.length - 1; index >= 0; index--) {
  const row = oldTopics[index];
  result = result.slice(0, row.start) + freshTopics[index] + result.slice(row.end);
}

for (const [id, expected] of [['new', site.newVideos], ['watch', site.newVideos], ['most-watched', site.mostWatched], ['shorts', site.shortsLatest.map(v => v.id)]]) {
  assert.equal(expected.length, 10);
  assert.equal(new Set(expected).size, 10);
  const range = elementRange(result, 'section', new RegExp('<section\\b[^>]*\\bid="' + id + '"[^>]*>'));
  const section = result.slice(range.start, range.end);
  let previous = -1;
  for (const videoId of expected) {
    const position = section.indexOf(videoId);
    assert(position > previous, 'Missing or out-of-order channel upload: ' + videoId);
    previous = position;
  }
}
assert(result.includes('https://www.youtube.com/shorts/' + site.shortsLatest[0].id));
assert(!result.includes('views views'));
const galleryImages = new Set();
for (const photo of site.photos) {
  assert(/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(photo.image), 'Invalid gallery image filename');
  assert(!galleryImages.has(photo.image), 'Duplicate gallery photograph');
  galleryImages.add(photo.image);
  const source = path.resolve(generatedDirectory, 'assets', photo.image);
  const target = path.resolve(publishedDirectory, 'assets', photo.image);
  assert(fs.existsSync(source) && fs.statSync(source).size > 1000, 'Missing gallery image: ' + photo.image);
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.copyFileSync(source, target);
  assert(result.includes('src="assets/' + photo.image + '"'), 'Gallery photo missing from homepage');
}
const ids = [...result.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate homepage anchor');
fs.writeFileSync(destination, result);
console.log('Published homepage refreshed: latest and popular videos and Shorts, channel spotlight, Press Play, shopping and daily-life rows, and '+site.photos.length+' original gallery photographs. Other pages and assets retained.');
