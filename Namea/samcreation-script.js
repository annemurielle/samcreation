document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.querySelector('[data-lightbox]');
  if (!overlay) return; // page sans lightbox

  const overlayImg = overlay.querySelector('img');
  const closeBtn  = overlay.querySelector('[data-lightbox-close]');
  const prevBtn   = overlay.querySelector('[data-lightbox-prev]');
  const nextBtn   = overlay.querySelector('[data-lightbox-next]');

  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  if (!triggers.length) return;

  let currentIndex = 0;

  function openLightboxAt(index) {
    currentIndex = index;
    const trigger = triggers[index];
    const img = trigger.querySelector('img');

    overlayImg.src = trigger.href;
    overlayImg.alt = img ? img.alt : '';
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    overlayImg.src = '';
  }

  function showRelative(step) {
    if (!triggers.length) return;
    const len = triggers.length;
    currentIndex = (currentIndex + step + len) % len;
    openLightboxAt(currentIndex);
  }

  // cacher les flèches s'il n'y a qu'une image
  if (triggers.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // clic sur les vignettes
  triggers.forEach(function (trigger, index) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openLightboxAt(index);
    });
  });

  // boutons précédent / suivant
  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      showRelative(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      showRelative(1);
    });
  }

  // clic sur le fond ou le bouton fermer
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === closeBtn) {
      closeLightbox();
    }
  });

  // clavier : Échap, flèches gauche/droite
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-visible')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showRelative(1);
    } else if (e.key === 'ArrowLeft') {
      showRelative(-1);
    }
  });
});
