// Refine all MariaSM pages after building the editorial ateliers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),docs=path.join(root,'docs');
const data=JSON.parse(fs.readFileSync(path.join(root,'content/editorial-expansion.json'),'utf8'));
const im=data.images;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ateliers=[
['belts-suspenders','Belts & Suspenders','👗','https://ciceroni.in/cdn/shop/products/arious-waist-belteconockbagciceroni-225129.jpg?v=1754922126'],
['scarves','Scarves & Shawls','🧣','https://images.tanp.jp/gracia.tanp/product49152/202410014_tanp1120.jpg?w=954'],
['gloves','Gloves & Handwear','🧤','https://www.tr-handschuhe.at/cdn/shop/products/gentlemen-s-gloves-from-dark-brown-hair-sheep-nappa-lined-with-cashmere-tr-handschuhe-wien-thomas-riemer-handmade-gloves-1_2c30162c-d639-4198-a1ea-56a6f7fe5c63.jpg?v=1666601658&width=2000'],
['home-utensils','Home Utensils','🏡','https://www.fercasa.eu/cdn/shop/collections/pentole-bicchieri-posate-caffettiere-tazze.webp?v=1763067795'],
['venetian-glass','Venetian Glass & Murano','✨','https://es.originalmuranoglass.com/images/stories/virtuemart/product/vasetti_1.jpg'],
['fine-tableware','Fine Tableware','🍽️','https://www.vietri.com/cdn/shop/files/BRS-7800-2.jpg?v=1767939511&width=1000']];
const photos={
'belts-suspenders':[[im.belt,'Modern leather belt: construction and buckle reference'],[im.gucciBelt,'Contemporary luxury hardware and leather finishing']],
'scarves':[[im.scarfWool,'Cashmere fabric: modern fibre and drape reference']],
'gloves':[[im.historicalGloves,'Historical gloves in a museum collection'],[im.gloves,'Contemporary leather gloves with cashmere cuff'],[im.thermalGloves,'Modern insulated technical gloves']],
'home-utensils':[[im.romanKitchen,'Excavated Roman domestic utensils on display'],[im.renaissanceKitchen,'Kitchen and table culture: illustrative modern editorial photograph'],[im.pot,'Modern enamelled cast-iron cookware']],
'venetian-glass':[[im.romanGlass,'Roman-period glass from the Venetian lagoon'],[im.glassWorkshop,'Modern Murano workshop and glass production'],[im.glassMosaic,'Modern handmade murrine glass'],[im.venini,'Venini Fazzoletto design: modern glasswork']],
'fine-tableware':[[im.terraSigillata,'Roman terra sigillata red-slip pottery'],[im.maiolica,'Historical painted ceramics: maiolica reference'],[im.fineTable,'Contemporary fine porcelain service']]};
const lessons={
'belts-suspenders':[
['Ancient Rome: straps with a purpose','Roman military belts and baltei secured equipment and could display identity and rank. Decorative mounts, buckles and strap ends provide archaeological evidence. Modern belts shown elsewhere on this page are present-day design references, not reconstructions of ancient examples.'],
['From medieval girdles to tailored braces','Medieval belts carried purses, keys and implements, while luxury fittings demonstrated specialist metalwork. Later changes in trouser construction made braces a practical alternative to fastening a belt at the waist. Y-back and X-back styles use different attachment arrangements.'],
['Materials, craft and value','Check whether a product uses full-grain leather, suede, textile webbing or coated synthetics. Stitching, edges, fasteners and replaceable hardware help explain both price and longevity. Branding alone does not reveal durability.']],
'scarves':[
['Draped garments before the scarf','Roman cloaks, veils and the palla were outer wraps rather than modern narrow neck scarves. Later textiles developed differently across climates and cultures, shaped by the local availability of linen, wool, silk and dyes.'],
['Shawls, silk routes and industrial weaving','Silk trade networks linked Asian weaving traditions with Middle Eastern and European markets. Kashmiri shawls gained wide prestige, while nineteenth-century mechanical production expanded access to patterned cloth. Origin, fibres and workmanship remain essential distinctions.'],
['Care for beautiful fabrics','Luxury silk twill is valued for print registration, finish and drape; quality cashmere depends on fibre and yarn handling. Compare composition labels, edging, pilling resistance, cleaning instructions and weave before buying.']],
'gloves':[
['Protection and status','Gloves served hand protection, ceremonial office and sometimes social distinction. Fine surviving leather and textile gloves are precious museum evidence; their rarity should not be confused with the variety of everyday gloves that once existed.'],
['Court fashions and industrial production','Renaissance and early-modern gloves could be perfumed and embroidered. Nineteenth-century manufacture made dress gloves more widely available while opera, riding and work gloves retained different silhouettes.'],
['Technical versus dress handwear','Warmth depends on lining, insulation, fit and wind resistance. For leather gloves inspect seams and flexibility; for touchscreen and ski gloves compare grip, conductive panels, breathability and weatherproof construction.']],
'home-utensils':[
['Roman households and the medieval hearth','Archaeological finds reveal bronze ladles, strainers, ceramic storage vessels and cooking pots. Medieval households relied heavily on open-fire equipment, wooden spoons, iron hooks, cauldrons and grinding tools. Each item reflects energy, labour and available materials.'],
['Renaissance kitchen to the industrial home','Specialised cookware, copper and decorative serving implements grew alongside changing dining customs. Industrial production later made stamped metal, enamel and glass more affordable. Electricity transformed refrigeration, mixing and domestic coffee preparation during the twentieth century.'],
['Practical design today','Compare food-safe surfaces, weight, heat compatibility, repairability and energy use. A costly designer kettle or coffee maker should still be comfortable to use and easy to clean; aesthetics are only one part of its value.']],
'venetian-glass':[
['From Roman glass to the Murano furnaces','Roman glassmaking preceded Venice by centuries. As the lagoon city grew into a trading power, imported knowledge and skilled workshops shaped its distinctive industry. The 1291 order to move furnaces to Murano became a turning point for glass production.'],
['The great innovations','Murano cristallo prized clarity. Sixteenth-century filigrana embedded threads of coloured or white lattimo glass within transparent forms. Murrine uses sections of patterned glass canes, while aventurina achieves its sparkle through fine copper crystals inside the glass.'],
['Revival, design and authenticity','Venetian glass production suffered crises and enjoyed a significant nineteenth-century revival. Twentieth-century designers and factories expanded the language of sculptural colour and form. Ask about the actual maker, technique and provenance: Venetian-style is not necessarily made in Murano.']],
'fine-tableware':[
['Roman red-slip wares and medieval pottery','Terra sigillata circulated widely in the Roman world, alongside glass and metal drinking vessels. Medieval pottery traditions continued to diversify across regions, with glaze technologies and trade changing the appearance of everyday service.'],
['Renaissance maiolica and European porcelain','Italian centres developed painted tin-glazed maiolica with intricate designs. Eighteenth-century European porcelain manufacture grew in dialogue with established Asian production, while later industrialisation made matching services more accessible.'],
['How to recognise quality','Earthenware, stoneware, porcelain and bone china have different raw materials, density and firing characteristics. Check glazing, chip resistance, dishwasher instructions and the availability of replacement pieces. Antiques may not be food-safe.']]};
const css=`<style id="maria-curation-css">.maria-catalogue-nav{position:relative;z-index:6;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;padding:10px 14px;background:#f8edf1;border-bottom:1px solid #e8ceda;font-family:Arial,sans-serif}.maria-catalogue-nav b{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7b4963;margin-right:10px}.maria-catalogue-nav a{border:1px solid #ead5df;background:white;border-radius:30px;padding:7px 10px;color:#704154!important;text-decoration:none!important;font-size:12px}.maria-catalogue-nav a:hover{background:#7c4761;color:white!important}.ma-curation{margin:36px auto;max-width:1170px;padding:25px;background:#fff8f9;border:1px solid #e7d7dd;border-radius:18px;color:#543d48}.ma-curation h2{font:normal clamp(29px,3vw,40px) Georgia,serif;color:#743b55}.ma-curation .details{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:14px}.ma-curation article{border:1px solid #e8d6df;border-radius:14px;background:white;padding:17px}.ma-curation article h3{font:normal 22px Georgia,serif;color:#7e4662}.ma-curation article p,.ma-curation p{line-height:1.65}.ma-curation .photogrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.ma-curation figure{margin:0;border:1px solid #ead6df;background:white;border-radius:12px;overflow:hidden}.ma-curation figure img{width:100%;height:210px;object-fit:contain;background:#f4e9ee;display:block}.ma-curation figcaption{padding:11px;font-size:12px}.ma-cards-photo{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:15px;margin-top:18px}.ma-cards-photo a{border:1px solid #e8d3dc;border-radius:17px;overflow:hidden;background:white;color:#744157!important;text-decoration:none!important}.ma-cards-photo img{width:100%;height:154px;object-fit:cover;display:block}.ma-cards-photo strong,.ma-cards-photo small{display:block;padding:9px 12px}.ma-cards-photo strong{font:normal 21px Georgia,serif}.ma-cards-photo small{font-size:12px;padding-top:0;padding-bottom:13px}@media(max-width:600px){.ma-curation{padding:16px}.maria-catalogue-nav{justify-content:flex-start}.maria-catalogue-nav b{width:100%}}/* The extra menu belongs alongside Ateliers; there is no sitewide ribbon above the header. */
.ms-site-header .ms-nav-group[data-menu="accessories-home"] .ms-nav-panel{min-width:265px;left:0;right:auto;grid-template-columns:1fr}
.ma-top{position:relative;z-index:140}
.ma-top .ma-navigation{align-items:center}
.ma-top .ms-nav-group{position:relative;flex:0 0 auto}
.ma-top .ms-nav-group>summary{display:inline-flex;align-items:center;list-style:none;border:1px solid #e3cada;background:#fff8fa;border-radius:99px;padding:8px 12px;color:#744058;cursor:pointer;font:700 12px/1.2 system-ui,Arial,sans-serif}
.ma-top .ms-nav-group>summary::-webkit-details-marker{display:none}
.ma-top .ms-nav-group>summary::after{content:"";width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-2px);margin-left:9px}
.ma-top .ms-nav-group[open]>summary,.ma-top .ms-nav-group>summary:hover{background:#edd7e2}
.ma-top .ms-nav-group .ms-nav-panel{position:absolute;top:calc(100% + 8px);left:0;z-index:170;background:#fffaf8;border:1px solid #e7ccd5;border-radius:14px;box-shadow:0 14px 35px #542b4833;width:min(310px,calc(100vw - 32px));max-height:65vh;overflow:auto;display:grid;grid-template-columns:1fr;gap:3px;padding:9px}
.ma-top .ms-nav-group .ms-nav-panel a{font:600 12px/1.4 system-ui,Arial,sans-serif;padding:9px 11px;border-radius:8px;color:#684353;text-decoration:none}
.ma-top .ms-nav-group .ms-nav-panel a:hover,.ma-top .ms-nav-group .ms-nav-panel a:focus-visible{background:#f5e6ed}
@media(max-width:1220px){.ms-site-header .ms-nav-group[data-menu="accessories-home"] .ms-nav-panel{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%;min-width:0;max-width:100%;margin:0;padding:5px 3px 7px;border:0;border-radius:10px;background:#fff5f8;box-shadow:none}}
@media(max-width:650px){.ma-top{flex-wrap:wrap}.ma-top .ma-navigation{justify-content:flex-start;gap:8px}.ma-top .ms-nav-group .ms-nav-panel{left:0;right:auto}}
@media(max-width:450px){.ms-site-header .ms-nav-group[data-menu="accessories-home"] .ms-nav-panel{grid-template-columns:1fr}}
.ma-curation figure.ma-photo-unavailable{min-height:210px;display:flex;flex-direction:column;justify-content:end;background:linear-gradient(145deg,#f9f1f4,#eadde3)}.ma-curation figure.ma-photo-unavailable figcaption:before{content:"Photograph unavailable — please refer to the original source. ";font-weight:700}.ma-curation figure img{object-position:center}.ma-cards-photo img{object-position:center}\n
/* MariaSM homepage: six new craft and accessory galleries. */
.ma-cards-photo{gap:19px;margin-top:25px}
.ma-cards-photo a{display:flex;flex-direction:column;min-width:0;box-shadow:0 8px 26px #68465a12;transition:transform .2s,box-shadow .2s;border-radius:20px;overflow:hidden}
.ma-cards-photo a:hover{transform:translateY(-3px);box-shadow:0 15px 35px #68465a24}
.ma-cards-photo img{height:190px;object-fit:cover;object-position:center;background:#f5e9ed}
.ma-cards-photo strong{font:normal 23px/1.25 Georgia,serif;padding:15px 17px 7px}
.ma-cards-photo small{margin-top:auto;font-size:12px;padding:0 17px 18px;color:#825c6c}
#mariasm-craft-ateliers{padding-top:32px;padding-bottom:48px}
#mariasm-craft-ateliers .section-head{align-items:end;gap:20px}
#mariasm-craft-ateliers .section-head p{max-width:500px;line-height:1.7}
.ma-top .ms-nav-group .ms-nav-panel{box-sizing:border-box}
.ma-top .ms-nav-group .ms-nav-panel a{display:block}
@media(max-width:700px){.ma-cards-photo{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ma-cards-photo img{height:145px}.ma-cards-photo strong{font-size:18px;padding:10px 12px 6px}.ma-cards-photo small{padding:0 12px 13px}.ma-top .ma-navigation{width:100%}}
@media(max-width:430px){.ma-cards-photo{grid-template-columns:1fr}.ma-cards-photo img{height:205px}}
@media(prefers-reduced-motion:reduce){.ma-cards-photo a{transition:none}.ma-cards-photo a:hover{transform:none}}
</style>`;
// Place the six new guides in a true dropdown beside the existing Ateliers menu.
const mainAteliers=[
['fashion','Fashion Atlas'],['fragrance','Fragrance'],['makeup','Makeup'],
['spirituality','Spirituality & Wellbeing'],['footwear','Footwear'],
['swimwear-lingerie','Swimwear & Lingerie'],['fitness-activewear','Fitness & Activewear'],
['bags','Bags & Handbags'],['hats','Hats & Headwear'],['jewellery','Jewellery'],
['watches','Watches & Horology']
];
function group(prefix,title,kind,entries){
return '<details class="ms-nav-group" data-menu="'+kind+'"><summary>'+esc(title)+'</summary><div class="ms-nav-panel">'+entries.map(a=>'<a href="'+prefix+a[0]+'/index.html">'+esc(a[1])+'</a>').join('')+'</div></details>';
}
function updateNavigation(html,rel,prefix){
  // Remove the prior sitewide bar and the redundant footer menu from the previous editorial pass.
  html=html.replace(/<div class="maria-catalogue-nav"[\s\S]*?<\/div>/g,'');
  html=html.replace(/<div data-mariasm-new-ateliers-menu[\s\S]*?<\/div>/g,'');
  const label='Accessories & Home';
  if(/<nav\b[^>]*\bms-site-nav\b/.test(html)){
    const menu=group(prefix,label,'accessories-home',ateliers.map(a=>[a[0],a[1]]));
    // Insert immediately after the existing Ateliers dropdown, not above the header.
    const marker=/(<details class="ms-nav-group" data-menu="ateliers">[\s\S]*?<\/details>)/;
    if(!marker.test(html))throw Error('Could not find Ateliers dropdown in '+rel);
    html=html.replace(marker,'$1'+menu);
  }else if(ateliers.some(a=>rel===a[0]+'/index.html')){
    // Standalone editorial pages have a smaller native header; give them matching inline dropdowns.
    const menus=group(prefix,'Ateliers','ateliers',mainAteliers)+group(prefix,label,'accessories-home',ateliers.map(a=>[a[0],a[1]]));
    const marker=/(<nav class="ma-navigation">)/;
    if(!marker.test(html))throw Error('Could not find editorial navigation in '+rel);
    html=html.replace(marker,'$1'+menus);
  }
  return html;
}
function gallery(slug){const pics=photos[slug];return '<section class="ma-curation"><h2>Photographic details &amp; materials</h2><p>Relevant visual references from historical collections, contemporary makers and retail photography. A reference image does not claim to depict the precise historical example or shopping variant.</p><div class="photogrid">'+pics.map(p=>'<figure><img loading="lazy" alt="'+esc(p[1])+'" src="'+esc(p[0])+'" onerror="this.onerror=null;this.style.display=&#39;none&#39;;this.parentElement.classList.add(&#39;ma-photo-unavailable&#39;)"><figcaption>'+esc(p[1])+'</figcaption></figure>').join('')+'</div></section>'}
function detail(slug){return '<section class="ma-curation" id="maria-deep-reading"><h2>The story behind the objects</h2><div class="details">'+lessons[slug].map(x=>'<article><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></article>').join('')+'</div></section>'}
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory()){walk(f);continue}if(!e.name.endsWith('.html'))continue;const rel=path.relative(docs,f).replaceAll(path.sep,'/');const prefix='../'.repeat(rel.split('/').length-1);let html=fs.readFileSync(f,'utf8');if(html.includes('maria-curation-css'))continue;
if(rel==='index.html'){
const cards='<section class="wrap section" id="mariasm-craft-ateliers"><div class="section-head"><div><p class="eyebrow">MariaSM illustrated library</p><h2>Fashion &amp; Home Ateliers</h2></div><p>Six in-depth stories from ancient Rome to today, including real-world shopping references and luxury editions.</p></div><div class="ma-cards-photo">'+ateliers.map(a=>'<a href="'+a[0]+'/index.html"><img loading="lazy" src="'+esc(a[3])+'" alt="'+esc(a[1])+' photographic reference"><strong>'+esc(a[1])+'</strong><small>History · Types · Materials · Shopping</small></a>').join('')+'</div></section>';
html=html.replace(/<section class="wrap section" id="mariasm-craft-ateliers">[\s\S]*?<\/section>/,cards);
}
for(const a of ateliers){if(rel===a[0]+'/index.html'){html=html.replace('<section id="shopping" class="ma-section">',detail(a[0])+'<section id="shopping" class="ma-section">');}}
html=html.replace('</head>',css+'</head>');
html=updateNavigation(html,rel,prefix);
fs.writeFileSync(f,html);}}
walk(docs);
console.log('Applied MariaSM photo, history, homepage and cross-site navigation finishing pass.');


