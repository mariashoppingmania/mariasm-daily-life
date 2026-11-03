import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'docs/venetian-glass/index.html');
if(!fs.existsSync(file))throw Error('Murano page missing');
let html=fs.readFileSync(file,'utf8');
if(html.includes('id="murano-research-2026"'))process.exit(0);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dir=path.join(root,'docs/assets/murano-photographs');fs.mkdirSync(dir,{recursive:true});
const base='https://venetianmuranoglass.com';
const chapters=[
 ['01','Origins in the lagoon','Roman glassware circulated across the northern Adriatic long before the Republic of Venice. Byzantine and Islamic contact, particularly links with Syrian glassmakers, influenced Venetian materials, decoration and trade. Written evidence records a Venetian glassmaker named Domenico in 982.'],
 ['02','The furnaces of Murano · 1291','The Venetian government ordered glass furnaces away from the urban centre in 1291, chiefly to reduce fire risk in a city of timber structures. Murano became a concentrated centre of training, skilled labour, merchant networks and techniques guarded by guild rules.'],
 ['03','Renaissance transparency · 1400s','In the mid-fifteenth century the master Angelo Barovier became closely associated with the development of exceptionally clear cristallo. Venetian makers refined raw materials and decolourising chemistry while producing elegant, thin-walled vessels for European elites.'],
 ['04','The age of filigree · 1500s','Glassworkers embedded canes with fine white lattimo or coloured threads within clear glass. Filigrana, retortoli and reticello made finely spaced, spiral or criss-cross patterns; enamelled goblets, mirrors and sophisticated blown forms also flourished.'],
 ['05','Baroque splendour · 1600–1700s','Ornate chalices, intricate stems, decorative mirrors and spectacular lighting showed the skill of Murano workshops. Fashion changed with European competition, while craftspeople and Venetian glassmaking methods spread beyond the lagoon.'],
 ['06','Political upheaval and renewal · 1797–1895','After the Republic fell in 1797, changed markets and politics contributed to decline. Nineteenth-century workshops and collectors revived techniques, while Vincenzo Zanetti helped establish the Murano Glass Museum in 1861.'],
 ['07','Modern masters · 1900–1970','Artistic directors and furnace masters connected Murano glass with modern design. Venini, Barovier & Toso, Seguso and designers including Carlo Scarpa experimented with colour, optical depth, sculptural silhouettes and new exhibitions.'],
 ['08','Contemporary Murano · 1970–today','Today Murano glass includes studio art, lighting, tableware, jewellery and restoration. Furnace energy costs, imitation imports, conservation and long apprenticeships make provenance and the survival of specialist skills especially important.']
];
const steps=[
 ['1','Prepare the batch','Silica sand supplies the glass-forming network; soda-bearing fluxes lower its working temperature, while lime and other stabilisers improve durability. Colour and opacity depend on carefully controlled additives. Batch recipes vary by furnace and glass type.'],
 ['2','Melt and refine','Raw materials are heated in a furnace until molten. The glass is held and refined to remove many bubbles and unmelted particles; temperature and viscosity must suit the intended technique.'],
 ['3','Gather and turn','The maestro takes a measured gather of molten glass on an iron blowpipe or solid punty and continuously rotates it. A marver and repeated reheating help control symmetry and wall thickness.'],
 ['4','Blow and shape','Air inflates the glass on the blowpipe. Borselle (metal pincers), shears, wooden blocks, moulds and centrifugal movement help form vessels, stems and applied ornaments. Assistants often work closely with the maestro.'],
 ['5','Build decoration','Glass canes may be embedded for filigrana; sliced murrine assembled as coloured mosaics; multiple layers produce sommerso; and coloured or transparent blown sections can be hot-joined using incalmo. Gold leaf and other inclusions require careful heat control.'],
 ['6','Anneal slowly','A finished piece enters an annealing kiln (lehr) and cools under control to reduce thermal stresses. Skipping proper annealing risks cracks or delayed fracture, especially in thick sculpture.'],
 ['7','Cold finishing','Once cooled, the work may be cut, ground, engraved, polished or inspected. Authenticity is established through provenance, maker documentation and knowledgeable inspection, not bubbles alone.']
];
const techniques=[
 ['Cristallo','Clear, refined soda-lime glass made famous in Renaissance Venice; translucent crystal-like appearance does not mean modern lead crystal.'],
 ['Lattimo','Opaque white glass inspired by porcelain and milk; used as a material in its own right and as white threads in filigrana.'],
 ['Filigrana, retortoli & reticello','Fine glass canes are incorporated into the vessel. Twisted canes create retortoli; crossed cane systems can create the diamond mesh of reticello.'],
 ['Murrine & millefiori','Patterned fused canes are cut into small cross-sections and arranged, reheated and joined. Millefiori designs often resemble hundreds of miniature flowers.'],
 ['Sommerso','A coloured glass core is encased in one or more contrasting transparent layers, creating optical depth in substantial vessels and sculptures.'],
 ['Incalmo','Two separately formed hot glass sections, often with different colours, are joined precisely rim to rim while still workable.'],
 ['Avventurina','Copper-bearing glass can develop bright suspended metal crystals through controlled chemistry and cooling, giving a sparkling effect.'],
 ['Calcedonio','A complex coloured, marbled glass that resembles chalcedony or agate, historically prized for unpredictable veining.'],
 ['Vetro ghiaccio','A historically documented crackled surface effect produced using rapid cooling and reheating; decorative and technically demanding.'],
 ['Fazzoletto','A hand-worked, folded handkerchief-like silhouette celebrated in twentieth-century Venetian glass design.'],
 ['Gold leaf & enamel','Metal leaves can be encased within glass while enamel can be applied and fired as surface decoration; not every gilded object uses the same process.'],
 ['Engraving & battuto','Cold-working tools create incisions, facets or a hammered-looking texture; the surface can then be finished and polished.']
];
function cards(items,kind){return items.map(a=>'<article class="murano-study"><span>'+esc(a[0])+'</span><h3>'+esc(a[1])+'</h3><p>'+esc(a[2])+'</p></article>').join('')}
const research='<section class="ma-section" id="murano-research-2026"><div class="ma-section-head"><div><span class="ma-kicker">History · Materials · Craft</span><h2>Venetian glass: a complete workshop history</h2></div><p>From Roman techniques and medieval lagoon trade to the Murano furnaces, master glassmakers and contemporary design. Text checked against museum publications.</p></div><div class="murano-study-grid">'+cards(chapters,'history')+'</div><h2>How Murano glass is actually made</h2><p class="murano-lead">The exact sequence depends on the piece: a bead made at a lamp is not produced like a furnace-blown chandelier, and a heavy sommerso vase has different heating and annealing demands from a thin goblet.</p><div class="murano-study-grid">'+cards(steps,'process')+'</div><h2>Techniques explained</h2><div class="murano-study-grid">'+techniques.map((x,i)=>'<article class="murano-study"><span>Technique '+String(i+1).padStart(2,'0')+'</span><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></article>').join('')+'</div><div class="murano-source"><strong>Museum & technique references</strong><p><a href="https://museovetro.visitmuve.it/en/il-museo/layout-and-collections/sections/" target="_blank" rel="noopener">Murano Glass Museum collections</a> · <a href="https://museovetro.visitmuve.it/it/il-museo/percorsi-e-collezioni/vetro-xv-xvi-xvii-secolo/" target="_blank" rel="noopener">Renaissance and filigrana</a> · <a href="https://whatson.cmog.org/exhibitions-galleries/rise-venetian-glassmaking" target="_blank" rel="noopener">Corning Museum of Glass</a></p></div></section>';
const css='<style id="murano-2026-css">#murano-research-2026{scroll-margin-top:30px}.murano-study-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:16px;margin:20px 0 38px}.murano-study{padding:22px;border:1px solid #e7d3dc;border-radius:17px;background:linear-gradient(145deg,#fff,#fdf7f8);box-shadow:0 6px 22px #4522380a}.murano-study>span{font:700 11px system-ui;color:#a2647c;letter-spacing:.09em;text-transform:uppercase}.murano-study h3{margin:10px 0;color:#623f55;font:500 23px Georgia,serif}.murano-study p,.murano-lead{line-height:1.72}.murano-source{background:#f3e5ed;border-radius:16px;padding:20px;margin:28px 0 10px}.murano-extra-shop{margin-top:32px}.murano-extra-shop .ma-product-image{background:#fff;display:grid;place-items:center;height:235px;overflow:hidden}.murano-extra-shop img{width:100%;height:100%;object-fit:contain;padding:10px}.murano-extra-shop .ma-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:16px}.murano-extra-shop .ma-product{min-width:0}.murano-extra-shop .ma-product-body{padding:16px}.murano-extra-shop .ma-product-body h3{font-size:18px}.murano-image-caption{font:12px system-ui;color:#80576a;margin:8px 0}#murano-research-2026 h2{font:500 clamp(27px,3vw,39px) Georgia,serif;margin:35px 0 15px;color:#56344a}</style>';
const categories=['bowls','vases','sculptures','jewelry','goblets-glasses','lighting','tableware'];
async function fetchBound(url,timeout=11000){const a=new AbortController(),timer=setTimeout(()=>a.abort(),timeout);try{const r=await fetch(url,{signal:a.signal,headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json,image/*,*/*'}});return r.ok?r:null}catch{return null}finally{clearTimeout(timer)}}
function properImage(image){return typeof image==='string'?image:(image?.src||'')}
function safeUrl(s){if(typeof s!=='string')return null;let u=s.startsWith('//')?'https:'+s:s;try{const q=new URL(u);return q.protocol==='https:'?u:null}catch{return null}}
let productItems=[];
for(const category of categories){
 const u=base+'/collections/'+category+'/products.json?limit=35';
 const r=await fetchBound(u);
 if(!r){console.warn('Murano collection API unavailable: '+category);continue}
 try{const data=await r.json();for(const p of (data.products||[]).slice(0,20)){
  const variant=p.variants?.find(v=>v.available) || p.variants?.[0];
  const img=safeUrl(properImage(p.images?.[0]||p.image));
  const handle=p.handle;
  if(!handle||!variant||!img)continue;
  productItems.push({name:p.title,brand:p.vendor||'Murano artisan',price:variant.price,handle,url:base+'/products/'+encodeURIComponent(handle),img,category});
 }}catch(e){console.warn('Murano JSON parsing issue: '+category, String(e))}
}
productItems=[...new Map(productItems.map(p=>[p.handle,p])).values()].slice(0,36);
function priceLabel(s){const n=Number(s);return Number.isFinite(n)?new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n):'See retailer price'}
let shopCards=[];
for(let i=0;i<productItems.length;i++){
 const p=productItems[i],imageUrl=p.img;
 const r=await fetchBound(imageUrl,8500);
 if(!r)continue;
 const type=(r.headers.get('content-type')||'').toLowerCase();
 if(!type.startsWith('image/'))continue;
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<2500||bytes.length>6_500_000)continue;
 const extension=type.includes('png')?'png':type.includes('webp')?'webp':type.includes('avif')?'avif':'jpg';
 const fileName='murano-'+String(i+1).padStart(3,'0')+'.'+extension;
 fs.writeFileSync(path.join(dir,fileName),bytes);
 const title=esc(p.name),merchant=esc(p.brand),link=esc(p.url);
 const price=priceLabel(p.price);
 shopCards.push('<article class="ma-product"><div class="ma-product-image"><a target="_blank" rel="noopener noreferrer" href="'+link+'"><img loading="lazy" decoding="async" src="../assets/murano-photographs/'+fileName+'" alt="Actual retailer photograph: '+title+'" /></a></div><div class="ma-product-body"><span class="ma-tier">'+esc(p.category.replaceAll('-',' '))+'</span><h3>'+title+'</h3><p>'+merchant+'</p><strong class="ma-price">'+esc(price)+'</strong><a class="ma-shop-link" target="_blank" rel="noopener noreferrer" href="'+link+'">View the exact product ↗</a></div></article>');
}
console.log('Murano: '+productItems.length+' retailer products discovered, '+shopCards.length+' actual images downloaded and validated.');
// No falsified generic product photos. Hide original shop products whose hotlinks
// cannot be locally confirmed; use our validated original-retailer-photo collection.
if(shopCards.length){
 const extra='<section class="ma-section murano-extra-shop" id="murano-verified-shop"><div class="ma-section-head"><div><span class="ma-kicker">Original photography · Real retailer listings</span><h2>Murano glass: the extended shopping gallery</h2></div><p>'+shopCards.length+' verified individual product photographs, from artisan gifts to collectible vases, chandeliers and sculptures. Prices are a retailer snapshot and may change; confirm the final price at checkout.</p></div><div class="ma-products">'+shopCards.join('')+'</div></section>';
 html=html.replace('</main>',extra+'</main>');
}
// Never show a misleading blank rectangle. Only preserve editorial imagery that
// can actually be archived locally. A failed download yields a descriptive link.
const imgPattern=/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g;
const refs=[...new Set([...html.matchAll(imgPattern)].map(x=>x[1]).filter(x=>/^https?:\/\//.test(x)))];
const verified=new Map();let num=0;
for(const remote of refs.slice(0,40)){
 const r=await fetchBound(remote.replaceAll('&amp;','&'),6500);if(!r)continue;
 const type=(r.headers.get('content-type')||'').toLowerCase();if(!type.startsWith('image/'))continue;
 const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length<2500||bytes.length>6_500_000)continue;
 const ex=type.includes('png')?'png':type.includes('webp')?'webp':'jpg';
 const name='editorial-'+String(++num).padStart(3,'0')+'.'+ex;
 fs.writeFileSync(path.join(dir,name),bytes);verified.set(remote,'../assets/murano-photographs/'+name);
}
html=html.replace(imgPattern,(tag,src)=>{
 if(!/^https?:\/\//.test(src))return tag;
 if(verified.has(src))return tag.replace('src="'+src+'"','src="'+verified.get(src)+'"');
 return '<a class="ma-no-image" href="'+esc(src)+'" target="_blank" rel="noopener noreferrer">View the archival or retailer reference photograph</a>';
});
html=html.replace('</head>',css+'</head>');
html=html.replace('<section id="shopping"',research+'<section id="shopping"');
html=html.replace('href="#shopping">Shop</a>','href="#murano-research-2026">Glassmaking</a><a href="#murano-verified-shop">Extended shop</a><a href="#shopping">Shop</a>');
fs.writeFileSync(file,html);
if(!html.includes('id="murano-research-2026"'))throw Error('Murano editorial insert failed');
console.log('Murano history and technical guides published. Editorial remote images archived: '+verified.size);
