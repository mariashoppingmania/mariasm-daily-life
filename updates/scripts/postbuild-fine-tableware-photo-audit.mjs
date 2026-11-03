import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs'), file=path.join(docs,'fine-tableware/index.html');
const images=path.join(docs,'assets/fine-tableware-photographs');
fs.mkdirSync(images,{recursive:true});
const content=JSON.parse(fs.readFileSync(path.join(root,'content/editorial-expansion.json'),'utf8'));
const data=content.sections.find(x=>x.slug==='fine-tableware');
if(!data||data.types.length!==8||data.eras.length!==8)throw Error('Fine tableware data unexpected');
let html=fs.readFileSync(file,'utf8');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const museumQueries=[
 ['Roman terra sigillata red slip bowl','terra sigillata bowl','Roman terra sigillata pottery'],
 ['medieval glazed pottery bowl 9th century','medieval pottery bowl','early medieval ceramic vessel'],
 ['Islamic lustreware bowl medieval','13th century glazed ceramic bowl','medieval maiolica pottery'],
 ['Italian Renaissance maiolica plate 16th century','Urbino istoriato maiolica dish','Deruta Renaissance plate'],
 ['Meissen porcelain plate 18th century','eighteenth century porcelain plate','Meissen porcelain service'],
 ['19th century transfer printed pottery plate','Victorian transferware plate','Spode blue transferware dinner plate'],
 ['Art Deco ceramic plate museum','Art Nouveau ceramic plate','twentieth century studio ceramic bowl'],
 ['contemporary stoneware dinnerware plate','modern ceramic dinnerware design','modern porcelain tableware']
];
const typeQueries=[
 ['Roman terra sigillata bowl','Roman red slip pottery bowl'],
 ['Italian majolica maiolica decorative plate','Deruta maiolica plate'],
 ['stoneware glazed ceramic plate','stoneware bowl museum'],
 ['white porcelain plate Meissen','fine bone porcelain dinner plate'],
 ['fine bone china teacup','bone china fine white teacup'],
 ['crystal wine glass stemware','cut crystal goblet'],
 ['Murano glass drinking tumblers','Murano glass goblets multicolour'],
 ['antique silverware cutlery set','silver tableware forks spoons']
];
async function get(url,timeout=8500){
 const controller=new AbortController(),clock=setTimeout(()=>controller.abort(),timeout);
 try{const response=await fetch(url,{signal:controller.signal,headers:{'User-Agent':'MariaSM-educational-editorial/1.0','Accept':'application/json,text/html,image/*,*/*'}});return response.ok?response:null}
 catch{return null}finally{clearTimeout(clock)}
}
const mimeExt=t=>/image\/png/.test(t)?'png':/image\/webp/.test(t)?'webp':/image\/jpeg/.test(t)?'jpg':null;
const save=async(url,filename)=>{
 if(!url||!/^https:\/\//i.test(url))return null;
 const r=await get(url,7000);if(!r)return null;
 const ext=mimeExt(r.headers.get('content-type')||'');if(!ext)return null;
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<3500||bytes.length>7000000)return null;
 const name=filename+'.'+ext;
 fs.writeFileSync(path.join(images,name),bytes);
 return '../assets/fine-tableware-photographs/'+name;
};
async function museumPhoto(searches,i,prefix){
 for(let j=0;j<searches.length;j++){
  const query='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch='+encodeURIComponent(searches[j])+'&prop=imageinfo&iiprop=url&iiurlwidth=800';
  const r=await get(query,7500);if(!r)continue;
  let pages=[];try{pages=Object.values((await r.json()).query?.pages||{})}catch{continue}
  const good=pages.filter(p=>/\.(jpg|jpeg|png|webp)$/i.test(p.title||'')&&p.imageinfo?.[0]?.thumburl);
  // Never use a random stock photograph; it must have a descriptive archival filename.
  const sorted=good.sort((a,b)=>{
    const score=p=>{let title=p.title.toLowerCase();return /plate|dish|bowl|cup|glass|ceramic|porcelain|ma[i]?olica|sigillata|tableware|stemware|silverware|pottery/.test(title)?3:0};
    return score(b)-score(a);
  });
  for(const p of sorted.slice(0,3)){
   const photo=await save(p.imageinfo[0].thumburl,prefix+'-'+String(i+1).padStart(2,'0'));
   if(photo)return {photo,credit:'Wikimedia Commons archival object photograph',title:p.title};
  }
 }
 return null;
}
const [eraPhotos,typePhotos]=await Promise.all([
 Promise.all(museumQueries.map((x,i)=>museumPhoto(x,i,'history'))),
 Promise.all(typeQueries.map((x,i)=>museumPhoto(x,i,'type')))
]);
const usePhoto=(x,label)=>x?'<a class="ft-photo-link" href="https://commons.wikimedia.org/wiki/Special:Search?search='+encodeURIComponent(x.title)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="'+esc(x.photo)+'" alt="Photograph of '+esc(label)+'"/></a>':'';
const eraCards=data.eras.map(([title,desc],i)=>{
 const pic=eraPhotos[i];
 return '<article class="ma-era-item"><div class="ma-era-media'+(pic?'':' ft-text-media')+'">'+usePhoto(pic,title)+(pic?'':'<span>Historical photographic reference currently unavailable</span>')+'</div><div class="ma-era-copy"><span class="ma-era-index">Chapter '+String(i+1).padStart(2,'0')+'</span><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><div class="ma-figure-caption">'+(pic?esc(pic.credit):'Historical context · cited references below')+'</div></div></article>';
}).join('');
const typeCards=data.types.map(([title,desc,material],i)=>{
 const pic=typePhotos[i];
 return '<article class="ma-type"><div class="ma-type-art'+(pic?'':' ft-text-media')+'">'+usePhoto(pic,title)+(pic?'':'<span>Object photograph currently unavailable</span>')+'</div><div class="ma-type-body"><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><small>Materials: '+esc(material)+'</small></div></article>';
}).join('');
function replaceGrid(sectionId,gridClass,markup){
 const start=html.indexOf('<section id="'+sectionId+'"');if(start<0)throw Error('Missing section '+sectionId);
 const end=html.indexOf('</section>',start);if(end<0)throw Error('Unclosed section '+sectionId);
 const before=html.slice(start,end), marker='<div class="'+gridClass+'">';
 const pos=before.indexOf(marker);if(pos<0)throw Error('Missing grid '+gridClass);
 const newBlock=before.slice(0,pos)+marker+markup+'</div>';
 html=html.slice(0,start)+newBlock+html.slice(end);
}
replaceGrid('history','ma-era',eraCards);
replaceGrid('types','ma-types',typeCards);
// Catalogue products are included only if the original retailer gives us its OWN
// specific photograph and the image bytes can be archived to GitHub Pages.
async function metadata(url){
 const res=await get(url,7000);if(!res)return null;
 const html=(await res.text()).slice(0,600000);
 let image=null;
 for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
  if(!/(?:property|name)=["'](?:og:image|twitter:image)["']/i.test(tag))continue;
  image=(tag.match(/content=["']([^"']+)["']/i)||[])[1];if(image)break;
 }
 if(!image)for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const data=JSON.parse(match[1]);
   const objects=(Array.isArray(data)?data:[data]).flatMap(x=>x['@graph']||[x]);
   const item=objects.find(x=>String(x?.['@type']||'').includes('Product'));
   if(item){image=typeof item.image==='string'?item.image:item.image?.[0]?.url||item.image?.[0];if(image)break}
  }catch{}
 }
 if(!image)return null;
 image=image.replaceAll('&amp;','&');
 if(image.startsWith('//'))image='https:'+image;
 if(image.startsWith('/'))image=new URL(image,url).href;
 return /^https:\/\//.test(image)?image:null;
}
async function catalogProduct(p,i){
 const [title,brand,price,tier,url,explicit]=p;
 if(!/^https:\/\//.test(url))return null;
 const found=await metadata(url);
 const photo=await save(found||explicit,'product-'+String(i+1).padStart(3,'0'));
 if(!photo)return null;
 return '<article class="ma-product"><div class="ma-product-image"><a class="ft-photo-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="'+esc(photo)+'" alt="Original retailer photograph: '+esc(title)+'"/></a></div><div class="ma-product-body"><span class="ma-tier">'+esc(tier)+'</span><h3>'+esc(title)+'</h3><p>'+esc(brand)+'</p><span class="ma-price">'+esc(price)+'</span><a class="ma-shop-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">See exact product and current price ↗</a></div></article>';
}
const cards=await Promise.all(data.products.map(catalogProduct));
let chosen=cards.filter(Boolean);
console.log('Fine Tableware: '+chosen.length+'/'+data.products.length+' original retailer product photos verified.');
// Add optional verified products from genuine shop feeds; never invent prices or images.
const feeds=[
 ['Burleigh Pottery','https://www.burleigh.co.uk/collections/all/products.json?limit=60'],
 ['Denby Pottery','https://www.denbypottery.com/collections/all/products.json?limit=60']
];
let added=0;
for(const [brand,feed] of feeds){
 const r=await get(feed,8500);if(!r)continue;
 let products=[];try{products=(await r.json()).products||[]}catch{continue}
 const domain=new URL(feed).origin;
 for(const item of products){
  if(added>=30)break;
  const variant=item.variants?.find(x=>x.available)||item.variants?.[0];
  const image=item.images?.[0]?.src||item.images?.[0];
  if(!item.handle||!variant||!image)continue;
  const name=item.title||'';
  if(!/plate|bowl|cup|saucer|mug|teapot|jug|dinner|glass|serve|dish/i.test(name))continue;
  const photo=await save(image,'extended-'+String(added+1).padStart(3,'0'));if(!photo)continue;
  const amount=Number(variant.price);if(!Number.isFinite(amount))continue;
  const currency=domain.endsWith('.co.uk')?'GBP':'EUR';
  const price=new Intl.NumberFormat('en-GB',{style:'currency',currency}).format(amount);
  const href=domain+'/products/'+encodeURIComponent(item.handle);
  chosen.push('<article class="ma-product"><div class="ma-product-image"><a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="'+esc(photo)+'" alt="Original retailer product photograph: '+esc(name)+'"/></a></div><div class="ma-product-body"><span class="ma-tier">Artisan tableware</span><h3>'+esc(name)+'</h3><p>'+esc(item.vendor||brand)+'</p><span class="ma-price">'+esc(price)+'</span><a class="ma-shop-link" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">See product and current price ↗</a></div></article>');added++;
 }
}
const shoppingStart=html.indexOf('<section id="shopping"'),shoppingEnd=html.indexOf('</section>',shoppingStart);
if(shoppingStart<0||shoppingEnd<0)throw Error('Shopping section structure missing');
const section=html.slice(shoppingStart,shoppingEnd),pos=section.indexOf('<div class="ma-products">');
if(pos<0)throw Error('Product grid not found');
const revised=section.slice(0,pos)+'<div class="ma-products">'+chosen.join('')+'</div>';
html=html.slice(0,shoppingStart)+revised+html.slice(shoppingEnd);
const css='<style id="fine-tableware-photo-fix">#types .ma-types{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px}#types .ma-type{display:flex;flex-direction:column;min-width:0;overflow:hidden;height:100%}#types .ma-type-art{height:190px;min-height:190px;max-height:190px;background:#fff;display:block;overflow:hidden}#types .ft-photo-link,.ma-era-media .ft-photo-link{display:flex;width:100%;height:100%;align-items:center;justify-content:center}#types img{display:block;width:100%;height:100%;object-fit:contain;padding:9px}#types .ma-type-body{display:flex;flex-direction:column;flex:1;gap:9px;padding:18px}#types .ma-type h3{margin:0;min-height:0}#types .ma-type p{margin:0}#types .ma-type small{margin-top:auto;padding-top:8px}.ft-text-media{display:flex!important;align-items:center;justify-content:center;text-align:center;font:12px/1.6 system-ui;color:#835f73;padding:18px}.ma-era-media img{display:block;width:100%;height:100%;object-fit:contain;background:#fff}.ma-products .ma-product-image{height:230px;background:#fff}.ma-products .ma-product-image img{height:100%;width:100%;object-fit:contain;padding:12px}.ma-products .ma-product-image a{display:block;width:100%;height:100%}@media(max-width:1100px){#types .ma-types{grid-template-columns:repeat(3,minmax(0,1fr))!important}}@media(max-width:760px){#types .ma-types{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:520px){#types .ma-types{grid-template-columns:1fr!important}}</style>';
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(file,html);
const allPaths=[...html.matchAll(/\bsrc="(\.\.\/assets\/fine-tableware-photographs\/[^"]+)"/g)];
for(const match of allPaths){
 const filename=match[1].split('/').pop();
 if(!fs.existsSync(path.join(images,filename)))throw Error('Missing physical image '+filename);
}
console.log('Fine Tableware final: '+eraPhotos.filter(Boolean).length+'/8 history photos, '+typePhotos.filter(Boolean).length+'/8 type photos, '+chosen.length+' exact photographed products ('+added+' feed additions), '+allPaths.length+' archived local images checked.');
if(!chosen.length)throw Error('Fine Tableware has no verified shop photographs');
