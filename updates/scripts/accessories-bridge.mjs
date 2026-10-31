import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../docs');
const pages=['fashion/index.html','fragrance/index.html','makeup/index.html','spirituality/index.html','footwear/index.html','swimwear-lingerie/index.html','fitness-activewear/index.html'];
const destinations=[['bags','Bags'],['hats','Hats'],['jewellery','Jewellery'],['watches','Watches & Horology']];
for(const page of pages){const pathname=path.join(root,page);if(!fs.existsSync(pathname))continue;let html=fs.readFileSync(pathname,'utf8');if(html.includes('id="ms-new-accessories"'))continue;const bar='<nav id="ms-new-accessories" class="ms-new-accessories" aria-label="Explore new accessories Ateliers"><strong>NEW ACCESSORIES ATELIERS</strong>'+destinations.map(([p,n])=>'<a href="../'+p+'/index.html">'+n+'</a>').join('')+'</nav>';const end=html.indexOf('</header>');if(end>0&&end<18000){html=html.slice(0,end+9)+bar+html.slice(end+9)}else{const m=html.match(/<body[^>]*>/i);if(!m){console.log('Cross-nav skipped: '+page);continue}const p=html.indexOf(m[0])+m[0].length;html=html.slice(0,p)+bar+html.slice(p)}html=html.replace('</head>','<link rel="stylesheet" href="../assets/accessories-bridge.css?v=20261031b"></head>');fs.writeFileSync(pathname,html);console.log('Added accessory cross-navigation to '+page)}
