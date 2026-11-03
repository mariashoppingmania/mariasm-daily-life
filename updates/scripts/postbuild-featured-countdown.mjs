import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/index.html');
let html=fs.readFileSync(page,'utf8');
if(html.includes('id="maria-featured-2026"'))throw Error('Featured countdown already inserted');
const block=`
<section id="maria-featured-2026" class="maria-spotlight wrap">
 <header class="maria-featured-heading"><span>MARIA SM · WINTER 2026</span><h2>Our <em>beautiful moments</em> are getting closer.</h2><p>A little magic, a little anticipation, and a new story to watch.</p></header>
 <div class="maria-featured-cols">
  <section class="maria-timer" aria-labelledby="maria-timer-heading">
   <span class="maria-kicker">✧ THE CHRISTMAS COUNTDOWN ✧</span><h3 id="maria-timer-heading">Christmas is coming</h3>
   <p>Counting down to 25 December 2026 in Italy.</p>
   <div class="maria-clock" role="timer" aria-label="Countdown until Christmas"><div><strong data-time="d">--</strong><span>Days</span></div><div><strong data-time="h">--</strong><span>Hours</span></div><div><strong data-time="m">--</strong><span>Minutes</span></div><div><strong data-time="s">--</strong><span>Seconds</span></div></div>
   <p id="maria-countdown-status">The most wonderful season is almost here.</p><div class="maria-ornament" aria-hidden="true">❄　✦　🎄　✦　❄</div>
  </section>
  <section class="maria-video" aria-labelledby="maria-feature-heading">
   <div class="maria-video-head"><span>✦ FEATURED VIDEO</span><span>MariaSM · YouTube</span></div>
   <div class="maria-video-media" id="maria-video-media">
    <button type="button" id="maria-video-play" aria-label="Play featured YouTube video">
     <img alt="Preview of MariaSM featured YouTube video" src="https://i.ytimg.com/vi/n2Wg46fwmb0/hqdefault.jpg" width="480" height="360" loading="lazy"><span class="maria-play-icon" aria-hidden="true">▶</span><span class="maria-play-label">Play featured video</span>
    </button>
   </div>
   <div class="maria-video-details"><div><h3>Now in the spotlight</h3><p>Watch Maria's selected video directly here, or open it on YouTube.</p></div><a href="https://www.youtube.com/watch?v=n2Wg46fwmb0" target="_blank" rel="noopener noreferrer">View on YouTube ↗</a></div>
  </section>
 </div>
</section>`;
const css=`<style id="maria-feature-style">
#maria-featured-2026{margin:40px auto 54px;padding:32px clamp(16px,3vw,38px);max-width:1300px;background:linear-gradient(130deg,#fff6fa,#fff,#f9edf3);border:1px solid #ead5df;border-radius:27px;box-shadow:0 20px 58px #633b4d1c;position:relative}
.maria-featured-heading{text-align:center;margin:0 auto 26px;max-width:680px}.maria-featured-heading span{font:700 11px/1.6 system-ui;letter-spacing:.2em;color:#9b5875}.maria-featured-heading h2{font:normal clamp(30px,3.6vw,50px)/1.15 Georgia,serif;color:#5c3448;margin:8px 0 10px}.maria-featured-heading em{color:#ae647e}.maria-featured-heading p{font:14px/1.65 system-ui;color:#7c6070;margin:0}
.maria-featured-cols{display:grid;grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:22px}.maria-timer,.maria-video{border-radius:22px;overflow:hidden;min-width:0}.maria-timer{padding:31px 21px 22px;background:radial-gradient(circle at 10% 0%,#ffffff38,transparent 35%),linear-gradient(135deg,#945070,#592a45);color:white;text-align:center;display:flex;flex-direction:column;justify-content:center}.maria-kicker{font:700 11px/1.6 system-ui;letter-spacing:.17em;color:#ffe4c2}.maria-timer h3{font:normal clamp(28px,3vw,42px)/1.15 Georgia,serif;margin:14px 0 11px;color:#fff}.maria-timer>p{font:13px/1.6 system-ui;color:#ffe5ec;margin:0 auto 18px}.maria-clock{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:5px 0 18px}.maria-clock>div{padding:12px 3px;border:1px solid #ffffff55;background:#ffffff19;border-radius:12px}.maria-clock strong{display:block;font:650 clamp(24px,3vw,38px)/1.15 system-ui;color:white;font-variant-numeric:tabular-nums}.maria-clock span{font:700 9px/1.5 system-ui;letter-spacing:.07em;text-transform:uppercase;color:#ffe6ec}.maria-ornament{font-size:21px;margin-top:5px}
.maria-video{background:#fff;border:1px solid #eadbe0;display:flex;flex-direction:column;box-shadow:0 12px 30px #633f530d}.maria-video-head{display:flex;justify-content:space-between;gap:12px;padding:14px 17px;font:700 11px/1.5 system-ui;letter-spacing:.07em;color:#995e79}.maria-video-media{width:100%;aspect-ratio:16/9;background:#271721}.maria-video-media button{display:block;position:relative;width:100%;height:100%;border:0;padding:0;cursor:pointer;color:white;background:#271721}.maria-video-media img{width:100%;height:100%;display:block;object-fit:cover;filter:brightness(.8)}.maria-play-icon{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);display:grid;place-items:center;width:80px;height:58px;border-radius:17px;background:#ac3158;color:white;font-size:24px;box-shadow:0 8px 30px #0004}.maria-play-label{position:absolute;bottom:14px;left:16px;color:white;text-shadow:0 2px 10px #000;font:700 12px/1.5 system-ui}.maria-video-media iframe{width:100%;height:100%;border:0;display:block}.maria-video-details{display:flex;justify-content:space-between;gap:15px;align-items:center;padding:16px 18px;flex:1}.maria-video-details h3{font:normal 24px/1.2 Georgia,serif;color:#5e354a;margin:0 0 6px}.maria-video-details p{font:12px/1.5 system-ui;color:#755e6d;margin:0}.maria-video-details a{background:#783d5a;color:white!important;padding:12px 15px;border-radius:99px;text-decoration:none;font:700 11px/1.3 system-ui;white-space:nowrap}
@media(max-width:840px){.maria-featured-cols{grid-template-columns:1fr}#maria-featured-2026{margin:24px 12px 45px;padding:22px 14px}.maria-timer{min-height:300px}}@media(max-width:460px){.maria-video-details{flex-wrap:wrap}.maria-video-details a{width:100%;text-align:center}.maria-clock{gap:4px}.maria-clock>div{padding:10px 2px}.maria-clock strong{font-size:25px}.maria-clock span{font-size:8px}}
</style>`;
const js=`<script id="maria-feature-script">
(()=>{'use strict';const s=document.getElementById('maria-featured-2026');if(!s)return;
const target=Date.parse('2026-12-24T23:00:00Z'),finish=Date.parse('2026-12-25T23:00:00Z');
const parts=['d','h','m','s'].map(k=>s.querySelector('[data-time="'+k+'"]')),msg=document.getElementById('maria-countdown-status');
function tick(){const now=Date.now(),secs=Math.max(0,Math.floor((target-now)/1000));const v=[Math.floor(secs/86400),Math.floor(secs/3600)%24,Math.floor(secs/60)%60,secs%60];parts.forEach((p,i)=>p.textContent=String(v[i]).padStart(2,'0'));if(now>=target)msg.textContent=now<finish?'Merry Christmas! Wishing you wonderful moments.':'Season’s greetings from MariaSM!'}tick();setInterval(tick,1000);
const button=document.getElementById('maria-video-play'),holder=document.getElementById('maria-video-media');
button.addEventListener('click',()=>{const player=document.createElement('iframe');player.src='https://www.youtube-nocookie.com/embed/n2Wg46fwmb0?autoplay=1&rel=0';player.title='MariaSM featured YouTube video';player.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';player.allowFullscreen=true;player.referrerPolicy='strict-origin-when-cross-origin';holder.replaceChildren(player)},{once:true});
})();
</script>`;
const marker='<section class="wrap yt-channel-spotlight" id="channel"';
if(!html.includes(marker))throw Error('Main video spotlight anchor missing');
html=html.replace(marker,block+'\n'+marker).replace('</head>',css+'</head>').replace('</body>',js+'</body>');
if(!html.includes('data-time="d"')||!html.includes('n2Wg46fwmb0'))throw Error('Feature incomplete');
fs.writeFileSync(page,html,'utf8');
console.log('Homepage featured Christmas countdown and YouTube video n2Wg46fwmb0 injected and linked.');
