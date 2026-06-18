/**
 * RENX Design System — carousel.js
 * Carousel com crossfade + Ken Burns nas imagens
 * Extraído de: digital-architect (hero carousel)
 */

(function () {
  'use strict';

  function initCarousel(carouselId) {
    var el = document.getElementById(carouselId || 'hero-carousel');
    if (!el) return;

    var slides = el.querySelectorAll('.carousel-slide');
    if (slides.length < 2) return;

    var current = 0;
    var interval = 5000;

    function next() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }

    setInterval(next, interval);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Inicializa todos os carouseis na página
    document.querySelectorAll('[data-carousel]').forEach(function (el) {
      initCarousel(el.id);
    });
    // Fallback para o id default
    initCarousel('hero-carousel');
  });

  // Expõe globalmente para uso externo
  window.RENX = window.RENX || {};
  window.RENX.initCarousel = initCarousel;

})();
