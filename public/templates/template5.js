/**
 * Template 5: Bold Serif
 * High-contrast black/white, editorial magazine layout — for thought leaders, writers, executives
 */

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

module.exports = function template5(user) {
  const services = (user.services || []).map((s, i) => `
    <div class="service-row">
      <span class="service-idx">${String(i+1).padStart(2,'0')}</span>
      <h3>${escHtml(s.title || s)}</h3>
      <p>${escHtml(s.description || '')}</p>
    </div>`).join('');

  const projects = (user.projects || []).map(p => `
    <div class="project-entry">
      ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title||'')}" />` : '<div class="proj-blank"></div>'}
      <div class="project-body">
        <h3>${escHtml(p.title || 'Untitled')}</h3>
        <p>${escHtml(p.description || '')}</p>
        ${p.link ? `<a href="${escHtml(p.link)}" target="_blank">View project ↗</a>` : ''}
      </div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(user.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --black: #0c0c0c;
      --white: #f8f7f4;
      --mid: #e0deda;
      --accent: #d4361e;
      --muted: #888;
      --ff-display: 'Libre Baskerville', serif;
      --ff-body: 'Barlow', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--white); color: var(--black); font-family: var(--ff-body); font-weight: 300; }

    nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.5rem 5vw;
      position: sticky; top: 0; z-index: 100;
      background: var(--white);
      border-bottom: 2px solid var(--black);
    }
    .nav-logo { font-family: var(--ff-display); font-size: 1rem; letter-spacing: 0.03em; }
    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a { color: var(--black); text-decoration: none; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
    .nav-links a:hover { color: var(--accent); }

    #hero {
      padding: 5rem 5vw 0;
      border-bottom: 2px solid var(--black);
      display: grid;
      grid-template-rows: auto auto;
    }
    .hero-top {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: end;
      padding-bottom: 3rem;
      border-bottom: 1px solid var(--mid);
      margin-bottom: 3rem;
    }
    .hero-name {
      font-family: var(--ff-display);
      font-size: clamp(3.5rem, 9vw, 9rem);
      font-weight: 700;
      line-height: 0.9;
      letter-spacing: -0.03em;
    }
    .hero-name em { font-style: italic; color: var(--accent); }
    .hero-meta { text-align: right; }
    .hero-profession {
      font-family: var(--ff-display);
      font-style: italic;
      font-size: clamp(1rem, 2vw, 1.5rem);
      color: var(--muted);
      margin-bottom: 1rem;
    }
    .hero-bio-line {
      max-width: 280px;
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.6;
    }
    .hero-bottom {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 2.5rem;
    }
    .hero-tagline {
      font-family: var(--ff-display);
      font-size: clamp(1.2rem, 2.5vw, 2rem);
      font-weight: 400;
      font-style: italic;
      max-width: 600px;
    }
    .hero-cta {
      display: inline-block;
      background: var(--black);
      color: var(--white);
      padding: 1rem 2.5rem;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .hero-cta:hover { background: var(--accent); }

    section { padding: 5rem 5vw; border-bottom: 2px solid var(--black); }
    .sec-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 3rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--mid);
    }
    .sec-num {
      font-family: var(--ff-display);
      font-size: 4rem;
      font-weight: 700;
      color: var(--mid);
      line-height: 1;
    }
    .sec-label { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }
    .sec-title {
      font-family: var(--ff-display);
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 700;
      line-height: 1.1;
    }

    #about { background: var(--black); color: var(--white); }
    #about .sec-title { color: var(--white); }
    #about .sec-num { color: #333; }
    .about-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 5rem; margin-top: 2rem; align-items: start; }
    .about-text { color: rgba(248,247,244,0.7); font-size: 1.05rem; line-height: 1.9; }
    .about-aside {
      border-left: 1px solid #333;
      padding-left: 2.5rem;
    }
    .aside-quote {
      font-family: var(--ff-display);
      font-size: 1.4rem;
      font-style: italic;
      color: var(--white);
      line-height: 1.5;
      margin-bottom: 2rem;
    }
    .aside-contact a {
      display: block;
      color: rgba(248,247,244,0.5);
      text-decoration: none;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      transition: color 0.2s;
    }
    .aside-contact a:hover { color: var(--accent); }

    #services .services-list { display: flex; flex-direction: column; }
    .service-row {
      display: grid;
      grid-template-columns: 60px 1fr 2fr;
      gap: 2rem;
      align-items: start;
      padding: 2rem 0;
      border-bottom: 1px solid var(--mid);
    }
    .service-idx { font-family: var(--ff-display); font-size: 1.5rem; color: var(--mid); font-weight: 700; }
    .service-row h3 { font-family: var(--ff-display); font-size: 1.2rem; font-weight: 700; }
    .service-row p { color: var(--muted); font-size: 0.9rem; line-height: 1.7; }

    #projects .projects-list { display: flex; flex-direction: column; gap: 3rem; margin-top: 2rem; }
    .project-entry { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; border: 1px solid var(--mid); }
    .project-entry img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
    .proj-blank { width: 100%; aspect-ratio: 4/3; background: var(--mid); }
    .project-body { padding: 2.5rem; }
    .project-body h3 { font-family: var(--ff-display); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.75rem; }
    .project-body p { color: var(--muted); line-height: 1.8; margin-bottom: 1.25rem; }
    .project-body a { color: var(--accent); text-decoration: none; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.05em; }

    #contact { background: var(--accent); color: var(--white); }
    .contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; margin-top: 2rem; }
    .contact-headline {
      font-family: var(--ff-display);
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1;
      color: var(--white);
    }
    .contact-detail {
      display: flex; flex-direction: column; gap: 1.5rem; justify-content: center;
    }
    .contact-row {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.3);
    }
    .contact-row label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.6; display: block; margin-bottom: 0.3rem; }
    .contact-row a { color: var(--white); text-decoration: none; font-size: 1rem; font-weight: 500; }
    .socials { display: flex; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap; }
    .socials a {
      border: 1px solid rgba(255,255,255,0.4);
      color: var(--white);
      padding: 0.5rem 1.2rem;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      transition: background 0.2s;
    }
    .socials a:hover { background: rgba(255,255,255,0.2); }

    footer {
      padding: 1.5rem 5vw;
      display: flex; justify-content: space-between;
      background: var(--black); color: var(--muted); font-size: 0.8rem;
    }
    footer a { color: var(--white); text-decoration: none; }

    @media (max-width: 900px) {
      .hero-top { grid-template-columns: 1fr; }
      .hero-meta { text-align: left; }
      .hero-bio-line { max-width: 100%; }
      .hero-bottom { flex-direction: column; gap: 2rem; align-items: flex-start; }
    }
    @media (max-width: 768px) {
      .about-grid, .contact-layout, .project-entry { grid-template-columns: 1fr; gap: 2rem; }
      .service-row { grid-template-columns: 40px 1fr; }
      .service-row p { grid-column: 2; }
      section { padding: 3.5rem 5vw; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="nav-logo">${escHtml(user.name)}</div>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#projects">Work</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <section id="hero">
    <div class="hero-top">
      <h1 class="hero-name">${escHtml(user.name.split(' ')[0])}<br><em>${escHtml(user.name.split(' ').slice(1).join(' ') || '')}</em></h1>
      <div class="hero-meta">
        <p class="hero-profession">${escHtml(user.profession)}</p>
        <p class="hero-bio-line">${escHtml(user.bio)}</p>
      </div>
    </div>
    <div class="hero-bottom">
      <p class="hero-tagline">"${escHtml(user.bio || 'Creating work that matters.')}"</p>
      <a href="#contact" class="hero-cta">Hire Me</a>
    </div>
  </section>

  <section id="about">
    <div class="sec-header">
      <div>
        <p class="sec-label">About</p>
        <h2 class="sec-title" style="color:var(--white)">The Story</h2>
      </div>
      <span class="sec-num">01</span>
    </div>
    <div class="about-grid">
      <p class="about-text">${escHtml(user.bio)}</p>
      <div class="about-aside">
        <p class="aside-quote">"Every project is a chance to create something lasting."</p>
        <div class="aside-contact">
          ${user.email ? `<a href="mailto:${escHtml(user.email)}">✉ ${escHtml(user.email)}</a>` : ''}
          ${user.phone ? `<a href="tel:${escHtml(user.phone)}">✆ ${escHtml(user.phone)}</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <section id="services">
    <div class="sec-header">
      <div>
        <p class="sec-label">What I Offer</p>
        <h2 class="sec-title">Services</h2>
      </div>
      <span class="sec-num">02</span>
    </div>
    ${services ? `<div class="services-list">${services}</div>` : '<p style="color:var(--muted)">Services coming soon.</p>'}
  </section>

  <section id="projects">
    <div class="sec-header">
      <div>
        <p class="sec-label">Portfolio</p>
        <h2 class="sec-title">Selected Work</h2>
      </div>
      <span class="sec-num">03</span>
    </div>
    ${projects ? `<div class="projects-list">${projects}</div>` : '<p style="color:var(--muted)">Projects coming soon.</p>'}
  </section>

  <section id="contact">
    <div class="contact-layout">
      <div>
        <p style="font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;opacity:0.7;margin-bottom:1rem">04 — Contact</p>
        <h2 class="contact-headline">Let's<br>Work<br>Together.</h2>
      </div>
      <div class="contact-detail">
        ${user.email ? `<div class="contact-row"><label>Email</label><a href="mailto:${escHtml(user.email)}">${escHtml(user.email)}</a></div>` : ''}
        ${user.phone ? `<div class="contact-row"><label>Phone</label><a href="tel:${escHtml(user.phone)}">${escHtml(user.phone)}</a></div>` : ''}
        <div class="socials">
          ${user.linkedin ? `<a href="${escHtml(user.linkedin)}" target="_blank">LinkedIn</a>` : ''}
          ${user.github ? `<a href="${escHtml(user.github)}" target="_blank">GitHub</a>` : ''}
          ${user.website ? `<a href="${escHtml(user.website)}" target="_blank">Website</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <footer>
    <span>&copy; ${new Date().getFullYear()} ${escHtml(user.name)}. All rights reserved.</span>
    <span>Built with <a href="/">Portfolia</a></span>
  </footer>

</body>
</html>`;
};
