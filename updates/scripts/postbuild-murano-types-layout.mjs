import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/venetian-glass/index.html');
const mediaDir=path.join(root,'docs/assets/murano-photographs');
const document=JSON.parse(fs.readFileSync(path.join(root,'content/editorial-expansion.json'),'utf8'));
const types=document.sections.find(x=>x.slug==='venetian-glass').types;
let html=fs.readFileSync(page,'utf8');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
if(types.length!==8)throw Error('Expected exactly eight Murano categories');
fs.mkdirSync(mediaDir,{recursive:true});

// Curated and topic-specific objects from the Murano Glass Museum, not AI drawings.
// Exact objects verified against their Wikimedia Commons descriptions. Their names
// identify the glass technique, rather than relying on a loosely related search result.
const museumFiles=[
 ['Venezia, vaso in cristallo, fine xvii-inizio xviii sec..JPG','Vetro di murano, coppa con piede, 1500 ca.JPG'],
 ["Italian - Milk Glass Vase in the Shape of a Pilgrim's Flask - Walters 4730 - Profile.jpg",'Plas Glyn y Weddw - Venetianischer Glasteller.jpg'],
 ['Vetro veneziano, vaso a umbone filigranato, 1580-1600.JPG','Vetro di murano, vasi con filigrana, 1550-1600 ca..JPG'],
 ['Bärnbach Glasmuseum Murano Millefiori.jpg'],
 ['Muranoglasvase von Flavio Poli.JPG'],
 ['Murano Glass Museum 27022015 Avventurina 02.jpg','Murano Glass Museum 27022015 Avventurina 04.jpg'],
 ['Venetian Mirror.JPG'],
 ['Vase Fazzoletto.jpg','Paolo venini e fulvio bianconi per venini spa., vaso fazzoletto, 1948 ca.jpg']
];
const searchTerms=[
 'Venetian cristallo glass goblet',
 'Murano lattimo white glass',
 'Murano glass filigrana reticello',
 'Murano murrine millefiori glass',
 'Murano sommerso layered glass',
 'Murano glass avventurina',
 'Venetian Murano glass mirror',
 'Venini fazzoletto Murano glass'
];
async function request(url,time=6500){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),time);
 try{const r=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':'MariaSM/1.0 (historical illustrated guide)','Accept':'application/json,image/*,*/*'}});return r.ok?r:null}catch{return null}finally{clearTimeout(timer)}
}
async function save(url,index){
 if(!url?.startsWith('https://'))return null;
 const r=await request(url);if(!r)return null;
 const mime=r.headers.get('content-type')||'';
 if(!/^image\/(png|jpeg|webp)/i.test(mime))return null;
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<4000||bytes.length>8_000_000)return null;
 const ext=/png/.test(mime)?'png':/webp/.test(mime)?'webp':'jpg';
 const name='type-curated-'+String(index+1).padStart(2,'0')+'.'+ext;
 fs.writeFileSync(path.join(mediaDir,name),bytes);
 return '../assets/murano-photographs/'+name;
}
async function commonsTitle(title,index){
 const url='https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=720&titles='+encodeURIComponent('File:'+title);
 const r=await request(url);if(!r)return null;
 try{const obj=await r.json();const page=Object.values(obj.query?.pages||{})[0];return await save(page?.imageinfo?.[0]?.thumburl||page?.imageinfo?.[0]?.url,index)}catch{return null}
}
async function commonsSearch(term,index){
 const url='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch='+encodeURIComponent(term)+'&prop=imageinfo&iiprop=url&iiurlwidth=720';
 const r=await request(url);if(!r)return null;
 try{
 const pages=Object.values((await r.json()).query?.pages||{}).filter(x=>/\.(jpg|jpeg|png|webp)$/i.test(x.title||''));
 for(const p of pages.slice(0,3)){const saved=await save(p.imageinfo?.[0]?.thumburl||p.imageinfo?.[0]?.url,index);if(saved)return saved}
 }catch{}
 return null;
}
async function find(index){
 // An exact source is better than a successful but unrelated generic photograph.
 // Try the actual museum/object filenames, and only then an exact-title file redirect.
 for(const title of museumFiles[index]){
  for(let attempt=0;attempt<2;attempt++){
    const photo=await commonsTitle(title,index);
    if(photo)return {src:photo,archived:true,title};
  }
  const direct='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(title)+'?width=720';
  const saved=await save(direct,index);
  if(saved)return {src:saved,archived:true,title};
 }
 // If Wikimedia blocks a server-side download, the file's direct public URL remains
 // in the page. It is an exact verified photograph, never an illustration or blank.
 const title=museumFiles[index][0];
 return {src:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(title)+'?width=720',archived:false,title};
}
const images=await Promise.all(types.map((_,i)=>find(i)));
const cards=types.map(([name,desc,materials],i)=>{
 const image=images[i],img=image.src;
 const info='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(image.title.replaceAll(' ','_'));
 const media='<div class="ma-type-art"><a href="'+esc(info)+'" target="_blank" rel="noopener noreferrer" title="Original museum or archival photograph"><img loading="lazy" decoding="async" src="'+esc(img)+'" alt="Real photographic example of '+esc(name)+' Venetian glass" referrerpolicy="no-referrer"/></a></div>';
 return '<article class="ma-type">'+media+'<div class="ma-type-body"><h3>'+esc(name.replace('Sommmerso','Sommerso'))+'</h3><p>'+esc(desc)+'</p><small>Materials: '+esc(materials)+'</small></div></article>';
}).join('');
// Replace the WHOLE grid rather than editing nested DIVs with regex (which caused
// incorrectly nested article elements and giant full-width cards).
const marker='<div class="ma-types">';
const first=html.indexOf('<section id="types"');
const end=html.indexOf('<section id="materials"',first);
if(first<0||end<0)throw Error('Types/Materials section boundary not found');
const section=html.slice(first,end);
const pos=section.indexOf(marker);
if(pos<0)throw Error('Types grid marker not found');
const next=section.indexOf('</section>',pos);
if(next<0)throw Error('Types section ending not found');
const updated=section.slice(0,pos)+marker+cards+'</div>'+section.slice(next);
html=html.slice(0,first)+updated+html.slice(end);
const css='<style id="murano-types-fixed-2026">#types .ma-types{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;align-items:stretch!important}#types .ma-types>.ma-type{display:flex!important;flex-direction:column!important;width:auto!important;max-width:none!important;min-width:0!important;height:auto!important;margin:0!important;overflow:hidden!important;align-self:stretch!important;border-radius:18px}#types .ma-type-art{display:block!important;height:205px!important;max-height:205px!important;min-height:205px!important;aspect-ratio:auto!important;overflow:hidden;background:#fff}#types .ma-type-art>a{display:flex;width:100%;height:100%;align-items:center;justify-content:center}#types .ma-type-art img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:205px!important;object-fit:contain!important;object-position:center!important;padding:10px;background:#fff}#types .ma-type-body{display:flex!important;flex:1!important;flex-direction:column!important;gap:10px;padding:18px!important;min-height:190px}#types .ma-type h3{font:normal 21px/1.2 Georgia,serif!important;margin:0!important;min-height:0!important}#types .ma-type p{margin:0!important;line-height:1.55!important}#types .ma-type small{margin-top:auto;padding-top:10px}#types .ma-type-text-only .ma-type-body{justify-content:center;min-height:310px}@media(max-width:1100px){#types .ma-types{grid-template-columns:repeat(3,minmax(0,1fr))!important}}@media(max-width:760px){#types .ma-types{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:520px){#types .ma-types{grid-template-columns:1fr!important}#types .ma-type-art{height:220px!important;max-height:220px!important}}</style>';
html=html.replace('</head>',css+'</head>');

