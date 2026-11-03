import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/jewellery/index.html');
const photoDir=path.join(root,'docs/jewellery/assets/verified-products');
fs.mkdirSync(photoDir,{recursive:true});
const catalog=JSON.parse(fs.readFileSync(path.join(root,'content/verified-accessories.json'),'utf8')).jewellery;
let html=fs.readFileSync(page,'utf8');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeout=9000;
async function get(url){
 if(typeof url!=='string'||!/^https:\/\//i.test(url))return null;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{return await fetch(url,{signal:controller.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; MariaSM-ProductPhotoAudit/1.0)','Accept':'text/html,application/json,image/avif,image/webp,image/png,image/jpeg,*/*'}})}
 catch(e){console.warn('Jewellery photo request failed '+url.slice(0,105)+' '+String(e).slice(0,70));return null}
 finally{clearTimeout(timer)}
}
const decode=s=>String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function normalize(s,base){let v=decode(s).trim();if(v.startsWith('//'))v='https:'+v;try{return new URL(v,base).href}catch{return ''}}
function ogPhoto(source,base){
 const tags=source.match(/<meta\b[^>]*>/gi)||[];
 for(const tag of tags){
  const attrs={};
  for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))attrs[m[1].toLowerCase()]=m[2]??m[3];
  if(/^(og:image|og:image:secure_url|twitter:image)$/i.test(attrs.property||attrs.name||'')){
   const url=normalize(attrs.content,base);if(url.startsWith('https://'))return url;
  }
 }
 for(const match of source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const parsed=JSON.parse(match[1]);const nodes=(Array.isArray(parsed)?parsed:[parsed]).flatMap(x=>x?.['@graph']||[x]);
   for(const node of nodes){if(!String(node?.['@type']||'').toLowerCase().includes('product'))continue;
    const i=node.image;let url=typeof i==='string'?i:Array.isArray(i)?(typeof i[0]==='string'?i[0]:i[0]?.url||i[0]?.contentUrl):i?.url;
    if(url)return normalize(url,base);
   }
  }catch{}
 }
 return null;
}
function exactReferenceInUrl(url,p){
 const token=p.sku.toLowerCase().replace(/[^a-z0-9]/g,'');
 const normalized=String(url||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 return normalized.includes(token);
}
async function getExactImage(p){
 // Never replace a missing necklace or bracelet with an unrelated item or AI art.
 const landing=await get(p.url);const htmlText=landing?.ok?await landing.text():'';
 const official=ogPhoto(htmlText,p.url);
 const candidates=[official,p.img].filter(Boolean);
 for(const url of [...new Set(candidates)]){
  // The retailer's own page is the source of truth. If metadata are blocked,
  // a direct image path must carry the *exact* catalogue SKU to qualify.
  if(url!==official&&!exactReferenceInUrl(url,p))continue;
  const res=await get(url);if(!res?.ok)continue;
  const mime=(res.headers.get('content-type')||'').toLowerCase();
  const ext=/image\/jpe?g/.test(mime)?'jpg':/image\/png/.test(mime)?'png':/image\/webp/.test(mime)?'webp':null;
  if(!ext)continue;
  const bytes=Buffer.from(await res.arrayBuffer());
  if(bytes.length<3500||bytes.length>7000000)continue;
  const basename=p.sku.replace(/[^a-z0-9_-]/gi,'-').toLowerCase();
  const filename=basename+'.'+ext;
  fs.writeFileSync(path.join(photoDir,filename),bytes);
  return 'assets/verified-products/'+filename;
 }
 return null;
}
const photoResults=await Promise.all(catalog.map(getExactImage));
const verified=catalog.map((p,i)=>({p,img:photoResults[i]})).filter(x=>x.img);
const targets=['CO02-512','BHKB261'];
for(const code of targets){const value=verified.find(x=>x.p.sku===code);console.log('Jewellery exact photograph '+code+': '+(value?'verified and archived':'not available; listing excluded'))}
const cards=verified.map(({p,img})=>
 '<article class="ac-product" data-group="'+esc(p.group)+'" data-search="'+esc((p.brand+' '+p.title+' '+p.sku+' '+p.group).toLowerCase())+'">'+
 '<figure class="ac-exact-photo" data-ref="'+esc(p.sku)+'"><a class="jewellery-original-photo" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">'+
 '<img loading="lazy" decoding="async" src="'+esc(img)+'" alt="Original retailer product photograph: '+esc(p.brand+' '+p.title)+' — '+esc(p.sku)+'"></a>'+
 '<figcaption>ORIGINAL RETAILER PHOTO · '+esc(p.sku)+'</figcaption></figure>'+
 '<div class="ac-product-body"><p class="ac-brand">'+esc(p.brand)+' · '+esc(p.group)+'</p><h3>'+esc(p.title)+'</h3><p class="ac-ref">Reference: '+esc(p.sku)+'</p>'+
 '<strong class="ac-price">'+esc(p.price)+'</strong><small>Confirm current price and availability with the retailer.</small>'+
 '<p>Photograph archived from this exact reference or its official retailer listing.</p><a class="ac-shoplink" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">View exact product &amp; price ↗</a></div></article>').join('');
const gridStart=html.indexOf('<div id="ac-product-grid" class="ac-product-grid">');
const end=html.indexOf('<p class="ac-footnote">',gridStart);
if(gridStart<0||end<0)throw Error('Jewellery shopping HTML anchors unavailable');
html=html.slice(0,gridStart)+'<div id="ac-product-grid" class="ac-product-grid">'+cards+'</div>'+html.slice(end);
html=html.replace(/<h2>\d+ genuine photographed products, not generic style suggestions\.<\/h2>/,'<h2>'+verified.length+' verified products with original retailer photographs.</h2>');
html=html.replace(/<span id="ac-count" role="status" aria-live="polite">\d+ exact product listings<\/span>/,'<span id="ac-count" role="status" aria-live="polite">'+verified.length+' verified product listings</span>');
const photoCSS='<style id="jewellery-verified-product-photos">#shopping .ac-exact-photo{overflow:hidden;display:flex;flex-direction:column;background:#fff;min-height:0}#shopping .jewellery-original-photo{display:flex;align-items:center;justify-content:center;height:195px;width:100%;padding:12px;background:#fff}#shopping .jewellery-original-photo img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;max-height:185px}#shopping .ac-exact-photo figcaption{background:#faf0f4;padding:8px 10px;font-size:10px;letter-spacing:.035em;text-align:center}#shopping .ac-product{min-width:0;overflow:hidden}#shopping .ac-product-body{display:flex;flex-direction:column;min-height:270px}#shopping .ac-product-body .ac-shoplink{margin-top:auto}</style>';
html=html.replace('</head>',photoCSS+'</head>');
for(const x of verified)if(!fs.existsSync(path.join(photoDir,path.basename(x.img))))throw Error('Missing archived jewellery photograph '+x.p.sku);
if(!verified.length)throw Error('No jewellery product photographs could be verified; abort publication rather than show AI art');
fs.writeFileSync(page,html);
console.log('Jewellery: '+verified.length+'/'+catalog.length+' verified real product photographs; '+(catalog.length-verified.length)+' unverified listings removed; no AI shopping photos.');
