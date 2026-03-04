/**
 * Portfolia — Portfolio Routes
 * Serves generated portfolio HTML files
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// List all portfolios (for browsing)
router.get('/', (req, res) => {
  const portfoliosDir = path.join(__dirname, '..', 'portfolios');
  const files = fs.readdirSync(portfoliosDir).filter(f => f.endsWith('.html'));
  res.json({ portfolios: files });
});

module.exports = router;
