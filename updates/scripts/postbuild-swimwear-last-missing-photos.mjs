import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'docs','swimwear-lingerie');
const page=path.join(dir,'index.html');
let html=fs.readFileSync(page,'utf8');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\x27':'&#39;'}[c]));
const catalogIndex=html.indexOf('<section id="swim-edit-2026">');
if(catalogIndex<0)throw Error('Expanded Swimwear catalog not available');
const catalog=html.slice(catalogIndex);
const products={};
for(const m of catalog.matchAll(/<section class="swx-group" id="swx-([^"]+)">([\s\S]*?)<\/section>/g)){
 const category=m[1];products[category]=[];
 for(const match of m[2].matchAll(/<article class="swx-product">([\s\S]*?)<\/article>/g)){
  const body=match[1];
  const image=body.match(/<img\b[^>]*src="([^"]+)"/)?.[1];
  const name=body.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
  const brand=body.match(/<small>([\s\S]*?)<\/small>/)?.[1];
  const description=body.match(/<p>([\s\S]*?)<\/p>/)?.[1];
  const price=body.match(/<strong>([\s\S]*?)<\/strong>/)?.[1];
  const url=body.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
  if(!image||!name||!brand||!price||!url)continue;
  const asset=path.join(dir,image);
  if(!image.startsWith('assets/expanded-shop/')||!fs.existsSync(asset)||fs.statSync(asset).size<4500)continue;
  products[category].push({image,name,brand,description,price,url});
 }
}
const alreadyUsed=new Set([...html.matchAll(/class="ms-auth-photo"[^>]*src="([^"]+)"/g)].map(m=>m[1]));
const replacements=[
 {title:'High-Waist Bikini Bottoms',category:'bottoms'},
 {title:'Bella Underwire Bikini Set Sea Blue',category:'bikini'}
];
let replaced=0;
for(const item of replacements){
 const found=[...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].find(m=>m[0].includes(item.title));
 if(!found)throw Error('Cannot locate placeholder card: '+item.title);
 const pool=products[item.category]||[];
 const product=pool.find(p=>!alreadyUsed.has(p.image));
 if(!product)throw Error('No local photo-verified replacement for '+item.title);
 const newCard='<article class="ms-authentic-swim-product" data-replaced-editorial="'+esc(item.title)+'"><img class="ms-auth-photo" loading="lazy" decoding="async" src="'+esc(product.image)+'" alt="'+esc(product.brand+' '+product.name)+' — actual retailer product photo"><div class="ms-auth-body"><small>'+product.brand+'</small><h3>'+product.name+'</h3><p>'+product.description+'</p><strong>'+product.price+'</strong><a href="'+product.url+'" target="_blank" rel="noopener noreferrer">View this exact product ↗</a></div></article>';
 html=html.slice(0,found.index)+newCard+html.slice(found.index+found[0].length);
 alreadyUsed.add(product.image);
 replaced++;
 console.log('Replaced missing-photo card:',item.title,'→',product.brand,product.name,'with',product.image);
}
if(replaced!==2)throw Error('Expected exactly two placeholder fixes; applied '+replaced);
for(const item of replacements){
 if(!html.includes('data-replaced-editorial="'+esc(item.title)+'"'))throw Error('Replacement marker missing for '+item.title);
}
if(!html.includes('id="ms-authentic-swim-product-css"'))throw Error('Authentic product CSS was not included by previous step');
fs.writeFileSync(page,html);
console.log('Both missing-photo cards replaced with distinct authentic retailer products; no fallback icons in corrected cards.');
