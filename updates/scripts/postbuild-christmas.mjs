// Final seasonal finishing pass after every generated page, including Ateliers.
// Keeps source templates untouched and removes old Halloween dressing in the output.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
const scene=String.raw`
<section class="christmas-welcome" aria-labelledby="christmas-welcome-title">
 <div class="christmas-welcome-copy">
  <p class="eyebrow">MariaSM Holiday Edition · Winter 2026</p>
  <h1 id="christmas-welcome-title">A little Christmas <em>magic, just for you.</em></h1>
  <p>Step into a cosy winter wonderland of sparkling lights, drifting snow, treasured little gifts and warm moments to share. From my world to yours, Merry Christmas and a beautiful new year.</p>
  <div class="xmas-intro-controls">
   <button type="button" class="christmas-music-toggle" data-xmas-action="music" aria-pressed="false">♫ Play holiday music</button>
   <button type="button" class="christmas-snow-toggle" data-xmas-action="snow" aria-pressed="true">❄ Pause snowfall</button>
  </div>
 </div>
 <div class="christmas-welcome-art" aria-label="Illustration of a decorated Christmas tree surrounded by gifts and a snowman" role="img">
  <svg viewBox="0 0 490 390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
   <defs>
    <linearGradient id="xmas-evergreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#348365"/><stop offset=".55" stop-color="#1e6850"/><stop offset="1" stop-color="#114835"/></linearGradient>
    <linearGradient id="xmas-snow" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#deedf0"/></linearGradient>
    <linearGradient id="xmas-red" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#dd6576"/><stop offset="1" stop-color="#952f50"/></linearGradient>
   </defs>
   <circle cx="350" cy="104" r="99" fill="#fff" opacity=".39"/>
   <ellipse cx="250" cy="359" rx="218" ry="22" fill="#ffffffb8"/>
   <g opacity=".72" fill="#fff"><circle cx="86" cy="82" r="4"/><circle cx="386" cy="45" r="3"/><circle cx="430" cy="177" r="4"/><circle cx="61" cy="231" r="3"/><circle cx="295" cy="22" r="3"/><circle cx="396" cy="275" r="2.5"/></g>
   <g class="xmas-sway">
    <rect x="239" y="300" width="32" height="59" rx="4" fill="#815b43"/>
    <path d="M254 51L196 151h25l-65 103h27l-59 78h262l-60-78h28l-65-103h24z" fill="url(#xmas-evergreen)" stroke="#1b5b45" stroke-width="3" stroke-linejoin="round"/>
    <path d="M254 61L217 137h19l-44 90h21l-38 71" fill="none" stroke="#7ab495" stroke-width="9" opacity=".2" stroke-linecap="round"/>
    <path d="M206 157q55 48 107-1M164 247q90 61 181 0M151 299q105 63 207 0" fill="none" stroke="#dfbd6e" stroke-width="5" stroke-linecap="round" opacity=".95"/>
    <path d="M215 115q35 34 78 0M196 205q61 43 123 0M172 280q85 48 167 0" fill="none" stroke="#fff1b9" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 9" opacity=".9"/>
    <path d="M254 21l9 18 20 3-15 15 4 21-18-10-19 10 4-21-15-15 21-3z" fill="#ffdb78" stroke="#f5b95a" stroke-width="2"/>
    <g stroke="#fef6d5" stroke-width="2">
     <circle class="xmas-tree-bulb" cx="227" cy="124" r="5" fill="#f7cb82"/><circle class="xmas-tree-bulb" cx="282" cy="138" r="5" fill="#f3a8b2"/>
     <circle class="xmas-tree-bulb" cx="190" cy="224" r="5" fill="#b1e3ed"/><circle class="xmas-tree-bulb" cx="313" cy="215" r="5" fill="#f8d26b"/>
     <circle class="xmas-tree-bulb" cx="160" cy="292" r="5" fill="#e99caa"/><circle class="xmas-tree-bulb" cx="349" cy="287" r="5" fill="#a7dcd2"/>
     <circle class="xmas-tree-bulb" cx="232" cy="285" r="5" fill="#ffefb3"/><circle class="xmas-tree-bulb" cx="280" cy="266" r="5" fill="#f4b9cb"/>
    </g>
    <g fill="url(#xmas-red)" stroke="#fff0ce" stroke-width="2"><circle cx="254" cy="100" r="9"/><circle cx="212" cy="179" r="12"/><circle cx="304" cy="185" r="10"/><circle cx="232" cy="248" r="13"/><circle cx="319" cy="281" r="12"/></g>
    <g fill="#f4d27d" stroke="#fff5d5" stroke-width="2"><circle cx="259" cy="174" r="11"/><circle cx="188" cy="275" r="10"/><circle cx="283" cy="307" r="11"/></g>
    <g fill="#f7f7ec" stroke="#b4ddd1" stroke-width="2"><circle cx="274" cy="224" r="9"/><circle cx="212" cy="302" r="9"/><circle cx="299" cy="116" r="7"/></g>
    <g stroke="#fff3d5" stroke-width="2" fill="none"><path d="M254 90v-5m-42 82v-5m92 12v-5m-72 66v-5m87 39v-5"/></g>
   </g>
   <g transform="translate(71 288)">
    <rect x="0" y="28" width="76" height="47" rx="5" fill="#d15b6c"/>
    <path d="M35 28v47M0 44h76" stroke="#ffe0ac" stroke-width="12"/>
    <path d="M36 25c-25-22-33-2-6 8m6-8c23-23 31-3 5 8" fill="none" stroke="#f2ca78" stroke-width="7" stroke-linecap="round"/>
   </g>
   <g transform="translate(318 315)">
    <rect width="66" height="43" rx="5" fill="#d7ac6f"/>
    <path d="M31 0v43M0 14h66" stroke="#fff1d2" stroke-width="9"/>
    <path d="M31 0c-17-16-23-2-5 7m5-7c17-16 24-2 5 7" fill="none" stroke="#fff1d2" stroke-width="5"/>
   </g>
   <g transform="translate(389 229)">
    <ellipse cx="37" cy="120" rx="41" ry="9" fill="#abcfc7" opacity=".45"/>
    <circle cx="36" cy="98" r="32" fill="url(#xmas-snow)" stroke="#b8d8dc" stroke-width="2"/>
    <circle cx="36" cy="54" r="24" fill="url(#xmas-snow)" stroke="#b8d8dc" stroke-width="2"/>
    <path d="M16 36h39l-4 8H20zm12-25h21l8 25H20z" fill="#326252"/>
    <path d="M14 72q21 17 44-1" fill="none" stroke="#bd5063" stroke-width="10"/>
    <circle cx="28" cy="50" r="2.8" fill="#334"/><circle cx="44" cy="50" r="2.8" fill="#334"/>
    <path d="M36 57l18 5-16 2z" fill="#eaa260"/>
    <g fill="#335b4c"><circle cx="36" cy="87" r="3"/><circle cx="36" cy="104" r="3"/></g>
    <path d="M6 89l-13-12m76 10 13-11" stroke="#865c42" stroke-width="3.5" stroke-linecap="round"/>
   </g>
  </svg>
 </div>
</section>`;
const footer=String.raw`<aside class="christmas-footer" aria-label="Christmas greeting"><span class="xmas-goodies" aria-hidden="true">🦌 🎅 🎄 🎁 🍪 🧦 ☃️ 🔔 🌿</span><strong>Season's greetings from MariaSM!</strong> May your winter be full of warmth, sparkle and little moments of wonder. ❄</aside>`;
let pages=0,homeChanged=false,removed=0;
function walk(folder){
  for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
    const filename=path.join(folder,entry.name);
    if(entry.isDirectory()){walk(filename);continue}
    if(!entry.name.endsWith('.html'))continue;
    const rel=path.relative(docs,filename).replaceAll(path.sep,'/');
    const depth=rel.split('/').length-1,prefix='../'.repeat(depth);
    let html=fs.readFileSync(filename,'utf8');
    // Remove the seasonal banner and old seasonal assets from actual pages.
    const before=html;
    html=html.replace(/<div class="yt-seasonal-slot wrap" id="seasonal-halloween">[\s\S]*?<\/svg><\/section><\/div>/g,'');
    html=html.replace(/<link\b[^>]*halloween\.css[^>]*>/gi,'')
             .replace(/<script\b[^>]*halloween\.js[^>]*><\/script>/gi,'')
             .replace(/\sclass="halloween"/g,'');
    if(before!==html)removed++;
    if(!html.includes('christmas-2026.css')){
      html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/christmas-2026.css?v=20261101"></head>`);
    }
    if(!html.includes('christmas-2026.js')){
      html=html.replace('</body>',`<script src="${prefix}assets/christmas-2026.js?v=20261101" defer></script></body>`);
    }
    if(rel==='index.html'){
      if(!html.includes('christmas-welcome')){
        html=html.replace(/(<main\b[^>]*id="main"[^>]*>)/i,'$1'+scene);
        homeChanged=html.includes('christmas-welcome');
      }
    }
    if(!html.includes('christmas-footer')){
      html=html.replace(/<footer\b/i,footer+'<footer');
    }
    fs.writeFileSync(filename,html,'utf8');
    pages++;
  }
}
if(!fs.existsSync(docs))throw Error('Missing docs output folder');
walk(docs);
for(const name of ['halloween.css','halloween.js']){
 const old=path.join(docs,'assets',name);if(fs.existsSync(old))fs.rmSync(old);
}
if(!homeChanged)throw Error('Christmas homepage introduction was not injected');
if(!pages)throw Error('No pages to decorate');
for(const name of ['christmas-2026.css','christmas-2026.js']){
 if(!fs.existsSync(path.join(docs,'assets',name)))throw Error('Missing Christmas asset: '+name);
}
console.log(`Christmas dressing applied to ${pages} pages; ${removed} pages had Halloween references; tree introduction added.`);
