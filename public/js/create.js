/**
 * Portfolia — Multi-Step Form Logic
 * Handles navigation, validation, image uploads, and form submission
 */

(function () {
  'use strict';

  // ─── State ─────────────────────────────────────────────────────────────────
  let currentStep = 1;
  const TOTAL_STEPS = 7;
  let selectedFiles = [];

  // ─── DOM References ─────────────────────────────────────────────────────────
  const form = document.getElementById('portfolioForm');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const btnGenerate = document.getElementById('btnGenerate');
  const progressBar = document.getElementById('progressBar');
  const stepCounter = document.getElementById('stepCounter');
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('projectImages');
  const imagePreviews = document.getElementById('imagePreviews');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const linkInputs = document.getElementById('linkInputs');
  const successOverlay = document.getElementById('successOverlay');
  const bioField = document.getElementById('bio');
  const bioCount = document.getElementById('bioCount');

  // ─── Step Navigation ─────────────────────────────────────────────────────
  function goToStep(step) {
    const current = document.querySelector('.form-step.active');
    const next = document.querySelector(`[data-step="${step}"]`);
    if (!next) return;

    current.classList.remove('active');
    next.classList.add('active');
    currentStep = step;

    // Update progress
    const pct = (step / TOTAL_STEPS) * 100;
    progressBar.style.width = pct + '%';
    stepCounter.textContent = `${step} of ${TOTAL_STEPS}`;

    // Show/hide nav buttons
    btnBack.style.visibility = step === 1 ? 'hidden' : 'visible';
    btnNext.style.display = step === TOTAL_STEPS ? 'none' : 'inline-flex';
    btnGenerate.style.display = step === TOTAL_STEPS ? 'inline-flex' : 'none';

    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus first input
    const firstInput = next.querySelector('input, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 400);
  }

  // ─── Validation ──────────────────────────────────────────────────────────
  function validateStep(step) {
    hideError(step);

    switch (step) {
      case 1:
        if (!document.getElementById('name').value.trim()) {
          showError(1); return false;
        }
        break;
      case 2:
        if (!document.getElementById('profession').value.trim()) {
          showError(2); return false;
        }
        break;
      case 3:
        if (!document.getElementById('bio').value.trim()) {
          showError(3); return false;
        }
        break;
      case 4:
        if (!document.getElementById('services').value.trim()) {
          showError(4); return false;
        }
        break;
      case 6:
        if (!document.getElementById('email').value.trim()) {
          showError(6); return false;
        }
        break;
    }
    return true;
  }

  function showError(step) {
    const el = document.getElementById(`error-${step}`);
    if (el) el.classList.add('visible');
  }
  function hideError(step) {
    const el = document.getElementById(`error-${step}`);
    if (el) el.classList.remove('visible');
  }

  // ─── Navigation Buttons ───────────────────────────────────────────────────
  btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  // Allow Enter key to advance
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (currentStep < TOTAL_STEPS) btnNext.click();
      else btnGenerate.click();
    }
  });

  // ─── Quick Pick Buttons ───────────────────────────────────────────────────
  document.querySelectorAll('.pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const field = document.getElementById(target);
      if (field) field.value = btn.textContent;
    });
  });

  // ─── Service Chip Buttons ─────────────────────────────────────────────────
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      rebuildServices();
    });
  });

  function rebuildServices() {
    const selected = [...document.querySelectorAll('.chip-btn.selected')]
      .map(b => b.dataset.service);
    const textarea = document.getElementById('services');
    const manual = textarea.value
      .split('\n')
      .map(s => s.trim())
      .filter(s => s && !document.querySelector(`.chip-btn[data-service="${s}"]`));
    textarea.value = [...selected, ...manual].join('\n');
  }

  // ─── Bio Character Count ──────────────────────────────────────────────────
  bioField.addEventListener('input', () => {
    const len = bioField.value.length;
    bioCount.textContent = `${len} / 400`;
    if (len > 380) bioCount.style.color = '#C84B2F';
    else bioCount.style.color = '';
    if (len > 400) bioField.value = bioField.value.slice(0, 400);
  });

  // ─── Image Upload ─────────────────────────────────────────────────────────
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles([...e.dataTransfer.files]);
  });

  fileInput.addEventListener('change', () => {
    handleFiles([...fileInput.files]);
    fileInput.value = '';
  });

  function handleFiles(files) {
    const allowed = files.filter(f => f.type.startsWith('image/'));
    const remaining = 6 - selectedFiles.length;
    const toAdd = allowed.slice(0, remaining);
    selectedFiles = [...selectedFiles, ...toAdd];
    renderPreviews();
  }

  function renderPreviews() {
    imagePreviews.innerHTML = '';
    selectedFiles.forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const div = document.createElement('div');
      div.className = 'preview-thumb';
      div.innerHTML = `<img src="${url}" alt="Preview ${idx + 1}" /><button class="preview-remove" data-idx="${idx}">×</button>`;
      imagePreviews.appendChild(div);
    });

    // Remove button handlers
    imagePreviews.querySelectorAll('.preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFiles.splice(parseInt(btn.dataset.idx), 1);
        renderPreviews();
      });
    });
  }

  // ─── Add Link Rows ────────────────────────────────────────────────────────
  addLinkBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `
      <input type="url" name="projectLinks" class="form-input link-input" placeholder="https://your-project.com" />
      <button type="button" class="remove-link" onclick="this.parentElement.remove()">×</button>
    `;
    linkInputs.appendChild(row);
    row.querySelector('input').focus();
  });

  // ─── Form Submission ──────────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitForm();
  });

  btnGenerate.addEventListener('click', async () => {
    await submitForm();
  });

  async function submitForm() {
    const generateText = btnGenerate.querySelector('.generate-text');
    const generateLoading = btnGenerate.querySelector('.generate-loading');

    // UI: loading state
    generateText.style.display = 'none';
    generateLoading.style.display = 'inline';
    btnGenerate.disabled = true;

    try {
      const formData = new FormData();

      // Basic fields
      formData.append('name', document.getElementById('name').value.trim());
      formData.append('profession', document.getElementById('profession').value.trim());
      formData.append('bio', document.getElementById('bio').value.trim());
      formData.append('services', document.getElementById('services').value.trim());
      formData.append('email', document.getElementById('email').value.trim());
      formData.append('phone', document.getElementById('phone').value.trim());
      formData.append('linkedin', document.getElementById('linkedin').value.trim());
      formData.append('twitter', document.getElementById('twitter').value.trim());

      // Template
      const template = document.querySelector('input[name="template"]:checked');
      formData.append('template', template ? template.value : 'minimal');

      // Images
      selectedFiles.forEach(file => formData.append('projectImages', file));

      // Project links
      document.querySelectorAll('input[name="projectLinks"]').forEach(input => {
        if (input.value.trim()) formData.append('projectLinks', input.value.trim());
      });

      const res = await fetch('/api/generate', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        showSuccess(data.username, data.portfolioUrl);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server. Make sure the server is running.');
    } finally {
      generateText.style.display = 'inline';
      generateLoading.style.display = 'none';
      btnGenerate.disabled = false;
    }
  }

  function showSuccess(username, portfolioUrl) {
    const urlDisplay = document.getElementById('portfolioUrlDisplay');
    const viewBtn = document.getElementById('viewPortfolioBtn');
    const dashBtn = document.getElementById('dashboardBtn');

    const fullUrl = window.location.origin + portfolioUrl;
    urlDisplay.textContent = fullUrl;
    viewBtn.href = portfolioUrl;
    dashBtn.href = `/dashboard/${username}`;

    successOverlay.classList.add('visible');
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  goToStep(1);

})();
