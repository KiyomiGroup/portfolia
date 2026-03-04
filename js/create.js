/**
 * Portfolia — Static Client-Side Generator
 * Builds a complete portfolio HTML file in the browser, then triggers a download.
 * No server needed. Works on GitHub Pages.
 */

(function () {
  'use strict';

  // ─── State ─────────────────────────────────────────────────────────────────
  let currentStep = 1;
  const TOTAL_STEPS = 7;
  let selectedFiles = [];       // File objects
  let imageDataURLs = [];       // Base64 encoded images (embedded into output HTML)

  // ─── DOM ────────────────────────────────────────────────────────────────────
  const btnBack      = document.getElementById('btnBack');
  const btnNext      = document.getElementById('btnNext');
  const btnGenerate  = document.getElementById('btnGenerate');
  const progressBar  = document.getElementById('progressBar');
  const stepCounter  = document.getElementById('stepCounter');
  const uploadZone   = document.getElementById('uploadZone');
  const fileInput    = document.getElementById('projectImages');
  const imagePreviews = document.getElementById('imagePreviews');
  const addLinkBtn   = document.getElementById('addLinkBtn');
  const linkInputs   = document.getElementById('linkInputs');
  const successOverlay = document.getElementById('successOverlay');
  const downloadBtn  = document.getElementById('downloadBtn');
  const bioField     = document.getElementById('bio');
  const bioCount     = document.getElementById('bioCount');

  // ─── Navigation ─────────────────────────────────────────────────────────────
  function goToStep(step) {
    document.querySelector('.form-step.active').classList.remove('active');
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    currentStep = step;

    progressBar.style.width = (step / TOTAL_STEPS * 100) + '%';
    stepCounter.textContent = `${step} of ${TOTAL_STEPS}`;
    btnBack.style.visibility = step === 1 ? 'hidden' : 'visible';
    btnNext.style.display    = step === TOTAL_STEPS ? 'none' : 'inline-flex';
    btnGenerate.style.display = step === TOTAL_STEPS ? 'inline-flex' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const first = document.querySelector(`[data-step="${step}"] input, [data-step="${step}"] textarea`);
    if (first) setTimeout(() => first.focus(), 350);
  }

  // ─── Validation ─────────────────────────────────────────────────────────────
  function validate(step) {
    hideError(step);
    const rules = {
      1: () => !!document.getElementById('name').value.trim(),
      2: () => !!document.getElementById('profession').value.trim(),
      3: () => !!document.getElementById('bio').value.trim(),
      4: () => !!document.getElementById('services').value.trim(),
      6: () => !!document.getElementById('email').value.trim(),
    };
    if (rules[step] && !rules[step]()) { showError(step); return false; }
    return true;
  }

  function showError(s) { const e = document.getElementById(`error-${s}`); if (e) e.classList.add('visible'); }
  function hideError(s) { const e = document.getElementById(`error-${s}`); if (e) e.classList.remove('visible'); }

  // ─── Button Listeners ───────────────────────────────────────────────────────
  btnNext.addEventListener('click', () => {
    if (validate(currentStep) && currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  });
  btnBack.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      currentStep < TOTAL_STEPS ? btnNext.click() : btnGenerate.click();
    }
  });

  // ─── Quick Picks ────────────────────────────────────────────────────────────
  document.querySelectorAll('.pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.target).value = btn.textContent;
    });
  });

  // ─── Service Chips ──────────────────────────────────────────────────────────
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      rebuildServices();
    });
  });

  function rebuildServices() {
    const selected = [...document.querySelectorAll('.chip-btn.selected')].map(b => b.dataset.service);
    const ta = document.getElementById('services');
    const manual = ta.value.split('\n').map(s => s.trim())
      .filter(s => s && !document.querySelector(`.chip-btn[data-service="${s}"]`));
    ta.value = [...selected, ...manual].join('\n');
  }

  // ─── Bio Counter ────────────────────────────────────────────────────────────
  bioField.addEventListener('input', () => {
    const len = Math.min(bioField.value.length, 400);
    bioCount.textContent = `${len} / 400`;
    bioCount.style.color = len > 380 ? '#C84B2F' : '';
    if (bioField.value.length > 400) bioField.value = bioField.value.slice(0, 400);
  });

  // ─── Image Upload ────────────────────────────────────────────────────────────
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles([...e.dataTransfer.files]);
  });
  fileInput.addEventListener('change', () => { handleFiles([...fileInput.files]); fileInput.value = ''; });

  function handleFiles(files) {
    const allowed = files.filter(f => f.type.startsWith('image/'));
    const toAdd = allowed.slice(0, 6 - selectedFiles.length);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        selectedFiles.push(file);
        imageDataURLs.push(e.target.result);
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    imagePreviews.innerHTML = '';
    imageDataURLs.forEach((dataUrl, idx) => {
      const div = document.createElement('div');
      div.className = 'preview-thumb';
      div.innerHTML = `<img src="${dataUrl}" alt="Preview" /><button class="preview-remove" data-idx="${idx}">×</button>`;
      imagePreviews.appendChild(div);
    });
    imagePreviews.querySelectorAll('.preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.idx);
        selectedFiles.splice(i, 1);
        imageDataURLs.splice(i, 1);
        renderPreviews();
      });
    });
  }

  // ─── Add Link Rows ───────────────────────────────────────────────────────────
  addLinkBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `<input type="url" class="form-input link-input" placeholder="https://your-project.com" /><button type="button" class="remove-link" onclick="this.parentElement.remove()">×</button>`;
    linkInputs.appendChild(row);
    row.querySelector('input').focus();
  });

  // ─── Generate ───────────────────────────────────────────────────────────────
  btnGenerate.addEventListener('click', generatePortfolio);

  function generatePortfolio() {
    // Collect form data
    const data = {
      name:       document.getElementById('name').value.trim(),
      profession: document.getElementById('profession').value.trim(),
      bio:        document.getElementById('bio').value.trim(),
      services:   document.getElementById('services').value.split('\n').map(s => s.trim()).filter(Boolean),
      email:      document.getElementById('email').value.trim(),
      phone:      document.getElementById('phone').value.trim(),
      linkedin:   document.getElementById('linkedin').value.trim(),
      twitter:    document.getElementById('twitter').value.trim(),
      template:   document.querySelector('input[name="template"]:checked')?.value || 'minimal',
      images:     imageDataURLs,
      links:      [...document.querySelectorAll('.link-input')].map(i => i.value.trim()).filter(Boolean),
      year:       new Date().getFullYear(),
    };

    const html = buildPortfolioHTML(data);
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'portfolio';

    // Wire up download button
    downloadBtn.onclick = () => {
      const blob = new Blob([html], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${slug}-portfolio.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    successOverlay.classList.add('visible');
  }

  // ─── HTML Builder ───────────────────────────────────────────────────────────
  function buildPortfolioHTML(d) {
    const servicesHTML = d.services.map(s =>
      `<div class="service-card"><span class="service-icon">✦</span><p>${esc(s)}</p></div>`
    ).join('');

    const projectsHTML = [
      ...d.images.map((src, i) =>
        `<div class="project-card"><img src="${src}" alt="Project ${i+1}" loading="lazy" /><div class="project-info"><h4>Project ${i+1}</h4></div></div>`
      ),
      ...d.links.map((link, i) =>
        `<div class="project-card project-link-card"><a href="${esc(link)}" target="_blank" rel="noopener"><div class="link-icon">🔗</div><h4>Project ${i+1}</h4><p>${esc(link)}</p></a></div>`
      )
    ].join('') || '<p class="empty-note">Projects coming soon.</p>';

    const contactHTML = [
      d.email    ? `<a href="mailto:${esc(d.email)}" class="social-link">✉ ${esc(d.email)}</a>` : '',
      d.phone    ? `<a href="tel:${esc(d.phone)}" class="social-link">📱 ${esc(d.phone)}</a>` : '',
      d.linkedin ? `<a href="${esc(d.linkedin)}" target="_blank" rel="noopener" class="social-link">in LinkedIn</a>` : '',
      d.twitter  ? `<a href="${esc(d.twitter)}" target="_blank" rel="noopener" class="social-link">𝕏 Twitter/X</a>` : '',
    ].filter(Boolean).join('\n') || '<p>No contact info provided.</p>';

    const templates = {
      minimal:   buildMinimal(d, servicesHTML, projectsHTML, contactHTML),
      bold:      buildBold(d, servicesHTML, projectsHTML, contactHTML),
      warm:      buildWarm(d, servicesHTML, projectsHTML, contactHTML),
      editorial: buildEditorial(d, servicesHTML, projectsHTML, contactHTML),
      glass:     buildGlass(d, servicesHTML, projectsHTML, contactHTML),
    };

    return templates[d.template] || templates.minimal;
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE: MINIMAL
  // ═══════════════════════════════════════════════════════════
  function buildMinimal(d, services, projects, contact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#FAFAF8;--ink:#18181B;--ink2:#6B7280;--accent:#C84B2F;--border:rgba(0,0,0,0.08);--font-d:'DM Serif Display',Georgia,serif;--font-b:'DM Sans',system-ui,sans-serif;}
body{font-family:var(--font-b);background:var(--bg);color:var(--ink);line-height:1.6;}
a{color:inherit;text-decoration:none;}
nav{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 5vw;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(250,250,248,0.92);backdrop-filter:blur(12px);z-index:10;}
.nav-name{font-family:var(--font-d);font-size:1.25rem;letter-spacing:-0.02em;}
.nav-links{display:flex;gap:2rem;font-size:0.875rem;font-weight:500;}
.nav-links a{color:var(--ink2);transition:color 0.2s;}.nav-links a:hover{color:var(--ink);}
.hero{max-width:900px;margin:0 auto;padding:8rem 5vw 6rem;}
.hero-tag{display:inline-block;font-size:0.8125rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;}
.hero-name{font-family:var(--font-d);font-size:clamp(3rem,8vw,6.5rem);letter-spacing:-0.04em;line-height:1;margin-bottom:1.5rem;}
.hero-name em{font-style:italic;color:var(--accent);}
.hero-bio{font-size:1.1rem;color:var(--ink2);max-width:540px;line-height:1.75;}
.hero-cta{display:inline-block;margin-top:2.5rem;background:var(--ink);color:var(--bg);padding:0.875rem 2rem;border-radius:100px;font-weight:500;font-size:0.9375rem;transition:background 0.2s;}
.hero-cta:hover{background:var(--accent);}
section{padding:6rem 5vw;border-top:1px solid var(--border);}
.section-inner{max-width:900px;margin:0 auto;}
.section-label{font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;}
h2{font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);letter-spacing:-0.03em;line-height:1.1;margin-bottom:2.5rem;}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start;}
.about-text{font-size:1.0625rem;color:var(--ink2);line-height:1.8;}
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);}
.service-card{background:var(--bg);padding:1.75rem;display:flex;flex-direction:column;gap:0.75rem;}
.service-icon{font-size:1.25rem;color:var(--accent);}
.service-card p{font-size:0.9375rem;font-weight:500;}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;}
.project-card{border-radius:12px;overflow:hidden;border:1px solid var(--border);background:#fff;transition:transform 0.2s,box-shadow 0.2s;}
.project-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.1);}
.project-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;}
.project-info{padding:1rem 1.25rem;}.project-info h4{font-weight:600;font-size:0.9375rem;}
.project-link-card a{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;gap:0.75rem;min-height:160px;color:var(--ink2);}
.project-link-card a:hover{color:var(--accent);}
.link-icon{font-size:2rem;}
.project-link-card p{font-size:0.75rem;word-break:break-all;color:var(--accent);}
.contact-links{display:flex;flex-direction:column;gap:0.875rem;}
.social-link{display:inline-flex;align-items:center;gap:0.75rem;font-size:1.0625rem;font-weight:500;color:var(--ink);padding:0.5rem 0;border-bottom:1px solid var(--border);transition:color 0.2s;}
.social-link:hover{color:var(--accent);}
.empty-note{color:var(--ink2);font-style:italic;}
footer{text-align:center;padding:3rem;border-top:1px solid var(--border);font-size:0.8125rem;color:var(--ink2);}
footer a{color:var(--accent);}
@media(max-width:768px){.about-grid{grid-template-columns:1fr;gap:2rem;}.nav-links{display:none;}}
</style>
</head>
<body>
<nav>
  <span class="nav-name">${esc(d.name)}</span>
  <div class="nav-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
