/* MariaSM Christmas 2026: interactive snow, fairy lights and an original instrumental.
 * Effects run on every generated page. Audio only plays after a user click.
 */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.remove('halloween');
  root.classList.add('christmas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const snow = document.createElement('canvas');
  snow.id = 'christmas-snow';
  snow.setAttribute('aria-hidden', 'true');
  document.body.append(snow);
  const lights = document.createElement('div');
  lights.id = 'christmas-lights';
  lights.setAttribute('aria-hidden', 'true');
  const colors = ['#ffe3a3','#fbc4c8','#bceee3','#cfe2fd','#fff7d7','#dbabbf'];
  for (let i=0;i<38;i++){
    const bulb=document.createElement('i');
    bulb.style.setProperty('--bulb',colors[i%colors.length]);
    bulb.style.setProperty('--delay',((-i*0.32)%2.4)+'s');
    bulb.style.setProperty('--tilt',(i%3-1)*8+'deg');
    lights.append(bulb);
  }
  document.body.append(lights);
  const stage = snow.getContext('2d', { alpha:true });
  let w = 0, h = 0, ratio = 1, snowEnabled = !reduceMotion, raf = 0;
  const flakes = [];
  function size(){
    ratio = Math.min(window.devicePixelRatio||1,2);
    w = window.innerWidth; h = window.innerHeight;
    snow.width = Math.round(w*ratio); snow.height=Math.round(h*ratio);
    snow.style.width = w+'px'; snow.style.height=h+'px';
    stage?.setTransform(ratio,0,0,ratio,0,0);
    flakes.length=0;
    const count=Math.min(w<600?45:92,Math.ceil(w*h/14500));
    for(let i=0;i<count;i++){
      flakes.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.8+1.0,s:Math.random()*0.9+.40,d:Math.random()*1.1+.25,phase:Math.random()*6.28});
    }
  }
  function paint(t){
    if(!snowEnabled||!stage){raf=0;return;}
    stage.clearRect(0,0,w,h);
    const wave=t/1900;
    for(const f of flakes){
      f.y+=f.s;f.x+=Math.sin(wave+f.phase)*.28+f.d*.16;
      if(f.y>h+12){f.y=-10;f.x=Math.random()*w}
      if(f.x>w+10)f.x=-10;
      stage.beginPath();stage.arc(f.x,f.y,f.r,0,Math.PI*2);
      stage.fillStyle='rgba(255,255,255,.86)';stage.shadowColor='rgba(111,161,174,.36)';
      stage.shadowBlur=4;stage.fill();
    }
    stage.shadowBlur=0;
    raf=requestAnimationFrame(paint);
  }
  function setSnow(value){
    snowEnabled=!!value&&!reduceMotion;
    snow.hidden=!snowEnabled;
    if(!snowEnabled&&raf){cancelAnimationFrame(raf);raf=0;stage?.clearRect(0,0,w,h)}
    if(snowEnabled&&!raf)raf=requestAnimationFrame(paint);
    document.querySelectorAll('[data-xmas-action="snow"]').forEach(b=>{
      b.setAttribute('aria-pressed', String(snowEnabled));
      b.textContent=snowEnabled?'❄ Pause snowfall':'❄ Start snowfall';
    });
  }
  window.addEventListener('resize',size,{passive:true});
  size();
  if(reduceMotion) snow.hidden=true; else raf=requestAnimationFrame(paint);

  // Tiny original winter waltz, not a recording or melody of "White Christmas".
  let ctx=null,musicTimer=null,musicOn=false;
  const phrase=[ [0,60,0.45],[.55,64,.40],[1.10,67,.48],[1.65,69,.48],[2.2,67,.7],[3.0,64,.45],
    [3.55,62,.45],[4.1,65,.48],[4.65,69,.5],[5.2,72,.55],[5.82,69,.54],[6.48,67,.60],
    [7.3,64,.55],[8.0,67,.50],[8.6,72,.65],[9.35,71,.65],[10.2,69,.60],[10.95,67,1.0] ];
  const notes=[48,53,55,50];
  function tone(midi,time,dur,vol=.026,type='sine'){
    if(!ctx)return;
    const freq=440*Math.pow(2,(midi-69)/12);
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type=type;osc.frequency.value=freq;
    gain.gain.setValueAtTime(.0001,time);
    gain.gain.exponentialRampToValueAtTime(vol,time+.045);
    gain.gain.exponentialRampToValueAtTime(.0001,time+dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);osc.stop(time+dur+.03);
  }
  function schedulePhrase(){
    if(!musicOn||!ctx)return;
    const t=ctx.currentTime+.08;
    phrase.forEach(([offset,n,dur])=>tone(n,t+offset,dur,.021,'triangle'));
    for(let i=0;i<4;i++){
      const note=notes[i];
      tone(note,t+i*3,2.65,.010);
      tone(note+7,t+i*3+.08,2.35,.007);
    }
  }
  function updateMusicButtons(){
    document.querySelectorAll('[data-xmas-action="music"]').forEach(b=>{
      b.setAttribute('aria-pressed',String(musicOn));
      b.textContent=musicOn?'♫ Stop holiday music':'♫ Play holiday music';
      b.title='Original gentle Christmas instrumental (click to play or pause)';
    });
  }
  async function setMusic(on){
    if(!on){
      musicOn=false;
      if(musicTimer){clearInterval(musicTimer);musicTimer=null}
      const old=ctx;ctx=null;
      if(old){try{await old.close()}catch(_e){}}
      updateMusicButtons();return;
    }
    if(!window.AudioContext&&!window.webkitAudioContext)return;
    try{
      ctx=new (window.AudioContext||window.webkitAudioContext)();
      await ctx.resume();
      musicOn=true;schedulePhrase();
      musicTimer=setInterval(schedulePhrase,12000);
    }catch(_e){musicOn=false}
    updateMusicButtons();
  }
  document.addEventListener('click',ev=>{
    const button=ev.target.closest('[data-xmas-action]');
    if(!button)return;
    if(button.dataset.xmasAction==='snow')setSnow(!snowEnabled);
    if(button.dataset.xmasAction==='music')void setMusic(!musicOn);
  });
  updateMusicButtons();
  setSnow(snowEnabled);

  const glyphs=['🎅','🦌','☃️','🧦','🍪','🎁','🎄','🔔','🌿','🍬','❄️','⭐'];
  const sections=[...document.querySelectorAll('main section,main article,main .atelier-collections-head')].filter(el=>{
    const rect=el.getBoundingClientRect();return rect.width>240 && !el.closest('.christmas-welcome') && !el.classList.contains('christmas-welcome');
  });
  let placed=0;
  for(let i=0;i<sections.length&&placed<22;i++){
    if(i%2!==0)continue;
    const el=sections[i],icon=document.createElement('span');
    icon.className='christmas-section-decor'+(i%4===0?' left':'')+(i%5===0?' little':'');
    icon.setAttribute('aria-hidden','true');
    icon.textContent=glyphs[placed%glyphs.length];
    const style=window.getComputedStyle(el);
    if(style.position==='static')el.style.position='relative';
    el.append(icon);placed++;
  }
  const extra=document.createElement('div');
  extra.className='christmas-corner-ornament';
  extra.innerHTML='<button type="button" class="christmas-music-toggle" data-xmas-action="music" aria-pressed="false">♫ Play holiday music</button><button type="button" class="christmas-snow-toggle" data-xmas-action="snow" aria-pressed="true">❄ Pause snowfall</button>';
  document.body.append(extra);
  updateMusicButtons();
  setSnow(snowEnabled);
})();
