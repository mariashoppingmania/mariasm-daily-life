// MariaSM Christmas Gifts 2026 — curated from the site's verified retailer-photo catalogues.
// Product photography and shopping links are copied from the already built individual atelier
// pages. If an exact photographed listing is not available, do not invent it.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
const outDir=path.join(docs,'christmas-gifts');
fs.mkdirSync(outDir,{recursive:true});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>String(s??'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').trim();
const get=(src,regex)=>src.match(regex)?.[1]||'';
const all=[],seen=new Set();
function add(product){
 const p={...product,title:plain(product.title),brand:plain(product.brand),price:plain(product.price)};
 if(!p.title||!p.img||!p.url||!/^https:\/\//i.test(p.url)||!/[0-9]/.test(p.price))return;
 const key=p.url.replace(/[#?].*$/,'').replace(/\/$/,'').toLowerCase();
 if(seen.has(key))return;
 if(!/^https:\/\//i.test(p.img)){
  const abs=path.resolve(outDir,p.img);
  if(!abs.startsWith(docs+path.sep)||!fs.existsSync(abs)||fs.statSync(abs).size<3500)return;
 }
 seen.add(key);all.push(p);
}
function fixImg(slug,src){
 if(!src)return '';
 if(/^https:\/\//i.test(src))return src.replaceAll('&amp;','&');
 if(src.startsWith('data:')||src.startsWith('//'))return '';
 return path.posix.normalize('../'+slug+'/'+src);
}
function readPage(slug){
 const p=path.join(docs,slug,'index.html');
 return fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
}
for(const slug of ['belts-suspenders','scarves','gloves','home-utensils','fine-tableware','venetian-glass']){
 const html=readPage(slug);
 for(const match of html.matchAll(/<article class="ma-product"[^>]*>[\s\S]*?<\/article>/g)){
  const block=match[0];
  const img=get(block,/<img\b[^>]*\bsrc="([^"]+)"/);
  const title=get(block,/<h3>([\s\S]*?)<\/h3>/);
  const price=get(block,/<span class="ma-price">([\s\S]*?)<\/span>/);
  const brand=get(block,/<div class="ma-product-body">[\s\S]*?<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>/);
  const url=get(block,/<a class="ma-shop-link" href="([^"]+)"/);
  const group=slug==='home-utensils'?'Home & Kitchen':slug==='fine-tableware'?'Table & Hosting':slug==='venetian-glass'?'Handmade Design':slug==='belts-suspenders'?'Fashion & Accessories':'Winter Warmers';
  add({title,brand,price,img:fixImg(slug,img),url:url.replaceAll('&amp;','&'),group,origin:slug});
 }
}
{
 const html=readPage('hair');
 for(const match of html.matchAll(/<article class="hair-shop-card"[^>]*>[\s\S]*?<\/article>/g)){
  const block=match[0],kind=get(block,/data-kind="([^"]+)"/);
  add({title:get(block,/<h3>([\s\S]*?)<\/h3>/),brand:plain(get(block,/<small>([\s\S]*?)<\/small>/)).split(' · ').slice(1).join(' · ')||'Brand catalogue',
   price:get(block,/<div class="hair-shop-text">[\s\S]*?<strong>([\s\S]*?)<\/strong>/),
   img:fixImg('hair',get(block,/<img\b[^>]*\bsrc="([^"]+)"/)),
   url:get(block,/<a class="hair-shop-buy" href="([^"]+)"/).replaceAll('&amp;','&'),
   group:/dryers|hot tools/i.test(kind)?'Tech & Beauty':'Beauty & Grooming',origin:'hair',kind});
 }
}
{
 const html=readPage('hats');
 for(const match of html.matchAll(/<article class="ew-product">[\s\S]*?<\/article>/g)){
  const block=match[0];
  add({title:get(block,/<h3>([\s\S]*?)<\/h3>/),brand:get(block,/<small>([\s\S]*?)<\/small>/),
   price:get(block,/<strong>([\s\S]*?)<\/strong>/),
   img:fixImg('hats',get(block,/<img\b[^>]*\bsrc="([^"]+)"/)),
   url:get(block,/<a href="([^"]+)"/).replaceAll('&amp;','&'),
   group:'Eyewear & Style',origin:'eyewear'});
 }
}
const byOrigin=s=>all.filter(p=>p.origin===s);
const chosen=new Set();
const him=[],her=[];
function take(dest,origin,count,predicate=()=>true){
 let items=byOrigin(origin).filter(p=>!chosen.has(p.url)&&predicate(p));
 // Vary reference budgets without claiming live shop prices.
 items.sort((a,b)=>{
  const price=x=>Number((x.price.replace(/[, ]/g,'').match(/[0-9]+(?:\.[0-9]+)?/)||[])[0]||0);
  return price(a)-price(b);
 });
 const spread=[];
 while(items.length){spread.push(items.shift());if(items.length)spread.push(items.pop());}
 for(const p of spread.slice(0,count)){dest.push(p);chosen.add(p.url);}
}
function fill(dest,target){
 for(const origin of ['home-utensils','eyewear','hair','scarves','gloves','belts-suspenders','fine-tableware','venetian-glass']){
  if(dest.length>=target)break;
  take(dest,origin,target-dest.length);
 }
}
take(him,'belts-suspenders',8);
take(him,'scarves',8);
take(him,'gloves',8);
take(him,'home-utensils',11);
take(him,'eyewear',7);
take(him,'hair',5,p=>p.group==='Tech & Beauty');
take(him,'fine-tableware',3);
fill(him,50);