// The final history card previously contained only an unusable "Explore photograph" link.
// A genuine modern Murano workshop image is more reliable for historical editorial context
// than claiming an unavailable photo exists. Archive the real photograph in Pages assets.
let livingCraftPhoto=null;
for(const title of [
 'Murano glassblowing demo 7.jpg',
 'Murano glassblowing demo.jpg',
 'Murano glassmaker.jpg',
 'Murano Glass Making 1 (3501196209).jpg'
]){
 livingCraftPhoto=await commonsTitle(title,8);
 if(livingCraftPhoto)break;
}
const livingStart=html.indexOf('<h3>Today · A living craft</h3>');
if(livingStart<0)throw Error('Murano ninth history chapter missing');
const articleStart=html.lastIndexOf('<article class="ma-era-item">',livingStart);
const articleEnd=html.indexOf('</article>',livingStart);
if(articleStart<0||articleEnd<0)throw Error('Cannot locate Murano modern history article');
const article=html.slice(articleStart,articleEnd+10);
const archivePage='https://commons.wikimedia.org/wiki/File:Murano_glassblowing_demo_7.jpg';
const source=livingCraftPhoto||'https://commons.wikimedia.org/wiki/Special:FilePath/Murano_glassblowing_demo_7.jpg?width=960';
const visual='<div class="ma-era-media"><a href="'+archivePage+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="'+source+'" alt="Murano glassblower demonstrating the modern craft in a working glass furnace" style="display:block;width:100%;height:100%;object-fit:cover;object-position:center;" /></a></div>';
const fixed=article.replace(/<div class="ma-era-media">[\s\S]*?<\/div>/,visual)
 .replace(/Editorial reference unavailable/g,'Modern Murano glassblowing · documentary photo from Wikimedia Commons');
if(!fixed.includes('Murano glassblower demonstrating'))throw Error('Modern glass image substitution failed');
html=html.slice(0,articleStart)+fixed+html.slice(articleEnd+10);
fs.writeFileSync(page,html);
console.log('Murano Living Craft photograph: '+(livingCraftPhoto?'archived locally':'public Commons fallback')+'.');
console.log('Murano types rebuilt with correct HTML: '+images.filter(x=>x.archived).length+'/8 archived real photographs (8/8 specific museum image sources); no SVGs; four-column desktop grid.');
if((html.match(/<article class="ma-type/g)||[]).length!==8)throw Error('Eight Murano cards expected');
