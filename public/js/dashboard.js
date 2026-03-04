/**
 * Portfolia — Dashboard JS
 * Load and manage user's portfolio from dashboard
 */

(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  let userId = params.get('id');

  // Fall back to last draft ID
  if (!userId) {
    try {
      const draft = JSON.parse(localStorage.getItem('portfolia_draft') || '{}');
      userId = draft.id;
    } catch (_) {}
  }

  // ── Load User ─────────────────────────────────────────────────────────────
  async function load() {
    const loading = document.getElementById('loadingState');
    const notFound = document.getElementById('notFoundState');
    const content = document.getElementById('dashboardContent');

    if (!userId) {
      loading.style.display = 'none';
      notFound.style.display = 'block';
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();

      if (!data.success || !data.user) {
        loading.style.display = 'none';
        notFound.style.display = 'block';
        return;
      }

      const user = data.user;
      loading.style.display = 'none';
      content.style.display = 'block';

      // Populate UI
      document.getElementById('userName').textContent = user.name.split(' ')[0];
      document.getElementById('userProfession').textContent = user.profession;

      const portfolioUrl = `/portfolio/${user.slug}.html`;
      const fullUrl = window.location.origin + portfolioUrl;

      document.getElementById('portfolioUrlDisplay').textContent = fullUrl;
      document.getElementById('portfolioLink').href = portfolioUrl;

      // Load iframe
      const iframe = document.getElementById('portfolioFrame');
      iframe.src = portfolioUrl;

      // Stats
      const templateNames = {
        template1: 'Midnight Modern', template2: 'Fresh Light',
        template3: 'Neon Grid', template4: 'Soft Studio', template5: 'Bold Serif'
      };
      document.getElementById('statTemplate').textContent = templateNames[user.template] || user.template;
      document.getElementById('statServices').textContent = (user.services || []).length;
      document.getElementById('statProjects').textContent = (user.projects || []).length;
      document.getElementById('statCreated').textContent = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Quick edit fields
      document.getElementById('edit-bio').value = user.bio || '';
      document.getElementById('edit-email').value = user.email || '';
      const templateSelect = document.getElementById('edit-template');
      if (templateSelect) templateSelect.value = user.template || 'template1';

      // Bind actions
      bindActions(user, fullUrl);

    } catch (err) {
      loading.style.display = 'none';
      notFound.style.display = 'block';
      console.error(err);
    }
  }

  // ── Bind Dashboard Actions ────────────────────────────────────────────────
  function bindActions(user, fullUrl) {

    // Copy link
    document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(fullUrl).then(() => {
        const btn = document.getElementById('copyLinkBtn');
        btn.textContent = 'Copied! ✓';
        setTimeout(() => btn.textContent = 'Copy Link', 2000);
      });
    });

    // Regenerate (same data)
    document.getElementById('regenerateBtn')?.addEventListener('click', async () => {
      const btn = document.getElementById('regenerateBtn');
      btn.disabled = true;
      btn.textContent = '⟳ Regenerating…';
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        const data = await res.json();
        if (data.success) {
          // Refresh iframe
          const iframe = document.getElementById('portfolioFrame');
          iframe.src = iframe.src.split('?')[0] + '?t=' + Date.now();
          btn.textContent = 'Done! ✓';
          setTimeout(() => { btn.disabled = false; btn.textContent = '↺ Regenerate'; }, 2000);
        }
      } catch (_) {
        btn.disabled = false;
        btn.textContent = '↺ Regenerate';
      }
    });

    // Delete
    document.getElementById('deleteBtn')?.addEventListener('click', async () => {
      if (!confirm('Delete this portfolio? This cannot be undone.')) return;
      try {
        await fetch(`/api/user/${user.id}`, { method: 'DELETE' });
        localStorage.removeItem('portfolia_draft');
        window.location.href = '/';
      } catch (_) {
        alert('Failed to delete. Please try again.');
      }
    });

    // Save quick edit + regenerate
    document.getElementById('saveEditBtn')?.addEventListener('click', async () => {
      const btn = document.getElementById('saveEditBtn');
      btn.disabled = true;
      btn.textContent = '⟳ Saving…';

      const updated = {
        ...user,
        bio: document.getElementById('edit-bio')?.value || user.bio,
        email: document.getElementById('edit-email')?.value || user.email,
        template: document.getElementById('edit-template')?.value || user.template,
      };

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const data = await res.json();
        if (data.success) {
          // Refresh iframe
          const iframe = document.getElementById('portfolioFrame');
          iframe.src = iframe.src.split('?')[0] + '?t=' + Date.now();
          btn.textContent = 'Saved & Regenerated ✓';
          setTimeout(() => { btn.disabled = false; btn.textContent = 'Save & Regenerate'; }, 2500);

          // Update stats
          const templateNames = {
            template1: 'Midnight Modern', template2: 'Fresh Light',
            template3: 'Neon Grid', template4: 'Soft Studio', template5: 'Bold Serif'
          };
          document.getElementById('statTemplate').textContent = templateNames[updated.template];
        }
      } catch (_) {
        btn.disabled = false;
        btn.textContent = 'Save & Regenerate';
      }
    });

    // Edit link → go to create page in edit mode
    document.querySelectorAll('[data-action="edit"]').forEach(el => {
      el.addEventListener('click', () => {
        window.location.href = `/create?id=${user.id}`;
      });
    });
  }

  // ── Boot ────────────────────────────────────────────────────────────────────
  load();

})();
