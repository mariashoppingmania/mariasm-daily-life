import fs from 'node:fs';
import path from 'node:path';
import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),docs=path.join(root,'docs');
const gif=path.join(docs,'assets/maria-anime-logo.gif');
if(!fs.existsSync(gif)||fs.statSync(gif).size<10000)throw Error('Animated GIF missing; logo must be built first.');
function pages(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>{let p=path.join(dir,x.name);return x.isDirectory()?pages(p):x.isFile()&&x.name.endsWith('.html')?[p]:[]})}
let changed=0,skipped=0;
for(const p of pages(docs)){
 let s=fs.readFileSync(p,'utf8');
 if(s.includes('id="mariasm-anime-logo-installer"'))continue;
 const rel=path.relative(path.dirname(p),docs).replaceAll(path.sep,'/');
 const prefix=rel==='.'?'./':rel+'/';
 const asset=prefix+'assets/maria-anime-logo.gif';
 const still=prefix+'assets/maria-anime-logo-still.png';
 const homepage=prefix+'index.html';
 const css='<style id="mariasm-anime-logo-style">.mariasm-anime-brand{display:inline-flex!important;align-items:center;justify-content:flex-start;flex:0 0 auto!important;max-width:min(250px,52vw)!important;width:min(250px,52vw)!important;min-width:128px!important;margin:0!important;text-decoration:none!important;line-height:0!important;overflow:visible!important}.mariasm-anime-brand picture,.mariasm-anime-brand img{display:block!important;width:100%!important;height:auto!important;max-height:99px!important;object-fit:contain!important;object-position:left center!important;border:0!important;border-radius:10px}.ms-site-header .mariasm-anime-brand,.ma-top .mariasm-anime-brand{vertical-align:middle!important}@media(max-width:680px){.mariasm-anime-brand{width:min(185px,48vw)!important;min-width:118px!important}.mariasm-anime-brand img{max-height:76px!important}}@media(max-width:380px){.mariasm-anime-brand{width:145px!important}}</style>';
 const js='<script id="mariasm-anime-logo-installer">(function(){const src='+JSON.stringify(asset)+',still='+JSON.stringify(still)+',home='+JSON.stringify(homepage)+';function run(){const heads=[...document.querySelectorAll("header, .ma-top, .ms-site-header")].filter((x,i,a)=>!a.some((y,j)=>i!==j&&y.contains(x)));if(!heads.length){console.warn("MariaSM logo: no header found");return;}for(const head of heads){if(head.querySelector(".mariasm-anime-brand"))continue;const candidates=[...head.querySelectorAll("a")].filter(a=>{const t=(a.textContent||"").trim();const c=(a.className||"").toString().toLowerCase();return t.length<120&&(/maria\\s*sm|maria\\s*shopping/i.test(t)||/brand|logo/.test(c)||a.querySelector("img[alt*=logo],img[alt*=Maria]"))});let anchor=candidates.find(a=>/brand|logo/.test(String(a.className).toLowerCase()))||candidates.find(a=>/maria/i.test(a.textContent||""));if(!anchor){anchor=document.createElement("a");head.prepend(anchor);}anchor.classList.add("mariasm-anime-brand");anchor.href=home;anchor.setAttribute("aria-label","Maria SM — home");anchor.title="Maria SM · Shopping, Stories, Soul";anchor.replaceChildren();const picture=document.createElement("picture");const staticSource=document.createElement("source");staticSource.media="(prefers-reduced-motion: reduce)";staticSource.srcset=still;picture.append(staticSource);const img=document.createElement("img");img.src=src;img.alt="Maria SM — colourful animated anime-inspired logo";img.width=540;img.height=210;img.decoding="async";img.loading="eager";picture.append(img);anchor.append(picture);}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run,{once:true});else run();})();</script>';
 if(!s.includes('</head>')||!s.includes('</body>')){skipped++;continue}
 s=s.replace('</head>',css+'</head>').replace('</body>',js+'</body>');
 fs.writeFileSync(p,s);changed++;
}
if(!changed)throw Error('No pages were updated with anime logo');
console.log('MariaSM animated anime logo injected into',changed,'HTML pages;',skipped,'skipped. GIF bytes',fs.statSync(gif).size);
