import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'docs/venetian-glass/index.html');
let html=fs.readFileSync(file,'utf8');
if(!html.includes('class="ma-types"'))throw Error('Murano types grid not found');
const names=['Cristallo','Lattimo','Filigrana','Murrine / millefiori','Sommmerso','Aventurina','Venetian mirrors','Fazzoletto & incalmo'];
const defs='<defs><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f5ffff" stop-opacity=".85"/><stop offset=".24" stop-color="#a9dee6" stop-opacity=".6"/><stop offset=".54" stop-color="#fff" stop-opacity=".3"/><stop offset=".8" stop-color="#71b6cb" stop-opacity=".65"/><stop offset="1" stop-color="#f7ffff" stop-opacity=".9"/></linearGradient><linearGradient id="opal" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#fff"/><stop offset=".6" stop-color="#dce7ee"/><stop offset="1" stop-color="#fafafa"/></linearGradient><linearGradient id="wine" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#253e8a"/><stop offset=".48" stop-color="#8c65ad"/><stop offset="1" stop-color="#dda7c4"/></linearGradient><linearGradient id="aqua" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8c8d7"/><stop offset=".48" stop-color="#48b7c4"/><stop offset="1" stop-color="#286194"/></linearGradient><radialGradient id="bg"><stop stop-color="#fff"/><stop offset="1" stop-color="#f2e8ed"/></radialGradient><filter id="shadow"><feGaussianBlur stdDeviation="7"/></filter></defs>';
const vase='M188 69 Q184 103 166 124 Q120 180 128 260 Q134 299 260 299 Q386 299 392 260 Q400 180 354 124 Q336 103 332 69 Z';
const shine='<path d="M177 137Q155 195 161 251" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="11" stroke-linecap="round"/>';
const circle=(x,y,r,color)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+color+'" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>';
function craft(i){
 if(i===0)return '<path d="M152 63 Q152 205 247 212 L247 279 L202 289 L202 302 L318 302 L318 289 L273 279 L273 212 Q368 205 368 63Z" fill="url(#glass)" stroke="#6b9fac" stroke-width="6"/><ellipse cx="260" cy="63" rx="108" ry="15" fill="#e7fbfd" fill-opacity=".7" stroke="#74aaba" stroke-width="5"/><path d="M172 113 Q182 182 247 192 M198 88 Q194 139 218 160" stroke="#fff" stroke-width="8" fill="none" opacity=".8"/>';
 if(i===1)return '<path d="'+vase+'" fill="url(#opal)" stroke="#b7c3d1" stroke-width="5"/><ellipse cx="260" cy="69" rx="72" ry="18" fill="#eaf0f5" stroke="#a7b4c2" stroke-width="5"/><path d="M171 139Q146 195 159 255" stroke="#fff" stroke-width="12" opacity=".9" fill="none"/><path d="M333 118Q377 184 359 261" stroke="#c0d4df" stroke-width="11" opacity=".5" fill="none"/>';
 if(i===2)return '<path d="'+vase+'" fill="url(#glass)" stroke="#609fae" stroke-width="5"/><ellipse cx="260" cy="69" rx="72" ry="18" fill="#f0fcff" stroke="#609fae" stroke-width="5"/><clipPath id="vclip"><path d="'+vase+'"/></clipPath><g clip-path="url(#vclip)">'+Array.from({length:16},(_,j)=>'<path d="M'+(86+j*19)+' 50 Q'+(286+j*3)+' 182 '+(80+j*23)+' 320" fill="none" stroke="'+(j%2?'#fff8fa':'#267d9b')+'" stroke-width="5" opacity=".82"/>').join('')+'</g>'+shine;
 if(i===3)return '<path d="'+vase+'" fill="#a1d6e6" stroke="#6197ab" stroke-width="5"/><clipPath id="vclip"><path d="'+vase+'"/></clipPath><g clip-path="url(#vclip)">'+Array.from({length:48},(_,j)=>{let x=120+(j*47)%290,y=100+(j*83)%215;return '<g>'+circle(x,y,13+(j%3)*3,['#f2bb43','#538cca','#b8487a','#77b9a2','#e9eef3'][j%5])+circle(x,y,5,'#fff8f3')+'</g>'}).join('')+'</g><ellipse cx="260" cy="69" rx="72" ry="18" fill="#ecffff" fill-opacity=".65" stroke="#6197ab" stroke-width="5"/>';
 if(i===4)return '<path d="'+vase+'" fill="url(#glass)" stroke="#568bae" stroke-width="5"/><clipPath id="vclip"><path d="'+vase+'"/></clipPath><g clip-path="url(#vclip)"><path d="M100 180Q240 130 420 180V340H100Z" fill="url(#aqua)"/><path d="M100 229Q240 185 420 229V340H100Z" fill="url(#wine)" opacity=".8"/><path d="M100 270Q240 225 420 270V340H100Z" fill="#70b3bb" opacity=".65"/></g><ellipse cx="260" cy="69" rx="72" ry="18" fill="#ebfaff" stroke="#568bae" stroke-width="5"/>'+shine;
 if(i===5)return '<path d="'+vase+'" fill="#4e376f" stroke="#a9a0c3" stroke-width="5"/><clipPath id="vclip"><path d="'+vase+'"/></clipPath><g clip-path="url(#vclip)">'+Array.from({length:105},(_,j)=>{let x=130+(j*89)%260,y=94+(j*53)%204;return '<circle cx="'+x+'" cy="'+y+'" r="'+(1+j%4)+'" fill="'+(j%3===0?'#f9d987':'#d3aa5e')+'" opacity=".9"/>'}).join('')+'</g><ellipse cx="260" cy="69" rx="72" ry="18" fill="#d9c8df" stroke="#a9a0c3" stroke-width="5"/>'+shine;
 if(i===6)return '<path d="M186 30L334 30L383 82L383 278L335 322L185 322L137 278L137 82Z" fill="#e5ba65" stroke="#ad7736" stroke-width="9"/><path d="M192 63H327L354 94V268L324 290H196L166 265V96Z" fill="url(#glass)" stroke="#f6e2a3" stroke-width="9"/><path d="M198 104Q252 80 327 110 M186 265Q255 230 332 265" fill="none" stroke="#fff" stroke-width="8" opacity=".8"/>'+Array.from({length:8},(_,j)=>circle(160+j*27,41,5,'#d4a84b')).join('');
 return '<path d="M157 139Q123 108 155 86Q199 60 215 78Q252 120 293 70Q322 44 352 82Q413 110 361 156L369 254Q344 301 259 297Q171 301 150 253Z" fill="url(#aqua)" stroke="#6a8da6" stroke-width="6"/><path d="M157 139Q193 116 217 151Q262 113 293 139Q339 115 361 156" fill="none" stroke="#f5dfef" stroke-width="10"/><path d="M163 199Q260 173 361 205" stroke="#f3f9fc" stroke-width="9" fill="none" opacity=".75"/>'+shine;
}
function fallback(i){
 return '<div class="murano-art-fallback"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 340" role="img" aria-label="Original illustrative study of '+names[i]+' Murano glass technique">'+defs+'<rect width="520" height="340" fill="url(#bg)"/><ellipse cx="260" cy="312" rx="135" ry="13" fill="#62445a" opacity=".13" filter="url(#shadow)"/>'+craft(i)+'</svg><span class="murano-art-label">Technique illustration</span></div>';
}
let count=0,photos=0;
html=html.replace(/<article class="ma-type">([\s\S]*?)<\/article>/g,(whole,body)=>{
 const i=count++; if(i>=8)return whole;
 const prior=(body.match(/<div class="ma-type-art">([\s\S]*?)<\/div>/)||[])[1]||'';
 const src=(prior.match(/<img\b[^>]*\bsrc="([^"]+)"/)||[])[1];
 let usePhoto=false;
 if(src&&src.startsWith('../assets/murano-photographs/')){
  usePhoto=fs.existsSync(path.join(root,'docs',src.replace('../','')));
 }
 if(usePhoto){photos++;return whole;}
 const newMedia='<div class="ma-type-art">'+fallback(i)+'</div>';
 if(/<div class="ma-type-art">[\s\S]*?<\/div>/.test(body))return '<article class="ma-type">'+body.replace(/<div class="ma-type-art">[\s\S]*?<\/div>/,newMedia)+'</article>';
 throw Error('Missing type-art block at card '+i);
});
if(count!==8)throw Error('Murano Types & Uses expected 8 cards; found '+count);
const css='<style id="murano-types-layout-2026">#types .ma-types{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;align-items:stretch}#types .ma-type{display:flex;flex-direction:column;min-width:0;height:100%;overflow:hidden;border-radius:20px}#types .ma-type-art{position:relative;display:block;height:auto;aspect-ratio:4/3;min-height:0;flex:none;background:#faf4f7;overflow:hidden}#types .ma-type-art>a{display:block;width:100%;height:100%}#types .ma-type-art img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:#fff}#types .ma-type-body{flex:1;display:flex;flex-direction:column;gap:10px;padding:21px}#types .ma-type h3{margin:0;line-height:1.2;min-height:2.4em}#types .ma-type p{margin:0;line-height:1.6}#types .ma-type small{display:block;margin-top:auto;line-height:1.6;padding-top:6px}#types .murano-art-fallback{width:100%;height:100%;position:relative}#types .murano-art-fallback svg{width:100%;height:100%;display:block}#types .murano-art-label{position:absolute;bottom:5px;right:8px;font:10px/1.2 system-ui;color:#73546b;background:#ffffffd9;border-radius:5px;padding:3px 5px}@media(max-width:1080px){#types .ma-types{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:780px){#types .ma-types{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){#types .ma-types{grid-template-columns:1fr}#types .ma-type h3{min-height:0}}</style>';
html=html.replace('</head>',css+'</head>');
fs.writeFileSync(file,html);
console.log('Murano types aligned: 8 cards, '+photos+' verified photos, '+(8-photos)+' original technique illustrations; no empty slots.');
