/**
 * Template 3: Neon Grid
 * Bold, tech-forward, dark with electric accents — for developers, tech creatives
 */

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

module.exports = function template3(user) {
  const services = (user.services || []).map(s => `
    <div class="service-card">
      <div class="card-top"><span class="bullet">▸</span><h3>${escHtml(s.title || s)}</h3></div>
      <p>${escHtml(s.description || '')}</p>
    </div>`).join('');

  const projects = (user.projects || []).map(p => `
    <div class="project-card">
      <div class="project-header">
        <h3>${escHtml(p.title || 'Project')}</h3>
        ${p.link ? `<a href="${escHtml(p.link)}" target="_blank" class="ext-link">↗</a>` : ''}
      </div>
      ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title || '')}" />` : ''}
      <p>${escHtml(p.description || '')}</p>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(user.name)} // ${escHtml(user.profession)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #060610;
      --surface: #0d0d20;
      --neon: #00f5c4;
      --purple: #7c3aed;
      --text: #e0e0ff;
      --muted: #6b6b9a;
      --border: rgba(124,58,237,0.25);
      --ff-mono: 'Space Mono', monospace;
      --ff-display: 'Syne', sans-serif;
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--ff-mono);
      font-size: 0.9rem;
      line-height: 1.7;
    }
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: 
        linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 0;
    }
    * { position: relative; z-index: 1; }

    nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.5rem 5vw;
      border-bottom: 1px solid var(--border);
      background: rgba(6,6,16,0.95);
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(8px);
    }
    .nav-logo {
      font-family: var(--ff-display);
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--neon);
      letter-spacing: 0.05em;
    }
    .nav-logo span { color: var(--muted); font-weight: 400; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.75rem; letter-spacing: 0.1em; transition: color 0.2s; }
    .nav-links a:hover { color: var(--neon); }

    #hero {
      min-height: 90vh;
      display: flex; flex-direction: column; justify-content: center;
      padding: 4rem 5vw;
      border-bottom: 1px solid var(--border);
    }
    .hero-prefix { color: var(--neon); font-size: 0.8rem; letter-spacing: 0.1em; margin-bottom: 1rem; }
    .hero-name {
      font-family: var(--ff-display);
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }
    .hero-name .highlight { 
      -webkit-text-stroke: 1px var(--neon);
      color: transparent;
    }
    .hero-role {
      font-family: var(--ff-display);
      font-size: clamp(1rem, 2.5vw, 1.6rem);
      color: var(--purple);
      font-weight: 400;
      margin-bottom: 2rem;
    }
    .hero-bio { color: var(--muted); max-width: 520px; margin-bottom: 3rem; font-size: 0.9rem; }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary {
      display: inline-block;
      background: var(--neon);
      color: var(--bg);
      padding: 0.85rem 2.2rem;
      text-decoration: none;
      font-family: var(--ff-mono);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.85; }
    .btn-outline {
      display: inline-block;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.85rem 2.2rem;
      text-decoration: none;
      font-family: var(--ff-mono);
      font-size: 0.8rem;
      transition: border-color 0.2s;
    }
    .btn-outline:hover { border-color: var(--neon); color: var(--neon); }

    section { padding: 5rem 5vw; border-bottom: 1px solid var(--border); }
    .sec-label {
      display: flex; align-items: center; gap: 1rem;
      font-size: 0.7rem; letter-spacing: 0.2em; color: var(--neon);
      margin-bottom: 2.5rem;
    }
    .sec-label::before { content: '//'; color: var(--muted); }
    .sec-title {
      font-family: var(--ff-display);
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 800;
      line-height: 1;
      margin-bottom: 2rem;
    }

    #about .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .about-bio { color: var(--muted); font-size: 0.92rem; line-height: 1.9; }
    .about-card {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 2.5rem;
    }
    .about-card .name { font-family: var(--ff-display); font-size: 1.4rem; font-weight: 700; color: var(--neon); }
    .about-card .title { color: var(--muted); font-size: 0.8rem; margin: 0.5rem 0 1.5rem; }
    .about-stat { margin-top: 1rem; }
    .about-stat label { font-size: 0.65rem; letter-spacing: 0.15em; color: var(--muted); text-transform: uppercase; }
    .about-stat p { color: var(--text); }

    #services .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .service-card {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 2rem;
      transition: border-color 0.3s;
    }
    .service-card:hover { border-color: var(--neon); }
    .card-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .bullet { color: var(--neon); font-size: 1.1rem; }
    .service-card h3 { font-family: var(--ff-display); font-size: 1rem; font-weight: 700; }
    .service-card p { color: var(--muted); font-size: 0.85rem; }

    #projects .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 1.75rem;
      transition: border-color 0.3s;
    }
    .project-card:hover { border-color: var(--purple); }
    .project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .project-header h3 { font-family: var(--ff-display); font-size: 1.1rem; font-weight: 700; }
    .ext-link { color: var(--neon); font-size: 1.2rem; text-decoration: none; }
    .project-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; margin-bottom: 1rem; opacity: 0.8; }
    .project-card p { color: var(--muted); font-size: 0.85rem; }

    #contact { background: var(--surface); }
    .contact-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
    .contact-left p { color: var(--muted); margin-bottom: 2rem; }
    .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
    .contact-link {
      display: flex; align-items: center; gap: 1rem;
      color: var(--text); text-decoration: none;
      padding: 1rem;
      border: 1px solid var(--border);
      transition: all 0.2s;
      font-size: 0.85rem;
    }
    .contact-link:hover { border-color: var(--neon); color: var(--neon); }
    .contact-link .icon { color: var(--neon); width: 20px; text-align: center; }
    .socials { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
    .socials a {
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 0.5rem 1rem;
      text-decoration: none;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      transition: all 0.2s;
    }
    .socials a:hover { border-color: var(--neon); color: var(--neon); }

    footer {
      padding: 1.5rem 5vw;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      color: var(--muted);
      font-size: 0.75rem;
    }
    footer a { color: var(--neon); text-decoration: none; }

    @media (max-width: 768px) {
      #about .about-grid, .contact-wrapper { grid-template-columns: 1fr; gap: 2rem; }
      section { padding: 3rem 5vw; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="nav-logo">${escHtml(user.name.split(' ')[0])}<span>.dev</span></div>
    <ul class="nav-links">
      <li><a href="#about">about</a></li>
      <li><a href="#services">services</a></li>
      <li><a href="#projects">projects</a></li>
      <li><a href="#contact">contact</a></li>
    </ul>
  </nav>

  <section id="hero">
    <p class="hero-prefix">// Hello, World.</p>
    <h1 class="hero-name">
      ${escHtml(user.name.split(' ')[0])}<br>
      <span class="highlight">${escHtml(user.name.split(' ').slice(1).join(' ') || user.profession)}</span>
    </h1>
    <p class="hero-role">${escHtml(user.profession)}</p>
    <p class="hero-bio">${escHtml(user.bio)}</p>
    <div class="hero-actions">
      <a href="#projects" class="btn-primary">View Work</a>
      <a href="#contact" class="btn-outline">Get in Touch</a>
    </div>
  </section>

  <section id="about">
    <div class="sec-label">ABOUT</div>
    <div class="about-grid">
      <div>
        <h2 class="sec-title">Who I Am</h2>
        <p class="about-bio">${escHtml(user.bio)}</p>
      </div>
      <div class="about-card">
        <div class="name">${escHtml(user.name)}</div>
        <div class="title">${escHtml(user.profession)}</div>
        ${user.email ? `<div class="about-stat"><label>Email</label><p>${escHtml(user.email)}</p></div>` : ''}
        ${user.linkedin ? `<div class="about-stat"><label>LinkedIn</label><p>${escHtml(user.linkedin)}</p></div>` : ''}
      </div>
    </div>
  </section>

  <section id="services">
    <div class="sec-label">SERVICES</div>
    <h2 class="sec-title">What I Do</h2>
    ${services ? `<div class="services-grid">${services}</div>` : '<p style="color:var(--muted)">// Coming soon</p>'}
  </section>

  <section id="projects">
    <div class="sec-label">PROJECTS</div>
    <h2 class="sec-title">Selected Work</h2>
    ${projects ? `<div class="projects-grid">${projects}</div>` : '<p style="color:var(--muted)">// Coming soon</p>'}
  </section>

  <section id="contact">
    <div class="sec-label">CONTACT</div>
    <div class="contact-wrapper">
      <div class="contact-left">
        <h2 class="sec-title">Let's Build<br>Something.</h2>
        <p>${escHtml(user.bio || "Open to new projects and collaborations.")}</p>
        <div class="socials">
          ${user.linkedin ? `<a href="${escHtml(user.linkedin)}" target="_blank">LinkedIn</a>` : ''}
          ${user.github ? `<a href="${escHtml(user.github)}" target="_blank">GitHub</a>` : ''}
          ${user.website ? `<a href="${escHtml(user.website)}" target="_blank">Website</a>` : ''}
        </div>
      </div>
      <div>
        <div class="contact-links">
          ${user.email ? `<a href="mailto:${escHtml(user.email)}" class="contact-link"><span class="icon">✉</span> ${escHtml(user.email)}</a>` : ''}
          ${user.phone ? `<a href="tel:${escHtml(user.phone)}" class="contact-link"><span class="icon">✆</span> ${escHtml(user.phone)}</a>` : ''}
          ${user.website ? `<a href="${escHtml(user.website)}" target="_blank" class="contact-link"><span class="icon">🌐</span> ${escHtml(user.website)}</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <footer>
    <span>&copy; ${new Date().getFullYear()} ${escHtml(user.name)}</span>
    <span>// built with <a href="/">Portfolia</a></span>
  </footer>

</body>
</html>`;
};