take(her,'hair',12,p=>p.group==='Tech & Beauty');
take(her,'hair',5,p=>p.group==='Beauty & Grooming');
take(her,'eyewear',8);
take(her,'scarves',7);
take(her,'gloves',6);
take(her,'home-utensils',9);
take(her,'fine-tableware',3);
fill(her,50);

if(him.length!==50||her.length!==50){
 throw Error('Gift guide requires 50 unique photographed items per collection: for him '+him.length+', for her '+her.length+'; total catalogue '+all.length);
}
const list=[...him.map((p,i)=>({...p,audience:'him',num:i+1})),...her.map((p,i)=>({...p,audience:'her',num:i+1}))];
if(new Set(list.map(p=>p.url)).size!==100)throw Error('Duplicated retailer product detected');
const priceBand=text=>{
 const n=Number((text.replace(/[, ]/g,'').match(/[0-9]+(?:\.[0-9]+)?/)||[])[0]);
 if(!Number.isFinite(n))return 'any';
 // Band estimates are for filtering only, using original retailer-currency snapshots.
 return n<30?'small':n<100?'medium':'special';
};
const card=p=>{
 const image=esc(p.img),link=esc(p.url),title=esc(p.title),brand=esc(p.brand),price=esc(p.price);
 return '<article class="gift-card" data-audience="'+p.audience+'" data-kind="'+esc(p.group)+'" data-band="'+priceBand(p.price)+'" data-search="'+esc((p.title+' '+p.brand+' '+p.group).toLowerCase())+'">'
  +'<a class="gift-image" href="'+link+'" target="_blank" rel="noopener noreferrer" aria-label="View '+title+' at the seller"><img src="'+image+'" alt="Original retailer photograph of '+title+'" loading="lazy" decoding="async"><span class="gift-number">GIFT '+String(p.num).padStart(2,'0')+'</span></a>'
  +'<div class="gift-detail"><span class="gift-category">'+esc(p.group)+'</span><h3>'+title+'</h3><p class="gift-brand">'+brand+'</p><p class="gift-price">'+price+'</p><p class="gift-greeting">'+(p.audience==='him'?'A thoughtful little surprise.':'Wrapped with a little magic.')+'</p><a class="gift-shop" href="'+link+'" target="_blank" rel="noopener noreferrer">View at the retailer ↗</a></div></article>';
};
const css=String.raw`
:root{--pine:#123c32;--berry:#863e4b;--gold:#f6ca78;--cream:#fff8ea;--ink:#473d38}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:var(--ink)}a{color:inherit}
.gift-top{background:#113c30;color:#fceaca;padding:13px 5%;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;font-size:13px}.gift-top a{text-decoration:none;font-weight:750}.gift-top nav{display:flex;gap:16px;flex-wrap:wrap}
.gift-hero{position:relative;overflow:hidden;text-align:center;padding:78px 20px 85px;background:radial-gradient(circle at 10% 25%,#d9aa545e,transparent 30%),radial-gradient(circle at 95% 80%,#ffd4822a,transparent 38%),linear-gradient(120deg,#163d33,#732e3f 74%,#4b172e);color:#fff8e8}
.gift-hero:before{content:"❄ ✧ ✶ ❄ ✧ ❄ ✶ ✧ ❄ ✶ ❄ ✧";position:absolute;top:15px;left:0;width:100%;opacity:.55;font-size:19px;letter-spacing:1.2em;white-space:nowrap;animation:floatflake 13s linear infinite}.gift-hero .ornaments{font-size:37px;letter-spacing:.3em}.gift-hero .kicker{color:#ffdf9b;text-transform:uppercase;font-size:11px;font-weight:800;letter-spacing:.22em;margin-top:20px}.gift-hero h1{font:normal clamp(42px,6.2vw,86px)/1.08 Georgia,serif;margin:20px auto;max-width:950px;text-shadow:0 4px 25px #170b1e55}.gift-hero em{color:#ffd99c}.gift-hero p{line-height:1.7;max-width:750px;margin:0 auto 26px;font-size:16px}.gift-hero .hero-actions{display:flex;gap:15px;justify-content:center;flex-wrap:wrap}.gift-hero .hero-actions a{background:#fff1cd;color:#55283b;padding:13px 22px;text-decoration:none;border-radius:35px;font-weight:800;border:2px solid #eec87e}.gift-hero .hero-actions a:last-child{background:transparent;color:white}.gift-hero .snow{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,#fff6e8aa 1px,transparent 2px);background-size:37px 49px;opacity:.15}
.gift-wrap{max-width:1240px;margin:auto;padding:0 24px}.gift-intro{padding-top:50px;text-align:center}.gift-intro h2{font:normal 40px Georgia,serif;color:var(--berry);margin:0 0 12px}.gift-intro p{line-height:1.65;max-width:840px;margin:10px auto;color:#66564b}.gift-stats{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:22px auto}.gift-stats strong{background:#fff;border:1px solid #e5c99b;border-radius:14px;padding:12px 24px;color:#6f3448}
.gift-controls{position:sticky;top:0;z-index:10;display:flex;flex-wrap:wrap;align-items:center;gap:12px;background:#fcf4e8ed;border:1px solid #e7c99a;border-radius:0 0 20px 20px;padding:12px 18px;backdrop-filter:blur(10px);box-shadow:0 7px 25px #452f2520}.gift-controls button,.gift-controls select,.gift-controls input{border:1px solid #ccafa8;padding:11px 15px;border-radius:14px;background:#fff;color:#573648;font:600 13px system-ui}.gift-controls button{cursor:pointer}.gift-controls button.active{background:#843d53;color:white;border-color:#843d53}.gift-controls input{flex:1;min-width:180px}.gift-count{font-weight:700;font-size:12px;color:#77465d}
.gift-head{padding:42px 0 18px;display:flex;justify-content:space-between;align-items:end;gap:22px;border-bottom:2px solid #e6cb9c;margin-bottom:25px}.gift-head h2{font:normal clamp(30px,4vw,48px) Georgia,serif;color:#823d4f;margin:0}.gift-head p{color:#786157;max-width:500px;line-height:1.6;margin:10px 0}.gift-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}.gift-card{background:white;min-width:0;border:1px solid #eed8b2;border-radius:19px;overflow:hidden;box-shadow:0 8px 18px #503a2c0d;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease}.gift-card:hover{transform:translateY(-4px);box-shadow:0 12px 26px #503a2c25}.gift-image{position:relative;display:block;background:#fff9f3;aspect-ratio:4/3;overflow:hidden}.gift-image img{display:block;width:100%;height:100%;object-fit:contain;padding:13px}.gift-number{position:absolute;bottom:12px;left:12px;font:800 10px system-ui;background:#17463a;color:#fff2db;border-radius:18px;padding:6px 10px}.gift-detail{padding:16px 17px 19px;display:flex;flex-direction:column;flex:1;gap:7px}.gift-category{font-size:10px;color:#a06343;text-transform:uppercase;font-weight:800;letter-spacing:.12em}.gift-detail h3{margin:3px 0 0;font:normal 19px/1.28 Georgia,serif;color:#493347;overflow-wrap:anywhere}.gift-brand{font-size:12px;color:#806b5d;margin:0}.gift-price{color:#783949;font-weight:800;font-size:16px;margin:6px 0 0}.gift-greeting{color:#896b5b;font-size:12px;margin:0 0 9px}.gift-shop{text-align:center;display:block;margin-top:auto;padding:11px;border-radius:22px;background:#80394f;color:white!important;text-decoration:none;font-weight:700;font-size:12px}.gift-card[hidden],.gift-section[hidden]{display:none!important}.gift-empty{display:none;padding:30px;text-align:center}.gift-empty.show{display:block}.gift-final{margin:50px 0;padding:29px;border-radius:20px;background:linear-gradient(125deg,#214e3c,#823947);color:#fff5df;text-align:center}.gift-final h2{font:normal 30px Georgia,serif}.gift-final p{line-height:1.6;font-size:14px}.gift-final a{color:#ffdf9c}.gift-footer{text-align:center;padding:25px 20px 55px;color:#806755;font-size:12px}.gift-footer a{color:#7f3850}
@keyframes floatflake{from{transform:translateX(0)}to{transform:translateX(-120px)}}@media(prefers-reduced-motion:reduce){.gift-hero:before{animation:none}.gift-card{transition:none}}@media(max-width:1000px){.gift-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.gift-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gift-head{display:block}.gift-controls{position:static}}@media(max-width:450px){.gift-grid{grid-template-columns:1fr}.gift-hero{padding:60px 20px}.gift-stats strong{width:100%}}
`;
const menu='<div class="gift-top"><a href="../index.html">✦ MARIA SM · HOME</a><nav aria-label="Christmas navigation"><a href="../christmas-food/index.html">Christmas Food Special</a><a href="#him">For Him</a><a href="#her">For Her</a><a href="#gift-note">Buying notes</a></nav></div>';
const intro='<div class="gift-hero"><div class="snow"></div><div class="ornaments" aria-hidden="true">🎄 🎁 ✨ 🎅 🎁 🎄</div><div class="kicker">MARIA SM · CHRISTMAS 2026 · 100 PRESENT IDEAS</div><h1>Christmas <em>Gift Wonderland</em></h1><p>100 joyful, thoughtful and occasionally cheeky presents for all kinds of personalities — from little stocking surprises to luxury treats. Pick a budget, follow a hobby, and make someone smile.</p><div class="hero-actions"><a href="#him">🎁 50 Gifts for Him</a><a href="#her">✨ 50 Gifts for Her</a><a href="../christmas-food/index.html">🍪 Christmas Food Special</a></div></div>';
const controls='<div class="gift-controls" aria-label="Filter the Christmas gifts"><button type="button" class="active" data-gift-filter="all">All 100 gifts</button><button type="button" data-gift-filter="him">For Him</button><button type="button" data-gift-filter="her">For Her</button><label for="gift-search">Search:</label><input id="gift-search" type="search" placeholder="Scarf, coffee, beauty, accessories…" aria-label="Search gift ideas"><span id="gift-count" class="gift-count">100 gift ideas</span></div>';
const head=(id,icon,title,copy)=>'<header class="gift-head"><div><p class="gift-category">'+icon+' · CHRISTMAS GIFT GUIDE 2026</p><h2 id="'+id+'">'+title+'</h2><p>'+copy+'</p></div><span aria-hidden="true" style="font-size:44px">🎁 ✨ 🎄</span></header>';
const main='<main class="gift-wrap"><section class="gift-intro"><h2>Joy starts with a little thought.</h2><p>Gift-giving is less about spending a fortune and more about knowing what makes someone smile. Browse 100 individually photographed products, with seller links, observed price references and a festive mood. The For Him / For Her groupings are just suggestions — every gift is for anyone who loves it!</p><div class="gift-stats"><strong>🎅 50 ideas for him</strong><strong>🎄 50 ideas for her</strong><strong>🎁 100 real product photographs</strong></div></section>'+controls
 +'<section id="him" class="gift-section" data-collection="him">'+head('him-title','🧣','50 Gifts for Him','From smart accessories and winter essentials to practical tools and fun discoveries — something for every personality.')+'<div class="gift-grid">'+him.map((p,i)=>card({...p,audience:'him',num:i+1})).join('')+'</div></section>'
 +'<section id="her" class="gift-section" data-collection="her">'+head('her-title','✨','50 Gifts for Her','Beautiful little surprises, cosy style, self-care tools and things to make everyday moments sparkle.')+'<div class="gift-grid">'+her.map((p,i)=>card({...p,audience:'her',num:i+1})).join('')+'</div></section>'
 +'<div class="gift-empty" id="gift-empty">No gifts match that search. Try another word or collection. 🎁</div>'
 +'<aside class="gift-final" id="gift-note"><h2>Christmas is better with a little magic ✨</h2><p>Prices are indicative retailer catalogue observations, not live offers, and may be in the retailer’s original currency. Product variants, delivery to Italy, taxes and shipping costs can change. Always confirm the current price and product photograph at the linked seller before buying. We use genuine merchant-product photographs previously checked during the MariaSM site build — not AI images presented as merchandise. We do not claim these are sponsored recommendations.</p><p><a href="../christmas-food/index.html">Christmas recipes & traditions</a> · <a href="../index.html">Back to MariaSM</a></p></aside></main>';
