import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),docs=path.join(root,'docs');
const recipes=JSON.parse(fs.readFileSync(path.join(root,'content/christmas-food-recipes.json'),'utf8'));
const dir=path.join(docs,'christmas-food'),photoDir=path.join(dir,'photos');fs.mkdirSync(photoDir,{recursive:true});
const E=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function get(url,timeout=12000){const controller=new AbortController(),t=setTimeout(()=>controller.abort(),timeout);try{return await fetch(url,{signal:controller.signal,headers:{'User-Agent':'MariaSM-Christmas-Food-Editorial/1.0','Accept':'application/json,image/*,*/*'}})}finally{clearTimeout(t)}}
function imageInfo(b){
 if(b.length<5000||b.length>6000000)return null;
 if(b[0]===137&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return ['png',b.readUInt32BE(16),b.readUInt32BE(20)];
 if(b[0]===255&&b[1]===216){let p=2;while(p+10<b.length){if(b[p]!==255){p++;continue}const m=b[p+1];p+=2;if(m===0xd9||m===0xda)break;if(m===0x01||(m>=0xd0&&m<=0xd7))continue;let n=b.readUInt16BE(p);if(n<2||p+n>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(m))return ['jpg',b.readUInt16BE(p+5),b.readUInt16BE(p+3)];p+=n}}
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'&&b.toString('ascii',12,16)==='VP8X')return ['webp',1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];
 return null
}
const wiki={};const sources=[];
const titles=[...new Set(recipes.map(r=>r.article))];
for(let k=0;k<titles.length;k+=30){
 try{
  const url='https://en.wikipedia.org/w/api.php?action=query&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&format=json&titles='+encodeURIComponent(titles.slice(k,k+30).join('|'));
  const res=await get(url,16000);if(!res.ok)continue;const data=await res.json();
  for(const page of Object.values(data.query?.pages??{})){if(page.thumbnail?.source)wiki[page.title]=page.thumbnail.source}
  for(const redir of data.query?.redirects??[]){if(wiki[redir.to])wiki[redir.from]=wiki[redir.to]}
 }catch(e){console.warn('Wikipedia image batch failed',k,String(e).slice(0,90))}
}
async function wikimediaFile(filename){
 try{
  const u='https://commons.wikimedia.org/w/api.php?action=query&titles='+encodeURIComponent('File:'+filename)+'&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=960&format=json';
  const response=await get(u,14000);if(!response.ok)return null;
  const data=await response.json();
  return Object.values(data.query?.pages??{})[0]?.imageinfo?.[0]?.thumburl??null;
 }catch(e){console.warn('Wikimedia file lookup failed:',filename,String(e).slice(0,90));return null}
}
const photoOverrides={
 'Pork Morcon': ['Morcón (Filipino cuisine) 1.jpg','Morcón (Filipino cuisine) 3.jpg','Morcón (Filipino cuisine) 2.jpg']
};
async function commons(name,limit=8){
 try{
  const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit='+limit+'&gsrsearch='+encodeURIComponent(name)+'&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=960&format=json';
  const res=await get(url,12000);if(!res.ok)return [];
  const data=await res.json();
  return Object.values(data.query?.pages??{}).filter(p=>/\.(jpe?g|png|webp)$/i.test(p.title??'')&&p.imageinfo?.[0]?.thumburl).map(p=>({url:p.imageinfo[0].thumburl,title:p.title}));
 }catch{return []}
}
const recipesInOrder=[...recipes.entries()],queue=recipesInOrder.slice();let photoCount=0;
await Promise.all(Array.from({length:7},async()=>{while(queue.length){
 const [i,r]=queue.shift();
 const candidates=[];
 if(r.name==='Pork Morcon')candidates.push({url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Morc%C3%B3n_%28Filipino_cuisine%29_1.jpg/960px-Morc%C3%B3n_%28Filipino_cuisine%29_1.jpg',title:'Morcón (Filipino cuisine) 1.jpg, Obsidian Soul, CC BY 4.0'});
 if(photoOverrides[r.name]){
  for(const filename of photoOverrides[r.name]){const u=await wikimediaFile(filename);if(u)candidates.push({url:u,title:'File:'+filename})}
 }
 if(wiki[r.article])candidates.push({url:wiki[r.article],title:r.article});
 if(!photoOverrides[r.name]){
  const q=r.name.replace(/ — Home Style| Holiday Platter/g,'');
  candidates.push(...await commons('intitle:'+q,6));
  if(candidates.length<2)candidates.push(...await commons(q+' food',7));
 }
 const seen=new Set();
 for(const item of candidates){
  const u=item.url;if(!u||seen.has(u))continue;seen.add(u);
  try{
   const resp=await get(u,15000);if(!resp.ok)continue;
   const b=Buffer.from(await resp.arrayBuffer()),dim=imageInfo(b);
   if(!dim||dim[1]<240||dim[2]<240||dim[1]>9000||dim[2]>9000)continue;
   const file='dish-'+String(i+1).padStart(2,'0')+'.'+dim[0],local=path.join(photoDir,file);
   fs.writeFileSync(local,b);if(fs.statSync(local).size!==b.length)throw Error('Photo corrupted');
   r.photo='photos/'+file;r.credit=item.title;photoCount++;sources.push({recipe:r.name,source:u,title:item.title});break;
  }catch(e){console.warn('Photo candidate failed:',r.name,String(e).slice(0,70))}
 }
 if(!r.photo)console.warn('NO VERIFIED PHOTO - withheld recipe:',r.name);
}}));
if(!recipes.find(r=>r.name==='Pork Morcon')?.photo)throw Error('Pork Morcon still has no authentic image; publication blocked');
const photographed=recipes.filter(r=>r.photo);
if(photographed.length<40)throw Error('Only '+photographed.length+' of '+recipes.length+' recipes had valid food photos; expected at least 40');
console.log('Christmas photo audit: '+photographed.length+'/'+recipes.length+' verified local photos; '+(recipes.length-photographed.length)+' not displayed because a photo is missing.');
const css='<style>'+
'*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#16392c;color:#3d2b22;font:16px/1.65 Georgia,serif}a{color:#7f2838}a:focus-visible,button:focus-visible{outline:3px solid #d5a95c;outline-offset:3px}.xw{width:min(1240px,calc(100% - 36px));margin:auto}'+
'.snow{position:fixed;inset:0;z-index:30;pointer-events:none;background-image:radial-gradient(3px 3px at 10% 15%,#fff8 60%,transparent 70%),radial-gradient(2px 2px at 75% 42%,#fff9 60%,transparent 70%);background-size:210px 250px;animation:snow 22s linear infinite}@keyframes snow{to{background-position:0 800px,0 1000px}}'+
'.top{position:relative;z-index:40;background:#18392f;border-bottom:2px solid #daa759}.top .xw{display:flex;gap:20px;justify-content:space-between;align-items:center;flex-wrap:wrap;padding:16px 0}.top a{color:#ffecb9;text-decoration:none}.brand{font-size:27px;font-weight:700}.top nav{display:flex;gap:17px;flex-wrap:wrap;font:700 13px system-ui}'+
'.hero{text-align:center;padding:100px 20px 108px;color:#fff3db;background:radial-gradient(ellipse at 20% 10%,#88303b 0,transparent 50%),radial-gradient(ellipse at 90% 60%,#536848,transparent 45%),linear-gradient(120deg,#14372d,#1b4739 58%,#542b38)}.hero .micro{letter-spacing:.25em;color:#eecd87;font:700 13px system-ui}.hero h1{font:normal clamp(43px,8vw,95px)/1.1 Georgia;margin:20px auto}.hero em{color:#ffd9a4}.hero p{max-width:720px;margin:20px auto;font-size:20px}.icons{font-size:38px;letter-spacing:16px}.hero a{display:inline-block;color:#ffe8b6;border:1px solid #f0c886;border-radius:30px;padding:9px 20px;margin:9px;text-decoration:none}'+
'.paper-bg{padding:64px 0 95px;background:linear-gradient(90deg,#1e493b 0,#1e493b 5%,#f0e2c5 5%,#f6eacf 95%,#1e493b 95%)}.intro,.outro{max-width:980px;margin:0 auto 45px;padding:35px;background:#fff5de;border:1px solid #be9560;box-shadow:0 8px 23px #3f24182a;text-align:center}.intro h2,.section h2,.outro h2{font:normal clamp(31px,5vw,49px)/1.12 Georgia;color:#74363b;margin:15px 0}.section{margin:65px auto}.section h2{text-align:center}.section>p{text-align:center;max-width:770px;margin:0 auto 28px;color:#655144}.ornament{text-align:center;font-size:23px;letter-spacing:14px;color:#9e753c}'+
'.filters{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:30px auto}.filters button{cursor:pointer;background:#fff5df;border:1px solid #bc915f;border-radius:30px;padding:10px 17px;font:700 13px system-ui;color:#654131}.filters button[aria-pressed=true]{background:#7a2b3a;color:#fff}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.recipe[hidden]{display:none!important}.recipe{background:#fff0ce;border:1px solid #b89156;box-shadow:0 9px 22px #34201325;display:flex;flex-direction:column;min-width:0}.photo{height:210px;background:radial-gradient(circle at 70% 24%,#f2d5a4,#9d6e48 90%);display:grid;place-items:center;overflow:hidden}.photo img{display:block;width:100%;height:100%;object-fit:cover}.photo .decoration{color:#fff2cf;font-size:90px;text-shadow:0 8px 25px #4d3625}.parchment{padding:22px;display:flex;flex:1;flex-direction:column;background-image:repeating-linear-gradient(0deg,transparent 0 30px,#8d724014 31px 32px)}.meta{font:700 11px system-ui;letter-spacing:.08em;color:#93603b;text-transform:uppercase}.recipe h3{font:normal 28px/1.13 Georgia;color:#803a40;margin:11px 0}.recipe p{margin:0 0 10px}.facts{font:700 12px system-ui;color:#72563f;border-block:1px solid #c7a676;padding:11px 0;margin:8px 0 17px}.recipe details{margin-top:auto}.recipe summary{cursor:pointer;background:#832d3b;color:white;padding:12px;text-align:center;border-radius:5px;font:700 13px system-ui}.recipe summary:after{content:" ▾"}.recipe details[open] summary:after{content:" ▴"}.recipe h4{font-size:20px;margin:14px 0 4px}.recipe ul,.recipe ol{padding-left:21px;margin:4px 0 12px}.recipe li{margin-bottom:8px}.tip{border-left:3px solid #b47b3e;padding:12px!important;background:#e8d4ab;margin-top:15px!important}.planners{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.planner{border:1px solid #bc9865;background:#fff5df;padding:25px}.planner h3{font:normal 27px Georgia;color:#713643}.notice{padding:23px;background:#fff7e4;border:1px dashed #ad8454;margin:45px auto;max-width:950px}.foot{background:#16392c;color:#fae3b9;padding:35px 15px;text-align:center;font:14px/1.9 system-ui}.foot a{color:#ffce91}'+
'@media(max-width:940px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}.planners{grid-template-columns:1fr}}@media(max-width:600px){.paper-bg{background:#f6eacf}.cards{grid-template-columns:1fr}.intro,.outro{padding:25px 18px}.hero{padding:75px 16px}.top .xw{justify-content:center}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.snow{animation:none}}@media print{.snow,.top,.hero,.filters,.foot{display:none}.paper-bg{background:white}.cards{grid-template-columns:repeat(2,1fr)}.recipe{break-inside:avoid;box-shadow:none}}'+
'</style>';
const card=(r,i)=>'<article class="recipe" data-kind="'+E(r.kind)+'"><div class="photo">'+(r.photo?'<img loading="lazy" decoding="async" src="'+E(r.photo)+'" alt="'+E(r.name)+' food photograph">':'<span class="decoration" aria-label="Festive decorative illustration">✦</span>')+'</div><div class="parchment"><small class="meta">RECIPE '+String(i+1).padStart(2,'0')+' · '+E(r.region)+' · '+E(r.kind)+'</small><h3>'+E(r.name)+'</h3><p>'+E(r.story)+'</p><div class="facts">Serves '+E(r.serves)+' &nbsp; · &nbsp; '+E(r.time)+'</div><details><summary>Unroll the recipe parchment</summary><h4>Ingredients</h4><ul>'+r.ingredients.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul><h4>Method</h4><ol>'+r.steps.map(x=>'<li>'+E(x)+'</li>').join('')+'</ol><p class="tip"><strong>Kitchen note:</strong> '+E(r.tip)+'</p></details></div></article>';
const regions=[['Italy','Il Natale Italiano','From Milanese panettone and Neapolitan struffoli to Christmas Eve fish and stuffed pasta in broth: discover regional Italian traditions.'],['Philippines','Paskong Pilipino · Noche Buena','Celebrate Filipino Christmas with bibingka, puto bumbong, hamon, pancit, lumpia and sweet dishes shared around the family table.'],['World','Christmas Around the World','Festive ideas from German bakeries, French pâtisseries, British Christmas kitchens, Mexico, Poland and sunny Australian celebrations.']];
const regionHtml=regions.map(([region,title,intro])=>'<section class="section" id="'+region.toLowerCase()+'"><div class="ornament">✦ ❄ ✦</div><h2>'+E(title)+'</h2><p>'+E(intro)+'</p><div class="cards">'+recipes.map((r,i)=>r.region===region&&r.photo?card(r,i):'').join('')+'</div></section>').join('');
const schema={'@context':'https://schema.org','@graph':photographed.map(r=>({'@type':'Recipe',name:r.name,description:r.story,recipeYield:r.serves,recipeIngredient:r.ingredients,recipeInstructions:r.steps.map(s=>({'@type':'HowToStep',text:s}))}))};
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Christmas Food Special 2026 | Maria SM</title><meta name="description" content="a growing collection of Christmas recipes from Italy, the Philippines and around the world, with ingredients, cooking methods and festive food photography."><link rel="canonical" href="https://mariashoppingmania.github.io/mariasm-daily-life/christmas-food/">'+css+'<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head><body><div class="snow" aria-hidden="true"></div><header class="top"><div class="xw"><a class="brand" href="../index.html">Maria SM</a><nav aria-label="Festive food navigation"><a href="../index.html">Home</a><a href="#italy">Italy</a><a href="#philippines">Philippines</a><a href="#world">The World</a><a href="#holiday-planner">Holiday planner</a></nav></div></header><section class="hero"><small class="micro">MARIA SM · CHRISTMAS SPECIAL 2026</small><div class="icons">❄ ✧ 🎄 ✧ ❄</div><h1>Christmas at <em>the Table</em></h1><p>Stories, aromas and cherished recipes from Italy, the Philippines and the world. A festive cookbook on old parchment, made for sharing.</p><a href="#italy">Discover the recipes</a><a href="#holiday-planner">Plan a festive feast</a></section><main class="paper-bg"><div class="xw"><section class="intro"><h2>Traditions made to share</h2><p>Every home has its own Christmas story. In Italy, regional feasts bring fish, pasta, rich breads and honey sweets; in the Philippines, Noche Buena draws families together while bibingka and puto bumbong recall the season of Simbang Gabi. These are practical home versions, offered with warmth and respect for family variations.</p></section><div class="filters" aria-label="Filter Christmas dishes"><button data-filter="All" aria-pressed="true">All recipes</button><button data-filter="Sweet" aria-pressed="false">Festive sweets</button><button data-filter="Savoury" aria-pressed="false">Savoury dishes</button><button id="print-recipes">Print cookbook</button></div>'+regionHtml+'<section class="section" id="holiday-planner"><h2>The Christmas Table Planner</h2><div class="planners"><article class="planner"><h3>Christmas Eve</h3><p><strong>Italy:</strong> Baccalà with potatoes, struffoli and cartellate. <strong>Philippines:</strong> Hamon, queso de bola, pancit and leche flan.</p></article><article class="planner"><h3>Christmas Day</h3><p>Tortellini in broth or lasagne; for a Filipino feast, pork morcon and lumpia. Finish with panettone, pandoro and bibingka.</p></article><article class="planner"><h3>A World Table</h3><p>Polish pierogi, herb-roasted turkey, Christstollen, French Yule log, mince pies and Australian pavlova.</p></article></div></section><aside class="notice"><strong>Food and safety notes:</strong> Cooking durations are approximate. Use a thermometer for meat and poultry; check allergens including gluten, eggs, dairy, nuts, fish and soy. Historical recipes vary from family to family. Images, where available, depict the dish, not necessarily the precise recipe variant.</aside><section class="outro"><h2>A Christmas keepsake</h2><p>Every treasured recipe carries a family memory. Open each parchment, gather ingredients and create another story at the table.</p><a href="../index.html">Back to Maria SM Shopping · Stories · Soul</a></section></div></main><footer class="foot">Maria SM · Christmas Food Special 2026<br>Tradition references: <a href="https://www.lacucinaitaliana.it/news/trend/piatti-di-natale-italiani/">La Cucina Italiana</a> · <a href="https://nnc.gov.ph/mindanao-region/pinoy-foods-this-holiday-season/">Philippines National Nutrition Council</a> · <a href="https://news.tv5.com.ph/features/read/10-noche-buena-faves-that-bring-christmas-feels-with-every-bite">TV5 Noche Buena</a></footer><script>(function(){const buttons=[...document.querySelectorAll("[data-filter]")],cards=[...document.querySelectorAll(".recipe")];buttons.forEach(b=>b.addEventListener("click",()=>{buttons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));cards.forEach(c=>c.hidden=b.dataset.filter!=="All"&&c.dataset.kind!==b.dataset.filter)}));document.getElementById("print-recipes").addEventListener("click",()=>{cards.forEach(c=>{c.hidden=false;c.querySelector("details").open=true});window.print()})})();</script></body></html>';
fs.writeFileSync(path.join(dir,'index.html'),html);
const homePath=path.join(docs,'index.html');let home=fs.readFileSync(homePath,'utf8');
const news='<section id="mariasm-christmas-food-news" aria-label="Christmas Food Special" style="max-width:1220px;margin:28px auto;padding:28px 30px;border-radius:20px;border:2px solid #d6aa63;background:linear-gradient(110deg,#143d31,#692c3a 72%,#a67535);color:#fff3dd;box-shadow:0 13px 28px #34201925"><small style="letter-spacing:.17em;color:#ffdb98;font-weight:800">✦ FESTIVE NEWS · CHRISTMAS FOOD SPECIAL 2026</small><h2 style="font:normal clamp(28px,4vw,43px) Georgia,serif;color:#fff3df;margin:10px 0">A Christmas Feast: Italy, the Philippines &amp; the World 🎄</h2><p style="max-width:900px;color:#fff2df">Discover a growing selection of photographed holiday recipes with festive photographs, detailed methods and beautifully aged parchment cards — from panettone and struffoli to bibingka, puto bumbong and Christmas dishes around the globe.</p><a href="christmas-food/index.html" style="display:inline-block;background:#ffdfa2;color:#542836;padding:12px 19px;border-radius:30px;text-decoration:none;font-weight:800">Explore the Christmas Food Special ↗</a></section>';
if(!home.includes('id="mariasm-christmas-food-news"')){const main=home.match(/<main\b[^>]*>/i);home=main?home.replace(main[0],main[0]+news):home.replace('</body>',news+'</body>')}
function menuLink(str,href){return str.replace(/(<details\b[^>]*data-menu=["']ateliers["'][^>]*>[\s\S]*?<div class=["']ms-nav-panel["'][^>]*>)/,m=>m+'<a class="ms-christmas-food-menu-link" href="'+href+'">🎄 Christmas Food Special</a>')}
if(!home.includes('ms-christmas-food-menu-link'))home=menuLink(home,'christmas-food/index.html');fs.writeFileSync(homePath,home);
function pages(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[])}
let menus=0;for(const p of pages(docs)){if(p===homePath||p===path.join(dir,'index.html'))continue;let h=fs.readFileSync(p,'utf8');if(h.includes('ms-christmas-food-menu-link'))continue;const href='../'.repeat(path.relative(docs,p).split(path.sep).length-1)+'christmas-food/index.html',u=menuLink(h,href);if(u!==h){fs.writeFileSync(p,u);menus++}}
fs.writeFileSync(path.join(dir,'photo-sources.json'),JSON.stringify(sources,null,2));
console.log('Christmas special:',photographed.length,'photographed recipes out of',recipes.length,'total; photos',photoCount,'verified real dish photos',menus,'site navigation additions.');
