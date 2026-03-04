/**
 * Template 4: Soft Studio
 * Warm pastels, rounded shapes, playful — for creatives, illustrators, coaches
 */

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

module.exports = function template4(user) {
  const services = (user.services || []).map(s => `
    <div class="service-pill">
      <div class="pill-icon">✦</div>
      <div>
        <h3>${escHtml(s.title || s)}</h3>
        <p>${escHtml(s.description || '')}</p>
      </div>
    </div>`).join('');

  const projects = (user.projects || []).map((p, i) => `
    <div class="project-item ${i % 2 === 0 ? 'even' : 'odd'}">
      <div class="project-visual">
        ${p.image ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.title || '')}" />` : `<div class="proj-placeholder">✦</div>`}
      </div>
      <div class="project-details">
        <h3>${escHtml(p.title || 'Project')}</h3>
        <p>${escHtml(p.description || '')}</p>
        ${p.link ? `<a href="${escHtml(p.link)}" target="_blank" class="view-btn">See it →</a>` : ''}
      </div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(user.name)} — ${escHtml(user.profession)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300;1,700&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #faf6f0;
      --peach: #f5e6d8;
      --sage: #d4e6d0;
      --blush: #f2d5d5;
      --sky: #d5e6f2;
      --text: #2d2418;
      --muted: #8a7a6a;
      --accent: #c46a3a;
      --ff-display: 'Fraunces', serif;
      --ff-body: 'Plus Jakarta Sans', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--cream); color: var(--text); font-family: var(--ff-body); font-weight: 300; }

    nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 5vw;
      background: var(--cream);
      border-bottom: 1px solid rgba(196,106,58,0.15);
      position: sticky; top: 0; z-index: 100;
    }
    .nav-logo { font-family: var(--ff-display); font-size: 1.1rem; font-style: italic; color: var(--accent); }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.85rem; font-weight: 400; transition: color 0.2s; }
    .nav-links a:hover { color: var(--accent); }

    #hero {
      background: var(--peach);
      padding: 7rem 5vw 5rem;
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 4rem;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    .hero-blob {
      position: absolute; right: -100px; top: -100px;
      width: 500px; height: 500px;
      background: var(--blush);
      border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;
      opacity: 0.5;
    }
    .hero-tag {
      display: inline-block;
      background: var(--accent);
      color: white;
      border-radius: 100px;
      padding: 0.4rem 1.2rem;
      font-size: 0.78rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
      letter-spacing: 0.03em;
    }
    .hero-name {
      font-family: var(--ff-display);
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 300;
      line-height: 1.1;
      margin-bottom: 0.75rem;
    }
    .hero-name em { font-style: italic; color: var(--accent); }
    .hero-title {
      font-family: var(--ff-display);
      font-size: 1.2rem;
      font-style: italic;
      font-weight: 300;
      color: var(--muted);
      margin-bottom: 1.5rem;
    }
    .hero-bio { color: var(--muted); line-height: 1.8; margin-bottom: 2rem; max-width: 420px; }
    .hero-cta {
      display: inline-block;
      background: var(--accent);
      color: white;
      border-radius: 100px;
      padding: 0.9rem 2.5rem;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .hero-cta:hover { opacity: 0.85; }
    .hero-visual {
      display: flex; align-items: center; justify-content: center;
      position: relative; z-index: 1;
    }
    .avatar-frame {
      width: min(300px, 80vw);
      aspect-ratio: 3/4;
      border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
      overflow: hidden;
      background: var(--blush);
      display: flex; align-items: center; justify-content: center;
      font-size: 5rem;
    }
    .avatar-frame img { width: 100%; height: 100%; object-fit: cover; }

    section { padding: 6rem 5vw; }
    .sec-tag {
      display: inline-block;
      border: 1px solid rgba(196,106,58,0.3);
      border-radius: 100px;
      padding: 0.3rem 1rem;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }
    .sec-title {
      font-family: var(--ff-display);
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 300;
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    .sec-title em { font-style: italic; color: var(--accent); }

    #about { background: var(--sage); }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; margin-top: 2rem; }
    .about-text { color: var(--muted); line-height: 1.9; font-size: 1.02rem; }

    #services { background: var(--cream); }
    .services-stack { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .service-pill {
      display: flex; gap: 1.5rem; align-items: flex-start;
      background: var(--peach);
      border-radius: 20px;
      padding: 1.75rem 2rem;
      transition: background 0.2s;
    }
    .service-pill:hover { background: var(--blush); }
    .pill-icon { color: var(--accent); font-size: 1.3rem; flex-shrink: 0; margin-top: 0.2rem; }
    .service-pill h3 { font-weight: 500; margin-bottom: 0.3rem; }
    .service-pill p { color: var(--muted); font-size: 0.9rem; }

    #projects { background: var(--sky); }
    .projects-stack { display: flex; flex-direction: column; gap: 4rem; margin-top: 3rem; }
    .project-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .project-item.odd .project-visual { order: 2; }
    .project-item.odd .project-details { order: 1; }
    .project-visual {
      border-radius: 30px;
      overflow: hidden;
      background: var(--peach);
      aspect-ratio: 4/3;
    }
    .project-visual img { width: 100%; height: 100%; object-fit: cover; }
    .proj-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; color: var(--accent); opacity: 0.3;
    }
    .project-details h3 { font-family: var(--ff-display); font-size: 1.7rem; font-weight: 300; margin-bottom: 0.75rem; }
    .project-details p { color: var(--muted); line-height: 1.8; margin-bottom: 1.25rem; }
    .view-btn {
      display: inline-block;
      background: var(--text);
      color: var(--cream);
      border-radius: 100px;
      padding: 0.65rem 1.75rem;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background 0.2s;
    }
    .view-btn:hover { background: var(--accent); }

    #contact { background: var(--text); color: var(--cream); }
    #contact .sec-tag { border-color: rgba(250,246,240,0.2); color: var(--peach); }
    #contact .sec-title { color: var(--cream); }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-top: 2rem; }
    .contact-desc { color: rgba(250,246,240,0.6); line-height: 1.8; }
    .contact-items { display: flex; flex-direction: column; gap: 1rem; }
    .contact-item {
      display: flex; align-items: center; gap: 1rem;
      color: var(--cream); text-decoration: none;
      background: rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .contact-item:hover { background: rgba(255,255,255,0.12); }
    .contact-item-icon { color: var(--peach); }
    .socials { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; }
    .socials a {
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--cream);
      padding: 0.5rem 1.25rem;
      text-decoration: none;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .socials a:hover { background: var(--accent); border-color: var(--accent); }

    footer {
      background: rgba(45,36,24,0.97);
      color: var(--muted);
      padding: 1.5rem 5vw;
      display: flex; justify-content: space-between; font-size: 0.8rem;
    }
    footer a { color: var(--accent); text-decoration: none; }

    @media (max-width: 768px) {
      #hero, .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
      .hero-visual { display: none; }
      .project-item, .project-item.odd .project-visual, .project-item.odd .project-details { order: 0; grid-template-columns: 1fr; }
      section { padding: 4rem 5vw; }
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
    <div class="hero-blob"></div>
    <div class="hero-left">
      <div class="hero-tag">${escHtml(user.profession)}</div>
      <h1 class="hero-name">Hi, I'm<br><em>${escHtml(user.name)}</em></h1>
      <p class="hero-title">${escHtml(user.profession)}</p>
      <p class="hero-bio">${escHtml(user.bio)}</p>
      <a href="#contact" class="hero-cta">Let's chat ✦</a>
    </div>
    <div class="hero-visual">
      <div class="avatar-frame">
        ${user.avatar ? `<img src="${escHtml(user.avatar)}" alt="${escHtml(user.name)}" />` : '✦'}
      </div>
    </div>
  </section>

  <section id="about">
    <div class="sec-tag">About Me</div>
    <div class="about-grid">
      <div>
        <h2 class="sec-title">Passionate about<br><em>craft & creativity.</em></h2>
      </div>
      <p class="about-text">${escHtml(user.bio)}</p>
    </div>
  </section>

  <section id="services">
    <div class="sec-tag">Services</div>
    <h2 class="sec-title">How I can <em>help you</em></h2>
    ${services ? `<div class="services-stack">${services}</div>` : '<p style="color:var(--muted)">Services coming soon.</p>'}
  </section>

  <section id="projects">
    <div class="sec-tag">Selected Work</div>
    <h2 class="sec-title">Things I'm <em>proud of</em></h2>
    ${projects ? `<div class="projects-stack">${projects}</div>` : '<p style="color:var(--muted)">Projects coming soon.</p>'}
  </section>

  <section id="contact">
    <div class="sec-tag">Contact</div>
    <h2 class="sec-title">Let's make something<br><em>beautiful together.</em></h2>
    <div class="contact-grid">
      <p class="contact-desc">${escHtml(user.bio || "I'd love to hear about your project. Reach out and let's start a conversation.")}</p>
      <div>
        <div class="contact-items">
          ${user.email ? `<a href="mailto:${escHtml(user.email)}" class="contact-item"><span class="contact-item-icon">✉</span> ${escHtml(user.email)}</a>` : ''}
          ${user.phone ? `<a href="tel:${escHtml(user.phone)}" class="contact-item"><span class="contact-item-icon">✆</span> ${escHtml(user.phone)}</a>` : ''}
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
    <span>Made with <a href="/">Portfolia</a></span>
  </footer>

</body>
</html>`;
};