</nav>
<div class="hero">
  <div class="hero-tag">${esc(d.profession)}</div>
  <h1 class="hero-name"><em>${esc(d.name)}</em></h1>
  <p class="hero-bio">${esc(d.bio)}</p>
  <a href="#contact" class="hero-cta">Get in Touch →</a>
</div>
<section id="about"><div class="section-inner">
  <div class="section-label">About</div>
  <div class="about-grid"><h2>A little bit about me.</h2><p class="about-text">${esc(d.bio)}</p></div>
</div></section>
<section id="services"><div class="section-inner">
  <div class="section-label">Services</div><h2>What I can do for you.</h2>
  <div class="services-grid">${services}</div>
</div></section>
<section id="projects"><div class="section-inner">
  <div class="section-label">Projects</div><h2>Selected work.</h2>
  <div class="projects-grid">${projects}</div>
</div></section>
<section id="contact"><div class="section-inner">
  <div class="section-label">Contact</div><h2>Let's work together.</h2>
  <div class="contact-links">${contact}</div>
</div></section>
<footer><p>© ${d.year} ${esc(d.name)} · Built with <a href="https://github.com" target="_blank">Portfolia</a></p></footer>
</body></html>`;
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE: BOLD
  // ═══════════════════════════════════════════════════════════
  function buildBold(d, services, projects, contact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0D0D0D;--ink:#F0EDE8;--ink2:#888;--accent:#E63946;--mid:#1A1A1A;--border:rgba(255,255,255,0.07);--font-d:'Syne',system-ui,sans-serif;--font-b:'Inter',system-ui,sans-serif;}
body{font-family:var(--font-b);background:var(--bg);color:var(--ink);line-height:1.6;}
a{color:inherit;text-decoration:none;}
nav{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 5vw;border-bottom:1px solid var(--border);background:rgba(13,13,13,0.95);backdrop-filter:blur(16px);position:sticky;top:0;z-index:10;}
.nav-name{font-family:var(--font-d);font-size:1.125rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}
.nav-links{display:flex;gap:2rem;font-size:0.8125rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;}
.nav-links a{color:var(--ink2);transition:color 0.2s;}.nav-links a:hover{color:var(--accent);}
.hero{padding:10rem 5vw 8rem;border-bottom:1px solid var(--border);}
.eyebrow{font-size:0.75rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;display:flex;align-items:center;gap:0.75rem;}
.eyebrow::before{content:'';width:40px;height:1px;background:var(--accent);}
.hero-name{font-family:var(--font-d);font-size:clamp(3.5rem,10vw,9rem);font-weight:800;line-height:0.9;letter-spacing:-0.04em;margin-bottom:3rem;}
.hero-name span{display:block;color:var(--accent);}
.hero-bio{font-size:1.0625rem;color:var(--ink2);max-width:480px;line-height:1.75;margin-bottom:3rem;}
.cta{display:inline-flex;align-items:center;gap:0.75rem;background:var(--accent);color:var(--ink);padding:1rem 2rem;font-family:var(--font-d);font-weight:700;font-size:0.875rem;letter-spacing:0.06em;text-transform:uppercase;transition:opacity 0.2s;}
.cta:hover{opacity:0.85;}
section{padding:6rem 5vw;border-bottom:1px solid var(--border);}
.inner{max-width:1000px;margin:0 auto;}
.label{font-size:0.7rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;display:flex;align-items:center;gap:0.75rem;}
.label::before{content:'';width:24px;height:1px;background:var(--accent);}
h2{font-family:var(--font-d);font-size:clamp(2rem,5vw,3.5rem);font-weight:800;letter-spacing:-0.03em;line-height:1;margin-bottom:2.5rem;}
.about-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:4rem;align-items:start;}
.about-text{font-size:1.0625rem;color:var(--ink2);line-height:1.8;}
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1px;background:var(--border);}
.service-card{background:var(--mid);padding:2rem;display:flex;flex-direction:column;gap:1rem;transition:background 0.2s;}
.service-card:hover{background:rgba(230,57,70,0.1);}
.service-icon{font-size:1.5rem;}.service-card p{font-size:0.9375rem;font-weight:500;}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
.project-card{overflow:hidden;background:var(--mid);border:1px solid var(--border);transition:border-color 0.2s;}
.project-card:hover{border-color:var(--accent);}
.project-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;filter:grayscale(30%);transition:filter 0.3s;}
.project-card:hover img{filter:none;}
.project-info{padding:1rem 1.25rem;}.project-info h4{font-weight:600;}
.project-link-card a{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;gap:0.75rem;min-height:160px;color:var(--ink2);}
.project-link-card a:hover{color:var(--accent);}
.link-icon{font-size:2rem;}.project-link-card p{font-size:0.75rem;word-break:break-all;color:var(--accent);}
.contact-links{display:flex;flex-direction:column;gap:0;}
.social-link{display:inline-flex;align-items:center;gap:1rem;font-size:1.0625rem;font-weight:500;color:var(--ink2);padding:1rem 0;border-bottom:1px solid var(--border);transition:color 0.2s,padding-left 0.2s;}
.social-link:hover{color:var(--accent);padding-left:0.5rem;}
.empty-note{color:var(--ink2);font-style:italic;}
footer{text-align:center;padding:3rem;font-size:0.8125rem;color:var(--ink2);}
footer a{color:var(--accent);}
@media(max-width:768px){.about-grid{grid-template-columns:1fr;}.nav-links{display:none;}}
</style>
</head>
<body>
<nav>
  <span class="nav-name">${esc(d.name)}</span>
  <div class="nav-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Work</a><a href="#contact">Contact</a></div>
</nav>
<div class="hero">
  <div class="eyebrow">${esc(d.profession)}</div>
  <h1 class="hero-name">${esc(d.name)}</h1>
  <p class="hero-bio">${esc(d.bio)}</p>
  <a href="#contact" class="cta">Start a project →</a>
</div>
<section id="about"><div class="inner">
  <div class="label">About</div>
  <div class="about-grid"><h2>The story so far.</h2><p class="about-text">${esc(d.bio)}</p></div>
</div></section>
<section id="services"><div class="inner">
  <div class="label">Services</div><h2>What I bring.</h2>
  <div class="services-grid">${services}</div>
</div></section>
<section id="projects"><div class="inner">
  <div class="label">Work</div><h2>Selected projects.</h2>
  <div class="projects-grid">${projects}</div>
</div></section>
<section id="contact"><div class="inner">
  <div class="label">Contact</div><h2>Let's build something.</h2>
  <div class="contact-links">${contact}</div>
</div></section>
<footer><p>© ${d.year} ${esc(d.name)} · Built with Portfolia</p></footer>
</body></html>`;
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE: WARM
  // ═══════════════════════════════════════════════════════════
  function buildWarm(d, services, projects, contact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#FDF8F0;--ink:#3D2C1E;--ink2:#8C7B6E;--accent:#D4845A;--warm2:#F5E6D3;--border:rgba(61,44,30,0.1);--font-d:'Lora',Georgia,serif;--font-b:'Nunito',system-ui,sans-serif;}
body{font-family:var(--font-b);background:var(--bg);color:var(--ink);line-height:1.6;}
a{color:inherit;text-decoration:none;}
nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 5vw;background:var(--bg);border-bottom:1px solid var(--border);}
.nav-name{font-family:var(--font-d);font-size:1.25rem;font-style:italic;}
.nav-links{display:flex;gap:1.75rem;font-size:0.875rem;font-weight:600;}
.nav-links a{color:var(--ink2);transition:color 0.2s;}.nav-links a:hover{color:var(--accent);}
.hero{padding:6rem 5vw;display:flex;align-items:center;gap:4rem;max-width:1000px;margin:0 auto;}
.hero-avatar{width:160px;height:160px;border-radius:50%;background:var(--warm2);border:4px solid var(--accent);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:3.5rem;}
.hero-tag{font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem;}
.hero-name{font-family:var(--font-d);font-size:clamp(2.5rem,6vw,5rem);letter-spacing:-0.02em;line-height:1.05;margin-bottom:1rem;}
.hero-bio{color:var(--ink2);max-width:440px;font-size:1.0625rem;line-height:1.8;}
.hero-cta{display:inline-block;margin-top:2rem;background:var(--accent);color:#fff;padding:0.875rem 2rem;border-radius:50px;font-weight:700;font-size:0.9375rem;transition:opacity 0.2s;}
.hero-cta:hover{opacity:0.85;}
section{padding:5rem 5vw;border-top:1px solid var(--border);}
.inner{max-width:1000px;margin:0 auto;}
.label{font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem;}
h2{font-family:var(--font-d);font-size:clamp(1.75rem,3.5vw,2.5rem);margin-bottom:2rem;line-height:1.2;}
.about-text{font-size:1.0625rem;color:var(--ink2);max-width:640px;line-height:1.85;}
.services-grid{display:flex;flex-wrap:wrap;gap:0.75rem;}
.service-card{background:var(--warm2);border-radius:12px;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:0.75rem;}
.service-icon{font-size:1.25rem;}.service-card p{font-weight:600;font-size:0.9375rem;}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;}
.project-card{border-radius:16px;overflow:hidden;border:1px solid var(--border);background:#fff;transition:transform 0.2s,box-shadow 0.2s;}
.project-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(61,44,30,0.12);}
.project-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;}
.project-info{padding:1rem 1.25rem;}.project-info h4{font-weight:700;}
.project-link-card a{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;gap:0.75rem;min-height:160px;color:var(--ink2);}
.project-link-card a:hover{color:var(--accent);}
.link-icon{font-size:2rem;}.project-link-card p{font-size:0.75rem;word-break:break-all;color:var(--accent);}
.contact-links{display:flex;flex-direction:column;gap:1rem;}
.social-link{display:inline-flex;align-items:center;gap:0.875rem;font-size:1.0625rem;font-weight:600;color:var(--ink);padding:0.875rem 1.25rem;background:var(--warm2);border-radius:10px;transition:background 0.2s;}
.social-link:hover{background:var(--accent);color:#fff;}
.empty-note{color:var(--ink2);font-style:italic;}
footer{text-align:center;padding:2.5rem;border-top:1px solid var(--border);font-size:0.8125rem;color:var(--ink2);}
footer a{color:var(--accent);}
@media(max-width:768px){.hero{flex-direction:column;gap:2rem;text-align:center;}.hero-avatar{width:110px;height:110px;font-size:2.5rem;}.nav-links{display:none;}}
</style>
</head>
<body>
<nav>
  <span class="nav-name">${esc(d.name)}</span>
  <div class="nav-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Work</a><a href="#contact">Contact</a></div>
</nav>
<div class="hero">
  <div class="hero-avatar">👋</div>
  <div>
    <div class="hero-tag">${esc(d.profession)}</div>
    <h1 class="hero-name">Hi, I'm ${esc(d.name)}.</h1>
    <p class="hero-bio">${esc(d.bio)}</p>
    <a href="#contact" class="hero-cta">Say hello →</a>
  </div>
</div>
<section id="about"><div class="inner"><div class="label">About Me</div><h2>A little more about me.</h2><p class="about-text">${esc(d.bio)}</p></div></section>
<section id="services"><div class="inner"><div class="label">Services</div><h2>How I can help.</h2><div class="services-grid">${services}</div></div></section>
<section id="projects"><div class="inner"><div class="label">My Work</div><h2>Things I've created.</h2><div class="projects-grid">${projects}</div></div></section>
<section id="contact"><div class="inner"><div class="label">Get In Touch</div><h2>Let's connect! 🤝</h2><div class="contact-links">${contact}</div></div></section>
<footer><p>Made with care by ${esc(d.name)} · © ${d.year} · Built with Portfolia</p></footer>
</body></html>`;
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE: EDITORIAL
  // ═══════════════════════════════════════════════════════════
  function buildEditorial(d, services, projects, contact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#F2EFE9;--ink:#1C1C1C;--ink2:#777;--border:rgba(28,28,28,0.1);--font-d:'Playfair Display',Georgia,serif;--font-b:'IBM Plex Sans',system-ui,sans-serif;}
body{font-family:var(--font-b);background:var(--bg);color:var(--ink);line-height:1.6;display:flex;min-height:100vh;}
a{color:inherit;text-decoration:none;}
.sidebar{width:220px;flex-shrink:0;background:#1C1C1C;color:#F2EFE9;padding:2.5rem 1.5rem;display:flex;flex-direction:column;gap:2rem;position:sticky;top:0;height:100vh;overflow-y:auto;}
.sidebar-name{font-family:var(--font-d);font-size:1.25rem;line-height:1.2;letter-spacing:-0.02em;font-style:italic;}
.sidebar-profession{font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(242,239,233,0.5);margin-top:0.25rem;}
.sidebar-nav{display:flex;flex-direction:column;gap:0;margin-top:auto;}
.sidebar-nav a{font-size:0.8125rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:rgba(242,239,233,0.5);padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.06);transition:color 0.2s;}
.sidebar-nav a:hover{color:#F2EFE9;}
.sidebar-copy{font-size:0.65rem;color:rgba(242,239,233,0.3);margin-top:2rem;}
.main{flex:1;overflow-y:auto;}
.hero{padding:6rem 5vw 5rem;border-bottom:1px solid var(--border);}
.eyebrow{font-size:0.7rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink2);margin-bottom:1.5rem;}
.hero-name{font-family:var(--font-d);font-size:clamp(3rem,7vw,6rem);line-height:0.95;letter-spacing:-0.04em;margin-bottom:2rem;}
.hero-name em{display:block;font-style:italic;font-weight:400;}
.hero-bio{font-size:1.0625rem;color:var(--ink2);max-width:520px;line-height:1.8;}
.hero-cta{display:inline-block;margin-top:2.5rem;border:2px solid var(--ink);padding:0.75rem 1.75rem;font-size:0.875rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;transition:background 0.2s,color 0.2s;}
.hero-cta:hover{background:var(--ink);color:var(--bg);}
section{padding:5rem 5vw;border-bottom:1px solid var(--border);}
.label{font-size:0.65rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink2);margin-bottom:1.25rem;}
h2{font-family:var(--font-d);font-size:clamp(1.75rem,3.5vw,2.75rem);letter-spacing:-0.03em;line-height:1.1;margin-bottom:2rem;}
.about-text{font-size:1.0625rem;color:var(--ink2);max-width:580px;line-height:1.85;}
.services-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);}
.service-card{background:var(--bg);padding:1.5rem;display:flex;flex-direction:column;gap:0.5rem;}
.service-icon{font-size:1rem;color:var(--ink2);}.service-card p{font-size:0.9375rem;font-weight:500;}
.projects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;}
.project-card{overflow:hidden;border:1px solid var(--border);transition:border-color 0.2s;}
.project-card:hover{border-color:var(--ink);}
.project-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;}
.project-info{padding:0.875rem 1rem;}.project-info h4{font-family:var(--font-d);font-size:1rem;font-style:italic;}
.project-link-card a{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;gap:0.75rem;min-height:160px;color:var(--ink2);}
.project-link-card a:hover{color:var(--ink);}
.link-icon{font-size:2rem;}.project-link-card p{font-size:0.75rem;word-break:break-all;}
.contact-links{display:flex;flex-direction:column;gap:0;}
.social-link{display:flex;align-items:center;gap:1rem;font-size:1rem;font-weight:500;padding:1rem 0;border-bottom:1px solid var(--border);color:var(--ink2);transition:color 0.2s;}
.social-link:hover{color:var(--ink);}
.empty-note{color:var(--ink2);font-style:italic;}
footer{padding:2rem 5vw;font-size:0.75rem;color:var(--ink2);}
footer a{color:var(--ink);}
@media(max-width:768px){body{flex-direction:column;}.sidebar{width:100%;height:auto;position:relative;}.projects-grid{grid-template-columns:1fr;}.services-grid{grid-template-columns:1fr;}}
</style>
</head>
<body>
<aside class="sidebar">
  <div><div class="sidebar-name">${esc(d.name)}</div><div class="sidebar-profession">${esc(d.profession)}</div></div>
  <nav class="sidebar-nav"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Work</a><a href="#contact">Contact</a></nav>
  <div class="sidebar-copy">© ${d.year} · Built with Portfolia</div>
</aside>
<main class="main">
  <div class="hero">
    <div class="eyebrow">${esc(d.profession)}</div>
    <h1 class="hero-name"><em>${esc(d.name)}</em></h1>
    <p class="hero-bio">${esc(d.bio)}</p>
    <a href="#contact" class="hero-cta">Contact me →</a>
  </div>
  <section id="about"><div class="label">About</div><h2>Background.</h2><p class="about-text">${esc(d.bio)}</p></section>
  <section id="services"><div class="label">Services</div><h2>Expertise.</h2><div class="services-grid">${services}</div></section>
  <section id="projects"><div class="label">Selected Work</div><h2>Portfolio.</h2><div class="projects-grid">${projects}</div></section>
  <section id="contact"><div class="label">Contact</div><h2>Reach out.</h2><div class="contact-links">${contact}</div></section>
  <footer><p>${esc(d.name)} · © ${d.year} · <a href="https://github.com" target="_blank">Built with Portfolia</a></p></footer>
</main>
</body></html>`;
  }

  // ═══════════════════════════════════════════════════════════
  // TEMPLATE: GLASS
  // ═══════════════════════════════════════════════════════════
  function buildGlass(d, services, projects, contact) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--font:'Space Grotesk',system-ui,sans-serif;--ink:#F0F0FF;--ink2:rgba(240,240,255,0.6);--accent:#A78BFA;--accent2:#60A5FA;--glass:rgba(255,255,255,0.07);--gb:rgba(255,255,255,0.15);}
