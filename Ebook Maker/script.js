/* ═══════════════════════════════════════════════════════════
   EbookMaker → EbookGPT | Sunset & Migration Page
   JavaScript V3 — All interactions + animated counters + video
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Ambient Floating Particles ─────────────────────────
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((width * height) / 16000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.3,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          alpha: Math.random() * 0.4 + 0.1,
          alphaDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.alpha += p.alphaDir * 0.002;
        if (p.alpha >= 0.5) { p.alpha = 0.5; p.alphaDir = -1; }
        if (p.alpha <= 0.05) { p.alpha = 0.05; p.alphaDir = 1; }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157, 78, 221, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => { resize(); createParticles(); }, 200);
    });
  }

  // ── Header Scroll Effect ────────────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    });
  }

  // ── Animated Number Counters ───────────────────────────
  function formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString('pt-BR');
    }
    return num.toString();
  }

  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Observe stats bar to trigger counters
  const statsBar = document.getElementById('hero-stats-bar');
  if (statsBar) {
    const statNumbers = statsBar.querySelectorAll('.hero-stat__number');
    let countersStarted = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNumbers.forEach((el) => {
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target, 2200);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsBar);
  }

  // ── Intersection Observer: Reveal Animations ───────────
  const revealElements = document.querySelectorAll(
    '.evolution-header, .evo-card, .evolution-arrow, .cta-container, .video-header, .video-container, .video-feature-card, .trust-bar__inner'
  );
  revealElements.forEach((el) => el.classList.add('reveal'));

  // Mockup frames get slide-right
  const mockupFramesReveal = document.querySelectorAll('.mockup-frame');
  mockupFramesReveal.forEach((frame, i) => {
    frame.classList.add('reveal-slide-right');
    frame.classList.add(`reveal-delay-${(i * 2) + 2}`);
  });

  // Stagger cards
  const legacyCard = document.getElementById('card-legacy');
  const arrow = document.getElementById('evolution-arrow');
  const newCard = document.getElementById('card-new');

  if (legacyCard) legacyCard.classList.add('reveal-delay-1');
  if (arrow) arrow.classList.add('reveal-delay-2');
  if (newCard) newCard.classList.add('reveal-delay-3');

  // Stagger video feature cards
  const videoFeatureCards = document.querySelectorAll('.video-feature-card');
  videoFeatureCards.forEach((card, i) => {
    card.classList.add(`reveal-delay-${i + 1}`);
  });

  const allRevealEls = [...revealElements, ...mockupFramesReveal];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    allRevealEls.forEach((el) => observer.observe(el));
  } else {
    allRevealEls.forEach((el) => el.classList.add('visible'));
  }

  // ── CTA Button: Ripple Effect ──────────────────────────
  const ctaButton = document.getElementById('cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute; width: 0; height: 0; border-radius: 50%;
        background: rgba(255, 255, 255, 0.1); transform: translate(-50%, -50%);
        left: ${x}px; top: ${y}px; z-index: 0; pointer-events: none;
        transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
      `;
      this.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.width = '400px';
        ripple.style.height = '400px';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ── Hero Glow: Mouse Tracking ──────────────────────────
  const heroSection = document.getElementById('hero');
  const heroGlow = document.querySelector('.hero-glow');
  const heroBackdropGlow = document.querySelector('.hero-backdrop-glow');

  if (heroSection && heroGlow) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      heroGlow.style.transform = `translate(calc(-50% + ${cx * 40}px), calc(-50% + ${cy * 40}px))`;
      if (heroBackdropGlow) {
        heroBackdropGlow.style.transform = `translate(calc(-50% + ${cx * 20}px), calc(-50% + ${cy * 20}px))`;
      }
    });
  }

  // ── Hero Illustration: Mouse Parallax ──────────────────
  const heroIllustration = document.getElementById('hero-illustration');
  if (heroSection && heroIllustration) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      heroIllustration.style.transform = `translate(${cx * 15}px, ${cy * 15}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroIllustration.style.transform = 'translate(0, 0)';
    });
  }

  // ── Card tilt on hover ─────────────────────────────────
  const cards = document.querySelectorAll('.evo-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 6;
      const tiltY = (x - 0.5) * -6;
      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
    });
  });

  // ── Mockup 3D tilt ─────────────────────────────────────
  const mockupFrames = document.querySelectorAll('.mockup-frame');
  mockupFrames.forEach((frame) => {
    const isLegacy = frame.classList.contains('mockup-frame--legacy');
    const baseRotationY = isLegacy ? 3 : -3;
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 4;
      const tiltY = (x - 0.5) * -4;
      frame.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY + baseRotationY}deg)`;
    });
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = `perspective(1200px) rotateY(${baseRotationY}deg) rotateX(1deg)`;
    });
  });

  // ── Video container tilt ───────────────────────────────
  const videoContainer = document.getElementById('video-container');
  if (videoContainer) {
    videoContainer.addEventListener('mousemove', (e) => {
      const rect = videoContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 5;
      const tiltY = (x - 0.5) * -5;
      videoContainer.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    videoContainer.addEventListener('mouseleave', () => {
      videoContainer.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  }

})();
