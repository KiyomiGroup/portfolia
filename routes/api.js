/**
 * Portfolia — API Routes
 * Handles user data, portfolio generation, and CRUD operations
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');
const PORTFOLIOS_DIR = path.join(__dirname, '..', 'portfolios');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── GET all users (for dev/demo) ────────────────────────────────────────────
router.get('/users', (req, res) => {
  const data = readData();
  res.json({ success: true, users: data.users });
});

// ─── GET single user by id ───────────────────────────────────────────────────
router.get('/user/:id', (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, user });
});

// ─── POST create or update user & generate portfolio ─────────────────────────
router.post('/generate', (req, res) => {
  try {
    const data = readData();
    const formData = req.body;

    // Validate required fields
    if (!formData.name || !formData.profession) {
      return res.status(400).json({ success: false, error: 'Name and profession are required.' });
    }

    const slug = slugify(formData.name);
    const id = formData.id || uuidv4();

    const user = {
      id,
      slug,
      name: formData.name,
      profession: formData.profession,
      bio: formData.bio || '',
      services: formData.services || [],
      projects: formData.projects || [],
      email: formData.email || '',
      phone: formData.phone || '',
      linkedin: formData.linkedin || '',
      github: formData.github || '',
      website: formData.website || '',
      template: formData.template || 'template1',
      avatar: formData.avatar || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Upsert user
    const existingIndex = data.users.findIndex(u => u.id === id);
    if (existingIndex >= 0) {
      data.users[existingIndex] = user;
    } else {
      data.users.push(user);
    }
    writeData(data);

    // Generate the HTML portfolio file
    const html = generatePortfolioHTML(user);
    const filePath = path.join(PORTFOLIOS_DIR, `${slug}.html`);
    fs.writeFileSync(filePath, html);

    res.json({
      success: true,
      id,
      slug,
      portfolioUrl: `/portfolio/${slug}.html`,
      dashboardUrl: `/dashboard?id=${id}`
    });

  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate portfolio.' });
  }
});

// ─── DELETE user ─────────────────────────────────────────────────────────────
router.delete('/user/:id', (req, res) => {
  const data = readData();
  const idx = data.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Not found' });

  const user = data.users[idx];
  const filePath = path.join(PORTFOLIOS_DIR, `${user.slug}.html`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  data.users.splice(idx, 1);
  writeData(data);

  res.json({ success: true });
});

// ─── Portfolio HTML Generator ─────────────────────────────────────────────────
function generatePortfolioHTML(user) {
  const templates = {
    template1: require('../public/templates/template1'),
    template2: require('../public/templates/template2'),
    template3: require('../public/templates/template3'),
    template4: require('../public/templates/template4'),
    template5: require('../public/templates/template5'),
  };

  const templateFn = templates[user.template] || templates['template1'];
  return templateFn(user);
}

module.exports = router;