body{font-family:var(--font);background:linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%) fixed;min-height:100vh;color:var(--ink);line-height:1.6;}
a{color:inherit;text-decoration:none;}
nav{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 5vw;background:rgba(0,0,0,0.2);backdrop-filter:blur(20px);border-bottom:1px solid var(--gb);position:sticky;top:0;z-index:10;}
.nav-name{font-size:1.125rem;font-weight:700;letter-spacing:-0.02em;}
.nav-links{display:flex;gap:2rem;font-size:0.875rem;font-weight:500;}
.nav-links a{color:var(--ink2);transition:color 0.2s;}.nav-links a:hover{color:var(--accent);}
.hero{padding:8rem 5vw 6rem;text-align:center;max-width:800px;margin:0 auto;}
.hero-tag{font-size:0.8rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1.5rem;}
.hero-name{font-size:clamp(3rem,8vw,7rem);font-weight:700;letter-spacing:-0.04em;line-height:0.95;margin-bottom:1.5rem;}
.hero-bio{font-size:1.0625rem;color:var(--ink2);max-width:500px;margin:0 auto 2.5rem;line-height:1.8;}
.cta{display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;padding:0.875rem 2rem;border-radius:100px;font-weight:600;font-size:0.9375rem;transition:transform 0.2s,box-shadow 0.2s;}
.cta:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(167,139,250,0.4);}
.gsec{padding:5rem 5vw;}
.inner{max-width:1000px;margin:0 auto;}
.gc{background:var(--glass);border:1px solid var(--gb);border-radius:20px;padding:2.5rem;backdrop-filter:blur(20px);margin-bottom:1.5rem;}
.label{font-size:0.7rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.75rem;}
h2{font-size:clamp(1.75rem,3.5vw,2.5rem);font-weight:700;letter-spacing:-0.03em;line-height:1.1;margin-bottom:1.5rem;}
.about-text{font-size:1.0625rem;color:var(--ink2);line-height:1.8;}
.services-grid{display:flex;flex-wrap:wrap;gap:0.75rem;}
.service-card{background:rgba(255,255,255,0.05);border:1px solid var(--gb);border-radius:12px;padding:1rem 1.5rem;display:flex;align-items:center;gap:0.75rem;backdrop-filter:blur(10px);transition:background 0.2s;}
.service-card:hover{background:rgba(167,139,250,0.15);}
.service-icon{font-size:1.125rem;}.service-card p{font-size:0.9375rem;font-weight:500;}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;}
.project-card{background:var(--glass);border:1px solid var(--gb);border-radius:16px;overflow:hidden;backdrop-filter:blur(12px);transition:transform 0.2s,border-color 0.2s;}
.project-card:hover{transform:translateY(-4px);border-color:var(--accent);}
.project-card img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;}
.project-info{padding:1rem 1.25rem;}.project-info h4{font-weight:600;}
.project-link-card a{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center;gap:0.75rem;min-height:160px;color:var(--ink2);}
.project-link-card a:hover{color:var(--accent);}
.link-icon{font-size:2rem;}.project-link-card p{font-size:0.75rem;word-break:break-all;color:var(--accent);}
.contact-links{display:flex;flex-direction:column;gap:0.75rem;}
.social-link{display:inline-flex;align-items:center;gap:1rem;font-size:1rem;font-weight:500;color:var(--ink);padding:1rem 1.25rem;background:var(--glass);border:1px solid var(--gb);border-radius:12px;transition:background 0.2s,border-color 0.2s;backdrop-filter:blur(12px);}
.social-link:hover{background:rgba(167,139,250,0.15);border-color:var(--accent);}
.empty-note{color:var(--ink2);font-style:italic;}
footer{text-align:center;padding:3rem;font-size:0.8125rem;color:var(--ink2);}
footer a{color:var(--accent);}
@media(max-width:768px){.nav-links{display:none;}}
</style>
</head>
<body>
<nav>
  <span class="nav-name">${esc(d.name)}</span>
  <div class="nav-links"><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Work</a><a href="#contact">Contact</a></div>
</nav>
<div class="hero">
  <div class="hero-tag">${esc(d.profession)}</div>
  <h1 class="hero-name">${esc(d.name)}</h1>
  <p class="hero-bio">${esc(d.bio)}</p>
  <a href="#contact" class="cta">Let's Connect ✨</a>
</div>
<div class="gsec" id="about"><div class="inner"><div class="gc"><div class="label">About</div><h2>Who I am.</h2><p class="about-text">${esc(d.bio)}</p></div></div></div>
<div class="gsec" id="services"><div class="inner"><div class="gc"><div class="label">Services</div><h2>What I do.</h2><div class="services-grid">${services}</div></div></div></div>
<div class="gsec" id="projects"><div class="inner"><div class="gc"><div class="label">Work</div><h2>My projects.</h2><div class="projects-grid">${projects}</div></div></div></div>
<div class="gsec" id="contact"><div class="inner"><div class="gc"><div class="label">Contact</div><h2>Get in touch.</h2><div class="contact-links">${contact}</div></div></div></div>
<footer><p>© ${d.year} ${esc(d.name)} · Built with Portfolia</p></footer>
</body></html>`;
  }

  // ─── Init ────────────────────────────────────────────────────────────────────
  goToStep(1);

})();
