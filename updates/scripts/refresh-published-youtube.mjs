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
for (const id of ['channel', 'new', 'shorts', 'watch']) {
  result = replaceElement(result, 'section', new RegExp('<section\\b[^>]*\\bid="' + id + '"[^>]*>'));
}
// The homepage's first topic row is the four-card shopping video selection.
result = replaceElement(result, 'div', /<div\b[^>]*class="wrap topic-videos"[^>]*>/);

for (const [id, expected] of [['new', site.newVideos], ['shorts', site.shortsLatest.map(v => v.id)]]) {
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
const ids = [...result.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate homepage anchor');
fs.writeFileSync(destination, result);
console.log('Published homepage refreshed: 10 videos, 10 Shorts, channel spotlight, Press Play and shopping row. Other pages and assets retained.');
