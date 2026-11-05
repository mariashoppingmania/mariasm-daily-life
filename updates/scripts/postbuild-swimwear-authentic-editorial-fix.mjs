import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'docs/swimwear-lingerie/index.html');
let html=fs.readFileSync(file,'utf8');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\x27':'&#39;'}[c]));
const source=html.slice(html.indexOf('<section id="swim-edit-2026">'));
if(!source.startsWith('<section id="swim-edit-2026">'))throw Error('Missing verified swimwear gallery');
const candidates={};
for(const match of source.matchAll(/<section class="swx-group" id="swx-([^"]+)">([\s\S]*?)<\/section>/g)){
 const group=match[1],products=[];
 for(const card of match[2].matchAll(/<article class="swx-product">([\s\S]*?)<\/article>/g)){
  const body=card[1],img=body.match(/<img\b[^>]*\bsrc="([^"]+)"/)?.[1];
  const brand=body.match(/<small>([\s\S]*?)<\/small>/)?.[1];
  const title=body.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
  const price=body.match(/<strong>([\s\S]*?)<\/strong>/)?.[1];
  const link=body.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
  const desc=body.match(/<p>([\s\S]*?)<\/p>/)?.[1];
  if(img&&brand&&title&&price&&link&&fs.existsSync(path.join(root,'docs/swimwear-lingerie',img)))products.push({img,brand,title,price,link,desc});
 }
 candidates[group]=products;
}
const tasks=[
 ['Triangle bikini tops','bikini',0],
 ['Brazilian bikini briefs','bottoms',0],
 ['Bandeau bikini sets','bikini',1],
 ['One-piece swimsuits','onepiece',0],
 ['Active bralette swim','bikini',2],
 ['Lace bralettes','lingerie',0],
 ['Silk sleepwear','lingerie',1],
 ['Thong bikini bottoms','bottoms',1]
];
let count=0;
const distinct=new Set();
const css='<style id="ms-authentic-swim-product-css">.ms-authentic-swim-product{overflow:hidden;border:1px solid #ead5e2;border-radius:18px;background:white;box-shadow:0 9px 26px rgba(92,40,70,.06);min-width:0;display:flex;flex-direction:column}.ms-authentic-swim-product .ms-auth-photo{display:block;width:100%;height:190px!important;max-height:190px!important;object-fit:contain!important;object-position:center!important;background:white;padding:7px;box-sizing:border-box}.ms-authentic-swim-product .ms-auth-body{padding:16px;display:flex;flex:1;flex-direction:column;gap:8px}.ms-authentic-swim-product h3{font:normal 22px/1.17 Georgia,serif;margin:0;color:#632b49}.ms-authentic-swim-product small{font-weight:800;letter-spacing:.06em;color:#aa6388}.ms-authentic-swim-product p{font-size:13px;line-height:1.45;margin:0;color:#6b5364}.ms-authentic-swim-product strong{display:block;font-size:20px;color:#822b56;margin-top:auto}.ms-authentic-swim-product a{display:inline-block;align-self:flex-start;padding:8px 13px;border-radius:30px;background:#813754;color:#fff!important;text-decoration:none;font-size:13px;font-weight:700}@media(max-width:480px){.ms-authentic-swim-product .ms-auth-photo{height:230px!important;max-height:230px!important}}</style>';
for(const [label,group,offset] of tasks){
 const available=candidates[group]||[];
 const actual=[...available.slice(offset),...available.slice(0,offset)].find(p=>!distinct.has(p.img));
 if(!actual){console.warn('No verified product available for',label);continue}
 const newCard='<article class="ms-authentic-swim-product" data-replaced-editorial="'+E(label)+'"><img class="ms-auth-photo" loading="lazy" decoding="async" src="'+E(actual.img)+'" alt="'+actual.brand+' '+actual.title+' — original verified product photograph"><div class="ms-auth-body"><small>'+actual.brand+'</small><h3>'+actual.title+'</h3><p>'+actual.desc+'</p><strong>'+actual.price+'</strong><a href="'+actual.link+'" target="_blank" rel="noopener noreferrer">View this exact product ↗</a></div></article>';
 let done=false;
 // The old cards are individually marked up as articles. Replace the ENTIRE card,
 // not only the photograph, so its brand/price always match the original product.
 html=html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g,card=>{
  if(done||!card.includes(label)||card.includes('class="swx-product"'))return card;
  done=true;return newCard;
 });
 if(done){distinct.add(actual.img);count++}
 else console.warn('Could not locate original editorial card',label);
}
if(count===0)throw Error('No original editorial product cards were found — inspect live markup before replacement');
if(!html.includes('id="ms-authentic-swim-product-css"'))html=html.replace('</head>',css+'</head>');
fs.writeFileSync(file,html);
console.log('Replaced',count,'repetitive editorial-style cards with distinct, locally verified authentic product photos and matching original product information');
