<div align="center">

# 🗂️ Portfolia

### Portfolio Generator for Non-Tech Users

Build a beautiful, professional portfolio website in under 5 minutes — no coding required.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=flat-square&logo=express)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

- **Guided Multi-Step Form** — One friendly question per screen with progress tracking
- **5 Professional Templates** — Minimal, Bold, Warm, Editorial, Glass
- **Instant Portfolio Generation** — HTML portfolio created and served automatically
- **Simple Dashboard** — View, edit, and regenerate your portfolio anytime
- **Image Uploads** — Upload project images (up to 6 photos, 5MB each)
- **Project Links** — Add links to external projects
- **Mobile-First Design** — Looks great on all screen sizes
- **Zero Dependencies on Paid APIs** — Fully self-contained

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express |
| File Upload | Multer |
| Data Storage | JSON file (no database needed) |
| Fonts | Google Fonts (DM Serif Display, DM Sans) |
| Styling | Custom CSS with CSS Variables |

## 📁 Project Structure

```
portfolia/
├── public/
│   ├── css/
│   │   ├── landing.css        # Landing page styles
│   │   └── create.css         # Multi-step form styles
│   ├── js/
│   │   └── create.js          # Form logic & API calls
│   ├── templates/
│   │   ├── minimal.html       # Clean white template
│   │   ├── bold.html          # Dark dramatic template
│   │   ├── warm.html          # Friendly beige template
│   │   ├── editorial.html     # Magazine-style template
│   │   └── glass.html         # Glassmorphism template
│   ├── portfolios/            # Generated portfolio files
│   ├── uploads/               # User-uploaded images
│   ├── index.html             # Landing page
│   ├── create.html            # Multi-step form
│   └── dashboard.html         # User dashboard
├── data/
│   └── users.json             # Simple JSON database
├── server.js                  # Express server + portfolio generator
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v14 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/portfolia.git
cd portfolia

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open your browser and go to: **http://localhost:3000**

### Development Mode (with auto-restart)

```bash
npm run dev
```

## 📖 How to Use

1. **Visit the landing page** at `http://localhost:3000`
2. **Click "Create Your Portfolio"** to start the guided form
3. **Answer 7 simple questions** — name, profession, bio, services, projects, contact, template
4. **Click "Generate My Portfolio"** — your portfolio is instantly created
5. **Access your dashboard** at `/dashboard/your-name` to edit or share

### Generated Portfolio URL

Each portfolio is available at:
```
http://localhost:3000/portfolio/your-name.html
```

### Sample Users (Pre-loaded)

Two sample users are included for demo purposes:
- `http://localhost:3000/dashboard/alex-chen`
- `http://localhost:3000/dashboard/maya-johnson`

## 🌐 Pushing to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial Portfolia MVP"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/portfolia.git

# Push
git push -u origin main
```

## 🎨 Templates

| Template | Style | Best For |
|----------|-------|---------|
| **Minimal** | Clean white, serif headings | Designers, writers, consultants |
| **Bold** | Dark background, high contrast | Developers, photographers, creatives |
| **Warm** | Beige tones, friendly feel | Coaches, freelancers, personal brands |
| **Editorial** | Side nav, magazine layout | Journalists, content creators |
| **Glass** | Gradient bg, glassmorphism | Tech professionals, modern creatives |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Landing page |
| `GET` | `/create` | Multi-step form |
| `GET` | `/dashboard/:username` | User dashboard |
| `GET` | `/portfolio/:filename` | Generated portfolio |
| `GET` | `/api/user/:username` | Get user data (JSON) |
| `POST` | `/api/generate` | Create new portfolio |
| `PUT` | `/api/user/:username` | Update portfolio |

## 🗺️ Roadmap

- [ ] Custom domain support
- [ ] PDF export
- [ ] More templates
- [ ] Analytics (view counts)
- [ ] Password-protected portfolios
- [ ] One-click deploy to Vercel/Netlify

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ by Portfolia
</div>
