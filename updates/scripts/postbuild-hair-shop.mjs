import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'docs/hair'),page=path.join(dir,'index.html'),photos=path.join(dir,'assets/shop');
fs.mkdirSync(photos,{recursive:true});
let html=fs.readFileSync(page,'utf8');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const feeds=[
 ['Olaplex','https://it.olaplex.com/products.json?limit=120'],
 ['Curlsmith','https://curlsmith.com/products.json?limit=160'],
 ['Denman','https://denmanbrush.com/products.json?limit=120'],
 ['Tangle Teezer','https://tangleteezer.com/products.json?limit=120'],
 ['Kitsch','https://www.mykitsch.com/products.json?limit=160'],
 ['Davines','https://us.davines.com/products.json?limit=120'],
 ['Bouclème','https://www.boucleme.co.uk/products.json?limit=120'],
 ['ghd','https://www.ghdhair.com/products.json?limit=140'],
 ['Moroccanoil','https://www.moroccanoil.com/products.json?limit=120'],
 ['Wet Brush','https://wetbrush.com/products.json?limit=120']
];
const curated=[
 ['Olaplex','No.4 Bond Maintenance Shampoo','Shampoo','€16–96','https://it.olaplex.com/collections/all-olaplex-products','Cleansing shampoo in multiple sizes; choose according to hair and scalp needs.'],
 ['Olaplex','No.5 Bond Maintenance Conditioner','Conditioner','€16–96','https://it.olaplex.com/collections/all-olaplex-products','Conditioner for everyday softness, slip and reduced tangling.'],
 ['Olaplex','No.3PLUS Complete Repair Treatment','Treatments','€34–68','https://it.olaplex.com/','At-home pre-shampoo repair care; follow the product instructions.'],
 ['Olaplex','No.6 Bond Smoother','Styling','€18.98','https://ditano.com/collections/styling','Leave-in cream to style lengths and manage frizz.'],
 ['Olaplex','No.9 Nourishing Hair Serum','Styling','€18.98','https://ditano.com/collections/styling','Light serum for styling and finishing.'],
 ['Olaplex','No.7 Bonding Oil','Treatments','€27.99','https://prd-it-epp-p2.dglecom.net/it/c/capelli/14','Styling oil, suitable for adding shine to lengths.'],
 ['Davines','OI Conditioner','Conditioner','€32.80','https://www.rinascente.it/it/list/cosmetica/capelli','Conditioning treatment for softer, easier-to-comb lengths.'],
 ['Davines','OI Hair Butter','Treatments','€37','https://www.rinascente.it/it/list/cosmetica/capelli','Richer mask for nourishing lengths.'],
 ['Davines','OI All In One Milk','Styling','€33.10','https://www.rinascente.it/it/list/cosmetica/capelli','Leave-in spray for conditioning and detangling.'],
 ['K18','Damage Shield pH Shampoo','Shampoo','€42.50','https://www.rinascente.it/it/list/cosmetica/capelli','Shampoo for routine cleansing and protection against styling stress.'],
 ['K18','Peptide Detox Shampoo','Shampoo','€42.50','https://www.rinascente.it/it/list/cosmetica/capelli','Deep-cleanse option for product buildup.'],
 ['ghd','Bodyguard Heat Protect Spray','Styling','€29.90','https://www.ghdhair.com/it/prodotti-capelli-c','Pre-styling thermal protectant; use before heated tools.'],
 ['ghd','Straight On Spray','Styling','€29.90','https://www.ghdhair.com/it/prodotti-capelli-c','Smoothing spray to prepare for straight styling.'],
 ['ghd','Sleek Talker Argan Oil','Styling','€39.90','https://www.ghdhair.com/it/prodotti-capelli-c','Thermal styling oil for shine and softness.'],
 ['ghd','Chronos Max Styler','Hot tools','€399','https://www.rinascente.it/it/list/cosmetica/capelli','Wide-plate professional straightener for longer, thicker hair.'],
 ['ghd','Rise Hot Brush','Hot tools','€249','https://www.rinascente.it/it/list/cosmetica/capelli','Heated brush for lifting roots and adding volume.'],
 ['Dyson','Supersonic Nural Hair Dryer','Hair dryers','€399','https://www.dyson.it/','Premium hair dryer with attachments; compare finish and hair type.'],
 ['Denman','D3 Original Styler','Brushes','€10.90','https://denmanbrush.com/','Seven-row styling brush widely used for curl definition and tension.'],
 ['Tangle Teezer','Ultimate Detangler','Brushes','€12.89','https://tangleteezer.com/','Flexible-tooth detangling brush used gently on damp hair.'],
 ['Kérastase','Genesis Bain Hydra-Fortifiant 250ml','Shampoo','€23.99','https://prd-it-epp-p2.dglecom.net/it/c/capelli/14','Shampoo for hair prone to breakage during brushing.'],
 ['Kérastase','Spécifique Bain Divalent 250ml','Shampoo','€28.99','https://prd-it-epp-p2.dglecom.net/it/c/capelli/14','Scalp-focused cleanser for oily roots and sensitised lengths.'],
 ['Mulac','STYL heat Spray 150ml','Styling','€17.99','https://prd-it-epp-p2.dglecom.net/it/c/capelli/14','Heat-protective spray for a blow-dry or heat styling routine.']
];
const group=(title,tag='')=>{
 const t=(title+' '+tag).toLowerCase();
 if(/dryer|phon|asciugacapelli|diffuser|blowdry|blow dry/.test(t))return 'Hair dryers';
 if(/styler|straightener|curling iron|flat iron|hot brush|airwrap|wand|curling tong/.test(t))return 'Hot tools';
 if(/brush|comb|detangler/.test(t))return 'Brushes';
 if(/clip|pin|scrunchie|silk bonnet|headband|hair tie|towel|pillowcase/.test(t))return 'Accessories';
 if(/conditioner/.test(t))return 'Conditioner';
 if(/shampoo|cleanser/.test(t))return 'Shampoo';
 if(/mask|treatment|repair|oil|scalp serum|elixir/.test(t))return 'Treatments';
 if(/spray|mousse|cream|gel|serum|primer|styling|leave-in/.test(t))return 'Styling';
 return null;
};
const description=(group,name)=>{
 const explanations={
  'Shampoo':'Designed to cleanse hair and scalp. Choose frequency based on scalp oil and buildup.',
  'Conditioner':'Helps soften lengths and ease detangling after cleansing.',
  'Treatments':'A targeted care step. Use following the product instructions and hair needs.',
  'Styling':'Helps prepare, shape or finish your hairstyle. Check heat or hold claims on the product page.',
  'Hair dryers':'A drying or blowout tool. Compare temperature, airflow, weight and attachments.',
  'Hot tools':'Heated styling device. Use appropriate temperature and protective preparation.',
  'Brushes':'For detangling, shaping or curl definition with gentle tension.',
  'Accessories':'An everyday styling or hair-care accessory. Avoid excessive tension.'
 };
 return explanations[group]||'Hair care and styling product.';
};
async function get(url,ms=8000){
 const ac=new AbortController(),t=setTimeout(()=>ac.abort(),ms);
 try{const r=await fetch(url,{signal:ac.signal,headers:{'User-Agent':'MariaSM-Editorial/1.0 (product image verification)','Accept':'application/json,text/html,image/*,*/*'}});return r.ok?r:null}catch{return null}finally{clearTimeout(t)}
}
let counter=0;
async function archive(url){
 if(!url)return null;
 let u=String(url).replaceAll('&amp;','&');if(u.startsWith('//'))u='https:'+u;
 if(!/^https:\/\//i.test(u))return null;
 const r=await get(u,7000);if(!r)return null;
 const mime=(r.headers.get('content-type')||'').toLowerCase();
 const ext=mime.includes('jpeg')?'jpg':mime.includes('png')?'png':mime.includes('webp')?'webp':null;
 if(!ext)return null;
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<5000||bytes.length>6_000_000)return null;
 const name='hair-product-'+String(++counter).padStart(3,'0')+'.'+ext;
 fs.writeFileSync(path.join(photos,name),bytes);
 return 'assets/shop/'+name;
}
async function fromShopify(brand,url){
 const r=await get(url,8500);if(!r)return [];
 let data;try{data=await r.json()}catch{return []}
 const host=new URL(url),currency=/\.co\.uk$/.test(host.hostname)?'GBP':/it\.olaplex\.com$/.test(host.hostname)?'EUR':'USD';
 const results=[];
 for(const p of (data.products||[]).slice(0,130)){
  const title=String(p.title||'').trim();const kind=group(title,p.product_type);
  if(!kind||!p.handle)continue;
  const variant=(p.variants||[]).find(x=>x.available)||(p.variants||[])[0];
  const amount=Number(variant?.price);if(!Number.isFinite(amount)||amount<=0)continue;
  const itemImage=p.images?.[0]?.src||p.image?.src;
  if(!itemImage)continue;
  results.push({brand,title,kind,amount,currency,description:description(kind,title),link:host.origin+'/products/'+encodeURIComponent(p.handle),image:itemImage});
  if(results.length>=25)break;
 }
 return results;
}
const collected=(await Promise.all(feeds.map(([brand,url])=>fromShopify(brand,url)))).flat();
console.log('Hair Shop feeds: '+collected.length+' photographed product candidates from official brand catalogues.');
// Additional carefully named product offers are checked against exact product-page
// structured data; generic category photo and logos are NEVER used.
async function fromCurated(item){
 const [brand,title,kind,price,link,desc]=item;
 // Category pages do not represent a particular item; skip rather than invent photography.
 const single=/\/products\/|\/product\/|\/p\//.test(link);
 if(!single)return null;
 const r=await get(link,7000);if(!r)return null;
 const source=(await r.text()).slice(0,400000);
 const meta=(source.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]*>/i)||[])[0]||'';
 const candidate=(meta.match(/content=["']([^"']+)["']/i)||[])[1];
 if(!candidate||/logo|placeholder|default/i.test(candidate))return null;
 const img=new URL(candidate.replaceAll('&amp;','&'),link).href;
 return {brand,title,kind,price,description:desc,link,image:img};
}
const extra=(await Promise.all(curated.map(fromCurated))).filter(Boolean);
const combined=[...collected,...extra].filter(x=>!(/gift card|bundle subscription|refill empty/i.test(x.title)));
const seen=new Set(),items=[];
for(const x of combined){let key=(x.brand+'|'+x.title).toLowerCase();if(seen.has(key))continue;seen.add(key);items.push(x);}
const max=72,selected=items.slice(0,max);
let results=await Promise.all(selected.map(async x=>({...x,local:await archive(x.image)})));
results=results.filter(x=>x.local);
if(results.length<12)console.warn('Only '+results.length+' verifiable product photos available: no unverified shopping images will be displayed.');
const fmt=(amount,currency)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:currency||'EUR'}).format(amount);
const cards=results.map(x=>{
 const price=x.price||fmt(x.amount,x.currency);
 return '<article class="hair-shop-card" data-kind="'+esc(x.kind)+'"><a class="hair-shop-image" href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(x.local)+'" alt="Real original product photograph: '+esc(x.brand+' '+x.title)+'" loading="lazy" decoding="async"></a><div class="hair-shop-text"><small>'+esc(x.kind)+' · '+esc(x.brand)+'</small><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p><strong>'+esc(price)+'</strong><a class="hair-shop-buy" href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer">View product & current price ↗</a></div></article>';
}).join('');
const bins=['All','Shampoo','Conditioner','Treatments','Styling','Hair dryers','Hot tools','Brushes','Accessories'];
const intro='<section class="hair-section" id="products"><header><small>10 · THE HAIR SHOP</small><h2>Hair care & styling essentials</h2><p>Discover authentic photographed products from brand catalogues: shampoos, conditioning rituals, styling formulas, brushes and electrical tools. Compare the products carefully before purchasing. Prices are indicative snapshots in their original catalogue currency and may change.</p></header><div class="hair-shop-filter" role="group" aria-label="Filter hair products">'+bins.map((b,i)=>'<button type="button" class="'+(i===0?'chosen':'')+'" data-hair-group="'+esc(b)+'">'+esc(b)+'</button>').join('')+'</div><p class="hair-shop-status">'+results.length+' products with verified original photographs, saved into the website. Only categories with available products are displayed.</p><div class="hair-shop-grid">'+cards+'</div><p class="hair-shop-note">The listed prices come from the public catalogues at the last build, and are not guaranteed real-time offers. Products from non-EU shops may require shipping and import charges. Merchant listings are not an endorsement or an affiliate offer.</p></section>';
const css='<style id="hair-shop-style">.hair-shop-filter{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 16px}.hair-shop-filter button{border:1px solid #e0c5d2;border-radius:30px;background:#fff;padding:9px 13px;color:#74435e;cursor:pointer;font:700 12px system-ui}.hair-shop-filter button.chosen{background:#7d435e;color:white}.hair-shop-status,.hair-shop-note{font:12px/1.7 system-ui;color:#7b5c70}.hair-shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.hair-shop-card{background:#fff;border:1px solid #e7d4dc;border-radius:17px;overflow:hidden;min-width:0;display:flex;flex-direction:column}.hair-shop-card[hidden]{display:none!important}.hair-shop-image{height:230px;background:#fff;display:flex;align-items:center;justify-content:center;padding:14px}.hair-shop-image img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}.hair-shop-text{padding:18px;display:flex;flex-direction:column;gap:11px;flex:1}.hair-shop-text small{font:700 10px/1.4 system-ui;letter-spacing:.09em;color:#a66782}.hair-shop-text h3{font:normal 21px/1.23 Georgia,serif;margin:0}.hair-shop-text p{font:12px/1.6 system-ui;color:#745365;margin:0}.hair-shop-text strong{font:750 18px system-ui;margin-top:auto;color:#603952}.hair-shop-buy{display:block;text-align:center;border-radius:30px;background:#7d435e;color:white!important;padding:11px 9px;text-decoration:none;font:700 12px system-ui}@media(max-width:1100px){.hair-shop-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.hair-shop-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:490px){.hair-shop-grid{grid-template-columns:1fr}}</style>';
const js='<script id="hair-shop-script">(()=>{const buttons=[...document.querySelectorAll("[data-hair-group]")],cards=[...document.querySelectorAll(".hair-shop-card")];buttons.forEach(b=>b.addEventListener("click",()=>{buttons.forEach(x=>x.classList.toggle("chosen",x===b));const tag=b.dataset.hairGroup;cards.forEach(c=>c.hidden=tag!=="All"&&c.dataset.kind!==tag)}))})();</script>';
if(!html.includes('id="shop"'))throw Error('Hair resources section missing');
html=html.replace('</head>',css+'</head>').replace('<section class="hair-section" id="shop">',intro+'<section class="hair-section" id="shop">');
html=html.replace('<a href="#shop">Resources</a>','<a href="#products">Products</a><a href="#shop">Resources</a>').replace('</body>',js+'</body>');
for(const x of results)if(!fs.existsSync(path.join(dir,x.local)))throw Error('Missing local product photo '+x.local);
fs.writeFileSync(page,html);
console.log('Hair Shop: '+results.length+' genuine product photos archived; all image paths verified; groups: '+[...new Set(results.map(x=>x.kind))].join(', '));
