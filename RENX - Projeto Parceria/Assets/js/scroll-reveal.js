/**
 * RENX Design System — scroll-reveal.js
 * IntersectionObserver para .reveal, .reveal-blur, .reveal-up, etc.
 * Também dispara text-reveal e flicker effects
 * Extraído de: digital-architect + axion-ai
 */

(function () {
  'use strict';

  const THRESHOLD    = 0.15;
  const ROOT_MARGIN  = '0px';
  const ONCE         = true; // anima apenas uma vez

  // Espera o DOM estar pronto
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    // ─── 1. Nav load animation ───────────────────────
    setTimeout(function () {
      var nav = document.querySelector('.nav-load');
      if (nav) nav.classList.add('loaded');
    }, 100);

    // ─── 2. Hero text reveal (disparo imediato) ───────
    setTimeout(function () {
      var heroTitle = document.getElementById('hero-title');
      if (heroTitle) heroTitle.classList.add('reveal-active');

      // Badges e stats do hero também
      document.querySelectorAll('.hero-badge, .hero-stat').forEach(function (el) {
        el.classList.add('active');
      });
    }, 400);

    // ─── 3. Scroll observer geral ─────────────────────
    var observerOptions = {
      root: null,
      rootMargin: ROOT_MARGIN,
      threshold: THRESHOLD
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.add('active');

        // Ativa text-reveal-content via classe no container
        if (el.querySelector('.text-reveal-content') || el.classList.contains('text-reveal-wrapper')) {
          el.classList.add('reveal-active');
        }
        if (el.tagName === 'H1' || el.tagName === 'H2') {
          el.classList.add('reveal-active');
        }

        if (ONCE) observer.unobserve(el);
      });
    }, observerOptions);

    // Observa todos os elementos de reveal
    var revealSelectors = [
      '.reveal',
      '.reveal-up',
      '.reveal-left',
      '.reveal-right',
      '.reveal-scale',
      '.reveal-blur',
      '.reveal-flicker'
    ];

    document.querySelectorAll(revealSelectors.join(',')).forEach(function (el) {
      observer.observe(el);
    });

    // Observa H1s que contêm text-reveal-content
    document.querySelectorAll('h1, h2').forEach(function (el) {
      if (el.querySelector('.text-reveal-content')) {
        observer.observe(el);
      }
    });

    // ─── 4. Bar fill progressivo ──────────────────────
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (ONCE) barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.bar-fill').forEach(function (el) {
      barObserver.observe(el);
    });

  });

})();
