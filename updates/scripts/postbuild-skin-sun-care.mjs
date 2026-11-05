import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/skin-care/index.html');
const dir=path.join(root,'docs/skin-care/assets/sun-care');
fs.mkdirSync(dir,{recursive:true});
let html=fs.readFileSync(page,'utf8');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const articles=[
['Understand SPF','SPF measures protection against sunburn-causing UVB radiation in laboratory testing. SPF 30 blocks about 97% of UVB under test conditions; no sunscreen blocks 100%.'],
['Broad spectrum UVA + UVB','Look for broad-spectrum protection: UVA contributes to premature skin ageing and skin cancer risk, while UVB is a principal cause of sunburn. In Europe, the circled UVA symbol indicates compliance with the relevant UVA protection recommendation.'],
['Choosing a daily face sunscreen','Look for broad-spectrum SPF 30 or higher, a comfortable texture and a formula suited to your skin. Lightweight fluids, tinted formulas and fragrance-free products may suit different preferences.'],
['Body sunscreen','For prolonged outdoor exposure choose SPF 30–50+, an appropriate water-resistant formula when swimming or sweating and enough product to cover all exposed skin.'],
['How much and when','An average adult needs approximately 30–35 ml to cover the whole body, depending on body size. Apply before going outdoors as instructed on the label. Reapply roughly every two hours outdoors and immediately after swimming, towelling or sweating.'],
['Mineral versus organic UV filters','Mineral UV filters such as zinc oxide and titanium dioxide and approved organic filters both work when correctly formulated and used. Choose based on tolerability, broad-spectrum efficacy and local regulatory approvals, not misleading “chemical-free” claims.'],
['Sensitive and acne-prone skin','Choose fragrance-free or non-comedogenic formulas where useful. Test small areas when your skin is reactive. Sunscreen can sting around the eyes; dedicated eye-tolerant formulas or sunglasses and shade may help.'],
['Children and sun protection','Keep infants younger than six months out of direct sunlight and ask a clinician before applying sunscreen to very young babies. Children benefit from shade, clothing and hats as well as sunscreen on exposed skin.'],
['Sport and swimming','Water-resistant is not waterproof. Check the labelled resistance duration, reapply after towelling, and pair sunscreen with a hat, UPF clothing and shade.'],
['Makeup and SPF','Makeup containing SPF may not give sufficient coverage because most people apply less than the tested amount. Use a dedicated sunscreen as your primary protection.'],
['Expiry and storage','Do not rely on expired sunscreen or a product that has separated, changed smell or been stored in prolonged extreme heat. Follow the expiry date and period-after-opening instructions.'],
['Sunburn care','Move into shade, cool skin gently and moisturise. Drink water. Seek medical attention for severe blistering, fever, dehydration, extensive burns or burns affecting vulnerable people.'],
['Tanning myths','A base tan is evidence of UV damage, not reliable protection. Sunbeds increase skin cancer risk. Consider sunless tanning if desired while continuing sunscreen.'],
['Sunscreen and depilation','Freshly shaved or waxed skin may be irritated; choose a gentle sunscreen after the skin has settled, and limit direct sun exposure after waxing, IPL or laser according to treatment advice.']
];
const faqs=[
['Is SPF 50 twice as strong as SPF 25?','No. SPF is not a linear percentage measure; sufficient application and reapplication matter more than small theoretical differences.'],
['Do I need sunscreen on cloudy days?','UV can pass through clouds. Check local UV conditions, especially during extended time outdoors.'],
['Do darker skin tones need sunscreen?','Yes. All skin tones can sustain UV damage, even if sunburn presentation and risk profiles differ.'],
['Do I need SPF indoors?','It depends on sunlight exposure, windows, location and individual skin conditions; regular outdoor protection is the priority.'],
['Can sunscreen replace a hat and shade?','No. Clothing, shade, sunglasses and reducing midday exposure are valuable complementary protections.']
];
const stores=[
['Beauty of Joseon','https://beautyofjoseon.com/products.json?limit=150','USD'],
['COSRX','https://www.cosrx.com/products.json?limit=150','USD'],
['Paula’s Choice','https://www.paulaschoice.com/products.json?limit=150','USD'],
['Supergoop!','https://supergoop.com/products.json?limit=150','USD'],
['Ultra Violette','https://ultraviolette.com.au/products.json?limit=150','AUD'],
['Bondi Sands','https://bondisands.com.au/products.json?limit=150','AUD'],
['Vacation','https://www.vacation.inc/products.json?limit=150','USD'],
['Naked Sundays','https://nakedsundays.com/products.json?limit=150','AUD'],
['Sun Bum','https://www.sunbum.com/products.json?limit=150','USD'],
['Coola','https://coola.com/products.json?limit=150','USD']
];
async function fetchWithTimeout(url,timeout=10000){const controller=new AbortController(),t=setTimeout(()=>controller.abort(),timeout);try{return await fetch(url,{signal:controller.signal,headers:{Accept:'application/json,image/*,*/*','User-Agent':'Mozilla/5.0 (compatible; MariaSM/1.0)'}})}finally{clearTimeout(t)}}
function imageInfo(b){
 if(b.length<48)return null;
 if(b[0]===137&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {ext:'png',w:b.readUInt32BE(16),h:b.readUInt32BE(20)};
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){
  const tag=b.toString('ascii',12,16);
  if(tag==='VP8X')return {ext:'webp',w:1+b.readUIntLE(24,3),h:1+b.readUIntLE(27,3)};
  if(tag==='VP8 ')return {ext:'webp',w:b.readUInt16LE(26)&16383,h:b.readUInt16LE(28)&16383};
  if(tag==='VP8L'){const v=b.readUInt32LE(21);return {ext:'webp',w:1+(v&16383),h:1+((v>>14)&16383)};}
 }
 if(b[0]===255&&b[1]===216){let i=2;while(i+10<b.length){if(b[i]!==255){i++;continue;}const m=b[i+1];i+=2;if(m===0xd9||m===0xda)break;if(m===0x01||(m>=0xd0&&m<=0xd7))continue;const n=b.readUInt16BE(i);if(n<2||i+n>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(m))return {ext:'jpg',w:b.readUInt16BE(i+5),h:b.readUInt16BE(i+3)};i+=n;}}
 return null;
}
const pool=[];
await Promise.all(stores.map(async([brand,url,currency])=>{try{
 const response=await fetchWithTimeout(url);
 if(!response.ok)return;
 const data=await response.json();
 let added=0;
 for(const p of data.products??[]){
  if(added>=10)break;
  if(!/(sun(screen|block|cream|care| protection)|spf|uv protection|sun shield)/i.test(p.title??''))continue;
  const photo=p.images?.find(im=>/^https:\/\//.test(im.src??''))?.src;
  const variant=p.variants?.find(v=>v.available!==false&&Number(v.price)>0)??p.variants?.find(v=>Number(v.price)>0);
  if(!photo||!variant||Number(variant.price)>500)continue;
  pool.push({brand,title:p.title,photo,price:Number(variant.price),currency,url:new URL(url).origin+'/products/'+encodeURIComponent(p.handle),description:String(p.body_html??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,165)||'Read full product directions on the official retailer website.'});
  added++;
 }
}catch(e){console.warn('Sunscreen catalogue unavailable',brand,String(e).slice(0,85))}}));
const verified=[];const seen=new Set();
for(const p of pool){
 if(verified.length>=36)break;
 const key=(p.brand+p.title).toLowerCase();if(seen.has(key))continue;seen.add(key);
 try{
  const resp=await fetchWithTimeout(p.photo,11000);if(!resp.ok)continue;
  const bytes=Buffer.from(await resp.arrayBuffer());const dims=imageInfo(bytes);
  if(!dims||dims.w<240||dims.h<240||dims.w>9000||dims.h>9000||bytes.length<4000||bytes.length>6000000)continue;
  const file='sunscreen-'+String(verified.length+1).padStart(2,'0')+'.'+dims.ext;
  fs.writeFileSync(path.join(dir,file),bytes);
  const saved=fs.readFileSync(path.join(dir,file));
  if(saved.length!==bytes.length||!imageInfo(saved)){fs.unlinkSync(path.join(dir,file));continue;}
  verified.push({...p,local:'assets/sun-care/'+file,dims});
 }catch(e){console.warn('Sunscreen photo unavailable',p.title,String(e).slice(0,85))}
}
const articleHtml=articles.map(([title,body],i)=>'<article class="sun-guide"><small>GUIDE '+(i+1)+'</small><h3>'+E(title)+'</h3><p>'+E(body)+'</p></article>').join('');
const productHtml=verified.map(p=>'<article class="sun-product"><img loading="lazy" decoding="async" src="'+E(p.local)+'" width="'+p.dims.w+'" height="'+p.dims.h+'" alt="'+E(p.brand+' '+p.title)+'"><div class="sun-product-body"><small>'+E(p.brand)+'</small><h3>'+E(p.title)+'</h3><p>'+E(p.description)+'</p><strong>'+new Intl.NumberFormat('en',{style:'currency',currency:p.currency}).format(p.price)+'</strong><a href="'+E(p.url)+'" target="_blank" rel="noopener noreferrer">See official product ↗</a></div></article>').join('');
const faqHtml=faqs.map(([question,answer])=>'<details><summary>'+E(question)+'</summary><p>'+E(answer)+'</p></details>').join('');
const css='<style id="ms-sun-styles">#sun-care{background:#fff9f1;padding:60px 0;color:#634d48}#sun-care .sun-wrap{width:min(1200px,calc(100% - 40px));margin:auto}#sun-care h2{font:normal clamp(36px,5vw,55px)/1.15 Georgia,serif}#sun-care h3{font:normal 23px Georgia,serif;margin:9px 0}#sun-care .sun-guides{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}#sun-care .sun-guide{padding:23px;border:1px solid #eeddd1;background:#fff;border-radius:16px}#sun-care .sun-guide small,#sun-care .sun-product small{color:#ab7661;font-weight:800}#sun-care .sun-products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}#sun-care .sun-product{background:#fff;border:1px solid #eeddd1;border-radius:15px;overflow:hidden;display:flex;flex-direction:column;min-width:0}#sun-care .sun-product img{width:100%;height:auto;aspect-ratio:1;object-fit:contain;background:white;display:block}#sun-care .sun-product-body{padding:16px;flex:1;display:flex;flex-direction:column}#sun-care .sun-product-body p{font-size:13px}#sun-care .sun-product-body strong{margin-top:auto}#sun-care .sun-product a{font-weight:700;font-size:13px;margin-top:12px;color:#8b4c35}#sun-care .sun-note{border-left:4px solid #c89771;background:#fff0dd;padding:17px;margin:17px 0}#sun-care details{padding:16px;background:#fff;border:1px solid #ead9d0;border-radius:12px;margin:9px 0}#sun-care summary{cursor:pointer;font-weight:700}#sun-care a{color:#8b4c35}@media(max-width:940px){#sun-care .sun-products{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){#sun-care .sun-guides,#sun-care .sun-products{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:460px){#sun-care .sun-guides,#sun-care .sun-products{grid-template-columns:1fr}}</style>';
const section=css+'<section id="sun-care"><div class="sun-wrap"><small>SKINCARE ATELIER · SUN PROTECTION</small><h2>Sun care & sunscreen: SPF, UVA and UVB</h2><p>Protective daily habits, sunscreen selection and practical application, from face creams to water-resistant body formulas.</p><div class="sun-note"><strong>Start here:</strong> use broad-spectrum SPF 30+ when appropriate, apply generously, reapply during outdoor exposure and combine with shade, clothing and a hat. No sunscreen makes prolonged exposure risk-free.</div><h2 id="sun-guides">The sun protection guide</h2><div class="sun-guides">'+articleHtml+'</div><h2 id="sun-shop">Sunscreen shop</h2><p>Each published product photograph is separately downloaded and file-checked, then served from this site rather than the retailer CDN. Products without a valid original image are hidden.</p><p class="sun-note">Listed prices are retailer catalogue snapshots in the original currency—not verified live euro prices. Check availability, shipping and taxes on the official product page.</p>'+(verified.length?'<div class="sun-products">'+productHtml+'</div>':'<p class="sun-note">No product images passed the required checks for this build. Products are hidden rather than displaying broken images; browse the manufacturer websites for current availability.</p>')+'<h2 id="sun-faq">Sunscreen FAQs</h2>'+faqHtml+'<p>Educational references: <a href="https://www.aad.org/public/everyday-care/sun-protection" target="_blank" rel="noopener noreferrer">American Academy of Dermatology</a> · <a href="https://www.nhs.uk/live-well/seasonal-health/sunscreen-and-sun-safety/" target="_blank" rel="noopener noreferrer">NHS sunscreen and sun safety</a>.</p></div></section>';
if(html.includes('id="sun-care"'))throw Error('Sun care module already inserted');
const pos=html.lastIndexOf('<footer');if(pos<0)throw Error('Skincare footer missing');
html=html.slice(0,pos)+section+html.slice(pos);
html=html.replace('<a href="#shop">Shop</a>','<a href="#shop">Shop</a><a href="#sun-care">Sun protection & SPF</a>');
fs.writeFileSync(page,html);
for(const p of verified){if(!fs.existsSync(path.join(root,'docs/skin-care',p.local)))throw Error('Missing image: '+p.local);}
console.log('Sunscreen guide created:',articles.length,'guides,',faqs.length,'FAQs,',verified.length,'verified product photos');
