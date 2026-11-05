import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sections=[
{slug:'skin-care',label:'Skincare Atelier',eyebrow:'SKIN · FACE · BODY',title:'The art and science of caring for your skin',lead:'A thoughtful guide to cleansing, hydration, sun protection, ingredients and the everyday routines that make sense for real skin.',chapters:[
['Start with your skin','Skin type and skin condition are different. Dry, oily and combination skin can all be sensitive or dehydrated. Choose gentle products first; introduce actives one at a time.'],
['Morning ritual','Cleanse gently if needed, moisturise and apply broad-spectrum SPF 30 or higher to exposed skin. Use enough sunscreen and reapply roughly every two hours outdoors, or after swimming or heavy sweating.'],
['Evening ritual','Remove makeup and sunscreen with a suitable cleanser, then use a moisturiser. Double cleansing is optional, not a requirement.'],
['Cleansing without stripping','Use lukewarm water, a fragrance-free gentle cleanser and fingertips rather than abrasive scrubs. Pat dry and moisturise while skin is slightly damp.'],
['Moisture barrier','Humectants such as glycerin and hyaluronic acid attract water; emollients smooth and occlusives such as petrolatum reduce water loss. Richer creams may suit very dry skin.'],
['Sunscreen explained','SPF indicates UVB protection under test conditions. Choose broad-spectrum UVA/UVB protection, SPF 30+, and a texture you will actually wear. Sunscreen does not make unlimited sun exposure safe.'],
['Niacinamide and vitamin C','Niacinamide can support barrier function; vitamin C is an antioxidant used for uneven tone. Patch-test and avoid layering multiple irritating treatments at once.'],
['Retinoids and retinol','Start slowly at night and expect possible dryness. Avoid retinoids during pregnancy or when trying to conceive unless a clinician directs otherwise. Seek professional advice for persistent acne.'],
['Exfoliating acids','AHAs such as glycolic and lactic acid work at the surface; salicylic acid is oil soluble. Over-exfoliation can worsen irritation. Avoid combining strong exfoliants when your skin is reactive.'],
['Sensitive skin and rosacea','Prefer simple fragrance-free formulas and a consistent routine. Burning, flushing or persistent redness deserves assessment rather than aggressive experimentation.'],
['Acne and spots','Non-comedogenic products can help. Benzoyl peroxide, adapalene or salicylic acid may be useful depending on age and circumstances; seek clinical help for painful, scarring or persistent acne.'],
['Body care','Keep showers short and lukewarm, cleanse where needed and use an appropriate moisturiser. Hands, elbows, feet and other exposed areas may need extra care.'],
['Lips, hands and feet','Lip balm with SPF outdoors, hand cream after washing and a urea-based foot cream where appropriate can support comfort. Avoid putting exfoliants on broken skin.'],
['Shaving and hair removal','Soften hair first, use a lubricating product, follow hair growth and avoid repeated passes when prone to irritation.'],
['When to seek medical advice','Rapidly changing moles, non-healing sores, severe rashes, infections or concerning pigment changes need medical evaluation. Skincare is not a substitute for diagnosis.']
],faqs:[
['Should I use ten products?','No. A gentle cleanser, moisturiser and sunscreen are a strong foundation. Add targeted products only when you have a clear reason.'],
['Does oily skin need moisturiser?','Often yes. Select a lightweight non-comedogenic formula.'],
['Can I use retinol every night immediately?','Starting slowly is usually better tolerated. Follow the formulation guidance and stop if significant irritation occurs.'],
['Can skincare replace a dermatologist?','No. Persistent symptoms, scarring acne or worrying lesions require professional assessment.']
],keywords:['cleanser','cleansing','moistur','serum','sun','spf','retinol','niacinamide','hyaluronic','lip balm','body lotion','face cream','vitamin c'],sources:[['American Academy of Dermatology','https://www.aad.org/public/everyday-care/skin-care-basics'],['NHS sunscreen guidance','https://www.nhs.uk/live-well/seasonal-health/sunscreen-and-sun-safety/']]},
{slug:'oral-care',label:'Oral Care Atelier',eyebrow:'TEETH · GUMS · MOUTH',title:'A healthier smile starts with the everyday details',lead:'Evidence-led brushing, interdental cleaning, fluoride, gum care and helpful tools for a practical oral hygiene routine.',chapters:[
['The daily foundation','Brush twice a day for about two minutes using fluoride toothpaste. Clean between teeth daily with floss or interdental brushes as appropriate.'],
['Toothbrush technique','Tilt soft bristles gently towards the gumline and clean outer, inner and chewing surfaces without scrubbing hard. Replace a worn brush head approximately every three months.'],
['Fluoride matters','For most adults, fluoride toothpaste around 1,350–1,500 ppm is recommended in NHS guidance. Spit after brushing rather than rinsing immediately with water to retain fluoride.'],
['Floss and interdental brushes','Use floss for tight contacts and appropriately sized interdental brushes where there is space. Never force an oversized brush; your dental team can help with sizes.'],
['Electric or manual?','Both can work with careful technique. Oscillating-rotating or sonic brushes may help some people brush thoroughly; pressure sensors and timers can be useful.'],
['Gum health','Bleeding gums can be a sign of gingivitis, not proof that you should stop cleaning. Persistent bleeding, swelling, loose teeth or pain should be assessed by a dentist.'],
['Tongue and breath','Gently cleaning the tongue and maintaining oral hygiene can help with breath. Persistent bad breath may have oral or medical causes worth checking.'],
['Mouthwash: useful but optional','A fluoride mouthwash at a different time from brushing may be helpful for some people. Antiseptic mouthwashes such as chlorhexidine are for limited courses when advised; they can stain teeth.'],
['Acids, sugar and enamel','Limit frequent sugary and acidic exposures. After acidic food or drinks, rinse with water and avoid immediate vigorous brushing.'],
['Sensitivity','Use a gentle brush and sensitivity toothpaste; persistent or localised pain needs a dentist to rule out decay, cracks and other causes.'],
['Whitening safely','Surface-stain toothpaste and dentist-supervised whitening are different. Avoid abrasive DIY charcoal, lemon or peroxide recipes that can injure teeth and gums.'],
['Braces, implants and restorations','Orthodontic appliances, bridges and implants can require tailored interdental brushes, floss threaders or irrigators. Follow personalised advice.'],
['Dry mouth','Hydration, sugar-free gum where appropriate and review of medicines may help. Persistent xerostomia increases dental risk and deserves assessment.'],
['Dental checkups','The right appointment interval depends on your risk and your dentist’s assessment; do not wait for pain before seeking care.'],
['Urgent warning signs','Facial swelling, fever with dental pain, trouble swallowing or breathing, and spreading infection need urgent assessment; breathing/swallowing difficulty is an emergency.']
],faqs:[
['Do I rinse after fluoride toothpaste?','For most adults, spit out the excess rather than immediately rinsing with water.'],
['Is bleeding while flossing normal?','It may happen with inflamed gums but should improve with gentle regular cleaning; persistent bleeding warrants dental review.'],
['Can a water flosser replace every interdental tool?','It can be a useful adjunct, especially around appliances, but technique and individual needs differ. Ask your dental hygienist.'],
['Can I whiten teeth with lemon or baking soda?','Avoid acidic or abrasive DIY treatments that can damage enamel and soft tissues.']
],keywords:['tooth','brush','floss','interdental','mouthwash','tongue','dental','gum','whitening','oral','paste'],sources:[['NHS how to keep teeth clean','https://www.nhs.uk/live-well/healthy-teeth-and-gums/how-to-keep-your-teeth-clean/'],['American Dental Association MouthHealthy','https://www.mouthhealthy.org/']]}
];
const stores=[
{brand:'The Ordinary',url:'https://theordinary.com/en-us/products.json?limit=160',currency:'USD',kind:'skin-care'},
{brand:'The INKEY List',url:'https://www.theinkeylist.com/products.json?limit=160',currency:'GBP',kind:'skin-care'},
{brand:'Geek & Gorgeous',url:'https://geekandgorgeous.com/products.json?limit=160',currency:'EUR',kind:'skin-care'},
{brand:'Paula’s Choice',url:'https://www.paulaschoice.com/products.json?limit=160',currency:'USD',kind:'skin-care'},
{brand:'COSRX',url:'https://www.cosrx.com/products.json?limit=160',currency:'USD',kind:'skin-care'},
{brand:'BYOMA',url:'https://byoma.com/products.json?limit=160',currency:'GBP',kind:'skin-care'},
{brand:'Beauty of Joseon',url:'https://beautyofjoseon.com/products.json?limit=160',currency:'USD',kind:'skin-care'},
{brand:'Typology',url:'https://global.typology.com/products.json?limit=160',currency:'USD',kind:'skin-care'},
{brand:'Marvis',url:'https://www.marvis.com/products.json?limit=160',currency:'EUR',kind:'oral-care'},
{brand:'Curaprox',url:'https://curaprox.us/products.json?limit=160',currency:'USD',kind:'oral-care'},
{brand:'Boka',url:'https://www.boka.com/products.json?limit=160',currency:'USD',kind:'oral-care'},
{brand:'Cocofloss',url:'https://cocofloss.com/products.json?limit=160',currency:'USD',kind:'oral-care'},
{brand:'BURST',url:'https://www.burstoralcare.com/products.json?limit=160',currency:'USD',kind:'oral-care'},
{brand:'Spotlight Oral Care',url:'https://spotlightoralcare.com/products.json?limit=160',currency:'EUR',kind:'oral-care'},
{brand:'Hismile',url:'https://us.hismileteeth.com/products.json?limit=160',currency:'USD',kind:'oral-care'}
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function get(url,timeout=10000){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeout);try{return await fetch(url,{signal:c.signal,headers:{'User-Agent':'MariaSMEditorial/1.0','Accept':'application/json,image/*,*/*'}})}finally{clearTimeout(t)}}
const catalogs={ 'skin-care':[], 'oral-care':[]};
await Promise.all(stores.map(async store=>{try{const resp=await get(store.url);if(!resp.ok)return;const obj=await resp.json();if(!Array.isArray(obj.products))return;let count=0;for(const p of obj.products){if(count>=12)break;const s=sections.find(x=>x.slug===store.kind);const title=String(p.title||'');if(!s.keywords.some(k=>title.toLowerCase().includes(k)))continue;const photo=p.images?.find(i=>/^https:\/\//.test(i.src||''))?.src;if(!photo)continue;const variant=p.variants?.find(v=>v.available!==false&&Number(v.price)>0)??p.variants?.find(v=>Number(v.price)>0);if(!variant)continue;const price=Number(variant.price);if(!(price>0&&price<2000))continue;const handle=encodeURIComponent(p.handle||'');const base=new URL(store.url).origin;catalogs[store.kind].push({brand:store.brand,title,price,currency:store.currency,image:photo,url:base+'/products/'+handle,description:String((p.body_html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()).slice(0,180)||'Explore the brand’s specifications and directions before use.'});count++}}catch(e){console.warn('Catalog unavailable',store.brand,String(e).slice(0,120))}}));
const made={};
for(const sec of sections){
 const dir=path.join(docs,sec.slug);const assets=path.join(dir,'assets');fs.mkdirSync(assets,{recursive:true});
 const verified=[];const pool=catalogs[sec.slug].slice(0,80);let attempts=0;
 for(const p of pool){if(verified.length>=40||attempts++>=75)break;try{
  const response=await get(p.image,13000);if(!response.ok)continue;
  const contentType=response.headers.get('content-type')||'';
  const bytes=Buffer.from(await response.arrayBuffer());
  const jpeg=bytes[0]===255&&bytes[1]===216, png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
  if(bytes.length<3000||bytes.length>4_000_000||!(jpeg||png||webp))continue;
  const ext=jpeg?'jpg':png?'png':'webp';const filename='product-'+(verified.length+1)+'.'+ext;
  fs.writeFileSync(path.join(assets,filename),bytes);
  verified.push({...p,local:'assets/'+filename});
 }catch(e){console.warn('Photo skipped',p.brand,p.title,String(e).slice(0,80))}}
 const article=sec.chapters.map(([name,body],i)=>'<article class="chapter"><span class="num">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+esc(name)+'</h3><p>'+esc(body)+'</p></div></article>').join('');
 const cards=verified.map(p=>'<article class="product"><img src="'+esc(p.local)+'" alt="'+esc(p.brand+' '+p.title)+'" loading="lazy" width="420" height="420"><div class="product-body"><small>'+esc(p.brand)+'</small><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p><div class="price">'+new Intl.NumberFormat('en',{style:'currency',currency:p.currency}).format(p.price)+'</div><a href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">View at brand store ↗</a></div></article>').join('');
 const faq=sec.faqs.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('');
 const resources=sec.sources.map(([name,url])=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(name)+' ↗</a>').join(' · ');
 const nav='<nav class="sectionnav"><a href="#guide">The guide</a><a href="#shop">Shop</a><a href="#faq">FAQ</a><a href="#resources">Sources</a><a href="../'+(sec.slug==='skin-care'?'oral-care':'skin-care')+'/index.html">Explore '+(sec.slug==='skin-care'?'Oral Care':'Skincare')+' ↗</a></nav>';
 const page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+esc(sec.lead)+'"><title>'+esc(sec.label)+' | MariaSM</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:#543f49;background:#fff9fb;font:16px/1.7 system-ui,-apple-system,sans-serif}a{color:#8b3765}.wrap{width:min(1200px,calc(100% - 40px));margin:auto}.top{background:#fff;border-bottom:1px solid #ead8e0;padding:14px 0}.top .wrap{display:flex;justify-content:space-between;align-items:center}.top a{text-decoration:none;font-weight:700}.brand{font:32px Georgia,serif}.hero{background:linear-gradient(118deg,#f9e4ef,#fff6fa 60%,#f0e4ed);padding:80px 0}.eyebrow{color:#9d6480;letter-spacing:.18em;font-weight:800;font-size:12px}.hero h1{font:normal clamp(38px,6vw,76px)/1.08 Georgia,serif;max-width:920px;margin:22px 0}.hero p{max-width:730px;font-size:19px}.sectionnav{display:flex;flex-wrap:wrap;gap:10px;padding:20px 0}.sectionnav a{background:#fff;border:1px solid #e9cddd;border-radius:28px;padding:7px 15px;text-decoration:none;font-size:13px;font-weight:700}.section{padding:50px 0}.section h2{font:normal clamp(32px,4vw,50px) Georgia,serif;margin:0 0 15px}.section>p{max-width:780px}.chapters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.chapter{display:flex;gap:16px;padding:25px;border:1px solid #efdce4;border-radius:18px;background:#fff}.chapter .num{color:#bf88a1;font:22px Georgia,serif}.chapter h3{font:normal 24px Georgia,serif;margin:0}.chapter p{margin:8px 0 0;color:#715965}.shop{background:#f6edf1;padding:55px 0}.products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.product{min-width:0;background:#fff;border:1px solid #ead6df;border-radius:16px;overflow:hidden;display:flex;flex-direction:column}.product img{width:100%;aspect-ratio:1;object-fit:contain;background:white;display:block}.product-body{padding:16px;display:flex;flex-direction:column;flex:1}.product small{color:#a45a80;font-weight:800}.product h3{font:normal 21px Georgia,serif;line-height:1.25;margin:8px 0}.product p{font-size:13px;color:#75616d}.price{font-size:19px;font-weight:800;margin-top:auto}.product a{margin-top:12px;font-weight:700;font-size:13px}.faq details{background:#fff;border:1px solid #ead6df;padding:17px;margin:12px 0;border-radius:12px}.faq summary{cursor:pointer;font-weight:700}.notice{background:#fff;border-left:4px solid #b77d9b;padding:19px;margin-top:25px;border-radius:8px}.footer{background:#5c3b4e;color:#fff;padding:35px 0}.footer a{color:#fff}@media(max-width:1000px){.products{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.chapters{grid-template-columns:1fr}.products{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:460px){.products{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style></head><body><header class="top"><div class="wrap"><a class="brand" href="../index.html">MariaSM</a><a href="../index.html">← Home</a></div></header><section class="hero"><div class="wrap"><small class="eyebrow">THE BEAUTY & WELLNESS ATELIERS · '+esc(sec.eyebrow)+'</small><h1>'+esc(sec.title)+'</h1><p>'+esc(sec.lead)+'</p></div></section><div class="wrap">'+nav+'<section class="section" id="guide"><h2>Care, explained step by step</h2><p>Simple, informed habits before expensive products: build a routine that matches your needs.</p><div class="chapters">'+article+'</div></section></div><section class="shop" id="shop"><div class="wrap"><h2>Curated product edit</h2><p>Only products with a downloaded, file-validated photograph are displayed. Prices are catalogue snapshots in the retailer’s displayed currency; regional availability, promotions, shipping and tax may differ. This is not a live price guarantee.</p>'+ (verified.length?'<div class="products">'+cards+'</div>':'<p class="notice">Product photography could not be verified during this publishing run. We have hidden unverified product cards rather than showing missing images. Visit the official brand retailers for currently available products.</p>')+'</div></section><div class="wrap"><section class="section faq" id="faq"><h2>Frequently asked questions</h2>'+faq+'</section><section class="section" id="resources"><h2>Reliable references</h2><p>'+resources+'</p><p class="notice">Educational information only. Product descriptions are simplified and do not replace instructions, personalised medical advice or a professional consultation.</p></section></div><footer class="footer"><div class="wrap">MariaSM · '+esc(sec.label)+' · <a href="../index.html">Back to the homepage</a></div></footer></body></html>';
 fs.writeFileSync(path.join(dir,'index.html'),page);made[sec.slug]=verified.length;
}
function pages(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(path.join(d,e.name)):e.isFile()&&e.name.endsWith('.html')?[path.join(d,e.name)]:[])}
let altered=0;
for(const p of pages(docs)){
 if(sections.some(s=>p===path.join(docs,s.slug,'index.html')))continue;
 let html=fs.readFileSync(p,'utf8');if(html.includes('class="ms-new-beauty-link"'))continue;
 const links=sections.map(s=>{let href=path.relative(path.dirname(p),path.join(docs,s.slug,'index.html')).split(path.sep).join('/');if(!href.startsWith('.'))href='./'+href;return '<a class="ms-new-beauty-link" href="'+href+'">'+s.label+'</a>'}).join('');
 const watch=/(<a\b[^>]*href=["'][^"']*watches\/index\.html[^"']*["'][^>]*>[\s\S]*?<\/a>)/;
 if(watch.test(html))html=html.replace(watch,m=>m+links);
 else if(/class="hair-nav-added"/.test(html))html=html.replace(/(<a class="hair-nav-added"[^>]*>[\s\S]*?<\/a>)/,m=>m+links);
 else if(p===path.join(docs,'index.html'))html=html.replace('</main>','<div class="wrap">'+links+'</div></main>');
 else continue;
 fs.writeFileSync(p,html);altered++;
}
const home=path.join(docs,'index.html');let html=fs.readFileSync(home,'utf8');
if(!html.includes('id="mariasm-skincare-oral-home"')){
 const feature='<section id="mariasm-skincare-oral-home" style="max-width:1190px;margin:30px auto;padding:30px;background:#f9edf3;border:1px solid #ead4e0;border-radius:20px"><small>NEW BEAUTY & WELLNESS ATELIERS</small><h2 style="font:normal 38px Georgia,serif">Skincare &amp; Oral Care</h2><p>Gentle skincare routines, facial and body treatments, daily dental hygiene and expert-informed practical guidance.</p><p><a href="skin-care/index.html">Explore Skincare Atelier ↗</a> &nbsp; · &nbsp; <a href="oral-care/index.html">Explore Oral Care Atelier ↗</a></p></section>';
 html=html.includes('</main>')?html.replace('</main>',feature+'</main>'):html.replace('</body>',feature+'</body>');
 fs.writeFileSync(home,html);
}
console.log('MariaSM wellness ateliers built',JSON.stringify({products:made,menus:altered,chapters:sections.map(s=>[s.slug,s.chapters.length])}));
