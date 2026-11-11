import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs'),out=path.join(docs,'christmas-gifts'),photoDir=path.join(out,'photos');
fs.mkdirSync(photoDir,{recursive:true});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const sourceData=[
['numskull','https://www.numskull.com','collections/all-products','GBP'],
['oddly','https://oddlyepic.com','collections/all','GBP'],
['hisgifts','https://www.hisgifts.it','en/collections/male','EUR'],
['latestbuy','https://www.latestbuy.it','en/collections/gadgets-fun-frivolous','EUR'],
['getdigital','https://www.getdigital.eu','collections/all','EUR'],
['concept-tech','https://32conceptstore.it','collections/gadget-tech-regalo','EUR'],
['concept-gifts','https://32conceptstore.it','collections/idee-regalo','EUR'],
['kikkerland','https://kikkerland.com','collections/all','USD'],
['native','https://www.nativeunion.com','collections/all','USD'],
['orbitkey','https://www.orbitkey.com','collections/all','USD'],
['cabaia','https://www.cabaia.com','collections/all','EUR'],
['pura','https://www.puravidabracelets.com','collections/all','USD'],
['rosefield','https://www.rosefieldwatches.com','collections/all','EUR'],
['oodie','https://www.theoodie.com','collections/all','USD'],
['divoom','https://www.divoom.com','collections/all','USD'],
['stanley','https://www.stanley1913.com','collections/all','USD'],
['ohhdeer','https://ohhdeer.com','collections/all','GBP'],
['kitsch','https://www.mykitsch.com','collections/all','USD'],
['frankbody','https://eu.frankbody.com','collections/all','EUR'],
['lipbar','https://thelipbar.com','collections/all','USD']];
async function req(url,ms=16000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{return await fetch(url,{signal:c.signal,headers:{'User-Agent':'Mozilla/5.0 (MariaSM Gift Guide)' }})}finally{clearTimeout(t)}}
const feeds=new Map();
await Promise.all(sourceData.map(async ([id,site,collection,currency])=>{
 try{const r=await req(site+'/'+collection+'/products.json?limit=250');if(!r.ok)throw Error('HTTP '+r.status);
  const j=await r.json();const ps=(j.products||[]).map(p=>{
   const vs=(p.variants||[]).filter(v=>v.available!==false&&Number(v.price)>0).sort((a,b)=>Number(a.price)-Number(b.price));
   const v=vs[0],image=p.images?.[0]?.src||p.image?.src,price=Number(v?.price);
   if(!v||!image||!/^https:\/\//.test(image)||!p.handle||!p.title||price<5||price>900)return null;
   const text=(p.title+' '+(p.product_type||'')+' '+(p.tags||'')).toLowerCase();
   if(/gift card|voucher|subscription|digital download|mystery box|surprise box|preorder|pre-order|replacement part/i.test(text))return null;
   return {title:String(p.title).trim(),brand:String(p.vendor||id),image,url:site+'/products/'+encodeURIComponent(p.handle),price,currency,source:id,text,variants:vs.length};
  }).filter(Boolean);feeds.set(id,ps);console.log('[Gifts]',id,ps.length);
 }catch(e){feeds.set(id,[]);console.warn('[Gifts] source unavailable',id,String(e).slice(0,100))}
}));
const known=new Set(),knownTitles=new Set();
function scan(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,d.name);
 if(d.isDirectory()){if(f!==out)scan(f);continue}
 if(!d.isFile()||!f.endsWith('.html')||f===path.join(out,'index.html'))continue;
 const html=fs.readFileSync(f,'utf8');
 for(const m of html.matchAll(/href="(https:\/\/[^"]+)"/g))known.add(m[1].replaceAll('&amp;','&').split(/[?#]/)[0].replace(/\/$/,'').toLowerCase());
 for(const m of html.matchAll(/<(?:h3|h4)>([^<]{6,110})<\/(?:h3|h4)>/g))knownTitles.add(norm(m[1]));
}}
scan(docs);
const chosenUrls=new Set(),chosenTitles=new Set(),chosenImages=new Set(),perSource=new Map();
function eligible(p){return !chosenUrls.has(p.url)&&!chosenTitles.has(norm(p.title))&&!chosenImages.has(p.image)
 &&!known.has(p.url.toLowerCase().split(/[?#]/)[0].replace(/\/$/,''))
 &&!knownTitles.has(norm(p.title))&&(perSource.get(p.source)||0)<15
 &&!/gift card|coupon|stickers? only|spare part|iphone 1[0-9] case|iphone 2[0-9] case|watch strap|mystery|subscription/i.test(p.title)}
async function photo(p){try{const r=await req(p.image,12000);if(!r.ok)throw Error('HTTP '+r.status);
 const b=Buffer.from(await r.arrayBuffer());if(b.length<4400||b.length>7000000)throw Error('invalid image bytes '+b.length);
 const ext=b[0]===255&&b[1]===216?'jpg':b[0]===137&&b.subarray(1,4).toString()==='PNG'?'png':b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'?'webp':b.subarray(4,12).toString().includes('ftyp')?'avif':null;
 if(!ext)throw Error('unrecognized image format');
 const filename=crypto.createHash('sha256').update(b).digest('hex').slice(0,20)+'.'+ext;
 fs.writeFileSync(path.join(photoDir,filename),b);return 'photos/'+filename;
 }catch(e){console.warn('[Gifts] image skipped',p.source,p.title,String(e).slice(0,85));return null}}
const R=(...parts)=>new RegExp(parts.join('|'),'i');
const groups=[
['him','Gaming & Fandom',9,[['numskull',R('game','arcade','xbox','destiny','doom','resident evil','star wars','switch','fallout','lamp','plush')],['oddly',R('gaming','controller','console','mouse','pixel')],['getdigital',R('star wars','gaming','geek')]]],
['him','Tech & Gadgets',8,[['divoom',R('speaker','display','pixel','charger','led')],['native',R('charger','power bank','wireless','stand','cable')],['concept-tech',R('powerbank','radio','auricolari','mouse','caricabatterie','usb')]]],
['him','Travel & Everyday Carry',6,[['orbitkey',R('organiser','tech pouch','key','travel','sleeve','bottle opener')],['cabaia',R('backpack','travel','suitcase','bag')],['kikkerland',R('travel','multi.tool','portable','emergency')]]],
['him','Outdoor & Adventure',5,[['stanley',R('adventure','flask','water bottle','jug','thermos','cooler')],['hisgifts',R('car','camping','outdoor','lamp','torch','tool','hiking')],['kikkerland',R('outdoor','solar','camp','multitool')]]],
['him','Puzzles & Making',5,[['oddly',R('book nook','puzzle','mechanical','model','build','kit')],['kikkerland',R('puzzle','model','build','game','3d')],['hisgifts',R('puzzle','robotime','model','board game')]]],
['him','Music & Movie Night',5,[['concept-gifts',R('crosley','giradischi','vinyl','audio','music')],['latestbuy',R('lamp','movie','projector','speaker','music')],['numskull',R('back to the future','jurassic park','matrix','ghostbusters','star trek')]]],
['him','Funny Little Surprises',6,[['kikkerland',R('megaphone','voice','funny','bottle','dad','fidget','game','ice')],['ohhdeer',R('soap','game','socks','jigsaw')],['hisgifts',R('novelty','dinosaur','mug','funny','cowboy')],['latestbuy',R('novelty','thinking cap','glitter','toy')]]],
['him','Style & Accessories',6,[['cabaia',R('backpack','crossbody','bag','bottle')],['orbitkey',R('wallet','organiser','key','clip')],['numskull',R('jumper','cap','t-shirt','hoodie','glasses')],['getdigital',R('shirt','hoodie','becher','tasse')]]],
['her','Jewellery & Little Sparkles',8,[['rosefield',R('bracelet','necklace','earring','ring','watch')],['pura',R('bracelet','necklace','earring','ring','charm')]]],
['her','Beauty & Self-Care',8,[['frankbody',R('scrub','body','lotion','cream','mask','serum','oil')],['lipbar',R('lipstick','gloss','kit','shadow','blush')],['kitsch',R('satin','scrunchie','pillowcase','curler','sleep')]]],
['her','Bags & Fashion',6,[['cabaia',R('backpack','bag','crossbody','suitcase','pouch')],['rosefield',R('watch','ring','necklace','bracelet')],['oodie',R('jacket','jumper','sherpa')]]],
['her','Cute Tech & Music',6,[['divoom',R('speaker','display','pixel','backpack','charger')],['concept-tech',R('daisy','bunny','panda','radio','wireless','powerbank','caricabatterie')],['native',R('power bank','charging','wireless','light','stand')]]],
['her','Cosy Moments',6,[['oodie',R('oodie','nightie','sherpa','blanket','socks','sleep')],['kitsch',R('satin','pillowcase','sleep')],['ohhdeer',R('socks','candle','soap')]]],
['her','Creative Hobbies',5,[['oddly',R('book nook','puzzle','kit','miniature','build','study')],['ohhdeer',R('notebook','diary','jigsaw','art')],['kikkerland',R('painting','puzzle','creative','drawing','playing cards')]]],
['her','Home & Happy Spaces',5,[['kikkerland',R('vase','candle','plant','book','desk','mirror','lamp')],['concept-gifts',R('design','seletti','quadro','decor','lamp')],['stanley',R('tumbler','cup','bottle','cafe')]]],
['her','Travel & Discovery',3,[['cabaia',R('suitcase','travel','backpack','bag')],['orbitkey',R('organiser','pouch','travel','compendium')],['stanley',R('travel','water bottle','cooler')]]],
['her','Fun & Unexpected',3,[['kikkerland',R('cat','dog','bird','ice','game','funny','mini')],['oddly',R('cute','cat','light','kit','dog')],['concept-tech',R('panda','bunny','daisy','rainbow','lamp')]]]
];
const him=[],her=[],sym={EUR:'€',GBP:'£',USD:'$'};
for(const [aud,group,n,specs] of groups){
 const dest=aud==='him'?him:her;
 const pools=specs.map(([src,re])=>({src,list:(feeds.get(src)||[]).filter(p=>re.test(p.text)).sort((a,b)=>a.title.localeCompare(b.title,'en')),i:0}));
 let got=0;while(got<n){let moved=false;
  for(const pool of pools){if(got>=n)break;
   while(pool.i<pool.list.length){const p=pool.list[pool.i++];if(!eligible(p))continue;
    const img=await photo(p);if(!img||chosenImages.has(img))continue;
    const price=(p.variants>1?'from ':'')+sym[p.currency]+p.price.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+p.currency;
    dest.push({title:p.title,brand:p.brand,price,img,url:p.url,group,source:p.source});
    chosenUrls.add(p.url);chosenTitles.add(norm(p.title));chosenImages.add(img);perSource.set(p.source,(perSource.get(p.source)||0)+1);got++;moved=true;break;
   }
  }
  if(!moved)break;
 }
 console.log('[Gifts] category',aud,group,got,'/',n);
 if(got!==n)throw Error('Not enough NEW photographic gifts in '+aud+' '+group+': '+got+'/'+n);
}
if(him.length!==50||her.length!==50)throw Error('Gift inventory count failed '+him.length+'/'+her.length);
const items=[...him,...her],sourceCount=new Set(items.map(x=>x.source)).size;
if(sourceCount<9||new Set(items.map(x=>x.url)).size!==100||new Set(items.map(x=>x.img)).size!==100)throw Error('Insufficient gift shop variety or duplicates');
const card=(p,g,i)=>'<article class="gift-card" data-audience="'+g+'" data-kind="'+esc(p.group)+'" data-search="'+esc((p.title+' '+p.brand+' '+p.group).toLowerCase())+'"><a class="gift-image" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(p.img)+'" alt="Merchant product photograph: '+esc(p.title)+'" loading="lazy"><span class="gift-number">GIFT '+String(i+1).padStart(2,'0')+'</span></a><div class="gift-detail"><span class="gift-category">'+esc(p.group)+'</span><h3>'+esc(p.title)+'</h3><p class="gift-brand">'+esc(p.brand)+'</p><p class="gift-price">'+esc(p.price)+'</p><p class="gift-greeting">'+(g==='him'?'A gift with personality.':'A little Christmas surprise.')+'</p><a class="gift-shop" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">View at the retailer ↗</a></div></article>';
const pagePath=path.join(out,'index.html');let html=fs.readFileSync(pagePath,'utf8');
for(const [g,arr] of [['him',him],['her',her]]){
 const start=html.indexOf('<section id="'+g+'" class="gift-section"');if(start<0)throw Error('Missing '+g+' collection');
 const end=html.indexOf('</section>',start),fragment=html.slice(start,end);
 const updated=fragment.replace(/(<div class="gift-grid">)[\s\S]*$/,(_whole,open)=>open+arr.map((p,i)=>card(p,g,i)).join('')+'</div>');
 if(updated===fragment)throw Error('Failed to replace '+g+' old gifts');
 html=html.slice(0,start)+updated+html.slice(end);
}
html=html.replace('100 individually photographed products, with seller links, observed price references','100 NEW real products chosen from independent gift shops, with seller photos and indicative prices');
fs.writeFileSync(pagePath,html);
const homePath=path.join(docs,'index.html');let home=fs.readFileSync(homePath,'utf8');
home=home.replace(/<section id="mariasm-christmas-gifts-news"[\s\S]*?<\/section>\s*/,'');
if(home.includes('mariasm-christmas-gifts-news')||!home.includes('id="mariasm-christmas-gift-button"'))throw Error('Homepage Christmas gifts banner removal failed');
fs.writeFileSync(homePath,home);
fs.writeFileSync(path.join(out,'gift-sources.json'),JSON.stringify({checkedOn:new Date().toISOString().slice(0,10),forHim:50,forHer:50,retailers:[...new Set(items.map(p=>p.source))].sort(),products:items},null,2));
console.log('[Gifts] NEW catalogue PASSED: 50 for him + 50 for her, '+sourceCount+' sources, 100 unique products, images, shop URLs; large homepage banner removed.');
