(function(){
  const el = document.getElementById('q2');
  if(!el) return;
  function supportsWebP() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img.width === 1 && img.height === 1);
      img.onerror = () => resolve(false);
      img.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    });
  }
  function setBackground(useWebP){
    const webp = el.getAttribute('data-bg-webp');
    const jpg  = el.getAttribute('data-bg-jpg');
    const url = (useWebP && webp) ? webp : jpg;
    if(!url) return;
    el.style.backgroundImage = `url("${url}")`;
    el.classList.add('has-bg');
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        obs.unobserve(entry.target);
        supportsWebP().then(supported => setBackground(supported));
      }
    });
  }, {rootMargin: '200px 0px'});
  io.observe(el);
})();
