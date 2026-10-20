// Decorations follow each visitor's local October calendar; no stored data.
(() => {
  const october = new Date().getMonth() === 9;
  document.documentElement.classList.toggle('halloween', october);
})();
