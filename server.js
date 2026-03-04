/**
 * Portfolia - Portfolio Generator for Non-Tech Users
 * Main Express server
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── File Upload Config (Multer) ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Data Store (JSON file as simple DB) ──────────────────────────────────────
const DB_PATH = path.join(__dirname, 'data', 'users.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { return {}; }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve form builder page
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

// Serve dashboard
app.get('/dashboard/:username', (req, res) => {
  const db = readDB();
  const user = db[req.params.username];
  if (!user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API: Get user data
app.get('/api/user/:username', (req, res) => {
  const db = readDB();
  const user = db[req.params.username];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// API: Save user data + generate portfolio
app.post('/api/generate', upload.array('projectImages', 6), (req, res) => {
  try {
    const db = readDB();
    const formData = req.body;

    // Build username from name
    const username = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || uuidv4().slice(0, 8);

    // Handle uploaded images
    const uploadedImages = (req.files || []).map(f => `/uploads/${f.filename}`);

    // Parse services (comma-separated or array)
    let services = formData.services || '';
    if (typeof services === 'string') {
      services = services.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Parse project links
    let projectLinks = [];
    if (formData.projectLinks) {
      projectLinks = (Array.isArray(formData.projectLinks)
        ? formData.projectLinks
        : [formData.projectLinks]
      ).filter(Boolean);
    }

    const userData = {
      username,
      name: formData.name || 'Your Name',
      profession: formData.profession || 'Professional',
      bio: formData.bio || '',
      services,
      projectLinks,
      projectImages: uploadedImages,
      email: formData.email || '',
      phone: formData.phone || '',
      linkedin: formData.linkedin || '',
      twitter: formData.twitter || '',
      template: formData.template || 'minimal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to DB
    db[username] = userData;
    writeDB(db);

    // Generate portfolio HTML
    generatePortfolio(userData);

    res.json({ success: true, username, portfolioUrl: `/portfolio/${username}.html` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate portfolio' });
  }
});

// API: Update user data
app.put('/api/user/:username', upload.array('projectImages', 6), (req, res) => {
  try {
    const db = readDB();
    if (!db[req.params.username]) return res.status(404).json({ error: 'User not found' });

    const existing = db[req.params.username];
    const formData = req.body;

    const uploadedImages = (req.files || []).map(f => `/uploads/${f.filename}`);
    let services = formData.services || '';
    if (typeof services === 'string') {
      services = services.split(',').map(s => s.trim()).filter(Boolean);
    }

    let projectLinks = [];
    if (formData.projectLinks) {
      projectLinks = (Array.isArray(formData.projectLinks)
        ? formData.projectLinks
        : [formData.projectLinks]
      ).filter(Boolean);
    }

    const updated = {
      ...existing,
      name: formData.name || existing.name,
      profession: formData.profession || existing.profession,
      bio: formData.bio || existing.bio,
      services: services.length ? services : existing.services,
      projectLinks: projectLinks.length ? projectLinks : existing.projectLinks,
      projectImages: uploadedImages.length ? [...existing.projectImages, ...uploadedImages] : existing.projectImages,
      email: formData.email || existing.email,
      phone: formData.phone || existing.phone,
      linkedin: formData.linkedin || existing.linkedin,
      twitter: formData.twitter || existing.twitter,
      template: formData.template || existing.template,
      updatedAt: new Date().toISOString()
    };

    db[req.params.username] = updated;
    writeDB(db);
    generatePortfolio(updated);

    res.json({ success: true, username: req.params.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Serve generated portfolios
app.get('/portfolio/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'portfolios', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.redirect('/');
  }
});

// ─── Portfolio Generator ───────────────────────────────────────────────────────
function generatePortfolio(userData) {
  const templatePath = path.join(__dirname, 'public', 'templates', `${userData.template}.html`);
  const fallbackPath = path.join(__dirname, 'public', 'templates', 'minimal.html');

  let template = '';
  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8');
  } else {
    template = fs.readFileSync(fallbackPath, 'utf-8');
  }

  // Build services HTML
  const servicesHtml = userData.services.map(s =>
    `<div class="service-card"><span class="service-icon">✦</span><p>${s}</p></div>`
  ).join('');

  // Build projects HTML
  const projectsHtml = [
    ...userData.projectImages.map((img, i) =>
      `<div class="project-card"><img src="${img}" alt="Project ${i + 1}" loading="lazy"><div class="project-info"><h4>Project ${i + 1}</h4></div></div>`
    ),
    ...userData.projectLinks.map((link, i) =>
      `<div class="project-card project-link-card"><a href="${link}" target="_blank" rel="noopener"><div class="link-icon">🔗</div><h4>Project Link ${i + 1}</h4><p>${link}</p></a></div>`
    )
  ].join('');

  // Build social links
  const socials = [];
  if (userData.email) socials.push(`<a href="mailto:${userData.email}" class="social-link">✉ ${userData.email}</a>`);
  if (userData.phone) socials.push(`<a href="tel:${userData.phone}" class="social-link">📱 ${userData.phone}</a>`);
  if (userData.linkedin) socials.push(`<a href="${userData.linkedin}" target="_blank" rel="noopener" class="social-link">in LinkedIn</a>`);
  if (userData.twitter) socials.push(`<a href="${userData.twitter}" target="_blank" rel="noopener" class="social-link">𝕏 Twitter</a>`);

  // Replace template variables
  const html = template
    .replace(/\{\{name\}\}/g, userData.name)
    .replace(/\{\{profession\}\}/g, userData.profession)
    .replace(/\{\{bio\}\}/g, userData.bio)
    .replace(/\{\{services\}\}/g, servicesHtml || '<p>No services listed yet.</p>')
    .replace(/\{\{projects\}\}/g, projectsHtml || '<p>No projects added yet.</p>')
    .replace(/\{\{contact\}\}/g, socials.join('\n') || '<p>No contact info provided.</p>')
    .replace(/\{\{year\}\}/g, new Date().getFullYear());

  // Write generated portfolio
  const outputDir = path.join(__dirname, 'public', 'portfolios');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, `${userData.username}.html`), html);
}

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolia running at http://localhost:${PORT}\n`);
});
