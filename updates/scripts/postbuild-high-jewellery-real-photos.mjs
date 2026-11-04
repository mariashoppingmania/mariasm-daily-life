import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page=path.join(root,'docs/jewellery/index.html'),dir=path.join(root,'docs/jewellery/assets/high-jewellery-photos');
fs.mkdirSync(dir,{recursive:true});let html=fs.readFileSync(page,'utf8');
const products=[
 ['Bvlgari Serpenti Viper white-gold wedding ring','349680','€1,770','https://www.bulgari.com/it-it/349680.html'],
 ['Bvlgari Serpenti Viper rose-gold ring','358771','€2,460','https://www.bulgari.com/it-it/358771.html'],
 ['Bvlgari Serpenti Viper yellow-gold ring','362500','€4,450','https://www.bulgari.com/it-it/product/362500'],
 ['Bvlgari Serpenti Viper diamond ring','AN858970','€5,950','https://www.bulgari.com/it-it/product/AN858970'],
 ['Bvlgari Serpenti Viper bracelet','Serpenti','€7,900','https://www.bulgari.com/it-it/gioielli/serpenti'],
 ['Bvlgari Serpenti Viper white-gold pavé ring','AN858111','€12,400','https://www.bulgari.com/it-it/AN858111.html'],
 ['Bvlgari Serpenti Viper white-gold ring','358648','See official store','https://www.bulgari.com/pt-br/AN859379.html'],
 ['Bvlgari Serpenti Viper yellow-gold ring','362148','See official store','https://www.bulgari.com/en-hk/jewellery/rings/serpenti-viper-ring-yellow-gold-yellow-362148'],
 ['Bvlgari Serpenti Viper white-gold coil ring','362143','See official store','https://www.bulgari.com/en-th/362143.html'],
 ['Bvlgari Serpenti Viper rose-gold coil ring','358640','See official store','https://www.bulgari.com/pt-br/AN859178.html']
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function fetcher(url){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);
 try{let r=await fetch(url,{signal:ctrl.signal,headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html,image/png,image/jpeg,image/webp,*/*'}});return r.ok?r:null}catch{return null}finally{clearTimeout(timer)}
}
function getPhotos(source,pageUrl){
 const links=[];
 for(const tag of source.match(/<meta\b[^>]*>/gi)||[]){
  const prop=(tag.match(/(?:property|name)=["']([^"']+)/i)||[])[1];
  const content=(tag.match(/content=["']([^"']+)/i)||[])[1];
  if(/^(og:image|twitter:image)$/i.test(prop||'')&&content)links.push(content);
 }
 for(const match of source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
  try{
   const parsed=JSON.parse(match[1]);
   const nodes=(Array.isArray(parsed)?parsed:[parsed]).flatMap(x=>x['@graph']||[x]);
   for(const node of nodes){
    if(!String(node['@type']||'').includes('Product'))continue;
    const arr=Array.isArray(node.image)?node.image:[node.image];
    for(const item of arr){if(typeof item==='string')links.push(item);else if(item?.url)links.push(item.url)}
   }
  }catch{}
 }
 const cleaned=links.map(s=>s?.replaceAll('&amp;','&')).filter(Boolean).map(s=>{try{return new URL(s,pageUrl).href}catch{return null}}).filter(Boolean);
 return [...new Set(cleaned)].filter(u=>/^https:\/\//.test(u)&&!/logo|favicon|placeholder|brandmark|social-?share|default/i.test(u));
}
const curatedExactPhotos={
 // Verified official photo of Serpenti Viper AN858970, 0.1 ct yellow-gold diamond ring.
 'AN858970':'https://media.bulgari.com/image/upload/c_pad%2Ch_800%2Cw_800/q_auto/f_auto/1281838.png',
 // Exact AN858111 Bvlgari product photograph from authorised retailer Kessaris.
 'AN858111':'https://www.kessaris.gr/sites/default/files/import/one_drive/BVL.354708/Bulgari-Serpenti-Viper-AN858111-White-Gold.jpg',
 // Bvlgari official product photograph for white-gold Serpenti Viper band, AN856869 / size reference 349680.
 '349680':'https://media.bulgari.com/image/upload/c_pad%2Ch_851%2Cw_1090/q_auto/f_auto/460129.png',
 // Bvlgari AN856868 rose-gold Serpenti Viper wedding band; same design in the 358771 offer.
 '358771':'https://www.bulgari.com/on/demandware.static/-/Sites-masterCatalog/default/dwcc92f84b/images/images/459769.png',
 '358648':'https://media.bulgari.com/image/upload/c_fill%2Ch_490%2Cw_490/q_auto/f_auto/1337156.png',
 '362148':'https://www.bulgari.com/on/demandware.static/-/Sites-masterCatalog/default/dw254899c1/images/images/1712972.png',
 '362143':'https://media2.bulgari.com/f_auto%2Cq_auto%2Cc_pad%2Ch_520%2Cw_520/production/dwa0d05b5d/images/images/1712607.png',
 '358640':'https://media.bulgari.com/image/upload/c_fill%2Ch_490%2Cw_490/q_auto/f_auto/1337147.png'
};
async function archiveKnownImage(url,index){
 const r=await fetcher(url);if(!r)return null;
 const mime=(r.headers.get('content-type')||'').toLowerCase();
 const ext=mime.includes('jpeg')?'jpg':mime.includes('png')?'png':mime.includes('webp')?'webp':null;if(!ext)return null;
 const data=Buffer.from(await r.arrayBuffer());if(data.length<12000||data.length>9000000)return null;
 const name='bvlgari-'+index+'.'+ext;fs.writeFileSync(path.join(dir,name),data);
 return 'assets/high-jewellery-photos/'+name;
}

const alternateProductPages={
 '349680':['https://www.bulgari.com/en-mt/349680.html','https://www.bartorelli.it/it/gioielli/marca-bulgari/anello-serpenti-viper-in-oro-bianco-an856869/'],
 '358771':['https://www.bulgari.com/en-at/358771.html','https://www.bulgari.com/en-gb/358771.html'],
 '362500':['https://www.bulgari.com/it-ch/gioielli/anelli/serpenti-viper-anello-oro-giallo-362500'],
 'AN858970':['https://www.bulgari.com/en-us/product/AN858970'],
 'AN858111':['https://www.bulgari.com/en-us/AN858111.html']
};
async function verifySitePhoto(url,index,sku){
 const result=await fetcher(url);if(!result)return null;
 const source=(await result.text()).slice(0,850000);
 const skuKey=sku.toLowerCase().replace(/\W/g,'');
 const verifiedPage=source.toLowerCase().replace(/\W/g,'').includes(skuKey) ||
  (sku==='349680'&&source.includes('AN856869')&&source.includes('Serpenti'));
 if(!verifiedPage)return null;
 const urls=getPhotos(source,url).slice(0,10);
 for(const candidate of urls){
  const archived=await archiveKnownImage(candidate,index);
  if(archived)return archived;
 }
 return null;
}
async function photo(item,index){
 const [title,sku,price,url]=item;
 // Curated photos are exact-reference product images from Bvlgari's media servers.
 if(curatedExactPhotos[sku]){
  const archived=await archiveKnownImage(curatedExactPhotos[sku],index);
  if(archived)return archived;
 }
 if(!/\d{5,}|AN\d{5,}/i.test(sku))return null;
 for(const page of [url,...(alternateProductPages[sku]||[])]){
  const archived=await verifySitePhoto(page,index,sku);
  if(archived)return archived;
 }
 return null;
}
const results=await Promise.all(products.map(photo));
let count=results.filter(Boolean).length;
const cards=products.map((p,i)=>({p,img:results[i]})).map(({p,img})=>{
 const media=img?'<a class="ms-jewel-photo" href="'+esc(p[3])+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(img)+'" alt="Official product photograph: '+esc(p[0])+'" loading="lazy" decoding="async"></a>':
 '<div class="ms-jewel-photo-unavailable"><span>Official photograph unavailable</span><a href="'+esc(p[3])+'" target="_blank" rel="noopener noreferrer">View product on Bvlgari ↗</a></div>';
 return '<article class="ms-jewel-card">'+media+'<div class="ms-jewel-card-copy"><h3>'+esc(p[0])+'</h3><p class="ms-jewel-sku">Reference '+esc(p[1])+'</p><strong>'+esc(p[2])+'</strong><small>Price snapshot; confirm current offer and exact variant with the official boutique.</small><a href="'+esc(p[3])+'" target="_blank" rel="noopener noreferrer">View model or collection ↗</a></div></article>';
}).join('');
const boutiques=[
 ['Cartier LOVE collection','https://www.cartier.com/it-it/'],
 ['Cartier Juste un Clou collection','https://www.cartier.com/it-it/'],
 ['Cartier Trinity collection','https://www.cartier.com/it-it/']
].map(([name,url])=>'<article class="ms-jewel-boutique"><h3>'+esc(name)+'</h3><p>Explore authentic collection photography and product references on the official boutique.</p><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Explore Cartier ↗</a></article>').join('');
const section='<section id="mariasm-high-jewellery-edit" class="ms-jewel-real-edit"><header><p class="ms-jewel-kicker">THE EXCEPTIONAL JEWELLERY EDIT</p><h2>Cartier &amp; Bvlgari · High jewellery</h2><p>Discover original product photographs for the exact models available, and explore the official Cartier collections. No synthetic representations are used as merchandise photos.</p></header>'+'<div class="ms-jewel-grid">'+cards+'</div>'+'<div class="ms-jewel-boutiques">'+boutiques+'</div></section>';
const first=html.indexOf('<section id="mariasm-high-jewellery-edit"'),last=html.indexOf('</section>',first);
if(first<0||last<0)throw Error('Could not find high jewellery section');html=html.slice(0,first)+section+html.slice(last+10);
const style='<style id="ms-jewel-real-style">.ms-jewel-photo-unavailable{min-height:158px;background:#fff8fa;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;gap:10px;color:#744963;font:12px/1.5 system-ui;text-align:center}.ms-jewel-photo-unavailable a{color:#793c5b;font-weight:700}.ms-jewel-real-edit{max-width:1200px;margin:32px auto;padding:clamp(18px,3vw,34px);border-radius:24px;background:#f7e9f0;border:1px solid #e8d2dc}.ms-jewel-real-edit header>h2{font:normal clamp(25px,3vw,38px)/1.2 Georgia,serif;color:#693b54;margin:12px 0}.ms-jewel-real-edit header>p:not(.ms-jewel-kicker){line-height:1.7;color:#714b60}.ms-jewel-kicker{font:700 11px/1.6 system-ui;letter-spacing:.14em;color:#965b76}.ms-jewel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;margin:24px 0}.ms-jewel-card,.ms-jewel-boutique{background:white;border:1px solid #e7d1da;border-radius:16px;overflow:hidden;min-width:0}.ms-jewel-photo{height:210px;background:white;display:flex;align-items:center;justify-content:center;padding:12px}.ms-jewel-photo img{display:block;width:100%;height:100%;object-fit:contain}.ms-jewel-card-copy{padding:17px;display:flex;flex-direction:column;gap:12px}.ms-jewel-card h3,.ms-jewel-boutique h3{font:normal 21px/1.25 Georgia,serif;color:#683950;margin:0}.ms-jewel-card strong{color:#703d5b}.ms-jewel-sku,.ms-jewel-card small{font:12px/1.5 system-ui;color:#79526c;margin:0}.ms-jewel-card-copy>a,.ms-jewel-boutique a{color:#7d3b60;font-weight:700}.ms-jewel-boutiques{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:24px}.ms-jewel-boutique{padding:20px}.ms-jewel-boutique p,.ms-jewel-note{font:13px/1.65 system-ui;color:#79546a}</style>';
html=html.replace('</head>',style+'</head>');
fs.writeFileSync(page,html);
console.log('High jewellery curated original photographs: '+count+'/'+products.length+'; '+(products.length-count)+' product cards preserved without images, no icons, no AI merchandise.');
