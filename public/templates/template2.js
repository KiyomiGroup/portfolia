/**
 * Template 2: Fresh Light
 * Clean white, editorial, airy — perfect for designers, writers, photographers
 */

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

module.exports = function template2(user) {
  const services = (user.services || []).map((s, i) => `
    <div class="service-item">
      <span class="service-num">0${i + 1}</span>
      <div>
        <h3>${escHtml(s.title || s)}</h3>
        <p>${escHtml(s.description || '')}</p>
      </div>
    </div>`).join('');

  const projects = (user.projects || []).map(p => `
    <div class="project-card">
      <div class="project-img">
        ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title || '')}" />` : '<div class="img-placeholder"></div>'}
      </div>
      <div class="project-meta">
        <h3>${escHtml(p.title || 'Project')}</h3>
        <p>${escHtml(p.description || '')}</p>
        ${p.link ? `<a href="${escHtml(p.link)}" target="_blank">View →</a>` : ''}
      </div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(user.name)} — ${escHtml(user.profession)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #fafaf8;
      --white: #ffffff;
      --text: #1a1a1a;
      --muted: #777;
      --accent: #e8533a;
      --border: #e8e8e4;
      --ff-display: 'Playfair Display', serif;
      --ff-body: 'Inter', sans-serif;
    }

    body { background: var(--bg); color: var(--text); font-family: var(--ff-body); font-weight: 300; }

    nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 5vw;
      background: var(--white);
      border-bottom: 1px solid var(--border);
    }
    .nav-name { font-family: var(--ff-display); font-size: 1.1rem; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.85rem; transition: color 0.2s; }
    .nav-links a:hover { color: var(--accent); }

    #hero {
      background: var(--white);
      padding: 8rem 5vw 6rem;
      border-bottom: 1px solid var(--border);
    }
    .hero-tag {
      display: inline-block;
      background: var(--accent);
      color: white;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.4rem 1rem;
      margin-bottom: 2rem;
    }
    .hero-name {
      font-family: var(--ff-display);
      font-size: clamp(3rem, 7vw, 6rem);
      font-weight: 700;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .hero-name em { font-style: italic; color: var(--accent); }
    .hero-title {
      font-family: var(--ff-display);
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      font-weight: 400;
      font-style: italic;
      color: var(--muted);
      margin-bottom: 2rem;
    }
    .hero-bio { max-width: 520px; color: var(--muted); line-height: 1.8; margin-bottom: 2.5rem; }
    .hero-cta {
      display: inline-block;
      background: var(--text);
      color: var(--white);
      padding: 0.9rem 2.5rem;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      transition: background 0.3s;
    }
    .hero-cta:hover { background: var(--accent); }

    section { padding: 6rem 5vw; }
    .section-header { margin-bottom: 3.5rem; }
    .section-num { font-size: 0.7rem; letter-spacing: 0.2em; color: var(--accent); margin-bottom: 0.5rem; }
    .section-title {
      font-family: var(--ff-display);
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      line-height: 1.15;
    }

    #about {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 6rem;
      align-items: start;
    }
    .about-text { color: var(--muted); line-height: 1.9; font-size: 1.05rem; }
    .about-avatar {
      aspect-ratio: 1;
      background: var(--border);
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem;
    }
    .about-avatar img { width: 100%; height: 100%; object-fit: cover; }

    #services { background: var(--text); }
    #services .section-num { color: var(--accent); }
    #services .section-title { color: var(--white); }
    .services-list { display: flex; flex-direction: column; gap: 0; }
    .service-item {
      display: flex; gap: 3rem; align-items: flex-start;
      padding: 2.5rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .service-num {
      font-family: var(--ff-display);
      font-size: 2.5rem;
      color: var(--accent);
      font-weight: 400;
      line-height: 1;
      flex-shrink: 0;
    }
    .service-item h3 { color: var(--white); font-weight: 500; margin-bottom: 0.5rem; font-size: 1.1rem; }
    .service-item p { color: rgba(255,255,255,0.5); font-size: 0.9rem; line-height: 1.6; }

    #projects .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2.5rem;
    }
    .project-card { background: var(--white); border: 1px solid var(--border); }
    .project-img { aspect-ratio: 16/9; overflow: hidden; background: var(--border); }
    .project-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .project-card:hover img { transform: scale(1.04); }
    .img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #f0f0ee, #e0e0dc); }
    .project-meta { padding: 1.75rem; }
    .project-meta h3 { font-family: var(--ff-display); font-size: 1.3rem; margin-bottom: 0.5rem; }
    .project-meta p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem; }
    .project-meta a { color: var(--accent); text-decoration: none; font-size: 0.85rem; font-weight: 500; }

    #contact { background: var(--accent); color: var(--white); }
    #contact .section-title { color: var(--white); }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 2rem; }
    .contact-desc { font-size: 1.1rem; opacity: 0.85; line-height: 1.8; }
    .contact-links { display: flex; flex-direction: column; gap: 1rem; }
    .contact-links a {
      display: flex; align-items: center; gap: 0.75rem;
      color: var(--white); text-decoration: none; font-size: 0.95rem;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 1rem;
      transition: opacity 0.2s;
    }
    .contact-links a:hover { opacity: 0.7; }
    .socials { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
    .socials a {
      color: var(--white);
      border: 1px solid rgba(255,255,255,0.5);
      padding: 0.5rem 1.2rem;
      text-decoration: none;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      transition: background 0.2s;
    }
    .socials a:hover { background: rgba(255,255,255,0.2); }

    footer {
      padding: 1.5rem 5vw;
      background: var(--text);
      color: var(--muted);
      font-size: 0.8rem;
      display: flex; justify-content: space-between;
    }
    footer a { color: var(--accent); text-decoration: none; }

    @media (max-width: 768px) {
      #about, .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
      section, #hero { padding: 4rem 5vw; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="nav-name">${escHtml(user.name)}</div>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#projects">Work</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <section id="hero">
    <div class="hero-tag">${escHtml(user.profession)}</div>
    <h1 class="hero-name">${escHtml(user.name).split(' ').map((w,i) => i===1 ? `<em>${w}</em>` : w).join(' ')}</h1>
    <p class="hero-title">${escHtml(user.profession)}</p>
    <p class="hero-bio">${escHtml(user.bio)}</p>
    <a href="#contact" class="hero-cta">Let's Work Together</a>
  </section>

  <section id="about">
    <div>
      <div class="section-header">
        <p class="section-num">01 — About</p>
        <h2 class="section-title">Turning ideas into<br>lasting impact.</h2>
      </div>
      <p class="about-text">${escHtml(user.bio)}</p>
    </div>
    <div class="about-avatar">
      ${user.avatar ? `<img src="${escHtml(user.avatar)}" alt="${escHtml(user.name)}" />` : '👤'}
    </div>
  </section>

  <section id="services">
    <div class="section-header">
      <p class="section-num">02 — Services</p>
      <h2 class="section-title">What I bring<br>to the table.</h2>
    </div>
    ${services ? `<div class="services-list">${services}</div>` : '<p style="opacity:0.5">Services coming soon.</p>'}
  </section>

  <section id="projects">
    <div class="section-header">
      <p class="section-num">03 — Work</p>
      <h2 class="section-title">Selected projects.</h2>
    </div>
    ${projects ? `<div class="projects-grid">${projects}</div>` : '<p style="color:var(--muted)">Projects coming soon.</p>'}
  </section>

  <section id="contact">
    <p class="section-num" style="color:rgba(255,255,255,0.7)">04 — Contact</p>
    <h2 class="section-title" style="color:white; margin-bottom: 2rem;">Ready to create<br>something great?</h2>
    <div class="contact-grid">
      <div class="contact-desc">${escHtml(user.bio || "Let's work together on your next project.")}</div>
      <div>
        <div class="contact-links">
          ${user.email ? `<a href="mailto:${escHtml(user.email)}">✉ ${escHtml(user.email)}</a>` : ''}
          ${user.phone ? `<a href="tel:${escHtml(user.phone)}">✆ ${escHtml(user.phone)}</a>` : ''}
        </div>
        <div class="socials">
          ${user.linkedin ? `<a href="${escHtml(user.linkedin)}" target="_blank">LinkedIn</a>` : ''}
          ${user.github ? `<a href="${escHtml(user.github)}" target="_blank">GitHub</a>` : ''}
          ${user.website ? `<a href="${escHtml(user.website)}" target="_blank">Website</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <footer>
    <span>&copy; ${new Date().getFullYear()} ${escHtml(user.name)}</span>
    <span>Built with <a href="/">Portfolia</a></span>
  </footer>

</body>
</html>`;
};
