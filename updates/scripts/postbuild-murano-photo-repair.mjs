import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'docs/venetian-glass/index.html');
const dir=path.join(root,'docs/assets/murano-photographs');
fs.mkdirSync(dir,{recursive:true});
let html=fs.readFileSync(file,'utf8');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const queries=[
 {name:'Cristallo',terms:['Venice glass goblet crystal cristallo museum','Venetian cristallo glass goblet museum']},
 {name:'Lattimo',terms:['lattimo Venetian milk glass vessel','Venetian glass lattimo white vase']},
 {name:'Filigrana',terms:['Murano Glass Museum Filigrana a reticello','Murano filigrana glass museum']},
 {name:'Murrine / millefiori',terms:['Murano millefiori glass paperweight','Murano murrine glass vase']},
 {name:'Sommmerso',terms:['Murano sommerso glass vase','Murano submerged glass vase']},
 {name:'Aventurina',terms:['Murano avventurina glass vase','Venetian aventurine glass']},
 {name:'Venetian mirrors',terms:['Venetian glass mirror museum','Venetian Murano glass mirror']},
 {name:'Fazzoletto & incalmo',terms:['Venini fazzoletto vase Murano','Murano incalmo glass vase']}
];
const commonFiles={
 'Filigrana':['Murano Glass Museum Filigrana a reticello 01062015 1.jpg','Murano Glass Museum 25052015 02.jpg'],
 'Cristallo':['Venezia, coppa su piede in cristallo soffiato, con smalti e foglia d oro, 1490-1510 ca.jpg','Venezia, contenitore con coperchio in cristallo con decorazioni incise a punta di diamante, xvii secolo.jpg']
};
const historicalQueries=[
 'Roman glass vessels museum Venetian lagoon',
 'Byzantine Venetian glass museum medieval',
 'Murano glass furnace glassblower Venezia',
 'Venice fifteenth century glass goblet museum',
 'Murano glass filigrana reticello museum',
 'Murano glass chandelier Venetian museum',
 'Murano glass museum nineteenth century',
 'Murano Venini twentieth century glass vase',
 'Murano glassblower furnace contemporary workshop'
];
async function get(url,seconds=9){
 const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),seconds*1000);
 try{const res=await fetch(url,{signal:ac.signal,headers:{'User-Agent':'MariaSM-editorial-archive/1.0 (educational website; Wikimedia Commons)','Accept':'application/json,image/*,*/*'}});return res.ok?res:null}
 catch{return null}finally{clearTimeout(tm)}
}
async function saveUrl(url,name){
 if(!url||!/^https:\/\//.test(url))return null;
 const response=await get(url,9);if(!response)return null;
 const kind=(response.headers.get('content-type')||'').toLowerCase();
 if(!/^image\/(jpeg|png|webp)/.test(kind))return null;
 const buf=Buffer.from(await response.arrayBuffer());
 if(buf.length<4000||buf.length>7_000_000)return null;
 const ext=kind.includes('png')?'png':kind.includes('webp')?'webp':'jpg';
 const target=name+'.'+ext;fs.writeFileSync(path.join(dir,target),buf);
 return '../assets/murano-photographs/'+target;
}
async function commonsByTitle(title,name){
 const request='https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=900&titles='+encodeURIComponent('File:'+title);
 const response=await get(request,10);if(!response)return null;
 try{
  const data=await response.json();
  const info=Object.values(data.query?.pages||{})[0]?.imageinfo?.[0];
  const imageUrl=info?.thumburl||info?.url;
  return await saveUrl(imageUrl,name);
 }catch{return null}
}
async function commonsBySearch(phrase,name){
 const endpoint='https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=9&gsrsearch='+encodeURIComponent(phrase)+'&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=800';
 const response=await get(endpoint,11);if(!response)return null;
 try{
  const pages=Object.values((await response.json()).query?.pages||{});
  const possible=pages.filter(x=>/\.(jpe?g|png|webp)$/i.test(x.title||'')&&x.imageinfo?.[0]?.thumburl)
   .sort((a,b)=> {
      const aName=(a.title||'').toLowerCase(),bName=(b.title||'').toLowerCase();
      const score=s=>(/murano|venezia|venetian|glass museum|venini/.test(s)?3:0)+(/museum|vetro|glass|vase|goblet|mirror/.test(s)?2:0);
      return score(bName)-score(aName);
   });
  for(const page of possible.slice(0,4)){const src=await saveUrl(page.imageinfo[0].thumburl,name);if(src)return src}
 }catch{}
 return null;
}
async function findCommonsImage(entry,name){
 for(const title of commonFiles[entry.name]||[]){const photo=await commonsByTitle(title,name);if(photo)return photo}
 for(const term of entry.terms){const photo=await commonsBySearch(term,name);if(photo)return photo}
 return null;
}
const typePhotos=await Promise.all(queries.map((entry,i)=>findCommonsImage(entry,'type-'+String(i+1).padStart(2,'0'))));
const typeCount=typePhotos.filter(Boolean).length;
let index=0;
html=html.replace(/<article class="ma-type">([\s\S]*?)<\/article>/g,(whole,inside)=>{
 const i=index++; if(i>=queries.length)return whole;
 const photo=typePhotos[i];if(!photo)return whole;
 const block='<div class="ma-type-art"><a href="'+photo+'" target="_blank" rel="noopener noreferrer" aria-label="Open illustrated reference image"><img loading="lazy" decoding="async" src="'+photo+'" alt="'+esc(queries[i].name)+' — real reference photography, Wikimedia Commons" style="width:100%;height:100%;object-fit:contain;object-position:center;background:white"></a></div>';
 return '<article class="ma-type">'+inside.replace(/<div class="ma-type-art">[\s\S]*?<\/div>/,block)+'</article>';
});
let chapterNumber=0, chapterFixed=0;
const historyMatches=[...html.matchAll(/<article class="ma-era-item">([\s\S]*?)<\/article>/g)];
for(const match of historyMatches){
 const ix=chapterNumber++;
 if(!/ma-no-image|Photography reference unavailable|Explore the original museum/.test(match[1]))continue;
 const photo=await commonsBySearch(historicalQueries[ix]||historicalQueries.at(-1),'history-'+String(ix+1).padStart(2,'0'));
 if(!photo)continue;
 const block='<div class="ma-era-media"><a href="'+photo+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="'+photo+'" alt="Murano glass history — documentary reference photograph from Wikimedia Commons" style="width:100%;height:100%;object-fit:contain;background:white"></a></div>';
 const improved=match[0].replace(/<div class="ma-era-media">[\s\S]*?<\/div>/,block)
 .replace(/Editorial reference unavailable/g,'Documentary photograph · Wikimedia Commons');
 html=html.replace(match[0],improved);chapterFixed++;
}
// Remove unphotographed shopping entries: a real shop must not display blank cards.
// The other Murano postbuild step already creates a separate expanded gallery of
// validated merchant-specific photos when public product data is accessible.
const shopStart=html.indexOf('<section id="shopping"');
if(shopStart<0)throw Error('Could not locate the Murano shopping section');
const shopEnd=html.indexOf('</section>',shopStart);
if(shopEnd<0)throw Error('Could not locate shop closing tag');
const original=html.slice(shopStart,shopEnd);
let removed=0;
const clean=original.replace(/<article class="ma-product">[\s\S]*?<\/article>/g,card=>{
 const img=card.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
 if(!img){removed++;return ''}
 const src=img[1].replaceAll('&amp;','&');
 if(src.startsWith('../assets/murano-photographs/')){
  const basename=src.split('/').pop();
  if(fs.existsSync(path.join(dir,basename)))return card;
 }
 if(src.startsWith('../assets/retail-photographs/')){
  const real=path.join(root,'docs',src.replace(/^\.\.\//,''));
  if(fs.existsSync(real))return card;
 }
 removed++;return '';
});
html=html.slice(0,shopStart)+clean+html.slice(shopEnd);
html=html.replace('</main>','<p class="murano-photo-audit">Murano photography: '+typeCount+' of '+queries.length+' types illustrated with archived source photography; '+chapterFixed+' additional historical images restored. Product listings without verifiable photographs were excluded ('+removed+').</p></main>');
html=html.replace('</head>','<style>.murano-photo-audit{font:12px/1.6 system-ui;color:#775568;text-align:center;margin:25px auto}.ma-type-art img,.ma-era-media img{display:block}</style></head>');
fs.writeFileSync(file,html);
console.log('Murano photo audit: types='+typeCount+'/8, historical fixed='+chapterFixed+', unphotographed shop items removed='+removed);
if(typeCount<4)console.warn('Commons temporarily blocked some editorial downloads; these types still need photographs.');