// Final quality layer for the six in-depth ateliers: search, price-tier filters,
// nonduplicated editorial pictures, accurate broken-image feedback.
const qualityStyle=String.raw`<style id="mariasm-quality">
.ma-shop-tools{display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin:20px 0;padding:16px;background:#fff7fa;border:1px solid #ead4df;border-radius:17px}
.ma-shop-tools label{display:grid;gap:6px;flex:1 1 185px;font:700 12px system-ui;color:#73435c}
.ma-shop-tools input,.ma-shop-tools select{width:100%;padding:11px;border:1px solid #d8bdcb;border-radius:9px;background:#fff;color:#473441;font:14px system-ui}
.ma-shop-tools button{border:1px solid #b688a0;border-radius:9px;padding:11px 16px;color:#6d4055;background:#fff;cursor:pointer}
.ma-shop-tools button:hover{background:#f4e1ea}
.ma-shop-tools .ma-results{flex:1 1 100%;margin:0;color:#6d5364;font:600 12px system-ui}
.ma-products .ma-product[hidden]{display:none!important}
.ma-editorial-unavailable{display:grid;place-items:center;width:100%;min-height:185px;padding:22px;background:linear-gradient(130deg,#f8ecf1,#e8dce5);color:#735669;text-align:center;font:600 13px/1.5 system-ui}
.ma-era-media img,.ma-type-art img,.ma-product-image img{object-position:center}
.ma-kind{display:inline-flex;align-self:flex-start;font-size:11px;letter-spacing:.02em;color:#81566a;background:#faf0f5;border:1px solid #eddae3;border-radius:30px;padding:4px 9px;margin:6px 0 10px}
.ma-product-image{overflow:hidden;min-height:225px}
.ma-product-image img{max-width:100%;max-height:100%;object-fit:contain}
.ma-product-body{min-width:0}
.ma-shop-tools label:focus-within{color:#7d405f}
.ma-shop-tools input:focus-visible,.ma-shop-tools select:focus-visible{outline:2px solid #ad6e8b;outline-offset:1px}
@media(min-width:900px){.ma-shop-tools:has(#ma-filter-kind) label{flex:1 1 175px}}

@media(max-width:560px){.ma-shop-tools label,.ma-shop-tools button{flex-basis:100%;width:100%}}
</style>`;
const qualityJS=String.raw`<script id="mariasm-quality-js">
(()=>{const section=document.querySelector('#shopping');if(!section)return;
const q=section.querySelector('#ma-filter-query'),cat=section.querySelector('#ma-filter-tier'),kind=section.querySelector('#ma-filter-kind'),clear=section.querySelector('#ma-filter-clear'),counter=section.querySelector('#ma-filter-results'),cards=[...section.querySelectorAll('.ma-products .ma-product')];
const norm=s=>String(s||'').toLowerCase();
const tierValues=[...new Set(cards.map(c=>c.querySelector('.ma-tier')?.textContent.trim()).filter(Boolean))].sort();
cat.innerHTML='<option value="">All price categories</option>';
for(const tier of tierValues){const option=document.createElement('option');option.value=tier;option.textContent=tier;cat.append(option)}
if(kind){const values=[...new Set(cards.map(c=>c.dataset.kind).filter(Boolean))].sort();kind.innerHTML='<option value="">All styles</option>';for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value;kind.append(option)}}
function apply(){let n=0;for(const card of cards){const tier=card.querySelector('.ma-tier')?.textContent.trim()||'';const show=norm(card.textContent).includes(norm(q.value.trim()))&&(!cat.value||tier===cat.value)&&(!kind||!kind.value||card.dataset.kind===kind.value);card.hidden=!show;if(show)n++}counter.textContent=n+' of '+cards.length+' products visible'}
q.addEventListener('input',apply);cat.addEventListener('change',apply);kind?.addEventListener('change',apply);
clear.addEventListener('click',()=>{q.value='';cat.value='';if(kind)kind.value='';apply();q.focus()});apply();
})();</script>`;
const seenQualityPhotos=new Set();let qualityPages=0,qualityDuplicates=0;
for(const section of data.sections){
 const filename=path.join(docs,section.slug,'index.html');
 if(!fs.existsSync(filename))throw Error('Missing editorial page '+section.slug);
 let html=fs.readFileSync(filename,'utf8');
 if(html.includes('id="mariasm-quality"'))continue;
 // Images used for explanatory history and types must not recur across all six ateliers.
 html=html.replace(/(<div class="ma-(?:era-media|type-art)">)([\s\S]*?)(<\/div>)/g,(whole,open,inside,close)=>{
  const m=inside.match(/<img\b[^>]*\bsrc="([^"]+)"/i);if(!m)return whole;
  const key=m[1].replaceAll('&amp;','&');
  if(seenQualityPhotos.has(key)){qualityDuplicates++;return open+'<div class="ma-editorial-unavailable">A distinct photographic reference is unavailable for this topic. Explore the historical explanation and source links below.</div>'+close}
  seenQualityPhotos.add(key);return whole;
 });
 const tiers=[...new Set(section.products.map(p=>p[3]).filter(Boolean))].sort();
 const styleSelector=section.slug==='belts-suspenders'?'<label for="ma-filter-kind">Style &amp; type<select id="ma-filter-kind"><option value="">All styles</option></select></label>':'';
 const tools='<div class="ma-shop-tools" role="search" aria-label="Product finder"><label for="ma-filter-query">Search products and brands<input type="search" id="ma-filter-query" placeholder="Product or brand" autocomplete="off"></label><label for="ma-filter-tier">Price category<select id="ma-filter-tier"><option value="">All price categories</option>''</select></label>'+styleSelector+'<button type="button" id="ma-filter-clear">Clear filters</button><p class="ma-results" id="ma-filter-results" role="status" aria-live="polite"></p></div>';
 if(!html.includes('<div class="ma-products">'))throw Error('Missing products on '+section.slug);
 html=html.replace('<div class="ma-products">',tools+'<div class="ma-products">');
 html=html.replace('</head>',qualityStyle+'</head>').replace('</body>',qualityJS+'</body>');
 html=html.replace('Only real, individually photographed products from identifiable retailer pages. No AI-made or substitute product photos.','Real retailer products only. Exact-item photography appears where it is available. Otherwise follow the original retailer link to inspect the product; AI-generated photos are never used as substitutes.');
 fs.writeFileSync(filename,html);qualityPages++;
}
if(qualityPages!==6)throw Error('Quality pass incomplete: '+qualityPages);
console.log('MariaSM quality: '+qualityPages+' complete atelier pages with product filters; '+qualityDuplicates+' duplicate documentary images prevented.');
