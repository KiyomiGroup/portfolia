/**
 * Portfolia — Main JS
 * Landing page interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Smooth scroll for anchor links ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Nav scroll effect ──────────────────────────────────────────────────
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 40
        ? '0 4px 24px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  // ── Template preview click ─────────────────────────────────────────────
  document.querySelectorAll('.template-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      window.location.href = '/create';
    });
  });

});
