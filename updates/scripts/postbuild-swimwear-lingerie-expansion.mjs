import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),docs=path.join(root,'docs');
const page=path.join(docs,'swimwear-lingerie/index.html'),imageDir=path.join(docs,'swimwear-lingerie/assets/expanded-shop');
if(!fs.existsSync(page))throw Error('Existing Swimwear & Lingerie page missing');fs.mkdirSync(imageDir,{recursive:true});
let html=fs.readFileSync(page,'utf8');if(html.includes('id="swim-edit-2026"'))throw Error('Expanded collection already exists');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guides=[
['Triangle bikinis','Adjustable triangle cups, tie necks or shoulders and separate bottoms; choose coverage and support for the intended activity.'],
['Bandeau & balconette','Strapless silhouettes for beach styling and structured balconette tops for more defined shaping.'],
['Brazilian, tanga & thong','Brazilian cuts offer moderate-to-minimal coverage; tanga and thong bottoms have narrower backs. Check lining, fit and movement comfort.'],
['Micro bikinis & minimal cuts','Very minimal swim designs prioritise fashion and tanning coverage over sport functionality. Confirm opacity when wet, local beach rules and secure fit.'],
['High-waisted & retro','Higher rises and full briefs combine vintage styling with adjustable coverage and support.'],
['One-piece swimsuits','From classic scoop-necks to halter and asymmetrical designs; compare strap security, lining and ease of movement.'],
['Cut-out & monokini','Design-led one-piece silhouettes with strategic openings: beautiful for resortwear, generally less suited to lap swimming.'],
['Technical pool swimwear','Chlorine-resistant fabrics, racerbacks and close-fitting one-pieces can support frequent training. Check resistance, seam placement and care labels.'],
['Goggles','Choose recreational or competition fit, anti-fog coating, adjustable straps and suitable clear or tinted lenses; avoid touching the inside coating.'],
['Swim caps','Silicone, latex and fabric styles vary in fit, hair accommodation and water drag. A cap does not guarantee dry hair.'],
['Beach accessories','Pareo, cover-ups, rash guards, waterproof pouches, swim bags and beach towels can make a kit more practical.'],
['Lingerie essentials','Triangle bras, balconettes, bralettes, briefs, bodysuits and delicate lace pieces should be chosen for comfort, material quality and appropriate sizing.'],
['Lace, satin & sensual styling','Sheer mesh, lace trims, satin sets, garter-inspired detailing and thong cuts offer elegant adult fashion without sacrificing fit and care.'],
['Fit, materials & aftercare','Rinse swimwear in cool water after pool or sea, avoid wringing, dry away from direct heat and follow care labels. For lingerie, prioritise breathable gussets and gentle washing.']
];
const groups=[
{key:'bikini',name:'Bikini tops & sets',terms:/bikini|triangle|bandeau|balconette|swim top|halter bikini|two.piece/i,exclude:/bottom|brief|thong|tanga|panty|short|cover/i},
{key:'bottoms',name:'Brazilian, tanga & micro bottoms',terms:/bikini bottom|swim bottom|swim brief|brazilian|tanga|thong|micro bikini|tie.side/i},
{key:'onepiece',name:'One-piece & pool swimsuits',terms:/one.piece|swimsuit|swim suit|maillot|monokini|racerback/i},
{key:'accessories',name:'Goggles, caps & swim accessories',terms:/goggle|swim cap|swimming cap|beach towel|pareo|sarong|cover.up|rash guard|swim bag/i},
{key:'lingerie',name:'Lingerie, lace & sensual edits',terms:/lingerie|bralette|bra |bustier|bodysuit|underwire|lace|satin|underwear|panties|panty|brief|thong|tanga/i}
];
const feeds=[
['Kulani Kinis','https://www.kulanikinis.com/products.json?limit=200','USD'],
['Blackbough Swim','https://blackboughswim.com/products.json?limit=200','USD'],
['Frankies Bikinis','https://frankiesbikinis.com/products.json?limit=200','USD'],
['Triangl','https://triangl.com/products.json?limit=200','USD'],
['Monday Swimwear','https://mondayswimwear.com/products.json?limit=200','USD'],
['Bamba Swim','https://www.bambaswim.com/products.json?limit=200','AUD'],
['Jolyn','https://jolyn.com/products.json?limit=200','USD'],
['SwimOutlet','https://www.swimoutlet.com/products.json?limit=200','USD'],
['Funkita','https://www.funkita.com/products.json?limit=200','AUD'],
['Funkita','https://funkita.com/products.json?limit=200','AUD'],
['TYR','https://www.tyr.com/products.json?limit=200','USD'],
['Speedo','https://us.speedo.com/products.json?limit=200','USD'],
['Arena','https://www.arenasport.com/products.json?limit=200','EUR'],
['Form Swim','https://www.formswim.com/products.json?limit=200','USD'],
['Lounge Underwear','https://lounge.com/products.json?limit=200','GBP'],
['Bluebella','https://www.bluebella.com/products.json?limit=200','GBP'],
['Boux Avenue','https://www.bouxavenue.com/products.json?limit=200','GBP'],
['Intimissimi','https://www.intimissimi.com/products.json?limit=200','EUR'],
['For Love & Lemons','https://forloveandlemons.com/products.json?limit=200','USD'],
['Parade','https://yourparade.com/products.json?limit=200','USD'],
['Hanky Panky','https://www.hankypanky.com/products.json?limit=200','USD'],
['Skims','https://skims.com/products.json?limit=200','USD']
];
async function request(url,ms=10000){const c=new AbortController(),timer=setTimeout(()=>c.abort(),ms);try{return await fetch(url,{signal:c.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; MariaSM-editorial/1.0)','Accept':'application/json,image/*,*/*'}})}finally{clearTimeout(timer)}}
function dimensions(b){
 if(b.length<45)return null;
 if(b[0]===137&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {ext:'png',w:b.readUInt32BE(16),h:b.readUInt32BE(20)};
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){
  const tag=b.toString('ascii',12,16);
  if(tag==='VP8X')return{ext:'webp',w:1+b.readUIntLE(24,3),h:1+b.readUIntLE(27,3)};
  if(tag==='VP8 ')return{ext:'webp',w:b.readUInt16LE(26)&16383,h:b.readUInt16LE(28)&16383};
  if(tag==='VP8L'){const v=b.readUInt32LE(21);return{ext:'webp',w:1+(v&16383),h:1+((v>>14)&16383)}}
 }
 if(b[0]===255&&b[1]===216){let i=2;while(i+10<b.length){if(b[i]!==255){i++;continue;}const m=b[i+1];i+=2;if(m===0xd9||m===0xda)break;if(m===0x01||(m>=0xd0&&m<=0xd7))continue;const n=b.readUInt16BE(i);if(n<2||i+n>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(m))return {ext:'jpg',w:b.readUInt16BE(i+5),h:b.readUInt16BE(i+3)};i+=n}}
 return null;
}
const pools=Object.fromEntries(groups.map(g=>[g.key,[]]));
await Promise.all(feeds.map(async([brand,url,currency])=>{try{
 const r=await request(url,12000);if(!r.ok)return;const data=await r.json();if(!Array.isArray(data.products))return;
 const limit={};for(const p of data.products){
  const txt=[p.title,p.product_type,...(p.tags??[])].join(' ');if(/gift card|gift voucher|digital|subscription|sample swatch/i.test(txt))continue;
  const img=p.images?.find(x=>/^https:\/\//.test(x.src??''))?.src;
  const variant=p.variants?.find(v=>v.available!==false&&Number(v.price)>0)??p.variants?.find(v=>Number(v.price)>0);
  if(!img||!variant||Number(variant.price)>1200)continue;
  for(const g of groups){
   if(!g.terms.test(txt)||(g.exclude?.test(txt)))continue;
   if((limit[g.key]??0)>=7)continue;
   const desc=String(p.body_html??'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
   pools[g.key].push({brand,title:p.title,img,price:Number(variant.price),currency,url:new URL(url).origin+'/products/'+encodeURIComponent(p.handle),desc:desc.slice(0,180)||'Explore size, fit, fabric and care instructions at the official brand shop.',group:g.key});
   limit[g.key]=(limit[g.key]??0)+1;break;
  }
 }
}catch(e){console.warn('Shop feed unavailable:',brand,String(e).slice(0,90))}}));
const verified=Object.fromEntries(groups.map(g=>[g.key,[]]));const used=new Set();
for(const g of groups){
 for(const p of pools[g.key]){
  if(verified[g.key].length>=22)break;
  const key=(p.brand+' '+p.title).toLowerCase();if(used.has(key))continue;used.add(key);
  try{const r=await request(p.img,12000);if(!r.ok)continue;const bytes=Buffer.from(await r.arrayBuffer()),d=dimensions(bytes);
   if(!d||bytes.length<4500||bytes.length>6000000||d.w<250||d.h<250||d.w>10000||d.h>10000)continue;
   const file='verified-'+g.key+'-'+String(verified[g.key].length+1).padStart(2,'0')+'.'+d.ext,full=path.join(imageDir,file);fs.writeFileSync(full,bytes);
   const check=fs.readFileSync(full),dc=dimensions(check);if(check.length!==bytes.length||!dc||dc.w!==d.w||dc.h!==d.h){fs.unlinkSync(full);continue}
   verified[g.key].push({...p,src:'assets/expanded-shop/'+file,w:d.w,h:d.h});
  }catch(e){console.warn('Image rejected:',p.brand,p.title,String(e).slice(0,90))}
 }
}
const guideHtml=guides.map(([h,p])=>'<article class="swx-guide"><h3>'+E(h)+'</h3><p>'+E(p)+'</p></article>').join('');
const shopHtml=groups.map(g=>{const items=verified[g.key],cards=items.map(p=>'<article class="swx-product"><img loading="lazy" decoding="async" src="'+E(p.src)+'" width="'+p.w+'" height="'+p.h+'" alt="'+E(p.brand+' '+p.title)+'"><div><small>'+E(p.brand)+'</small><h3>'+E(p.title)+'</h3><p>'+E(p.desc)+'</p><strong>'+new Intl.NumberFormat('en',{style:'currency',currency:p.currency}).format(p.price)+'</strong><a target="_blank" rel="noopener noreferrer" href="'+E(p.url)+'">View official product ↗</a></div></article>').join('');
 return '<section class="swx-group" id="swx-'+g.key+'"><h2>'+E(g.name)+'</h2>'+(items.length?'<div class="swx-products">'+cards+'</div>':'<p class="swx-notice">No product photo passed the image audit for this category in this build; the catalog is hidden rather than showing broken product photographs. See the official brand catalogues for current styles.</p>')+'</section>'}).join('');
const styles='<style id="swx-catalogue-css">#swim-edit-2026{background:#fff8fb;color:#604254;padding:65px 0;font:15px/1.65 system-ui,sans-serif}#swim-edit-2026 .swx-wrap{max-width:1240px;margin:auto;padding:0 22px}#swim-edit-2026 h2{font:normal clamp(32px,4vw,50px)/1.12 Georgia,serif}#swim-edit-2026 h3{font:normal 22px/1.2 Georgia,serif;margin:10px 0}#swim-edit-2026 .swx-nav{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0}#swim-edit-2026 .swx-nav a{padding:9px 15px;border:1px solid #e3c4d5;border-radius:25px;background:white;text-decoration:none}#swim-edit-2026 .swx-guides{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}#swim-edit-2026 .swx-guide,#swim-edit-2026 .swx-product{background:#fff;border:1px solid #ead7e1;border-radius:16px;min-width:0}#swim-edit-2026 .swx-guide{padding:20px}#swim-edit-2026 .swx-group{padding:35px 0;border-top:1px solid #ebd6e0}#swim-edit-2026 .swx-products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}#swim-edit-2026 .swx-product{overflow:hidden;display:flex;flex-direction:column}#swim-edit-2026 .swx-product img{display:block!important;width:100%!important;height:240px!important;max-height:240px!important;min-height:0!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:center center!important;background:#fff;padding:8px;box-sizing:border-box}#swim-edit-2026 .swx-product{height:auto!important;min-height:0!important;align-self:start}#swim-edit-2026 .swx-product>div{min-height:180px}#swim-edit-2026 .swx-product>div{display:flex;flex-direction:column;flex:1;padding:16px}#swim-edit-2026 .swx-product p{font-size:13px}#swim-edit-2026 .swx-product strong{margin-top:auto;font-size:19px}#swim-edit-2026 .swx-product a{font-weight:700;font-size:13px;margin-top:10px}#swim-edit-2026 .swx-notice{background:#f5e7ef;padding:20px;border-left:3px solid #bb799c}@media(max-width:950px){#swim-edit-2026 .swx-products{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){#swim-edit-2026 .swx-products,#swim-edit-2026 .swx-guides{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){#swim-edit-2026 .swx-products,#swim-edit-2026 .swx-guides{grid-template-columns:1fr}#swim-edit-2026 .swx-product img{height:280px!important;max-height:280px!important}}</style>';
const nav='<nav class="swx-nav"><a href="#swx-styles">Styles & fitting</a>'+groups.map(g=>'<a href="#swx-'+g.key+'">'+E(g.name)+'</a>').join('')+'</nav>';
const section=styles+'<section id="swim-edit-2026"><div class="swx-wrap"><small>MARIA SM · SWIMWEAR & LINGERIE · EXPANDED EDIT</small><h2>From the pool to the beach, and the art of lingerie</h2><p>Technical swimwear, expressive bikinis, minimal tanga and thong cuts, eye-catching one-pieces, goggles and caps, everyday underwear and sophisticated lace.</p>'+nav+'<h2 id="swx-styles">Style, coverage and materials: the complete guide</h2><div class="swx-guides">'+guideHtml+'</div><h2>Explore the expanded shop</h2><p class="swx-notice">Products feature original photographs individually downloaded and validated as image files before publication. Unsupported images are not displayed. Retailer prices are snapshots in the original currency; offers, availability, delivery fees and taxes may vary. Check each official store for current information.</p>'+shopHtml+'</div></section>';
const pos=html.lastIndexOf('</main>');if(pos>=0)html=html.slice(0,pos)+section+html.slice(pos);else{const p=html.lastIndexOf('</body>');if(p<0)throw Error('Page has no insertion point');html=html.slice(0,p)+section+html.slice(p)}
fs.writeFileSync(page,html);
console.log('Expanded swimwear and lingerie:',JSON.stringify(Object.fromEntries(groups.map(g=>[g.key,verified[g.key].length]))));
