<div align="center">

<img src="https://img.shields.io/badge/TempMail_Pro-v4.0-6382ff?style=for-the-badge&logo=mail.ru&logoColor=white" alt="TempMail Pro">

# 📬 TempMail Pro

**Instant · Disposable · Secure · Zero Registration**

> A production-grade, single-file disposable email web app with multi-provider fallback, real-time polling, AI-powered spam detection, and 5 stunning themes.

<br>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-3dffc0?style=for-the-badge)](https://brokenwebsit.github.io/-Team_Broken_Websit/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-6382ff?style=for-the-badge&logo=github)](https://github.com/BrokenWebsit/-Team_Broken_Websit)
[![Single File](https://img.shields.io/badge/Single_File-HTML_Only-ff4f7b?style=for-the-badge&logo=html5&logoColor=white)](https://brokenwebsit.github.io/-Team_Broken_Websit/)
[![No Backend](https://img.shields.io/badge/No_Backend-100%25_Client_Side-ffb347?style=for-the-badge)](https://brokenwebsit.github.io/-Team_Broken_Websit/)

<br>

![MIT License](https://img.shields.io/github/license/BrokenWebsit/-Team_Broken_Websit?color=6382ff)
![Stars](https://img.shields.io/github/stars/BrokenWebsit/-Team_Broken_Websit?style=flat&color=ffb347)
![Forks](https://img.shields.io/github/forks/BrokenWebsit/-Team_Broken_Websit?style=flat&color=3dffc0)
![Issues](https://img.shields.io/github/issues/BrokenWebsit/-Team_Broken_Websit?style=flat&color=ff4f7b)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-6382ff?logo=pwa)

</div>

---

## ✨ What is TempMail Pro?

**TempMail Pro** is a fully client-side, zero-backend disposable email application built as a **single HTML file**. No sign-up, no tracking, no ads — just instant temporary email addresses that work right now.

Whether you want to avoid spam, test your own apps, or sign up to a service without revealing your real email — TempMail Pro has you covered with **3 live mail providers**, automatic failover, and a sleek production-quality interface that works on any device.

---

## 🚀 Live Demo

<div align="center">

### 👉 [https://brokenwebsit.github.io/-Team_Broken_Websit/](https://brokenwebsit.github.io/-Team_Broken_Websit/)

*No installation. No login. Works instantly in any browser.*

</div>

---

## 🎯 Key Features

### 📧 Email & Provider System
| Feature | Details |
|--------|---------|
| **Multi-Provider** | 1secmail → mail.tm → GuerrillaMail (auto fallback) |
| **Auto Failover** | If one provider fails, instantly switches to next |
| **Up to 3 Accounts** | Manage 3 simultaneous email addresses |
| **Custom Username** | Generate addresses with your chosen name |
| **4 Generator Modes** | Random · Custom · Alias · Secure |
| **Domain Rotation** | Auto-rotate across available domains |
| **Token Refresh** | Auto re-authenticate on session expiry — no data loss |

### 🔒 Security & Privacy
| Feature | Details |
|--------|---------|
| **🔑 OTP Detection** | Auto-extracts OTP codes from emails with highlight |
| **🛡️ Spam Filter** | AI-style keyword + domain scoring engine |
| **🎣 Phishing Scanner** | Scans all links in email HTML for threats |
| **🔥 Burn-After-Read** | Auto-deletes email with 5s countdown after viewing |
| **📊 Threat Score** | Visual risk indicator per email |
| **Zero Tracking** | 100% client-side, no analytics, no external logging |

### 💾 Storage & Data
| Feature | Details |
|--------|---------|
| **IndexedDB Primary** | Fast local storage with full query support |
| **localStorage Fallback** | Works even without IndexedDB support |
| **Auto Expiry** | Set emails to expire in 1h / 4h / 24h / 7d |
| **Export Options** | Download inbox as JSON, TXT, or CSV |
| **Persistent Sessions** | Accounts survive page refresh |

### 🎨 UI & Experience
| Feature | Details |
|--------|---------|
| **5 Themes** | Dark · Light · Cyber · Matrix · Nord |
| **PC Sidebar Layout** | Full sidebar navigation on desktop (900px+) |
| **Mobile Bottom Sheets** | Native-feel modal sheets on mobile |
| **Smart Refresh Ring** | Animated countdown ring showing next poll time |
| **Real-time Toast** | Beautiful animated notification toasts |
| **Ripple Effects** | Material-style button interactions |
| **Skeleton Loading** | Shimmer placeholders while loading |
| **Email Categories** | OTP · Promo · Spam · Security · Social · General |
| **Timeline Grouping** | Today · Yesterday · This Week · Earlier |

### 📱 Mobile & PWA
| Feature | Details |
|--------|---------|
| **PWA Installable** | Add to Home Screen on any device |
| **Offline Support** | Service Worker caches resources |
| **No Zoom Bug** | Correct viewport meta for all Android browsers |
| **Touch Optimized** | `touch-action: manipulation` on all buttons |
| **QR Code Share** | Generate QR for your temp address instantly |
| **Push Notifications** | Browser notifications for new emails |

---

## 🏗️ Architecture

```
index.html  (Single File — ~112KB)
│
├── 🎨 CSS Engine
│   ├── 5 theme system (CSS variables)
│   ├── Responsive grid (mobile + PC sidebar)
│   └── Animations & micro-interactions
│
├── 📦 JavaScript Modules
│   ├── DB          — IndexedDB + localStorage fallback
│   ├── CFG         — Settings persistence
│   ├── OTP         — Pattern-based OTP extraction
│   ├── Sec         — Spam scoring + phishing scanner
│   ├── API         — Multi-provider with auto fallback
│   ├── Poll        — Adaptive smart polling engine
│   ├── Inbox       — Message lifecycle management
│   ├── UI          — Rendering, toasts, modals
│   └── App         — Main controller
│
└── 🌐 Mail Providers
    ├── 1secmail     (Primary  — best CORS support)
    ├── mail.tm      (Secondary — token-based auth)
    └── GuerrillaMail (Fallback — session-based)
```

---

## 🌐 Mail Providers

| # | Provider | Type | CORS | Auth | Priority |
|---|----------|------|------|------|----------|
| 1 | **1secmail** | Public API | ✅ Best | None | 🥇 Primary |
| 2 | **mail.tm** | REST API | ✅ Good | Bearer Token | 🥈 Secondary |
| 3 | **GuerrillaMail** | AJAX API | ✅ OK | Session SID | 🥉 Fallback |

> **Auto-failover:** If any provider fails, the next one is tried automatically with no user action required.

---

## 🚀 Getting Started

### Option 1: Use Live Demo
Simply visit 👉 **[https://brokenwebsit.github.io/-Team_Broken_Websit/](https://brokenwebsit.github.io/-Team_Broken_Websit/)**

### Option 2: Download & Open Locally
```bash
# Clone the repository
git clone https://github.com/BrokenWebsit/-Team_Broken_Websit.git

# Navigate to folder
cd -Team_Broken_Websit

# Open directly in browser (double-click or):
open index.html
```

### Option 3: Host on Any Static Server
```bash
# With Python
python3 -m http.server 8080

# With Node.js npx
npx serve .

# With PHP
php -S localhost:8080
```

> ✅ No build step. No npm install. No configuration. **Just open `index.html`.**

---

## 📱 Install as App (PWA)

**On Android (Chrome):**
1. Open the live demo in Chrome
2. Tap the menu `⋮` → **"Add to Home screen"**
3. Tap **Install** → Done!

**On iPhone (Safari):**
1. Open the live demo in Safari
2. Tap the Share button `⬆️`
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add** → Done!

**On Desktop (Chrome/Edge):**
1. Open the live demo
2. Click the install icon `⊕` in the address bar
3. Click **Install** → Done!

---

## 🎨 Theme Gallery

| Theme | Preview | Description |
|-------|---------|-------------|
| 🌑 **Dark** | Deep navy background | Default. Easy on eyes. |
| ☀️ **Light** | Clean white & indigo | Professional daytime look |
| 🤖 **Cyber** | Neon magenta + cyan | Cyberpunk aesthetic |
| 🟩 **Matrix** | Pure green on black | Hacker terminal vibes |
| ❄️ **Nord** | Arctic blue palette | Nordic calm & focus |

---

## ⚙️ Configuration Options

All settings are saved automatically to browser storage.

| Setting | Options | Default |
|---------|---------|---------|
| Auto-refresh | On / Off | On |
| Refresh Interval | 5s / 10s / 30s / 1m | 10s |
| Generator Mode | Random / Custom / Alias / Secure | Random |
| OTP Detection | On / Off | On |
| Spam Filter | On / Off | On |
| Phishing Scanner | On / Off | On |
| HTML Rendering | On / Off | Off |
| Burn-After-Read | On / Off | Off |
| Auto Expiry | None / 1h / 4h / 24h / 7d | None |
| Domain Rotation | On / Off | Off |
| Notifications | On / Off | Off |
| Theme | 5 options | Dark |

---

## 🔧 Technical Details

### Browser Compatibility
| Browser | Support |
|---------|---------|
| Chrome (Android/Desktop) | ✅ Full |
| Firefox | ✅ Full |
| Safari (iOS/macOS) | ✅ Full |
| Samsung Internet | ✅ Full |
| Edge | ✅ Full |

### Why Single File?
- ✅ Zero dependencies to manage
- ✅ One-click deployment anywhere
- ✅ Instant loading, no build pipeline
- ✅ Easy to audit, fork, and customize
- ✅ Works from USB drives, email attachments, local filesystem

### Key Technical Decisions
- **No AbortSignal** → Uses `Promise.race()` for timeouts (avoids Android cloning bug)
- **No object spread on fetch** → Manually constructs fetch options (cross-browser safe)
- **IndexedDB + localStorage** → Dual storage with automatic fallback
- **Sequential account creation** → Creates account first, waits 1.8s, then fetches token (avoids race condition)
- **Adaptive polling** → Slows down on errors, speeds up on activity

---

## 📁 Project Structure

```
-Team_Broken_Websit/
│
├── index.html          ← Entire application (single file)
├── README.md           ← This file
└── LICENSE             ← MIT License
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/-Team_Broken_Websit.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes to index.html

# 5. Commit your changes
git commit -m "feat: add amazing feature"

# 6. Push to your branch
git push origin feature/amazing-feature

# 7. Open a Pull Request
```

### Contribution Guidelines
- Keep it as a **single HTML file**
- No external JS frameworks (vanilla only)
- No build tools required
- Test on both mobile and desktop
- Zero `console.error` / `console.warn` in production

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Browser name and version
- Device type (mobile/desktop)
- Steps to reproduce
- Console error messages (if any)

👉 [Open an Issue](https://github.com/BrokenWebsit/-Team_Broken_Websit/issues/new)

---

## 📊 Stats

<div align="center">

![GitHub code size](https://img.shields.io/github/languages/code-size/BrokenWebsit/-Team_Broken_Websit?color=6382ff&label=Code%20Size)
![GitHub repo size](https://img.shields.io/github/repo-size/BrokenWebsit/-Team_Broken_Websit?color=3dffc0&label=Repo%20Size)
![Last Commit](https://img.shields.io/github/last-commit/BrokenWebsit/-Team_Broken_Websit?color=ffb347)
![HTML](https://img.shields.io/badge/Language-HTML%2FCSS%2FJS-ff4f7b?logo=html5&logoColor=white)

</div>

---

## 📄 License

```
MIT License

Copyright (c) 2025 Team Broken Websit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

Full license → [LICENSE](https://github.com/BrokenWebsit/-Team_Broken_Websit/blob/main/LICENSE)

---

## 👥 Team

<div align="center">

**Built with ❤️ by [Team Broken Websit](https://github.com/BrokenWebsit)**

[![GitHub](https://img.shields.io/badge/GitHub-BrokenWebsit-6382ff?style=for-the-badge&logo=github)](https://github.com/BrokenWebsit)

</div>

---

## ⭐ Support the Project

If TempMail Pro helped you, consider:

- ⭐ **Star this repository**
- 🍴 **Fork and customize it**
- 📣 **Share it with others**
- 🐛 **Report bugs and help improve it**

<div align="center">

---

*Made with 💜 · Single HTML File · Zero Backend · Open Source*

**[🌐 Live Demo](https://brokenwebsit.github.io/-Team_Broken_Websit/) · [📁 Repository](https://github.com/BrokenWebsit/-Team_Broken_Websit) · [🐛 Issues](https://github.com/BrokenWebsit/-Team_Broken_Websit/issues)**

</div>
