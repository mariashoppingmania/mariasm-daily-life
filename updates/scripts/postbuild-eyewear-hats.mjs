import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),docs=path.join(root,'docs');
const target=path.join(docs,'hats/index.html'),assets=path.join(docs,'hats/assets/eyewear');fs.mkdirSync(assets,{recursive:true});
let html=fs.readFileSync(target,'utf8');if(html.includes('id="eyewear-guide"'))throw Error('Eyewear section already exists');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const styles=[
['Aviator','Teardrop lenses, usually with thin metal frames; a long-standing classic.'],
['Wayfarer','Angular acetate silhouette with a strong brow, suitable for many everyday looks.'],
['Cat-eye','Upswept corners create a distinctive vintage or contemporary fashion statement.'],
['Round','Circular frames inspired by the early twentieth century and creative design.'],
['Square & rectangular','Graphic proportions that can contrast with softer face outlines.'],
['Oval','A gentle, compact lens shape with a vintage or minimalist feel.'],
['Oversized','Larger lenses for bold proportions and potentially more physical coverage.'],
['Rimless & semi-rimless','Light visual structure, including minimalist optical frames.'],
['Wraparound & sport','Curved, close-fitting frames for motion, wind and peripheral coverage.'],
['Clubmaster & browline','Stronger upper rims and a lighter bottom structure.'],
['Geometric','Hexagonal or other faceted forms for a contemporary statement.'],
['Reading & prescription','Corrective eyewear requires accurate prescription, fit and optical assessment; non-prescription fashion lenses are not a substitute.']
];
const guidance=[
['UV protection','Choose sunglasses explicitly marked 100% UVA/UVB protection or UV400. A dark tint alone does not establish UV safety.'],
['Polarised lenses','Polarisation helps cut reflected glare from water or roads, but it is not equivalent to UV protection. Verify both claims.'],
['Lens categories','Categories indicate visible-light transmission: category 0 is very light, category 3 is dark sunlight; category 4 is not suitable for driving. Check the exact product classification.'],
['Photochromic lenses','These adapt to light levels, although some do not darken as strongly behind UV-filtering windscreens.'],
['Prescription lenses','Single-vision, progressive and occupational lenses must be chosen with a qualified eye-care professional, including accurate pupil distances and fitting.'],
['Frame materials','Acetate offers colour and thickness; titanium is lightweight and corrosion-resistant; stainless steel and other metals offer thin profiles.'],
['Choosing a fit','Consider bridge width, lens width, temple length, lash clearance, cheek contact and comfort behind the ears.'],
['Cleaning & storage','Rinse grit away, use an approved microfibre cloth and suitable lens cleaner. Avoid wiping dry dusty lenses or leaving frames in a hot car.'],
['Face shapes','Style rules are optional. Comfort, visual proportions and personal taste matter more than rigid “correct” shapes.'],
['For children and sports','Look for good coverage, suitable UV protection, secure fit and activity-specific impact requirements. Ordinary sunglasses are not certified safety goggles.'],
['When to have an eye test','Persistent headaches, blurred vision, sudden changes in vision or discomfort should be assessed by a qualified professional. Sudden vision loss is urgent.'],
['A brief history','Pince-nez and early spectacles evolved into modern optical frames; twentieth-century cinema and aviation helped popularise sunglasses.']
];
const catalogues=[
['Goodr','https://goodr.com/products.json?limit=200','USD'],
['Knockaround','https://knockaround.com/products.json?limit=200','USD'],
['Sunski','https://sunski.com/products.json?limit=200','USD'],
['Diff Eyewear','https://www.diffeyewear.com/products.json?limit=200','USD'],
['Le Specs','https://lespecs.com/products.json?limit=200','AUD'],
['Quay','https://www.quay.com/products.json?limit=200','USD'],
['Meller','https://mellerbrand.com/products.json?limit=200','EUR'],
['Jimmy Fairly','https://www.jimmyfairly.com/products.json?limit=200','EUR'],
['Pala Eyewear','https://palaeyewear.com/products.json?limit=200','GBP'],
['MessyWeekend','https://messyweekend.com/products.json?limit=200','EUR'],
['SOJOS','https://sojosvision.com/products.json?limit=200','USD'],
['Izipizi','https://www.izipizi.com/products.json?limit=200','EUR']
];
async function fetcher(u,timeout=12000){const c=new AbortController(),t=setTimeout(()=>c.abort(),timeout);try{return await fetch(u,{signal:c.signal,headers:{'User-Agent':'Mozilla/5.0 (MariaSM editorial catalogue)','Accept':'application/json,image/*,*/*'}})}finally{clearTimeout(t)}}
function dims(b){
 if(b.length<48)return null;
 if(b[0]===137&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return ['png',b.readUInt32BE(16),b.readUInt32BE(20)];
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){
  const t=b.toString('ascii',12,16);
  if(t==='VP8X')return ['webp',1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];
  if(t==='VP8 ')return ['webp',b.readUInt16LE(26)&16383,b.readUInt16LE(28)&16383];
  if(t==='VP8L'){const v=b.readUInt32LE(21);return ['webp',1+(v&16383),1+((v>>14)&16383)];}
 }
 if(b[0]===255&&b[1]===216){let i=2;while(i+10<b.length){if(b[i]!==255){i++;continue;}const m=b[i+1];i+=2;if(m===0xd9||m===0xda)break;if(m===0x01||(m>=0xd0&&m<=0xd7))continue;const n=b.readUInt16BE(i);if(n<2||i+n>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(m))return ['jpg',b.readUInt16BE(i+5),b.readUInt16BE(i+3)];i+=n;}}
 return null;
}
const candidates=[];
await Promise.all(catalogues.map(async([brand,url,currency])=>{try{
 const r=await fetcher(url);if(!r.ok)return;const x=await r.json();let n=0;
 for(const p of x.products??[]){if(n>=28)break;
 const title=String(p.title??'');if(/case|cloth|kit|gift card|accessor|chain|cord|cleaner|replacement|lens only|mystery|blind[ -]?box|surprise|random|grab bag|secret drop/i.test(title))continue;
 const photo=p.images?.find(i=>/^https:\/\//.test(i.src??''))?.src,variant=p.variants?.find(v=>v.available!==false&&Number(v.price)>0)??p.variants?.find(v=>Number(v.price)>0);
 if(!photo||!variant||Number(variant.price)>900)continue;
 if(!/sun|glass|frame|optic|aviator|wayfarer|cat.eye|round|square|polar|eyewear|shade/i.test(title+' '+String(p.product_type??'')))continue;
 candidates.push({brand,title,photo,currency,price:Number(variant.price),url:new URL(url).origin+'/products/'+encodeURIComponent(p.handle),description:String(p.body_html??'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,180)||'Check size, lens material and UV specifications with the retailer.'});n++;
 }
}catch(e){console.warn('Eyewear catalogue unavailable',brand,String(e).slice(0,90))}}));
const verified=[],seen=new Set();
const brandCounts=new Map();
for(const p of candidates){if(verified.length>=60)break;const key=(p.brand+p.title).toLowerCase();if(seen.has(key))continue;if((brandCounts.get(p.brand)||0)>=9)continue;seen.add(key);
 try{const r=await fetcher(p.photo,14000);if(!r.ok)continue;const b=Buffer.from(await r.arrayBuffer()),d=dims(b);
 if(!d||b.length<4000||b.length>6000000||d[1]<250||d[2]<250||d[1]>9000||d[2]>9000)continue;
 const filename='eyewear-'+String(verified.length+1).padStart(2,'0')+'.'+d[0],full=path.join(assets,filename);fs.writeFileSync(full,b);
 const test=fs.readFileSync(full),d2=dims(test);if(test.length!==b.length||!d2||d2[1]!==d[1]||d2[2]!==d[2]){fs.unlinkSync(full);continue;}
 verified.push({...p,image:'assets/eyewear/'+filename,width:d[1],height:d[2]});brandCounts.set(p.brand,(brandCounts.get(p.brand)||0)+1);
 }catch(e){console.warn('Eyewear photo skipped',p.title,String(e).slice(0,90))}
}
if(verified.some(p=>/mystery|surprise|blind[ -]?box|random/i.test(p.title)))throw Error('Uncertain eyewear listings survived product filter');
if(verified.length<10){
 // A temporary retailer outage must not block unrelated channel updates.
 // Restore the existing published selection only after checking every photo.
 const liveBase='https://mariashoppingmania.github.io/mariasm-daily-life/hats/';
 const response=await fetcher(liveBase+'index.html',20000);
 if(!response.ok)throw Error('Published eyewear fallback unavailable');
 const previous=await response.text();
 const section=previous.match(/<section id="eyewear-guide">[\s\S]*?<\/section>/)?.[0];
 const css=previous.match(/<style id="mariasm-eyewear-css">[\s\S]*?<\/style>/)?.[0];
 const photos=[...new Set([...String(section).matchAll(/<img[^>]*src="(assets\/eyewear\/[^"<>]+)"/g)].map(m=>m[1]))];
 if(!section||!css||photos.length<10)throw Error('Published eyewear fallback incomplete');
 await Promise.all(photos.map(async relative=>{
  if(!/^assets\/eyewear\/[A-Za-z0-9_.-]+$/.test(relative))throw Error('Invalid archived eyewear path');
  const r=await fetcher(new URL(relative,liveBase).href,20000);
  if(!r.ok)throw Error('Archived eyewear photo unavailable: '+relative);
  const b=Buffer.from(await r.arrayBuffer()),d=dims(b);
  if(!d||b.length<4000||d[1]<250||d[2]<250)throw Error('Invalid archived eyewear photo: '+relative);
  fs.writeFileSync(path.join(docs,'hats',relative),b);
 }));
 const end=html.lastIndexOf('</body>');
 if(end<0)throw Error('No page insertion point');
 fs.writeFileSync(target,html.slice(0,end)+css+section+html.slice(end));
 console.log('Preserved published eyewear selection with',photos.length,'verified local photographs; retailers temporarily unavailable');
 process.exit(0);
}
console.log('Eyewear photo audit: no mystery products,',verified.length,'named models from',brandCounts.size,'brands');
const types=styles.map(([name,body])=>'<article class="ew-card"><h3>'+E(name)+'</h3><p>'+E(body)+'</p></article>').join('');
const guide=guidance.map(([name,body])=>'<article class="ew-card"><h3>'+E(name)+'</h3><p>'+E(body)+'</p></article>').join('');
const products=verified.map(p=>'<article class="ew-product"><img src="'+E(p.image)+'" loading="lazy" decoding="async" width="'+p.width+'" height="'+p.height+'" alt="'+E(p.brand+' '+p.title)+'"><div><small>'+E(p.brand)+'</small><h3>'+E(p.title)+'</h3><p>'+E(p.description)+'</p><strong>'+new Intl.NumberFormat('en',{style:'currency',currency:p.currency}).format(p.price)+'</strong><a href="'+E(p.url)+'" target="_blank" rel="noopener noreferrer">View at official store ↗</a></div></article>').join('');
const style='<style id="mariasm-eyewear-css">#eyewear-guide{background:#f6eff5;color:#5b4552;padding:58px 0;font:15px/1.7 system-ui,sans-serif}#eyewear-guide .ew-wrap{width:min(1200px,calc(100% - 36px));margin:auto}#eyewear-guide h2{font:normal clamp(34px,5vw,55px)/1.15 Georgia,serif;margin:20px 0}#eyewear-guide h3{font:normal 23px Georgia,serif;margin:8px 0}#eyewear-guide .ew-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}#eyewear-guide .ew-card,#eyewear-guide .ew-product{border:1px solid #e6d6e1;border-radius:16px;background:#fff;min-width:0}#eyewear-guide .ew-card{padding:22px}#eyewear-guide .ew-products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}#eyewear-guide .ew-product{overflow:hidden;display:flex;flex-direction:column}#eyewear-guide .ew-product img{width:100%;height:auto;aspect-ratio:1;object-fit:contain;display:block;background:white}#eyewear-guide .ew-product>div{padding:16px;display:flex;flex-direction:column;flex:1}#eyewear-guide .ew-product p{font-size:13px}#eyewear-guide .ew-product strong{font-size:18px;margin-top:auto}#eyewear-guide .ew-product a{font-weight:700;font-size:13px;margin-top:10px}#eyewear-guide .ew-note{border-left:4px solid #ba819c;background:#fff;padding:18px;margin:18px 0}#eyewear-guide .ew-links{display:flex;gap:12px;flex-wrap:wrap}#eyewear-guide .ew-links a{padding:8px 14px;background:#fff;border:1px solid #ddc4d2;border-radius:22px;text-decoration:none}@media(max-width:900px){#eyewear-guide .ew-products{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){#eyewear-guide .ew-grid,#eyewear-guide .ew-products{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){#eyewear-guide .ew-grid,#eyewear-guide .ew-products{grid-template-columns:1fr}}</style>';
const section=style+'<section id="eyewear-guide"><div class="ew-wrap"><small>HATS & HEADWEAR ATELIER · THE EYEWEAR EDIT</small><h2>Eyewear: frames, lenses & personal style</h2><p>Explore sunglasses, optical frames, statement shapes, materials and practical lens features. Fit and UV protection come before the logo.</p><div class="ew-links"><a href="#eyewear-types">Frames & styles</a><a href="#eyewear-lenses">Lens & fit guide</a><a href="#eyewear-shop">Curated eyewear shop</a></div><h2 id="eyewear-types">12 frame styles explained</h2><div class="ew-grid">'+types+'</div><h2 id="eyewear-lenses">Choosing lenses, materials & fit</h2><div class="ew-grid">'+guide+'</div><h2 id="eyewear-shop">Shop sunglasses & eyewear</h2><p class="ew-note">Only authentic product photographs individually downloaded, inspected and stored on this website are used. If a retailer blocks an image, that product does not appear. Displayed prices are retailer catalogue snapshots in their original currencies, not guaranteed current prices; check the retailer for taxes, shipping and availability.</p>'+(verified.length?'<div class="ew-products">'+products+'</div>':'<p class="ew-note">No seller product images passed the checks during this publishing run. Unverified products are hidden rather than displayed with broken images.</p>')+'<p class="ew-note">For sun protection, look for a verified 100% UVA/UVB or UV400 claim. Polarised lenses reduce reflected glare but do not independently guarantee UV blocking. <a target="_blank" rel="noopener noreferrer" href="https://www.aao.org/eye-health/diseases/sunglasses-3">American Academy of Ophthalmology guidance ↗</a>.</p></div></section>';
const insert=html.lastIndexOf('</main>');if(insert>=0)html=html.slice(0,insert)+section+html.slice(insert);
else{const end=html.lastIndexOf('</body>');if(end<0)throw Error('No page insertion point');html=html.slice(0,end)+section+html.slice(end);}
fs.writeFileSync(target,html);
if(!html.includes('id="eyewear-guide"')||!html.includes('id="eyewear-shop"'))throw Error('Eyewear module missing');
console.log('Eyewear module ready',styles.length,'styles',guidance.length,'guides',verified.length,'verified product photos.');
