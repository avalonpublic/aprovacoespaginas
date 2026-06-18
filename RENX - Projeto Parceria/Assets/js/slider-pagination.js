/**
 * RENX Design System — slider-pagination.js
 * Horizontal snap scroll + dots de paginação + arrows + swipe
 * Extraído de: instagram-slides (slider + IntersectionObserver + touch events)
 */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initSlider();
    initAnimateOnScroll();
  });

  // ─── Animate on scroll (instagram-slides pattern) ─────────────────
  function initAnimateOnScroll() {
    if (!window.IntersectionObserver) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px -10% 0px -10%' });

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      io.observe(el);
    });
  }

  // ─── Slider com snap ──────────────────────────────────────────────
  function initSlider() {
    var slider      = document.getElementById('ds-slider');
    if (!slider) return;

    var slides      = slider.querySelectorAll('.slide-container');
    var dotsEl      = document.getElementById('ds-pagination');
    var prevBtn     = document.getElementById('ds-prev');
    var nextBtn     = document.getElementById('ds-next');
    var dots        = dotsEl ? Array.from(dotsEl.children) : [];

    if (!slides.length) return;

    // Atualiza dots
    function updateDots(activeIndex) {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIndex);
      });
    }

    // Observer de slides visíveis
    if (window.IntersectionObserver) {
      var slideObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var index = Array.from(slides).indexOf(entry.target);
            if (index !== -1) updateDots(index);
          }
        });
      }, { root: slider, threshold: 0.6 });

      slides.forEach(function (s) { slideObserver.observe(s); });
    }

    // Click nos dots
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });

    // Arrows
    function scrollAmount() {
      return window.innerWidth < 768 ? window.innerWidth * 0.85 : 548;
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
    }

    // Touch / swipe
    var startX = 0;
    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        slider.scrollBy({ left: diff > 0 ? scrollAmount() : -scrollAmount(), behavior: 'smooth' });
      }
    }, { passive: true });
  }

})();
