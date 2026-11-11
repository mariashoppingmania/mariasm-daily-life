// Repair the ORIGINAL home "Press play. Stay a little." #watch section.
// Unlike the old hard-coded selection, the first cards always mirror the freshly
// verified YouTube Videos tab, which is refreshed before every GitHub Pages build.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const homePath=path.join(root,'docs','index.html');
const site=JSON.parse(fs.readFileSync(path.join(root,'content','site.json'),'utf8'));
let html=fs.readFileSync(homePath,'utf8');
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validId=x=>/^[A-Za-z0-9_-]{11}$/.test(String(x));
const labels={shopping:'Shopping finds',beauty:'Beauty & fragrance',accessories:'Watches & accessories',style:'Personal style',life:'Daily life'};
function classify(v){
 const title=String(v.title||'').toLowerCase();
 if(/\bwatch(?:es)?\b|timepiece|bracelet|earrings?|necklace|jewellery|jewelry|handbag|bag collection/.test(title))return 'accessories';
 if(/makeup|make-up|perfume|fragrance|beauty|lipstick|skincare|scent|cosmetic/.test(title)&&!/haul|amazon|asos|nk[d]?/.test(title))return 'beauty';
 if(/haul|shopping|amazon|asos|unbox|haul|package|fashion finds|purchases|collective haul/.test(title))return 'shopping';
 if(/outfit|ootd|try.on|lookbook|style|wardrobe|fashion tips|dress|shoes/.test(title))return 'style';
 if(Object.hasOwn(labels,v.filter)&&!(v.category==='Latest upload'&&v.filter==='life'))return v.filter;
 return 'life';
}
const catalogue=new Map((site.videos||[]).filter(v=>validId(v.id)).map(v=>[v.id,v]));
const newest=(site.newVideos||[]).filter(validId).filter(id=>catalogue.has(id));
if(newest.length<2)throw Error('Fresh public YouTube video list missing; refusing to publish stale home diary');
const entries=[...newest.map(id=>catalogue.get(id))];
const labelsHTML=[
 ['all','All moments'],
 ['shopping',labels.shopping],
 ['beauty',labels.beauty],
 ['accessories',labels.accessories],
 ['style',labels.style],
 ['life',labels.life]
].map(([key,title],i)=>'<button type="button" class="filter" aria-pressed="'+String(i===0)+'" data-filter="'+key+'">'+E(title)+'</button>').join('');
const fmtDate=s=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return 'latest update';
 return new Date(s+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
};
const cards=entries.map((v,i)=>{
 const category=classify(v);
 const title=E(v.title);
 const duration=String(v.duration||'');
 const durationHTML=/^\d{1,3}:\d\d(?::\d\d)?$/.test(duration)?'<span class="duration">'+E(duration)+'</span>':'';
 const label=(v.publishedLabel&&v.publishedLabel!=='New on YouTube')?v.publishedLabel:'New on YouTube';
 const videoUrl='https://www.youtube.com/watch?v='+v.id;
 return '<article class="video-card" data-category="'+category+'" data-video-id="'+v.id+'">'
 +'<a class="video-image" href="'+videoUrl+'" target="_blank" rel="noopener noreferrer" aria-label="Watch '+title+' on YouTube">'
 +'<img src="https://img.youtube.com/vi/'+v.id+'/hqdefault.jpg" alt="Actual YouTube thumbnail for '+title+'" width="640" height="360" loading="lazy">'+durationHTML+'</a>'
 +'<p class="eyebrow">'+E(labels[category])+(i===0?' · Newest upload':'')+'</p>'
 +'<h3><a href="'+videoUrl+'" target="_blank" rel="noopener noreferrer">'+title+'</a></h3>'
 +'<p class="video-meta">'+E(label)+'</p>'
 +'<a class="text-link" href="'+videoUrl+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></article>';
}).join('');
const section='<section class="wrap section" id="watch" data-video-feed="site.newVideos" aria-labelledby="watch-title">'
 +'<div class="section-head"><div><p class="eyebrow">From my YouTube diary</p><h2 id="watch-title">Press play. Stay a little.</h2></div>'
 +'<p>Real moments, small discoveries, and a little company for your day. Always fresh from the channel.</p></div>'
 +'<div class="filters" role="group" aria-label="Filter videos by topic">'+labelsHTML+'</div>'
 +'<div class="video-grid" id="watch-videos">'+cards+'</div>'
 +'<p class="snapshot-note">The '+newest.length+' newest public videos in upload order, refreshed '+E(fmtDate(site.verifiedOn))
 +' · Find more on <a href="'+E(site.youtube)+'/videos" target="_blank" rel="noopener noreferrer">MariaSM YouTube ↗</a>.</p>'
 +'</section>';
const oldSection=/<section\b[^>]*\bid="watch"[^>]*>[\s\S]*?<\/section>/;
if(oldSection.test(html))html=html.replace(oldSection,section);
else{
 const target='<div class="wrap yt-ateliers-intro">';
 if(!html.includes(target))throw Error('Cannot locate home video diary placement');
 html=html.replace(target,section+'\n'+target);
}
if((html.match(/\bid="watch"/g)||[]).length!==1)throw Error('More than one original watch section');
if(html.includes('id="press-play-stay-a-little"')||html.includes('ms-pp-videos'))throw Error('Duplicated Press Play block remains');
const watchHTML=html.match(/<section\b[^>]*\bid="watch"[^>]*>[\s\S]*?<\/section>/)?.[0]||'';
const allIDs=[...watchHTML.matchAll(/data-video-id="([^"]+)"/g)].map(m=>m[1]);
if(allIDs.length!==newest.length||allIDs[0]!==site.newVideos[0])throw Error('Watch section does not match latest channel videos');
if(allIDs.some((id,i)=>id!==newest[i]))throw Error('Video order mismatched channel Videos tab');
fs.writeFileSync(homePath,html);
console.log('[Press Play] Original filtered home diary updated:',allIDs.length,'latest videos; first:',allIDs[0],JSON.stringify(catalogue.get(allIDs[0]).title),'checked',site.verifiedOn);
