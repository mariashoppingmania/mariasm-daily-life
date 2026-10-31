const normalise=value=>value.toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
for(const input of document.querySelectorAll('[data-filter-grid]')){
 const grid=document.getElementById(input.dataset.filterGrid),status=document.getElementById(input.id+'-status'),empty=document.getElementById(grid.id+'-empty');
 const items=[...grid.querySelectorAll(':scope > [data-search]')];
 const update=()=>{const q=normalise(input.value.trim());let count=0;for(const item of items){item.hidden=!normalise(item.dataset.search).includes(q);if(!item.hidden)count++;}status.textContent=`${count} of ${items.length} results`;empty.hidden=count>0;};
 input.addEventListener('input',update);update();
}
const shopGrid=document.getElementById('shop-grid');
if(shopGrid){
 const input=document.getElementById('shop-search'),buttons=[...document.querySelectorAll('[data-shop-category]')],cards=[...shopGrid.children],status=document.getElementById('shop-results'),empty=document.getElementById('shop-empty');let category='All';
 const apply=()=>{const query=normalise(input.value.trim());let total=0;for(const card of cards){card.hidden=!((category==='All'||card.dataset.category===category)&&normalise(card.dataset.search).includes(query));if(!card.hidden)total++;}status.textContent=`${total} of ${cards.length} destinations`;empty.hidden=total!==0;};
 input.addEventListener('input',apply);
 for(const button of buttons)button.addEventListener('click',()=>{category=button.dataset.shopCategory;for(const item of buttons)item.setAttribute('aria-pressed',String(item===button));apply();});apply();
}