const clientScript=String.raw`
(function(){
 const cards=Array.from(document.querySelectorAll('.gift-card'));
 const buttons=Array.from(document.querySelectorAll('[data-gift-filter]'));
 const sections=Array.from(document.querySelectorAll('[data-collection]'));
 const search=document.getElementById('gift-search'),count=document.getElementById('gift-count'),empty=document.getElementById('gift-empty');
 let filter='all';
 function apply(){
  const q=search.value.trim().toLowerCase();let visible=0;
  cards.forEach(card=>{const show=(filter==='all'||card.dataset.audience===filter)&&(!q||card.dataset.search.includes(q));card.hidden=!show;if(show)visible++});
  sections.forEach(section=>{section.hidden=![...section.querySelectorAll('.gift-card')].some(c=>!c.hidden)});
  buttons.forEach(b=>{const active=b.dataset.giftFilter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  count.textContent=visible+' gift ideas';empty.classList.toggle('show',visible===0);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.giftFilter;apply()}));
 search.addEventListener('input',apply);apply();
})();
`;
const page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#143f33"><meta name="description" content="Christmas gift guide 2026: 50 ideas for him, 50 for her. Real photographed products, prices and shopping links."><title>Christmas Gift Wonderland 2026 | MariaSM</title><link rel="canonical" href="https://mariashoppingmania.github.io/mariasm-daily-life/christmas-gifts/"><style>'+css+'</style></head><body>'+menu+intro+main+'<footer class="gift-footer">© MariaSM 2026 · Gifts selected with care and Christmas cheer 🎄 · <a href="../index.html">Home</a></footer><script>'+clientScript+'</script></body></html>';
fs.writeFileSync(path.join(outDir,'index.html'),page);

