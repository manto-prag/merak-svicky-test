# MERAK svíčky — Handcrafted Custom Candle Atelier

A modern, elegant web application and 1,000-combination custom candle configurator for **MERAK svíčky**, crafted with React 19, Vite, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **1,000-Combination Candle Configurator**:
  - 10 natural artisanal fragrances
  - 10 eco-friendly wax colors
  - 10 premium vessels & packaging styles
  - Real-time SVG candle visualizer with packaging, wax, wick, and label previews
  - Custom label messages and dedication engraving
- **Bilingual Storefront**: Full Czech (`CZ`) & English (`EN`) support.
- **Packeta / Zásilkovna Shipping**: Integrated pickup point finder and street delivery calculation.
- **Czech Standard SPAYD QR Payment**: Generates bank-compliant QR codes with IBAN, variable symbol, and instant copy buttons.
- **Admin Dashboard**: Workshop order status tracking, shipping tracking code assignment, and live raw materials stock toggling.

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js**: Version 18 or higher (Node 20+ recommended)
- **npm**: Version 9 or higher

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/merak-svicky.git

# Navigate to project directory
cd merak-svicky

# Install dependencies
npm install
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the URL shown in your terminal) in your browser.

### 4. Build for Production

```bash
npm run build
```

The production-ready static files will be generated in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment to GitHub Pages

This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable GitHub Pages:
1. Push this repository to GitHub.
2. Go to your repository on GitHub: **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push to `main` or `master` branch — your site will be built and published automatically!

---

## ☁️ Deploy to Other Platforms

- **Vercel**: Import repository, framework preset: `Vite`, build command: `npm run build`, output directory: `dist`.
- **Netlify**: Import repository, build command: `npm run build`, publish directory: `dist`.
- **Cloudflare Pages**: Framework preset: `Vite`, build command: `npm run build`, output directory: `dist`.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Cormorant Garamond typography
- **Icons**: Lucide React
- **Animations**: Motion & Canvas Confetti
- **QR Code**: QRCode (SPAYD standard)
