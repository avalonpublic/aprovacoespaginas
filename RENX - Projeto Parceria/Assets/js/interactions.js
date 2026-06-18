/**
 * RENX Design System — interactions.js
 * Parallax, flashlight de mouse, hover effects gerais
 * Extraído de: digital-architect (parallax) + instagram-slides (flashlight)
 */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    // ─── 1. Parallax em scroll ───────────────────────
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;

      document.querySelectorAll('.parallax-img').forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.05;
        el.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
      });

      document.querySelectorAll('.parallax-element').forEach(function (el) {
        var speed = parseFloat(el.dataset.speed) || 0.05;
        el.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
      });
    }, { passive: true });

    // ─── 2. Flashlight (mouse-tracking por card) ─────
    document.querySelectorAll('.card-flashlight').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      });
    });

    // ─── 3. Data bar fill — set width from data attr ─
    document.querySelectorAll('.data-bar-fill').forEach(function (el) {
      var w = el.dataset.width || '50%';
      el.style.setProperty('--target-width', w);
    });

    // ─── 4. Lucide icons render (se disponível) ──────
    if (window.lucide) {
      window.lucide.createIcons();
    }

  });

})();