const homeFile=path.join(docs,'index.html');let home=fs.readFileSync(homeFile,'utf8');
if(!home.includes('id="mariasm-christmas-food-news"'))throw Error('Home Christmas Food Special not found');
const offer='<a id="mariasm-christmas-gift-button" href="christmas-gifts/index.html" style="display:inline-block;margin:8px 0 0 9px;background:#fff7e5;color:#682c46;padding:12px 19px;border-radius:30px;text-decoration:none;font-weight:850;border:2px solid #f6c96e">🎁 Discover 100 Christmas Gift Ideas ↗</a>';
home=home.replace(/(<section id="mariasm-christmas-food-news"[\s\S]*?)(<\/section>)/,(_m,a,b)=>a+offer+b);
const banner='<section id="mariasm-christmas-gifts-news" style="max-width:1220px;margin:10px auto 30px;padding:26px 30px;border-radius:22px;border:2px solid #d7a767;background:linear-gradient(115deg,#21533c,#973c4d 72%,#aa723e);box-shadow:0 10px 24px #46202b2c;color:#fff7df"><small style="font-weight:800;letter-spacing:.17em;color:#f9d8a0">🎄 A NEW FESTIVE SPECIAL · CHRISTMAS GIFT WONDERLAND</small><h2 style="font:normal clamp(27px,4vw,41px) Georgia,serif;color:#fff4d6;margin:10px 0">100 little reasons to smile this Christmas 🎁</h2><p style="max-width:870px;color:#fff4e2;line-height:1.65">Browse 50 illustrated gift ideas for him and 50 for her, from winter fashion and beauty tech to cosy accessories, home design and playful treats. Real product photographs, price references and direct shop links.</p><a href="christmas-gifts/index.html" style="display:inline-block;background:#ffe3a9;color:#542b3c;padding:13px 20px;border-radius:24px;text-decoration:none;font-weight:850">Step into the Gift Wonderland ↗</a></section>';
home=home.replace(/(<section id="mariasm-christmas-food-news"[\s\S]*?<\/section>)/,'$1'+banner);
if(!home.includes('mariasm-christmas-gifts-news'))throw Error('Christmas gift home banner was not inserted');
fs.writeFileSync(homeFile,home);
const foodFile=path.join(docs,'christmas-food','index.html');
if(fs.existsSync(foodFile)){let food=fs.readFileSync(foodFile,'utf8');food=food.replace(/(<nav aria-label="Festive food navigation">)/,'$1<a href="../christmas-gifts/index.html">🎁 Gift Ideas</a>');fs.writeFileSync(foodFile,food)}
console.log('Christmas gift wonderland generated: '+him.length+' for him + '+her.length+' for her; '+all.length+' independently photographed candidates. All 100 selected gifts have product photographs and numeric reference prices.');
