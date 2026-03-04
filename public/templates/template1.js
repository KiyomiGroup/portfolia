/**
 * Template 1: Midnight Modern
 * Dark, elegant, minimal — inspired by luxury creative studios
 */

module.exports = function template1(user) {
  const services = (user.services || []).map(s => `
    <div class="service-card">
      <div class="service-icon">◈</div>
      <h3>${escHtml(s.title || s)}</h3>
      <p>${escHtml(s.description || '')}</p>
    </div>`).join('');

  const projects = (user.projects || []).map(p => `
    <div class="project-card">
      ${p.image ? `<div class="project-img"><img src="${escHtml(p.image)}" alt="${escHtml(p.title || '')}" /></div>` : `<div class="project-img placeholder"><span>◈</span></div>`}
      <div class="project-info">
        <h3>${escHtml(p.title || 'Project')}</h3>
        <p>${escHtml(p.description || '')}</p>
        ${p.link ? `<a href="${escHtml(p.link)}" target="_blank" class="project-link">View Project →</a>` : ''}
      </div>
    </div>`).join('');

  const socials = buildSocials(user, '#c9a96e');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(user.name)} — ${escHtml(user.profession)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0a;
      --surface: #141414;
      --border: #222;
      --gold: #c9a96e;
      --text: #e8e8e0;
      --muted: #888;
      --ff-display: 'Cormorant Garamond', serif;
      --ff-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--ff-body);
      font-weight: 300;
      line-height: 1.7;
    }

    /* Nav */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.5rem 4rem;
      background: rgba(10,10,10,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo {
      font-family: var(--ff-display);
      font-size: 1.4rem;
      color: var(--gold);
      letter-spacing: 0.05em;
    }
    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      transition: color 0.3s;
    }
    .nav-links a:hover { color: var(--gold); }

    /* Hero */
    #hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 8rem 4rem 4rem;
      position: relative;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 60% at 70% 50%, rgba(201,169,110,0.06) 0%, transparent 70%);
    }
    .hero-line {
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 1px; background: linear-gradient(to bottom, transparent, var(--gold), transparent);
      left: 4rem;
      opacity: 0.4;
    }
    .hero-content { max-width: 700px; position: relative; }
    .hero-eyebrow {
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1.5rem;
    }
    .hero-name {
      font-family: var(--ff-display);
      font-size: clamp(3.5rem, 8vw, 7rem);
      font-weight: 300;
      line-height: 1;
      letter-spacing: -0.02em;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-family: var(--ff-display);
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      color: var(--gold);
      font-weight: 400;
      margin-bottom: 2rem;
    }
    .hero-bio {
      color: var(--muted);
      font-size: 1rem;
      max-width: 480px;
      margin-bottom: 3rem;
    }
    .hero-cta {
      display: inline-block;
      padding: 1rem 2.5rem;
      border: 1px solid var(--gold);
      color: var(--gold);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      transition: all 0.3s;
    }
    .hero-cta:hover {
      background: var(--gold);
      color: var(--bg);
    }

    /* Sections */
    section { padding: 6rem 4rem; border-top: 1px solid var(--border); }
    .section-label {
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 3rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .section-label::after {
      content: '';
      flex: 1;
      max-width: 60px;
      height: 1px;
      background: var(--gold);
      opacity: 0.4;
    }
    .section-title {
      font-family: var(--ff-display);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 300;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    /* About */
    #about .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }
    #about .about-text { color: var(--muted); font-size: 1.05rem; line-height: 1.9; }
    #about .about-avatar {
      aspect-ratio: 3/4;
      background: var(--surface);
      border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--ff-display);
      font-size: 5rem;
      color: var(--gold);
      opacity: 0.5;
      overflow: hidden;
    }
    #about .about-avatar img { width: 100%; height: 100%; object-fit: cover; }

    /* Services */
    #services { background: var(--surface); }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    .service-card {
      padding: 2.5rem;
      border: 1px solid var(--border);
      background: var(--bg);
      transition: border-color 0.3s;
    }
    .service-card:hover { border-color: var(--gold); }
    .service-icon { font-size: 1.5rem; color: var(--gold); margin-bottom: 1rem; }
    .service-card h3 {
      font-family: var(--ff-display);
      font-size: 1.3rem;
      font-weight: 400;
      margin-bottom: 0.75rem;
    }
    .service-card p { color: var(--muted); font-size: 0.9rem; }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    .project-card {
      border: 1px solid var(--border);
      overflow: hidden;
      transition: border-color 0.3s;
    }
    .project-card:hover { border-color: var(--gold); }
    .project-img {
      aspect-ratio: 16/9;
      overflow: hidden;
      background: var(--surface);
    }
    .project-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .project-card:hover .project-img img { transform: scale(1.05); }
    .project-img.placeholder {
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; color: var(--gold); opacity: 0.3;
    }
    .project-info { padding: 1.75rem; }
    .project-info h3 {
      font-family: var(--ff-display);
      font-size: 1.3rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }
    .project-info p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem; }
    .project-link {
      color: var(--gold);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
    }

    /* Contact */
    #contact { background: var(--surface); }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      margin-top: 3rem;
    }
    .contact-info p { color: var(--muted); font-size: 1.05rem; margin-bottom: 2rem; }
    .contact-details { display: flex; flex-direction: column; gap: 1rem; }
    .contact-item {
      display: flex; align-items: center; gap: 1rem;
      color: var(--text); text-decoration: none; font-size: 0.95rem;
    }
    .contact-item span { color: var(--gold); font-size: 1.1rem; }
    .socials { display: flex; gap: 1.5rem; margin-top: 2rem; flex-wrap: wrap; }
    .socials a {
      display: inline-flex; align-items: center; gap: 0.5rem;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: 1px solid var(--border);
      padding: 0.6rem 1.2rem;
      transition: all 0.3s;
    }
    .socials a:hover { border-color: var(--gold); color: var(--gold); }

    /* Footer */
    footer {
      padding: 2rem 4rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--muted);
      font-size: 0.8rem;
    }
    footer a { color: var(--gold); text-decoration: none; }

    /* Responsive */
    @media (max-width: 768px) {
      nav { padding: 1.25rem 1.5rem; }
      .nav-links { display: none; }
      #hero, section { padding: 5rem 1.5rem 3rem; }
      .hero-line { display: none; }
      #about .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
      footer { flex-direction: column; gap: 0.5rem; text-align: center; }
    }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero-eyebrow { animation: fadeUp 0.8s ease forwards; }
    .hero-name { animation: fadeUp 0.8s 0.15s ease forwards; opacity: 0; }
    .hero-title { animation: fadeUp 0.8s 0.3s ease forwards; opacity: 0; }
    .hero-bio { animation: fadeUp 0.8s 0.45s ease forwards; opacity: 0; }
    .hero-cta { animation: fadeUp 0.8s 0.6s ease forwards; opacity: 0; }
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
    <div class="hero-bg"></div>
    <div class="hero-line"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">Portfolio</p>
      <h1 class="hero-name">${escHtml(user.name)}</h1>
      <p class="hero-title">${escHtml(user.profession)}</p>
      <p class="hero-bio">${escHtml(user.bio)}</p>
      <a href="#contact" class="hero-cta">Get in Touch</a>
    </div>
  </section>

  <section id="about">
    <div class="section-label">About</div>
    <div class="about-grid">
      <div>
        <h2 class="section-title">The Person<br>Behind the Work</h2>
        <p class="about-text">${escHtml(user.bio)}</p>
      </div>
      <div class="about-avatar">
        ${user.avatar ? `<img src="${escHtml(user.avatar)}" alt="${escHtml(user.name)}" />` : '👤'}
      </div>
    </div>
  </section>

  <section id="services">
    <div class="section-label">What I Do</div>
    <h2 class="section-title">Services</h2>
    ${services ? `<div class="services-grid">${services}</div>` : '<p style="color:var(--muted)">Services coming soon.</p>'}
  </section>

  <section id="projects">
    <div class="section-label">Selected Work</div>
    <h2 class="section-title">Projects</h2>
    ${projects ? `<div class="projects-grid">${projects}</div>` : '<p style="color:var(--muted)">Projects coming soon.</p>'}
  </section>

  <section id="contact">
    <div class="section-label">Let's Connect</div>
    <div class="contact-grid">
      <div class="contact-info">
        <h2 class="section-title">Start a<br>Conversation</h2>
        <p>Available for new projects and collaborations. Don't hesitate to reach out.</p>
        <div class="socials">${socials}</div>
      </div>
      <div class="contact-details">
        ${user.email ? `<a href="mailto:${escHtml(user.email)}" class="contact-item"><span>✉</span> ${escHtml(user.email)}</a>` : ''}
        ${user.phone ? `<a href="tel:${escHtml(user.phone)}" class="contact-item"><span>✆</span> ${escHtml(user.phone)}</a>` : ''}
        ${user.website ? `<a href="${escHtml(user.website)}" target="_blank" class="contact-item"><span>🌐</span> ${escHtml(user.website)}</a>` : ''}
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${escHtml(user.name)}. All rights reserved.</p>
    <p>Built with <a href="/">Portfolia</a></p>
  </footer>

</body>
</html>`;
};

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSocials(user, color) {
  const links = [];
  if (user.linkedin) links.push(`<a href="${escHtml(user.linkedin)}" target="_blank">LinkedIn</a>`);
  if (user.github) links.push(`<a href="${escHtml(user.github)}" target="_blank">GitHub</a>`);
  if (user.website) links.push(`<a href="${escHtml(user.website)}" target="_blank">Website</a>`);
  return links.join('');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
