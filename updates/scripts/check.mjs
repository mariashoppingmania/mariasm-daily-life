import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../docs');
const content=path.resolve(root,'../content');
const site=JSON.parse(fs.readFileSync(path.join(content,'site.json'),'utf8'));
const research=JSON.parse(fs.readFileSync(path.join(content,'video-research.json'),'utf8'));
assert.equal(new Set(site.videos.map(v=>v.id)).size,site.videos.length,'Videos must be unique');
assert.deepEqual(site.newVideos,research.latest.slice(0,10).map(v=>v.id),'New must follow the observed newest-first order');
assert.deepEqual(site.mostWatched,research.popular.slice(0,10).map(v=>v.id),'Ranking must follow the observed Popular order');
assert.deepEqual(site.shortsLatest.map(v=>v.id),research.shortsLatest.map(v=>v.id),'Latest Shorts must follow YouTube upload order');
assert.deepEqual(site.shortsPopular.map(v=>v.id),research.shortsPopular.map(v=>v.id),'Popular Shorts must follow YouTube ranking');
for(const list of [site.shortsLatest,site.shortsPopular]){assert.equal(list.length,10);assert.equal(new Set(list.map(v=>v.id)).size,10);for(const v of list){assert(/^[A-Za-z0-9_-]{11}$/.test(v.id));assert(v.title&&v.image&&v.views);assert(!site.videos.some(x=>x.id===v.id),'Shorts must be separate from long-form videos');}}
assert.equal(site.photos.length,11,'Expected eleven owner photographs');
for(const id of [...site.newVideos,...site.mostWatched])assert(site.videos.some(v=>v.id===id),`Unknown video ${id}`);
assert.equal(new Set(site.videos.map(v=>v.filter)).size,5,'Expected five browse categories');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(root),pages=files.filter(f=>f.endsWith('.html'));let references=0;
assert(pages.length>=8,'Expected homepage, five stories and two information pages');
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert(html.includes('<html lang="en">'),`Wrong language: ${file}`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`Expected one h1: ${file}`);
 assert(/<meta name="description" content="[^"]+"/.test(html),`Missing description: ${file}`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,`Duplicate id: ${file}`);
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const url=match[1];if(/^(https?:|mailto:|data:)/.test(url))continue;
  assert(!url.startsWith('/'),`Root-relative URL breaks project Pages: ${url}`);
  const [withQuery,hash]=url.split('#');const base=withQuery.split('?')[0];const target=base?path.resolve(path.dirname(file),base):file;
  assert(fs.existsSync(target),`Missing target ${url} in ${file}`);references++;
  if(hash && target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Missing anchor ${url}`);
 }
 for(const img of html.matchAll(/<img\b[^>]*>/g))assert(/\balt="[^"]*"/.test(img[0]),`Missing alt: ${file}`);
 for(const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert(/rel="[^"]*noopener/.test(link[0]),'Unsafe new-tab link');
 assert(!/<iframe|<form|googletagmanager|google-analytics/.test(html),'Unexpected tracking/embed/form');
}
const total=files.reduce((sum,f)=>sum+fs.statSync(f).size,0);
console.log(`PASS: ${pages.length} English pages; ${references} valid local references; ${site.videos.length} unique videos; verified newest 10 and ranked 10; ${site.photos.length} owner photos. Static site: ${(total/1024).toFixed(0)} KB.`);
