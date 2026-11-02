import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
const source=JSON.parse(fs.readFileSync(path.join(root,'content/editorial-expansion.json'),'utf8'));
const css=fs.readFileSync(path.join(root,'assets/editorial-expansion.css'),'utf8');
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'' :'&#39;'}[c]));
const link='target="_blank" rel="noopener noreferrer"';
const artColors=[['#ad6c78','#e4cad0','#634355'],['#628e9f','#d6e9e8','#2c5969'],['#b48b5f','#f3dfb8','#795030'],['#82769e','#e1d7ef','#47395f'],['#7a987d','#d3e0d0','#385740'],['#b77355','#f0c9b0','#814732'],['#c06c91','#f1d5de','#6c3254'],['#7599b4','#c8e2f2','#345e79'],['#8e7866','#e8d4ba','#503e34']];
let illustrationCount=0;
function illustration(slug,index,isHistory=false){
 const unique='ma-art-'+(++illustrationCount)+'-';
 const c=artColors[index%artColors.length],a=c[0],b=c[1],d=c[2],mode=index%4;
 const opening='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 330" role="img" aria-label="Original illustrated study of an accessory or decorative object"><defs><linearGradient id="shade" x1="0" y1="1" x2=".7" y2="0"><stop stop-color="'+d+'"/><stop offset=".4" stop-color="'+a+'"/><stop offset=".75" stop-color="'+b+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient><radialGradient id="bg"><stop stop-color="#fffaf9"/><stop offset="1" stop-color="'+b+'"/></radialGradient><filter id="shadow"><feGaussianBlur stdDeviation="11"/></filter></defs><rect width="600" height="330" fill="url(#bg)"/><ellipse cx="300" cy="282" rx="172" ry="22" fill="'+d+'" opacity=".2" filter="url(#shadow)"/><g transform="translate('+(index%3*12-10)+',0)">';
 let shape='';
 if(slug==='belts-suspenders'){
 shape=mode===2?'<path d="M190 65L250 263M407 65L350 263M190 65Q300 35 407 65" fill="none" stroke="url(#shade)" stroke-width="25" stroke-linecap="round"/><rect x="168" y="55" width="46" height="44" rx="6" fill="none" stroke="'+d+'" stroke-width="8"/><rect x="384" y="55" width="46" height="44" rx="6" fill="none" stroke="'+d+'" stroke-width="8"/>':'<path d="M95 172C156 89 328 83 490 160L480 212C330 159 183 155 95 225Z" fill="url(#shade)" stroke="'+d+'" stroke-width="7"/><rect x="414" y="137" width="93" height="94" rx="'+(mode*6+7)+'" fill="none" stroke="#dfb86d" stroke-width="17"/><path d="M463 184h-90" stroke="#eac478" stroke-width="9"/><circle cx="189" cy="158" r="6" fill="'+d+'"/><circle cx="215" cy="150" r="6" fill="'+d+'"/>';
 }else if(slug==='scarves'){
 shape='<path d="M218 62Q330 39 365 113L321 260Q249 279 215 226L269 123Q246 112 206 143Z" fill="url(#shade)" stroke="'+d+'" stroke-width="3"/><path d="M314 73Q390 91 395 147Q397 182 354 233L399 285L453 247L418 202Q485 115 399 71Q362 40 314 73" fill="'+b+'" stroke="'+a+'" stroke-width="7"/><path d="M249 122Q300 162 348 126M251 144Q296 182 345 147M235 173Q290 213 333 181" stroke="#ffffff88" stroke-width="8" fill="none"/>';
 for(let i=0;i<10;i++)shape+='<path d="M'+(323+i*5)+' 255l'+(i%2?5:-4)+' 24" stroke="'+d+'" stroke-width="3"/>';
 }else if(slug==='gloves'){
 const glove='<path d="M176 261L168 174Q158 157 140 181L117 199Q104 204 100 187Q96 177 109 162L164 109L164 48Q166 32 180 37Q194 42 194 60L198 116L206 34Q209 16 225 22Q239 25 237 45L234 113L247 41Q251 22 266 26Q281 34 275 53L266 126L287 74Q293 56 308 64Q320 73 313 89L276 209L268 261Z" fill="url(#shade)" stroke="'+d+'" stroke-width="5"/>';
 shape='<g transform="translate(-20,0)">'+glove+'</g><g transform="translate(620,0) scale(-1,1)">'+glove+'</g><path d="M145 256h103M370 256h103" stroke="'+b+'" stroke-width="12"/>';
 }else if(slug==='home-utensils'){
 shape=mode===1?'<path d="M224 58L240 142M210 53Q222 42 236 57" stroke="'+d+'" stroke-width="10" fill="none"/><path d="M240 140Q188 170 222 228Q258 268 298 227Q325 190 276 159Z" fill="url(#shade)" stroke="'+d+'" stroke-width="5"/><path d="M350 75L355 222" stroke="'+a+'" stroke-width="12"/><ellipse cx="355" cy="234" rx="45" ry="22" fill="'+b+'" stroke="'+d+'" stroke-width="6"/>':'<path d="M177 136L205 257H404L431 136Z" fill="url(#shade)" stroke="'+d+'" stroke-width="8"/><ellipse cx="305" cy="135" rx="130" ry="35" fill="'+a+'" stroke="'+d+'" stroke-width="8"/><path d="M175 150Q120 123 112 174Q119 211 168 194M432 151Q483 116 494 173Q495 217 432 198" stroke="'+d+'" stroke-width="14" fill="none"/><path d="M226 111Q237 68 270 88M316 89Q342 68 364 113" fill="none" stroke="#ffffffb0" stroke-width="7"/>';
 }else if(slug==='venetian-glass'){
 shape='<path d="M236 59Q211 104 228 129Q184 184 209 249Q245 293 354 284Q399 267 390 215Q385 163 352 125Q370 99 353 57Z" fill="url(#shade)" stroke="'+d+'" stroke-width="5"/><ellipse cx="294" cy="58" rx="58" ry="19" fill="'+b+'" stroke="'+d+'" stroke-width="7"/><path d="M222 171Q305 148 390 175M215 211Q312 179 389 216M229 248Q295 215 384 247" fill="none" stroke="#fff8e1b9" stroke-width="12"/>';
 for(let j=0;j<18;j++){let x=235+(j*27)%128,y=134+(j*41)%126;shape+='<circle cx="'+x+'" cy="'+y+'" r="'+(5+j%3*3)+'" fill="'+(j%2?'#fffbd8':'#a4d9e7')+'" opacity=".78"/>'}
 }else{
 shape='<ellipse cx="299" cy="182" rx="167" ry="116" fill="url(#shade)" stroke="'+d+'" stroke-width="7"/><ellipse cx="299" cy="180" rx="134" ry="87" fill="'+b+'" stroke="#ffffffa3" stroke-width="14"/><ellipse cx="299" cy="180" rx="96" ry="62" fill="none" stroke="'+a+'" stroke-width="7"/>';
 for(let j=0;j<12;j++){let theta=j*Math.PI/6;shape+='<circle cx="'+(299+119*Math.cos(theta)).toFixed(1)+'" cy="'+(180+79*Math.sin(theta)).toFixed(1)+'" r="7" fill="'+d+'" opacity=".78"/>'}
 }
 const texture='<g opacity=".24" stroke="#fff" stroke-width="2"><path d="M65 50l80 60M450 40l80 65M65 280l65-60M450 280l85-59"/></g>';
 return (opening+texture+shape+'</g></svg>').replaceAll('id="shade"','id="'+unique+'shade"').replaceAll('id="bg"','id="'+unique+'bg"').replaceAll('url(#shade)','url(#'+unique+'shade)').replaceAll('url(#bg)','url(#'+unique+'bg)');
}
function isRelevantHistoryPhoto(d,entry,idx,used){
 const img=entry[2];if(!img||used.has(img))return false;
 const allowed={
 'belts-suspenders':['alexandersapparel','media.gucci.com'],
 'scarves':['boutiquedellasciarpa'],
 'gloves':['metmuseum','corneliajames','mediadecathlon'],
 'home-utensils':['azscience','villarubini','salepepe','idealo'],
 'venetian-glass':['exibart','webmaster360','originalmuranoglass','shopify','1stdibs'],
 'fine-tableware':['wikimedia','meisterdrucke','thommel']};
 return (allowed[d.slug]||[]).some(k=>img.includes(k));
}
const ogCache=new Map();
async function tryProductImage(product){
 const [title,brand,price,tier,url]=product;
 if(!/^https:/.test(url) || !(/productpage\.|\/p\/|\/product\/|\/products\/|mytheresa\.com|\/piatto-|\/serpenti-viper-/.test(url)))return null;
 if(ogCache.has(url))return ogCache.get(url);
 let image=null;
 try{
  const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),4200);
  try{
   const response=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':'Mozilla/5.0 (compatible; MariaSMEditorial/1.0)'}});
   if(response.ok){
    const html=(await response.text()).slice(0,250000);
    const metas=html.match(/<meta\b[^>]*>/gi)||[];
    const candidate=metas.find(x=>/(?:og:image|twitter:image)/i.test(x));
    if(candidate){
     const m=candidate.match(/content\s*=\s*["']([^"']+)["']/i);
     if(m){image=m[1].replaceAll('&amp;','&');if(image.startsWith('//'))image='https:'+image;if(!/^https:\/\//.test(image))image=null;}
    }
   }
  }finally{clearTimeout(timeout)}
 }catch(e){}
 ogCache.set(url,image);
 return image;
}
function era(d,e,i,used){
 const useImage=isRelevantHistoryPhoto(d,e,i,used);
 if(useImage)used.add(e[2]);
 const historyFallback='data:image/svg+xml;base64,'+Buffer.from(illustration(d.slug,i,true),'utf8').toString('base64');
 const historyError=' onerror="this.onerror=null;this.src=&#39;'+historyFallback+'&#39;;this.closest(&#39;.ma-era-item&#39;).querySelector(&#39;.ma-figure-caption&#39;).textContent=&#39;Illustrated historical reconstruction — source image unavailable&#39;"';
 const media=useImage?'<img src="'+esc(e[2])+'"'+historyError+' loading="lazy" alt="Historically relevant museum or editorial photograph for '+esc(e[0])+'">':illustration(d.slug,i,true);
 const caption=useImage?'Documentary/editorial reference photograph':'Original reconstructed object illustration · not an archival photograph';
 return '<article class="ma-era-item"><div class="ma-era-media">'+media+'</div><div class="ma-era-copy"><span class="ma-era-index">Chapter '+String(i+1).padStart(2,'0')+'</span><h3>'+esc(e[0])+'</h3><p>'+esc(e[1])+'</p><div class="ma-figure-caption">'+caption+'</div></div></article>';
}
function typeCard(d,t,i){return '<article class="ma-type"><div class="ma-type-art">'+illustration(d.slug,i+3)+'</div><div class="ma-type-body"><h3>'+esc(t[0])+'</h3><p>'+esc(t[1])+'</p><small>Materials: '+esc(t[2])+'</small></div></article>'}
function materialCard(m){return '<article class="ma-material"><h3>'+esc(m[0])+'</h3><p>'+esc(m[1])+'</p></article>'}
async function productCard(d,p,i){
 let image=await tryProductImage(p);
 let proof=Boolean(image);
 const special={
 'Heat Keeper thermal women\'s gloves':source.images.thermalGloves,
 'Inès leather gloves / cashmere cuff':source.images.gloves,
 'Venini Fazzoletto vase':source.images.venini,
 'Gucci GG Marmont leather belt':source.images.gucciBelt};
 if(!image && special[p[0]])image=special[p[0]];
 const fallback='data:image/svg+xml;base64,'+Buffer.from(illustration(d.slug,i+7),'utf8').toString('base64');
 const errorHandler=' onerror="this.onerror=null;this.src=&#39;'+fallback+'&#39;;this.nextElementSibling.textContent=&#39;Illustrative drawing — see retailer&#39;"';
 const imageSlot=image?'<img loading="lazy" src="'+esc(image)+'"'+errorHandler+' alt="'+esc(p[0])+' — '+(proof?'retailer product photo':'brand or model reference photo')+'"><span class="ma-picture-label">'+(proof?'Retailer product image':'Model reference image — check seller variant')+'</span>':illustration(d.slug,i+7)+'<span class="ma-picture-label">Distinct illustrative drawing · product image at seller</span>';
 return '<article class="ma-product"><div class="ma-product-image">'+imageSlot+'</div><div class="ma-product-body"><span class="ma-tier">'+esc(p[3])+'</span><h3>'+esc(p[0])+'</h3><p>'+esc(p[1])+'</p><span class="ma-price">'+esc(p[2])+'</span><a class="ma-shop-link" href="'+esc(p[4])+'" '+link+'>View at retailer ↗</a></div></article>';
}
function sectionHead(k,title,description){return '<div class="ma-section-head"><div><span class="ma-kicker">'+esc(k)+'</span><h2>'+esc(title)+'</h2></div><p>'+esc(description)+'</p></div>'}
function extra(slug){
 if(slug==='venetian-glass')return '<div class="ma-extra"><h3>Inside a Murano workshop</h3><div class="ma-process"><div><strong>01 · The glass batch</strong><p>Silica, fluxes, stabilisers and selected colourants are melted into a workable mass; formulas and heat treatment determine behaviour.</p></div><div><strong>02 · The gathering</strong><p>The glassmaker collects molten glass on a blowpipe, rolling, reheating and adding layers or decorative glass canes.</p></div><div><strong>03 · Shaping</strong><p>Blowing, centrifugal movement, tools, hand finishing and cooperation with assistants shape the vessel while hot.</p></div><div><strong>04 · Decoration</strong><p>Murrine, filigrana, gold leaf, sommerso, engraving and colour layers each require different workshop skills.</p></div><div><strong>05 · Annealing</strong><p>Slow controlled cooling relieves internal stress. Skipping correct annealing risks cracks later on.</p></div><div><strong>06 · Authentication</strong><p>Ask about furnace or studio, maker, technique, signatures, seller provenance and documentation. Murano-style is not the same as made in Murano.</p></div></div></div>';
 if(slug==='home-utensils')return '<div class="ma-extra"><h3>From hearth to contemporary home</h3><p>A useful home tool should have a clear job, comfortable grip, durable components and care requirements that fit real daily life. For cookware compare heat responsiveness, weight, food contact surfaces and compatibility with induction or open flame. For appliances, repairability and energy consumption matter as much as the design.</p></div>';
 if(slug==='fine-tableware')return '<div class="ma-extra"><h3>A collector’s eye: from Rome to today</h3><p>Do not confuse earthenware, stoneware and porcelain: they differ in composition, firing, density and glaze. Check surface flaws, evidence of restoration, maker’s marks and whether gold trim is safe in the dishwasher. Historic and antique pieces may require specialist handling for food use.</p></div>';
 return '<div class="ma-extra"><h3>How to buy a piece that lasts</h3><p>Think about comfort, accurate sizing, fibre or material composition, practical fastening, construction quality and proper care. A high price does not guarantee suitability for wet weather, winter use or everyday wear.</p></div>';
}
async function buildOne(d){
 const dir=path.join(docs,d.slug);fs.mkdirSync(dir,{recursive:true});
 const used=new Set([d.hero]);const history=d.eras.map((x,i)=>era(d,x,i,used)).join('');
 const types=d.types.map((x,i)=>typeCard(d,x,i)).join('');
 const materials=d.materials.map(materialCard).join('');
 const prod=[];for(let i=0;i<d.products.length;i+=5){const batch=await Promise.all(d.products.slice(i,i+5).map((p,j)=>productCard(d,p,i+j)));prod.push(...batch);}
 const sources=d.sources.map(x=>'<a href="'+esc(x[1])+'" '+link+'>'+esc(x[0])+'</a>').join(' · ');
 const other=source.sections.filter(x=>x.slug!==d.slug).map(x=>'<a href="../'+x.slug+'/index.html">'+esc(x.name)+'</a>').join('');
 const body='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+esc(d.intro)+'"><title>'+esc(d.name)+' Atelier | MariaSM</title><link rel="canonical" href="https://mariashoppingmania.github.io/mariasm-daily-life/'+esc(d.slug)+'/"><style>'+css+'</style></head><body class="mariasm-editorial"><div class="ma-top"><a href="../index.html">MARIA<span style="color:#ae6481">SM</span> · HOME</a><nav class="ma-navigation"><a href="#history">History</a><a href="#types">Types</a><a href="#materials">Materials</a><a href="#shopping">Shop</a></nav></div><header class="ma-hero" style="background-image:url(&quot;'+esc(d.hero)+'&quot;)"><div class="ma-hero-copy"><p class="ma-kicker">'+esc(d.eyebrow)+'</p><h1>'+esc(d.name)+' Atelier</h1><p>'+esc(d.intro)+'</p><div class="ma-pills"><a href="#history">Explore the history</a><a href="#types">See styles</a><a href="#shopping">Discover shopping</a></div></div></header><main class="ma-container"><div class="ma-intro"><p class="ma-kicker">MariaSM · The illustrated encyclopaedia</p><h2>Beautiful things. Remarkable stories.</h2><p>Discover the evolution of design, the feel of materials and the difference between everyday essentials and exceptional objects.</p></div><section id="history" class="ma-section">'+sectionHead('A visual timeline','Through the centuries','A detailed illustrated journey from antiquity to contemporary design. Historical illustrations are clearly distinguished from documentary photographs.')+'<div class="ma-era">'+history+'</div></section><section id="types" class="ma-section">'+sectionHead('The catalogue of forms','Types & uses','Learn to recognise distinctive shapes and understand their purpose.')+'<div class="ma-types">'+types+'</div></section><section id="materials" class="ma-section">'+sectionHead('The makers’ materials','Material encyclopedia','Understand quality, craft and care before choosing your next object.')+'<div class="ma-materials">'+materials+'</div>'+extra(d.slug)+'</section><section id="shopping" class="ma-section">'+sectionHead('From affordable to extraordinary','The shopping collection','Real products or identifiable retailer collections, with verified price snapshots where available.')+'<div class="ma-products">'+prod.join('')+'</div><div class="ma-note"><strong>Important:</strong> Prices are editorial snapshots from 2 November 2026, not live offers. Availability, prices and variants may change. Images fetched from retailers when accessible; where a product image could not be verified, the card uses an original illustrative drawing and clearly says so. A category link may open a collection rather than a specific SKU. Always check the shop before purchase.</div></section><section class="ma-section">'+sectionHead('Keep exploring','More MariaSM Ateliers','Fashion, craft and everyday design are all connected.')+'<div class="ma-links">'+other+'<a href="../jewellery/index.html">Jewellery</a><a href="../bags/index.html">Bags</a><a href="../index.html">Return to MariaSM</a></div></section><div class="ma-note">Historical reading and image references: '+sources+'. Where images are documentary or retailer photographs, credit remains with their respective owners; original schematics are editorial illustrations.</div></main><footer class="ma-footer">MariaSM · A little beauty in the everyday · <a href="../index.html">Back to the journal</a></footer></body></html>';
 fs.writeFileSync(path.join(dir,'index.html'),body);
 console.log('Rendered '+d.slug+': '+d.eras.length+' historical chapters, '+d.products.length+' shopping picks');
}
for(const d of source.sections)await buildOne(d);
function addCatalogueHome(){
 const homePath=path.join(docs,'index.html');let home=fs.readFileSync(homePath,'utf8');
 const old=/<section class="wrap section" id="new-accessory-ateliers">[\s\S]*?<\/section>/;
 home=home.replace(old,'');
 if(!home.includes('id="mariasm-craft-ateliers"')){
 const cards=source.sections.map((d,i)=>'<a href="'+d.slug+'/index.html" style="display:block;flex:1 1 225px;background:#fff;border:1px solid #ead0dc;border-radius:20px;padding:12px 14px 18px;color:#683951;text-decoration:none;box-shadow:0 5px 18px #86536d16"><div style="height:116px;overflow:hidden;border-radius:13px;background:#f7ebf0">'+illustration(d.slug,i)+'</div><strong style="display:block;margin:12px 5px 5px;font-size:16px">'+esc(d.name)+'</strong><small style="margin:0 5px">History · Materials · Shopping ↗</small></a>').join('');
 const section='<section class="wrap section" id="mariasm-craft-ateliers"><div class="section-head"><div><p class="eyebrow">Beautiful things, remarkable history</p><h2>Fashion &amp; Home Ateliers</h2></div><p>Six in-depth illustrated guides from Roman craftsmanship to the luxury of today.</p></div><div style="display:flex;flex-wrap:wrap;gap:15px;align-items:stretch;margin:25px 0">'+cards+'</div></section>';
 home=home.replace('</main>',section+'</main>');}
 fs.writeFileSync(homePath,home);
}
addCatalogueHome();
function updateSiteNavigation(){
 const all=source.sections.map(d=>[d.slug,d.name]);
 function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
   const full=path.join(dir,ent.name);if(ent.isDirectory()){walk(full);continue;}
   if(!ent.name.endsWith('.html'))continue;
   const rel=path.relative(docs,full).replaceAll(path.sep,'/');
   if(source.sections.some(d=>rel===d.slug+'/index.html'))continue;
   let html=fs.readFileSync(full,'utf8');
   const depth=rel.split('/').length-1,prefix='../'.repeat(depth);
   if(!html.includes('data-mariasm-new-ateliers-menu')){
    const nav='<div data-mariasm-new-ateliers-menu style="display:flex;flex-wrap:wrap;gap:8px;padding:13px 18px;margin:12px auto;max-width:1200px;background:#f8ecf3;border:1px solid #ead2df;border-radius:14px"><span style="font-size:12px;font-weight:bold;margin-right:8px">Discover more Ateliers</span>'+all.map(([s,n])=>'<a href="'+prefix+s+'/index.html" style="font-size:12px;color:#76405c;text-decoration:none;padding:4px 7px">'+esc(n)+'</a>').join('')+'</div>';
    html=html.replace('</footer>',nav+'</footer>');
    if(!html.includes('data-mariasm-new-ateliers-menu'))html=html.replace('</body>',nav+'</body>');
   }
   fs.writeFileSync(full,html);
  }
 }
 walk(docs);
}
updateSiteNavigation();
async function jewelleryUpdate(){
 const file=path.join(docs,'jewellery/index.html');if(!fs.existsSync(file))return;
 let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<section id="mariasm-high-jewellery-edit"[\s\S]*?<\/section>/,'');
 const jew=[
 ['Bvlgari Serpenti Viper white-gold wedding ring','€1,770','https://www.bulgari.com/it-it/349680.html'],
 ['Bvlgari Serpenti Viper rose-gold ring','€2,460','https://www.bulgari.com/it-it/358771.html'],
 ['Bvlgari Serpenti Viper yellow-gold ring','€4,450','https://www.bulgari.com/it-it/product/362500'],
 ['Bvlgari Serpenti Viper diamond ring','€5,950','https://www.bulgari.com/it-it/product/AN858970'],
 ['Bvlgari Serpenti Viper bracelet','€7,900','https://www.bulgari.com/it-it/gioielli/serpenti'],
 ['Bvlgari Serpenti Viper white gold pavé ring','€12,400','https://www.bulgari.com/it-it/AN858111.html'],
 ['Cartier LOVE bracelets and rings','See official boutique','https://www.cartier.com/it-it/'],
 ['Cartier Juste un Clou creations','See official boutique','https://www.cartier.com/it-it/'],
 ['Cartier Trinity jewellery','See official boutique','https://www.cartier.com/it-it/']
 ];
 const cards=[];for(let i=0;i<jew.length;i++){const p=jew[i],im=await tryProductImage([p[0],'',p[1],'',p[2]]);const art=im?'<img loading="lazy" src="'+esc(im)+'" alt="'+esc(p[0])+'" style="width:100%;height:145px;object-fit:contain">':'<div style="height:145px;display:grid;place-items:center;background:linear-gradient(130deg,#f3e9e5,#d8bdad);font-size:47px" aria-label="Illustrative jewellery icon">💍</div>';cards.push('<article style="background:white;border:1px solid #e8d6d5;border-radius:17px;padding:12px;min-width:0">'+art+'<h3 style="font:normal 20px Georgia,serif">'+esc(p[0])+'</h3><strong>'+esc(p[1])+'</strong><p style="font-size:12px">Price snapshot or official store; confirm variant and current price.</p><a href="'+esc(p[2])+'" '+link+'>Shop on official site ↗</a></article>')}
 const section='<section id="mariasm-high-jewellery-edit" style="max-width:1200px;margin:30px auto;padding:30px;border-radius:24px;background:#f6e7ed"><p style="letter-spacing:.15em;font-size:11px">THE EXCEPTIONAL JEWELLERY EDIT</p><h2 style="font-family:Georgia,serif;color:#673b52">Cartier &amp; Bvlgari · High jewellery</h2><p>Selected Serpenti rings and bracelets with observed Italian prices, plus official Cartier LOVE, Juste un Clou and Trinity boutiques. The photographs shown when available originate from retailer product metadata.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px">'+cards.join('')+'</div></section>';
 if(html.includes('</main>'))html=html.replace('</main>',section+'</main>');else html=html.replace('</body>',section+'</body>');
 fs.writeFileSync(file,html);
 console.log('Expanded jewellery with '+jew.length+' Cartier/Bvlgari picks.');
}
await jewelleryUpdate();
console.log('MariaSM editorial expansion complete: '+source.sections.length+' full ateliers.');
