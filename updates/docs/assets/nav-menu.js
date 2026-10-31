/* MariaSM accessible compact navigation. */
(()=>{"use strict";
  const nav=document.querySelector(".ms-site-nav");
  const button=document.querySelector(".ms-nav-toggle");
  if(!nav||!button)return;
  const groups=[...nav.querySelectorAll("details.ms-nav-group")];
  const closeGroups=(except=null)=>groups.forEach(group=>{if(group!==except)group.open=false;});
  const closeMenu=()=>{nav.classList.remove("is-open");button.setAttribute("aria-expanded","false");closeGroups();};
  button.addEventListener("click",()=>{
    const opening=!nav.classList.contains("is-open");
    nav.classList.toggle("is-open",opening);
    button.setAttribute("aria-expanded",String(opening));
    if(!opening)closeGroups();
  });
  groups.forEach(group=>group.addEventListener("toggle",()=>{
    if(group.open)closeGroups(group);
  }));
  nav.addEventListener("click",event=>{
    if(event.target.closest("a"))closeMenu();
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"){
      const hadOpen=nav.classList.contains("is-open")||groups.some(group=>group.open);
      if(hadOpen){closeMenu();button.focus();}
    }
  });
  document.addEventListener("pointerdown",event=>{
    if(!event.target.closest(".ms-site-header"))closeMenu();
  });
  const query=window.matchMedia("(min-width: 1221px)");
  query.addEventListener?.("change",()=>closeMenu());
})();
