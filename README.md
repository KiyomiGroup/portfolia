<div align="center">

# 🗂️ Portfolia — Static Edition

### Portfolio Generator for Non-Tech Users · GitHub Pages Ready

Answer 7 simple questions → pick a template → download your portfolio HTML.  
No server, no database, no build step. Pure HTML/CSS/JS.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen?style=flat-square&logo=github)](https://pages.github.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**[▶ Live Demo →](https://YOUR_USERNAME.github.io/portfolia)**

</div>

---

## ✨ How It Works

1. Visit the site and click **"Create Your Portfolio"**
2. Answer 7 friendly questions (name, profession, bio, services, projects, contact, template)
3. Click **"Generate My Portfolio"**
4. A complete `.html` file is built **entirely in your browser** and downloaded instantly
5. Open the file locally — or deploy it to GitHub Pages for a free public URL

**No server. No signup. No data sent anywhere.**

## 🚀 Deploy to GitHub Pages (Free Hosting)

### Option A — Deploy this app (so others can use it)

```bash
# 1. Fork or clone this repo
git clone https://github.com/YOUR_USERNAME/portfolia.git
cd portfolia

# 2. Push to GitHub
git add .
git commit -m "deploy portfolia"
git push origin main

# 3. Enable GitHub Pages
# → Go to your repo on GitHub
# → Settings → Pages
# → Source: Deploy from a branch
# → Branch: main / (root)
# → Save

# Your site will be live at:
# https://YOUR_USERNAME.github.io/portfolia
```

### Option B — Deploy YOUR generated portfolio

After generating your portfolio from the form:

```bash
# 1. Create a new GitHub repo called: YOUR_USERNAME.github.io
# 2. Upload the downloaded .html file, renaming it to: index.html
# 3. Enable GitHub Pages (Settings → Pages → main / root)
# 4. Your portfolio is live at: https://YOUR_USERNAME.github.io
```

## 📁 Project Structure

```
portfolia/
├── index.html          ← Landing page
├── create.html         ← 7-step form + generator
├── css/
│   ├── landing.css     ← Landing page styles
│   └── create.css      ← Form styles
├── js/
│   └── create.js       ← Client-side portfolio generator (all 5 templates)
└── README.md
```

## 🎨 Templates Included

| Template | Style |
|----------|-------|
| **Minimal** | Clean white, DM Serif Display |
| **Bold** | Dark/dramatic, Syne font |
| **Warm** | Beige/friendly, Lora |
| **Editorial** | Side nav, magazine layout |
| **Glass** | Gradient bg, glassmorphism |

## 🖼️ Image Support

Images you upload are embedded as **base64 data URLs** directly into the generated HTML file — meaning the portfolio is fully self-contained and works offline, no hosting required for images.

## 📄 License

MIT — free to use, modify, and deploy.

---

<div align="center">Built with ❤️ · No backend required</div>
