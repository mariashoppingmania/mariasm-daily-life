import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/skin-care/index.html');
const assets=path.join(root,'docs/skin-care/assets/hair-removal');
fs.mkdirSync(assets,{recursive:true});
let html=fs.readFileSync(page,'utf8');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lessons=[
['Choose a method','Trimming and shaving cut hair at the surface; waxing, sugaring and mechanical epilation remove it from the root. Depilatory creams chemically dissolve visible hair. IPL and professional laser aim for longer-lasting reduction and need suitability checks.'],
['Preparation by skin area','For legs and arms, wash gently and check for irritation or wounds. For underarms and bikini edges, start with a guarded trimmer if sensitivity is a concern. Avoid treating mucosal surfaces or applying chemicals to skin not explicitly approved by the product.'],
['Shaving technique','Soften hair with warm water, use a clean sharp razor and fragrance-free shaving gel, follow the direction of hair growth at first, avoid pressing hard and rinse the blade between strokes. Replace dull blades.'],
['Trimmers and electric shavers','Body trimmers are useful for length control, sensitive areas and reducing close-shave irritation. Select attachments intended for the area, clean after each use and do not share personal devices.'],
['Waxing and sugaring','Follow the product’s precise temperature and application instructions. Pulling hair from the root can cause irritation, burns, folliculitis or ingrown hairs. Do not wax sunburned, damaged or actively irritated skin. Retinoids and some medications can increase skin injury risk.'],
['Hair-removal creams','Chemical depilatories can cause burns if left on too long or used on the wrong body part. Read contraindications, patch-test as directed and never exceed the stated time. Rinse immediately if burning occurs.'],
['Epilators','Electric epilators remove multiple hairs from the root. Start on a small area, keep the device clean, use compatible speed settings and follow wet/dry instructions. Initial discomfort and temporary redness are possible.'],
['Home IPL and clinic laser','IPL is intense pulsed light, not a laser. Outcomes vary with skin tone, hair colour and device suitability; it is not reliable for every hair type. Follow manufacturer skin-tone guidance, eye safety and contraindications. Professional laser requires assessment and can cause burns or pigment changes.'],
['Before an IPL session','Check current tanning, skin-tone compatibility, medications that cause photosensitivity, tattoos, moles and the precise permitted body regions. Do not flash over tattoos, suspicious lesions or near eyes. Follow the device manual and consider professional advice for medical conditions.'],
['Aftercare for 24–48 hours','If skin is tender, pause hot baths, friction, fragrance and harsh exfoliants until it settles. Apply a gentle moisturiser, avoid picking at bumps and protect exposed treated areas from sunlight. Follow device-specific post-treatment advice.'],
['Ingrown hairs and folliculitis','Do not dig at an ingrown hair with tweezers or a needle. Gentle hygiene, reduced friction and temporarily avoiding close shaving may help. Spreading redness, pus, fever or recurrent painful bumps warrant medical assessment.'],
['When not to remove hair','Wait if you have active infection, open wounds, significant eczema flare or sunburn. Seek professional advice for unusual rashes, sudden excessive hair growth or prior serious reactions.'],
['A thoughtful product kit','Consider a sharp razor or guarded trimmer, compatible gel, reusable cleaning accessories, fragrance-free post-shave moisturiser and only the method-specific consumables you need. Expensive devices are not automatically necessary.'],
['Different bodies, different choices','There is no obligation to remove body hair. Personal comfort, accessibility, pain tolerance, skin tone and texture should determine your approach—not fashion pressure.']
];
const methods=[
['Trimming','Low irritation potential','Shortens hair without attempting an ultra-close finish.','Trimmers, guards, cleaning brush'],
['Wet shaving','Fast and inexpensive','Smooth short-term result; technique and blade condition matter.','Body razors, refill blades, shave gel'],
['Waxing & sugaring','Longer lasting','Removes hair from the root; sensitive or treated skin requires caution.','Wax strips, hard wax, spatulas'],
['Depilatory creams','Chemical method','Use only on indicated regions with a timed patch test.','Body depilatory creams, applicators'],
['Epilators','Root removal','Tweezing mechanisms may cause temporary discomfort.','Wet/dry epilators, cleansing accessories'],
['IPL & professional laser','Long-term reduction','Skin-tone compatibility and safety screening are essential.','Manufacturer-approved IPL devices']
];
const faq=[
['Can I shave every day?','Some people tolerate daily shaving; others develop razor burn. Reduce frequency or use a guard if the skin becomes irritated.'],
['Does shaving make hair grow thicker?','No. The blunt end of a shaved hair can feel coarser, but shaving does not change the follicle’s growth rate or true thickness.'],
['Is home IPL permanent?','Devices may provide longer-term hair reduction and require maintenance. Do not promise permanent removal; results vary.'],
['Can I wax while using a retinoid?','Retinoids may increase skin fragility, particularly in treated areas. Consult your clinician or product guidance before waxing.'],
['How can I reduce ingrown hairs?','Avoid repeated close passes, use a sharp blade in the direction of growth, reduce friction and never pick at an inflamed bump.']
];
const stores=[
['Flamingo','https://www.shopflamingo.com/products.json?limit=150','USD'],
['Billie','https://mybillie.com/products.json?limit=150','USD'],
['Athena Club','https://www.athenaclub.com/products.json?limit=150','USD'],
['Estrid','https://estrid.com/products.json?limit=150','EUR'],
['Fur','https://furyou.com/products.json?limit=150','USD'],
['Fur','https://www.furyou.com/products.json?limit=150','USD'],
['Sugardoh','https://sugardoh.co/products.json?limit=150','USD'],
['Nad’s','https://nads.com/products.json?limit=150','USD'],
['Waxing Moon','https://www.waxingmoon.com/products.json?limit=150','USD'],
['Glee','https://www.gleebrand.com/products.json?limit=150','USD'],
['Bushbalm','https://bushbalm.com/products.json?limit=150','CAD'],
['WooWoo','https://woowoo.fun/products.json?limit=150','GBP'],
['Gillette Venus','https://gillettevenus.com/products.json?limit=150','USD'],
['Veet','https://www.veet.co.uk/products.json?limit=150','GBP'],
['GiGi','https://gigispa.com/products.json?limit=150','USD'],
['Parissa','https://parissa.com/products.json?limit=150','CAD'],
['Cirepil','https://cirepil.com/products.json?limit=150','USD'],
['Schick Hydro Silk','https://www.schick.com/products.json?limit=150','USD'],
['Bleame','https://bleame.com/products.json?limit=150','USD'],
['Happy Waxing','https://happywaxing.com/products.json?limit=150','USD']
];
const re=/(razor|shav(e|ing|er)|wax|sugar|depilat|epilat|hair remov|hair removal|trimmer|bikini|ingrown|post.shave|waxing|silk|body groom|laser|ipl|blade refill|razor refill)/i;
async function get(url,timeout=13000){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeout);try{return await fetch(url,{signal:c.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; MariaSM-Catalog/1.0)','Accept':'application/json,image/*,*/*'}})}finally{clearTimeout(t)}}
const picks=[];
await Promise.all(stores.map(async([brand,url,currency])=>{try{
 const response=await get(url);if(!response.ok)return;
 const data=await response.json();if(!Array.isArray(data.products))return;
 let selected=0;
 for(const item of data.products){if(selected>=9)break;
  if(!re.test(item.title??''))continue;
  const photo=(item.images??[]).find(i=>/^https:\/\//i.test(i.src??'')&&i.width!==0);
  const variant=(item.variants??[]).find(v=>v.available!==false&&Number(v.price)>0)??(item.variants??[]).find(v=>Number(v.price)>0);
  if(!photo||!variant)continue;
  const price=Number(variant.price);if(!(price>0&&price<1500))continue;
  const desc=String(item.body_html??'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,205);
  picks.push({brand,title:item.title,photo:photo.src,price,currency,url:new URL(url).origin+'/products/'+encodeURIComponent(item.handle),description:desc||'See the official store for specifications and method-specific instructions.'});selected++;
 }
}catch(e){console.warn('Hair removal catalog unavailable:',brand,String(e).slice(0,100))}}));
function imageDimensions(b){
 if(b.length<40)return null;
 if(b[0]===137&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {type:'png',width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){
  const tag=b.toString('ascii',12,16);
  if(tag==='VP8X'&&b.length>=30)return {type:'webp',width:1+b.readUIntLE(24,3),height:1+b.readUIntLE(27,3)};
  if(tag==='VP8 '&&b.length>=30)return {type:'webp',width:b.readUInt16LE(26)&0x3fff,height:b.readUInt16LE(28)&0x3fff};
  if(tag==='VP8L'&&b.length>=25){const v=b.readUInt32LE(21);return {type:'webp',width:1+(v&0x3fff),height:1+((v>>14)&0x3fff)};}
  return null;
 }
 if(b[0]===255&&b[1]===216){
  let i=2;
  while(i+9<b.length){
   if(b[i]!==255){i++;continue;}let m=b[i+1];i+=2;
   if(m===0xd9||m===0xda)break;
   if(m===0x01||(m>=0xd0&&m<=0xd7))continue;
   const n=b.readUInt16BE(i);if(n<2||i+n>b.length)break;
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(m))return {type:'jpg',width:b.readUInt16BE(i+5),height:b.readUInt16BE(i+3)};
   i+=n;
  }
 }
 return null;
}
const uniq=new Set();const verified=[];
for(const p of picks){
 if(verified.length>=48)break;
 const key=(p.brand+' '+p.title).toLowerCase();if(uniq.has(key))continue;uniq.add(key);
 try{
  const response=await get(p.photo,16000);if(!response.ok)continue;
  const bytes=Buffer.from(await response.arrayBuffer());const dim=imageDimensions(bytes);
  if(!dim||bytes.length<4000||bytes.length>6000000||dim.width<240||dim.height<240||dim.width>9000||dim.height>9000)continue;
  const filename='hair-removal-'+String(verified.length+1).padStart(2,'0')+'.'+dim.type;
  fs.writeFileSync(path.join(assets,filename),bytes);
  // Re-read the file and verify its bytes are preserved on disk.
  const check=fs.readFileSync(path.join(assets,filename));const recheck=imageDimensions(check);
  if(check.length!==bytes.length||!recheck||recheck.width!==dim.width||recheck.height!==dim.height){fs.unlinkSync(path.join(assets,filename));continue;}
  verified.push({...p,local:'assets/hair-removal/'+filename,dim});
 }catch(e){console.warn('Skipped image',p.title,String(e).slice(0,70))}
}
const style='<style id="ms-depilation-styles">#depilation{background:#fff5f9;border-top:1px solid #ead3df;padding:64px 0}#depilation .hr-wrap{width:min(1200px,calc(100% - 40px));margin:auto}#depilation h2{font:normal clamp(34px,5vw,56px)/1.1 Georgia,serif}#depilation h3{font:normal 23px Georgia,serif}#depilation p{line-height:1.7}#depilation .hr-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}#depilation .hr-method,#depilation .hr-lesson,#depilation .hr-product{background:white;border:1px solid #ecd8e3;border-radius:16px;padding:20px;min-width:0}#depilation .hr-lessons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}#depilation .hr-product{padding:0;overflow:hidden;display:flex;flex-direction:column}#depilation .hr-product img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain;background:white}#depilation .hr-product>div{padding:16px;display:flex;flex-direction:column;flex:1}#depilation .hr-product p{font-size:13px}#depilation .hr-price{font-weight:800;margin-top:auto}#depilation .hr-product a{font-size:13px;font-weight:700}#depilation .hr-products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}#depilation details{background:#fff;border:1px solid #ecd8e3;border-radius:12px;padding:16px;margin:8px 0}#depilation summary{cursor:pointer;font-weight:700}#depilation .hr-note{background:#f8e6ef;padding:16px;border-left:3px solid #bb789c}#depilation .hr-pill{display:inline-block;text-decoration:none;padding:9px 15px;margin:5px;border:1px solid #cfa5ba;border-radius:30px;background:white}@media(max-width:950px){#depilation .hr-products{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){#depilation .hr-products,#depilation .hr-grid,#depilation .hr-lessons{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){#depilation .hr-products,#depilation .hr-grid,#depilation .hr-lessons{grid-template-columns:1fr}}</style>';
const methodHtml=methods.map(([n,c,d,tools])=>'<article class="hr-method"><small>'+escape(c)+'</small><h3>'+escape(n)+'</h3><p>'+escape(d)+'</p><strong>Tools:</strong> '+escape(tools)+'</article>').join('');
const lessonHtml=lessons.map(([n,d],i)=>'<article class="hr-lesson"><small>GUIDE '+String(i+1).padStart(2,'0')+'</small><h3>'+escape(n)+'</h3><p>'+escape(d)+'</p></article>').join('');
const productHtml=verified.map(p=>'<article class="hr-product"><img src="'+escape(p.local)+'" loading="lazy" decoding="async" width="'+p.dim.width+'" height="'+p.dim.height+'" alt="'+escape(p.brand+' '+p.title)+'"><div><small>'+escape(p.brand)+'</small><h3>'+escape(p.title)+'</h3><p>'+escape(p.description)+'</p><div class="hr-price">'+new Intl.NumberFormat('en',{style:'currency',currency:p.currency}).format(p.price)+'</div><a href="'+escape(p.url)+'" target="_blank" rel="noopener noreferrer">See details at official store ↗</a></div></article>').join('');
const faqHtml=faq.map(([q,a])=>'<details><summary>'+escape(q)+'</summary><p>'+escape(a)+'</p></details>').join('');
const content=style+'<section id="depilation"><div class="hr-wrap"><small>SKINCARE ATELIER · BODY CARE</small><h2>Body hair removal & depilation</h2><p>From an everyday razor to salon treatments: a practical and inclusive guide to hair removal, skin preparation, safe technique and soothing aftercare.</p><p><a class="hr-pill" href="#hr-methods">Compare methods</a><a class="hr-pill" href="#hr-technique">Step-by-step techniques</a><a class="hr-pill" href="#hr-shop">Product shop</a><a class="hr-pill" href="#hr-faq">FAQs</a></p><h2 id="hr-methods">Choose your method</h2><div class="hr-grid">'+methodHtml+'</div><h2 id="hr-technique">Technique and skin safety</h2><div class="hr-lessons">'+lessonHtml+'</div><h2 id="hr-shop">Shop: razors, wax, trimmers and aftercare</h2><p>Products and accessories are sourced from brand catalogues. Every item shown below has a separately downloaded, inspected and locally archived product photograph: unverified image files are never displayed.</p><p class="hr-note">Prices are a dated catalogue snapshot in the original retailer currency. Stock, tax, shipping and local prices may differ. Always check the store’s current offer and product safety guidance.</p>'+(verified.length?'<div class="hr-products">'+productHtml+'</div>':'<p class="hr-note">No retailer images met the verification requirements during this build, so no product cards are displayed. Browse official retailers for current offers.</p>')+'<h2 id="hr-faq">Frequently asked questions</h2>'+faqHtml+'<p class="hr-note">These guides are educational rather than personal medical advice. If you develop severe burns, spreading redness, fever or persistent skin lesions, seek medical care. For hair-removal safety, consult <a href="https://www.aad.org/public/everyday-care/skin-care-basics/hair/remove-unwanted-hair" target="_blank" rel="noopener noreferrer">the American Academy of Dermatology</a>.</p></div></section>';
if(html.includes('id="depilation"'))throw Error('Depilation section already present: stop to avoid duplicates');
if(!html.includes('</footer>'))throw Error('Skincare page footer not found');
html=html.replace('</footer>', '</footer>'); // no-op ensures expected markup is present
const beforeFooter=html.lastIndexOf('<footer');
if(beforeFooter<0)throw Error('Missing footer insertion point');
html=html.slice(0,beforeFooter)+content+html.slice(beforeFooter);
html=html.replace('<a href="#shop">Shop</a>','<a href="#shop">Shop</a><a href="#depilation">Hair removal & depilation</a>');
fs.writeFileSync(page,html);
if(!html.includes('id="depilation"')||!html.includes('id="hr-shop"'))throw Error('New body hair removal page content missing');
for(const p of verified){if(!fs.existsSync(path.join(root,'docs/skin-care',p.local)))throw Error('Missing local product photo: '+p.local);}
console.log('Body hair removal guide published:',lessons.length,'guides,',methods.length,'method comparisons,',verified.length,'individually inspected original product photographs. Seller catalog entries:',picks.length);
