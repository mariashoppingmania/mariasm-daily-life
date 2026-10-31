const normalise=value=>value.toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
for(const input of document.querySelectorAll('[data-filter-grid]')){
 const grid=document.getElementById(input.dataset.filterGrid),status=document.getElementById(input.id+'-status'),empty=document.getElementById(grid.id+'-empty');
 const items=[...grid.querySelectorAll(':scope > [data-search]')];
 const update=()=>{const q=normalise(input.value.trim());let count=0;for(const item of items){item.hidden=!normalise(item.dataset.search).includes(q);if(!item.hidden)count++;}status.textContent=`${count} of ${items.length} results`;empty.hidden=count>0;};
 input.addEventListener('input',update);update();
}
