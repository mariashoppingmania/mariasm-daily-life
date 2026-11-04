import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs'),dir=path.join(docs,'hair');
fs.mkdirSync(dir,{recursive:true});
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cuts=[
['Pixie','Cropped, precise and adaptable to a soft or structured finish'],['Bixie','Short pixie-bob hybrid with textured movement'],['French bob','Jaw-length shape with an optional fringe'],['Blunt bob','One-length perimeter with visual density'],['Italian bob','Full, airy shape with natural volume'],['Graduated bob','Stacked weight at the nape'],['Long bob','Collarbone length, versatile and softly structured'],['Shag','Airy, crown-focused layering'],['Wolf cut','Shag and mullet influences with contrast'],['Curtain fringe','Face-framing centre-parted bangs'],['Butterfly cut','Long length with shorter floating layers'],['Long layers','Movement without losing perimeter length'],['Rounded curly cut','Designed for natural shrinkage and volume'],['Tapered coils','Shorter nape with curl volume above'],['Modern mullet','Short framing with a longer back'],['Long U-shape','Curved perimeter for longer lengths']
];
const colours=[
['Espresso','#33241f'],['Chocolate','#67412c'],['Mushroom brown','#847b72'],['Chestnut','#98623d'],['Copper','#bd713c'],['Ginger','#d99a68'],['Cherry cola','#722d40'],['Honey blonde','#c6a264'],['Beige blonde','#d6c39d'],['Champagne blonde','#e8d7b5'],['Pearl blonde','#e7e3df'],['Strawberry blonde','#dca78e'],['Raven black','#252329'],['Silver','#a9aab1'],['Rose brunette','#976873'],['Lavender','#b5a7ce']
];
const methods=[
['Balayage','Hand-painted lighter sections with soft transitions'],['Foilyage','Painted sections enclosed in foil to aid lift'],['Babylights','Fine woven highlights for natural dimension'],['Money piece','Face-framing lightness at the front'],['Root shadow','Blended darker roots and lighter lengths'],['Gloss','Shine and tone refinement, not a substitute for bleaching'],['Permanent colour','Oxidative colour for lasting pigment change'],['Demi colour','Lower-lift or deposit-focused colour'],['Direct dye','Temporary or semi-permanent creative pigment'],['Bleaching','Chemical lightening; assess damage and history'],['Keratin smoothing','Salon smoothing, varied formulations and precautions'],['Perm','Chemical restructuring for waves or curls'],['Silk press','Temporary smooth finish for textured hair'],['Dry curl cut','Cutting adapted to natural curl shrinkage'],['Blowout','Airflow and brush tension for shape and volume'],['Roller set','Curls and volume set by drying and cooling']
];
const eras=[
['Ancient worlds','Egyptian wigs, Greek and Roman arrangements and diverse African hair traditions expressed identity and craft.'],
['Medieval and Renaissance','Braids, coifs, coverings, pins and regional customs varied widely across cultures.'],
['Eighteenth century','Elaborate European powdered styles coexisted with practical everyday hair arrangements.'],
['1920s to 1940s','Bobs, finger waves, set curls and sculpted formal styles reshaped fashion in many cities.'],
['1950s to 1970s','Bouffants, beehives, afros, natural-hair movements and long straight silhouettes gained cultural significance.'],
['1980s to 2000s','Perms, layered blowouts, crimping, highlights and precision straightening followed music and popular culture.'],
['Modern era','Natural textures, protective styles, sharp bobs, colour techniques and personal expression coexist today.']
];
const care=[
['Understand your hair','Texture, strand diameter, density, natural shrinkage, colour history and styling time all matter.'],
['Shampoo to suit your scalp','Oil, exercise and product buildup affect washing frequency; there is no one-size-fits-all rule.'],
['Condition regularly','A conditioner after shampoo reduces friction, tangling and breakage.'],
['Detangle gently','Use suitable slip, tools and sections; avoid pulling on knots.'],
['Control heat','Choose the lowest practical tool temperature, limit passes and use thermal protection.'],
['Avoid painful tension','Tight ponytails, heavy extensions and tight braids can damage fragile hairlines.'],
['Protect treated hair','Minimise repeat bleaching, excessive heat and unplanned combinations of chemical treatments.'],
['Know when to get help','Persistent itching, scaling, shedding or scalp pain merits professional assessment.']
];
const looks=[['Sleek low bun','A classic updo without painful tension'],['French twist','Pinned vertical sculptural style'],['Braided crown','Braids worn gently around the head'],['Soft waves','Relaxed textured movement'],['Defined curls','Conditioned, styled natural curls'],['Bouncy blowout','Round-brush volume with cooling'],['Half-up style','Face framing and loose lengths'],['Textured ponytail','Volume without tight pulling']];
const faq=[
['How frequently should I wash?','According to scalp oil, activity and buildup; texture and personal needs vary.'],
['Do frequent trims speed growth?','No. Trimming improves the ends but does not speed growth from the follicle.'],
['Can split ends be permanently repaired?','They can be temporarily smoothed, but trimming removes them.'],
['Does purple shampoo bleach hair?','No. It deposits pigment that can neutralise visible yellow tones.'],
['Should I patch test a familiar dye?','Yes; sensitivity can develop after repeated use. Follow package instructions every time.'],
['Does any protective style prevent damage?','Not if it causes tension or irritation; gentle installation and scalp care matter.'],
['Can I do dramatic bleach corrections myself?','Previously coloured or fragile hair often needs a qualified colourist and a staged plan.'],
['What if colouring causes burning?','Stop, follow safety directions and seek medical advice for significant symptoms.']
];
const cards=(a,tag)=>'<div class="hair-cards">'+a.map(([a,b],i)=>'<article class="hair-card"><small>'+tag+' '+String(i+1).padStart(2,'0')+'</small><h3>'+E(a)+'</h3><p>'+E(b)+'</p></article>').join('')+'</div>';
const section=(id,k,title,lead,body)=>'<section class="hair-section" id="'+id+'"><header><small>'+E(k)+'</small><h2>'+E(title)+'</h2><p>'+E(lead)+'</p></header>'+body+'</section>';
const imgSources=[
 ['hero','https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85'],
 ['cuts','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=82'],
 ['curl','https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=82'],
 ['colour','https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=82']
];
const folder=path.join(dir,'assets');fs.mkdirSync(folder,{recursive:true});
async function loadPhoto([key,url]){
 const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
 try{const r=await fetch(url,{signal:c.signal});if(!r.ok||!(r.headers.get('content-type')||'').startsWith('image/'))return [key,url,false];const data=Buffer.from(await r.arrayBuffer());if(data.length<4000||data.length>8e6)return [key,url,false];const file='assets/'+key+'.jpg';fs.writeFileSync(path.join(dir,file),data);return [key,file,true]}catch{return [key,url,false]}finally{clearTimeout(t)}
}
const downloaded=await Promise.all(imgSources.map(loadPhoto));
const photos=Object.fromEntries(downloaded.map(([key,src])=>[key,src]));
const image=(k,alt)=>'<div class="hair-photo"><img loading="lazy" decoding="async" alt="'+E(alt)+'" src="'+E(photos[k])+'" onerror="this.onerror=null;this.hidden=true;this.parentElement.classList.add(&quot;hair-photo-missing&quot;)"></div>';
const sections=[
 section('history','01 · HISTORY','Hair through the centuries','A global history of beauty, identity and craft.',cards(eras,'PERIOD')),
 section('cuts','02 · HAIRCUTS','Cuts and silhouettes','Sixteen styles from short pixies to long layers and natural curls.',image('cuts','Haircut salon photography')+image('curl','Natural hair texture photography')+cards(cuts,'CUT')),
 section('colour','03 · COLOUR','Colour studio','Explore colour families: these swatches indicate direction, not a guaranteed formula.','<div class="hair-swatches">'+colours.map(([name,hex])=>'<article><span style="background:'+hex+'"></span><strong>'+E(name)+'</strong></article>').join('')+'</div>'+image('colour','Hair colour editorial photography')+'<p>Discuss the starting base, porosity, previous dyes, bleach history, maintenance and realistic results with a professional before choosing a shade.</p>'),
 section('techniques','04 · SALON METHODS','Techniques explained','Professional colouring, cutting and styling approaches.',cards(methods,'TECHNIQUE')+'<aside class="hair-alert"><h3>Colour safety</h3><p>Follow label directions. Conduct the specified allergy alert test before every hair dye application. Do not colour on irritated skin or dye brows and lashes at home. Seek a qualified professional for major lightening, chemical straightening or perming.</p></aside>'),
 section('styles','05 · STYLING','The hairstyle guide','Formal looks and everyday styling without unnecessary tension.',cards(looks,'STYLE')),
 section('care','06 · HEALTHY HAIR','Hair and scalp care','Practical, gentle habits for different textures, densities and routines.',cards(care,'GUIDE')),
 section('consult','07 · CHECKLIST','Before the salon appointment','A checklist you can print and bring to your stylist.','<div class="hair-checks">'+['Natural curl pattern, density and hair condition','Past dye, bleach, henna, perms and relaxers','Scalp or skin sensitivity and reactions','Reference images and results to avoid','Preferred length and time available for styling','Budget and maintenance schedule','Colour allergy testing and realistic expectations','Aftercare recommendations'].map(x=>'<label><input type="checkbox">'+E(x)+'</label>').join('')+'</div><button type="button" onclick="window.print()">Print the checklist</button>'),
 section('faq','08 · QUESTIONS','Useful answers','Know the difference between effective care and popular myths.','<div class="hair-faq">'+faq.map(([q,a])=>'<details><summary>'+E(q)+'</summary><p>'+E(a)+'</p></details>').join('')+'</div>'),
 section('shop','09 · RESOURCES','Explore hair care & styling','Official brand and education resources; these are not unverified merchandise listings.','<div class="hair-cards">'+[['Wella Professionals','https://www.wella.com/professional/'],['L’Oréal Professionnel','https://www.lorealprofessionnel.com/'],['Schwarzkopf Professional','https://www.schwarzkopf-professional.com/'],['ghd','https://www.ghdhair.com/'],['Denman','https://denmanbrush.com/'],['Curlsmith','https://curlsmith.com/']].map(([n,u])=>'<article class="hair-card"><small>OFFICIAL WEBSITE</small><h3>'+E(n)+'</h3><a href="'+E(u)+'" target="_blank" rel="noopener noreferrer">Explore ↗</a></article>').join('')+'</div><p>Research: <a href="https://www.aad.org/public/everyday-care/hair-scalp-care/hair">American Academy of Dermatology</a> · <a href="https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes">FDA hair dye safety</a>.</p>')
];
const style='<style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff9fb;color:#633e52;font-family:system-ui,sans-serif}a{color:#7d4260}.wrap{max-width:1210px;margin:auto;padding:0 20px}.hair-top{padding:17px 0;background:#fff;border-bottom:1px solid #ead4df;position:sticky;top:0;z-index:10}.hair-top .wrap{display:flex;align-items:center;justify-content:space-between}.hair-top a{text-decoration:none;font:700 13px system-ui}.hair-top .brand{font:29px Georgia,serif}.hair-hero{background:linear-gradient(115deg,#fff4f9,#f2e2eb);padding:60px 0}.hair-hero .wrap{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}.hair-hero h1{font:normal clamp(44px,5vw,74px)/1.1 Georgia,serif;margin:14px 0}.hair-hero em{color:#b26989}.hair-hero p{font:16px/1.75 system-ui}.hair-photo{background:#efdfe8;border-radius:16px;overflow:hidden;height:280px;margin:12px 0}.hair-hero .hair-photo{height:370px}.hair-photo img{display:block;width:100%;height:100%;object-fit:cover}.hair-photo-missing{height:60px}.hair-navigation{display:flex;gap:7px;flex-wrap:wrap;padding:15px 20px;border-bottom:1px solid #e9d5df}.hair-navigation a{text-decoration:none;border:1px solid #e9d5df;background:white;border-radius:30px;padding:9px 13px;font:700 12px system-ui}.hair-section{padding:58px 0 32px;border-bottom:1px solid #ead6e0;scroll-margin-top:85px}.hair-section header{margin-bottom:27px;max-width:770px}.hair-section header small,.hair-card small{color:#a86985;font:700 11px system-ui;letter-spacing:.13em}.hair-section h2{font:normal clamp(33px,4vw,48px) Georgia,serif;margin:12px 0}.hair-section header p{line-height:1.7}.hair-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.hair-card{background:#fff;border:1px solid #e9d4df;padding:20px;border-radius:16px;min-width:0}.hair-card h3{font:normal 23px/1.2 Georgia,serif;margin:10px 0}.hair-card p{font:13px/1.7 system-ui;color:#78596a}.hair-swatches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-bottom:25px}.hair-swatches article{border:1px solid #e9d4df;border-radius:16px;overflow:hidden;background:#fff}.hair-swatches span{display:block;height:95px}.hair-swatches strong{display:block;padding:14px;font:normal 20px Georgia,serif}.hair-alert{background:#f5e5ed;border-left:4px solid #a76a82;border-radius:12px;padding:24px;margin-top:25px}.hair-alert p{line-height:1.8}.hair-checks{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hair-checks label{display:flex;gap:12px;background:white;border:1px solid #e8d4df;padding:16px;border-radius:12px}.hair-checks input{accent-color:#864761}.hair-section button{margin-top:18px;border:0;border-radius:30px;background:#793b5d;color:#fff;padding:12px 18px;cursor:pointer}.hair-faq details{padding:17px;border:1px solid #e8d3dd;background:#fff;border-radius:12px;margin-bottom:10px}.hair-faq summary{font-weight:700;cursor:pointer}.hair-faq p{line-height:1.7}.hair-footer{background:#633e53;color:#fff;padding:30px;text-align:center}.hair-footer a{color:#fff}@media(max-width:1020px){.hair-cards,.hair-swatches{grid-template-columns:repeat(3,1fr)}}@media(max-width:750px){.hair-hero .wrap{grid-template-columns:1fr}.hair-cards,.hair-swatches{grid-template-columns:repeat(2,minmax(0,1fr))}.hair-checks{grid-template-columns:1fr}}@media(max-width:450px){.hair-cards,.hair-swatches{grid-template-columns:1fr}.hair-hero .hair-photo{height:270px}}@media print{.hair-navigation,.hair-top,.hair-footer,button{display:none}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style>';
const nav=[['history','History'],['cuts','Cuts'],['colour','Colour'],['techniques','Techniques'],['styles','Styles'],['care','Care'],['consult','Consultation'],['faq','FAQ'],['shop','Resources']].map(([id,label])=>'<a href="#'+id+'">'+label+'</a>').join('');
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hair Atelier | MariaSM</title><meta name="description" content="Hair Atelier: the complete guide to haircuts, colours, hairstyles, techniques, history and hair care.">'+style+'</head><body><header class="hair-top"><div class="wrap"><a class="brand" href="../index.html">MariaSM</a><a href="../index.html">← Back home</a></div></header><main><section class="hair-hero"><div class="wrap"><div><small>THE BEAUTY ATELIER · HAIR</small><h1>Hair, an art of <em>self-expression.</em></h1><p>Discover cuts, colour palettes, hairstyles, salon techniques, historical perspectives and useful care guides, all in one English-language atlas.</p><a href="#cuts">Explore the atelier ↓</a></div>'+image('hero','Contemporary hairstyling salon photograph')+'</div></section><nav class="hair-navigation wrap" aria-label="Hair Atelier sections">'+nav+'</nav><div class="wrap">'+sections.join('')+'</div></main><footer class="hair-footer">MariaSM Hair Atelier · <a href="../index.html">Return to the homepage</a></footer></body></html>';
fs.writeFileSync(path.join(dir,'index.html'),html);
function pages(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(path.join(d,e.name)):e.isFile()&&e.name.endsWith('.html')?[path.join(d,e.name)]:[])}
let menus=0;
for(const p of pages(docs)){
 if(p===path.join(dir,'index.html'))continue;let s=fs.readFileSync(p,'utf8');
 let href=path.relative(path.dirname(p),path.join(dir,'index.html')).split(path.sep).join('/');
 if(!href.startsWith('.'))href='./'+href;
 if(s.includes('class="hair-nav-added"'))continue;
 const link='<a class="hair-nav-added" href="'+href+'">Hair Atelier</a>';
 const pattern=/(<a\b[^>]*href=["'][^"']*watches\/index\.html[^"']*["'][^>]*>[\s\S]*?<\/a>)/g;
 if(pattern.test(s))s=s.replace(pattern,x=>x+link);
 else if(s.includes('data-menu="ateliers"'))s=s.replace(/(<details class="ms-nav-group" data-menu="ateliers">[\s\S]*?<div class="ms-nav-panel">)/,(_,x)=>x+link);
 else continue;
 fs.writeFileSync(p,s);menus++;
}
const home=path.join(docs,'index.html');let h=fs.readFileSync(home,'utf8');
if(!h.includes('id="hair-atelier-home-feature"')){
 h=h.replace('</main>','<section id="hair-atelier-home-feature" class="wrap" style="max-width:1220px;margin:32px auto;padding:25px;border-radius:22px;background:#f6e9ef;border:1px solid #e6cdda"><small>NEW BEAUTY ATELIER</small><h2 style="font:normal 36px Georgia,serif">Discover Hair Atelier</h2><p>Cuts, colours, hairstyles, techniques, history and caring for your hair.</p><a href="hair/index.html">Explore Hair Atelier ↗</a></section></main>');
 fs.writeFileSync(home,h);
}
console.log('Hair Atelier created: '+cuts.length+' cuts, '+colours.length+' shades, '+methods.length+' techniques, '+faq.length+' FAQs; '+downloaded.filter(x=>x[2]).length+'/'+imgSources.length+' photo assets archived; '+menus+' menus updated.');
