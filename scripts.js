document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', function(){
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Lightbox
  const triggers = Array.from(document.querySelectorAll('.modal-trigger'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.querySelector('.lightbox-image');
  const lbCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const nextBtn = document.querySelector('.lightbox-next');
  const prevBtn = document.querySelector('.lightbox-prev');
  let currentIndex = -1;

  function openLightbox(index){
    const el = triggers[index];
    if(!el) return;
    currentIndex = index;
    lbImage.src = el.src;
    lbImage.alt = el.alt || '';
    lbCaption.textContent = el.dataset.caption || el.alt || '';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function showNext(delta=1){
    const next = (currentIndex + delta + triggers.length) % triggers.length;
    openLightbox(next);
  }

  triggers.forEach((t,i)=> t.addEventListener('click', e=>{ e.preventDefault(); openLightbox(i); }));
  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  nextBtn && nextBtn.addEventListener('click', ()=>showNext(1));
  prevBtn && prevBtn.addEventListener('click', ()=>showNext(-1));

  lightbox && lightbox.addEventListener('click', function(e){
    if(e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e){
    if(lightbox && lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') showNext(1);
      if(e.key === 'ArrowLeft') showNext(-1);
    }
  });

  // Touch swipe for lightbox
  let startX = null;
  lbImage && lbImage.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; });
  lbImage && lbImage.addEventListener('touchend', e=>{
    if(startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ showNext(dx < 0 ? 1 : -1); }
    startX = null;
  });
});
