---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/landing.html"
project: "chitragupta"
role: auth
language: html
frameworks: [docker, vite]
lines: 883
size: 24068 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, code, docker, html, project/chitragupta, vite]
---

# landing.html

> Authentication / authorization module using **docker, vite** (883 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/landing.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | docker, vite |
| **Lines** | 883 |
| **Size** | 24068 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chitragupta - Business Ledger for Xerox & Recharge</title>
  <meta name="description" content="Professional business ledger & partner management for Xerox shops and retail businesses. Track transactions, split profits, and manage partners seamlessly.">
  <meta name="theme-color" content="#061423">
  <link rel="manifest" href="/manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <style>
    :root {
      --bg-deep: #030810;
      --bg-surface: #061423;
      --glass: rgba(6, 20, 35, 0.6);
      --glass-border: rgba(214, 228, 249, 0.08);
      --glass-border-hi: rgba(214, 228, 249, 0.15);
      
      --gold: #ffbf70;
      --gold-glow: rgba(255, 191, 112, 0.3);
      --gold-gradient: linear-gradient(135deg, #ffbf70 0%, #e0a458 100%);
      
      --blue-celestial: #9bd0ff;
      --blue-glow: rgba(155, 208, 255, 0.2);
      --blue-gradient: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
      
      --green: #34d399;
      --purple: #a78bfa;
      --pink: #f472b6;
      
      --text: #f0f4f8;
      --text-dim: #94a3b8;
      --text-muted: #64748b;
      
      --radius: 16px;
      --radius-lg: 24px;
      --radius-full: 9999px;
      
      --blur: blur(24px);
      --shadow-sm: 0 4px 24px rgba(0, 0, 0, 0.2);
      --shadow-lg: 0 8px 48px rgba(0, 0, 0, 0.4);
      --shadow-gold: 0 0 40px rgba(255, 191, 112, 0.15);
      
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Sora', system-ui, sans-serif;
      background-color: var(--bg-deep);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Animated Background */
    .bg-canvas {
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
    }

    .bg-gradient {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 80% 50% at 20% -20%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 80% 120%, rgba(255, 191, 112, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse 40% 30% at 50% 50%, rgba(167, 139, 250, 0.04) 0%, transparent 40%);
      animation: bgShift 20s ease-in-out infinite;
    }

    @keyframes bgShift {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%);
    }

    .bg-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 191, 112, 0.08) 0%, transparent 70%);
      top: 20%;
      left: 10%;
      animation: float 8s ease-in-out infinite;
    }

    .bg-glow-2 {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%);
      top: 60%;
      right: 15%;
      animation: float 10s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-30px) scale(1.05); }
    }

    /* Main Container */
    .landing {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navigation */
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 48px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: rgba(3, 8, 16, 0.7);
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .nav-brand .logo {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gold-gradient);
      border-radius: 10px;
      font-size: 22px;
    }

    .nav-brand .name {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-link {
      color: var(--text-dim);
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-link:hover {
      color: var(--text);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: var(--radius);
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.3s var(--ease-out);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-dim);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .btn-primary {
      background: var(--gold-gradient);
      color: #030810;
      box-shadow: var(--shadow-gold);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(255, 191, 112, 0.25);
    }

    .btn-secondary {
      background: rgba(56, 189, 248, 0.15);
      color: var(--blue-celestial);
      border: 1px solid rgba(56, 189, 248, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(56, 189, 248, 0.25);
      transform: translateY(-2px);
    }

    /* Hero Section */
    .hero {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 80px 48px 120px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      gap: 80px;
    }

    .hero-content {
      flex: 1;
      max-width: 640px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(255, 191, 112, 0.1);
      border: 1px solid rgba(255, 191, 112, 0.2);
      border-radius: var(--radius-full);
      font-size: 13px;
      font-weight: 500;
      color: var(--gold);
      margin-bottom: 24px;
      animation: fadeInUp 0.8s var(--ease-out) forwards;
      opacity: 0;
    }

    .hero-title {
      font-size: clamp(40px, 5vw, 64px);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -2px;
      margin-bottom: 24px;
      animation: fadeInUp 0.8s var(--ease-out) 0.1s forwards;
      opacity: 0;
    }

    .hero-title .highlight {
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }

    .hero-desc {
      font-size: 18px;
      color: var(--text-dim);
      margin-bottom: 40px;
      max-width: 520px;
      animation: fadeInUp 0.8s var(--ease-out) 0.2s forwards;
      opacity: 0;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      animation: fadeInUp 0.8s var(--ease-out) 0.3s forwards;
      opacity: 0;
    }

    .hero-visual {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      perspective: 1000px;
    }

    .hero-card {
      width: 100%;
      max-width: 520px;
      background: var(--glass);
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 32px;
      box-shadow: var(--shadow-lg);
      animation: floatCard 6s ease-in-out infinite;
      transform: rotateY(-5deg) rotateX(2deg);
    }

    @keyframes floatCard {
      0%, 100% { transform: rotateY(-5deg) rotateX(2deg) translateY(0); }
      50% { transform: rotateY(-3deg) rotateX(1deg) translateY(-15px); }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
    }

    .card-badge {
      padding: 4px 12px;
      background: rgba(52, 211, 153, 0.15);
      color: var(--green);
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 600;
    }

    .card-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .card-stat {
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: var(--radius);
      text-align: center;
    }

    .card-stat-value {
      font-size: 24px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 4px;
    }

    .card-stat-value.gold { color: var(--gold); }
    .card-stat-value.blue { color: var(--blue-celestial); }
    .card-stat-value.green { color: var(--green); }

    .card-stat-label {
      font-size: 12px;
      color: var(--text-muted);
    }

    .card-graph {
      height: 120px;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 16px 0;
    }

    .graph-bar {
      flex: 1;
      background: linear-gradient(to top, rgba(255, 191, 112, 0.6), rgba(255, 191, 112, 0.2));
      border-radius: 4px 4px 0 0;
      animation: growBar 1.2s var(--ease-out) forwards;
      transform-origin: bottom;
    }

    .graph-bar:nth-child(1) { height: 40%; animation-delay: 0.4s; }
    .graph-bar:nth-child(2) { height: 65%; animation-delay: 0.5s; }
    .graph-bar:nth-child(3) { height: 45%; animation-delay: 0.6s; }
    .graph-bar:nth-child(4) { height: 80%; animation-delay: 0.7s; }
    .graph-bar:nth-child(5) { height: 55%; animation-delay: 0.8s; }
    .graph-bar:nth-child(6) { height: 90%; animation-delay: 0.9s; }
    .graph-bar:nth-child(7) { height: 70%; animation-delay: 1s; }
    .graph-bar:nth-child(8) { height: 100%; animation-delay: 1.1s; }

    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Features Section */
    .features {
      padding: 120px 48px;
      background: rgba(0, 0, 0, 0.3);
    }

    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 80px;
    }

    .section-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .section-desc {
      color: var(--text-dim);
      font-size: 17px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      padding: 40px;
      background: var(--glass);
      backdrop-filter: var(--blur);
      -webkit-backdrop-filter: var(--blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      transition: all 0.4s var(--ease-out);
    }

    .feature-card:hover {
      border-color: var(--glass-border-hi);
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 191, 112, 0.1);
      border-radius: 14px;
      font-size: 28px;
      color: var(--gold);
      margin-bottom: 24px;
    }

    .feature-icon.blue {
      background: rgba(56, 189, 248, 0.1);
      color: var(--blue-celestial);
    }

    .feature-icon.green {
      background: rgba(52, 211, 153, 0.1);
      color: var(--green);
    }

    .feature-icon.purple {
      background: rgba(167, 139, 250, 0.1);
      color: var(--purple);
    }

    .feature-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .feature-desc {
      color: var(--text-dim);
      font-size: 15px;
      line-height: 1.7;
    }

    /* How It Works */
    .how-it-works {
      padding: 120px 48px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 48px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .step {
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gold-gradient);
      border-radius: 50%;
      font-size: 20px;
      font-weight: 700;
      color: #030810;
      margin: 0 auto 24px;
    }

    .step-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .step-desc {
      color: var(--text-dim);
      font-size: 14px;
    }

    /* CTA Section */
    .cta {
      padding: 120px 48px;
      text-align: center;
      background: linear-gradient(to bottom, transparent, rgba(255, 191, 112, 0.03));
    }

    .cta-title {
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .cta-desc {
      color: var(--text-dim);
      font-size: 18px;
      margin-bottom: 40px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Footer */
    .footer {
      padding: 48px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .footer-text {
      color: var(--text-muted);
      font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 60px 24px 80px;
      }

      .hero-content {
        max-width: 100%;
      }

      .hero-desc {
        max-width: 100%;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-visual {
        display: none;
      }

      .nav {
        padding: 20px 24px;
      }

      .nav-links {
        display: none;
      }

      .features, .how-it-works, .cta {
        padding: 80px 24px;
      }
    }

    @media (max-width: 640px) {
      .hero-title {
        font-size: 36px;
      }

      .feature-card {
        padding: 32px;
      }

      .cta-title {
        font-size: 28px;
      }

      .cta-actions {
        flex-direction: column;
      }

      .cta-actions .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <!-- Animated Background -->
  <div class="bg-canvas">
    <div class="bg-gradient"></div>
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>
    <div class="bg-glow-2"></div>
  </div>

  <!-- Navigation -->
  <nav class="nav">
    <a href="#" class="nav-brand">
      <div class="logo material-icons-round">account_balance</div>
      <span class="name">Chitragupta</span>
    </a>
    <div class="nav-links">
      <a href="#features" class="nav-link">Features</a>
      <a href="#how-it-works" class="nav-link">How It Works</a>
      <a href="#pricing" class="nav-link">Pricing</a>
    </div>
    <div class="nav-actions">
      <a href="login.html" class="btn btn-ghost">Login</a>
      <a href="signup.html" class="btn btn-primary">Get Started</a>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="landing">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="material-icons-round" style="font-size: 16px;">auto_awesome</span>
          Trusted by 100+ Xerox Shops
        </div>
        <h1 class="hero-title">
          Business Ledger<br>
          <span class="highlight">Made Simple</span>
        </h1>
        <p class="hero-desc">
          Professional partner management & transaction tracking for Xerox shops and retail businesses. Split profits, track transactions, and manage partners seamlessly.
        </p>
        <div class="hero-actions">
          <a href="signup.html" class="btn btn-primary">
            <span class="material-icons-round">rocket_launch</span>
            Start Free
          </a>
          <a href="#features" class="btn btn-secondary">
            <span class="material-icons-round">explore</span>
            Learn More
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-header">
            <span class="card-title">Dashboard Overview</span>
            <span class="card-badge">Live</span>
          </div>
          <div class="card-stats">
            <div class="card-stat">
              <div class="card-stat-value gold">₹45,280</div>
              <div class="card-stat-label">Total Balance</div>
            </div>
            <div class="card-stat">
              <div class="card-stat-value blue">₹12,500</div>
              <div class="card-stat-label">Invested</div>
            </div>
            <div class="card-stat">
              <div class="card-stat-value green">₹8,200</div>
              <div class="card-stat-label">Withdrawn</div>
            </div>
          </div>
          <div class="card-graph">
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
            <div class="graph-bar"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="section-header">
        <div class="section-label">Features</div>
        <h2 class="section-title">Everything You Need to Manage Your Business</h2>
        <p class="section-desc">Powerful tools designed specifically for Xerox shops and small retail businesses.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <span class="material-icons-round">account_balance_wallet</span>
          </div>
          <h3 class="feature-title">Smart Ledger</h3>
          <p class="feature-desc">Track every transaction with detailed records. Know your exact position at any moment with real-time balance updates.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon blue">
            <span class="material-icons-round">group</span>
          </div>
          <h3 class="feature-title">Partner Split</h3>
          <p class="feature-desc">Define custom profit-sharing rules. Automatic calculations ensure every partner gets their fair share, every time.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon green">
            <span class="material-icons-round">analytics</span>
          </div>
          <h3 class="feature-title">Reports & Analytics</h3>
          <p class="feature-desc">Comprehensive reports on revenue, partner contributions, and trends. Export data anytime for tax or review.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon purple">
            <span class="material-icons-round">sync_alt</span>
          </div>
          <h3 class="feature-title">Settlement Tracking</h3>
          <p class="feature-desc">Keep books perfectly balanced. Clear visibility into who owes whom and settlement status.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <span class="material-icons-round">phone_android</span>
          </div>
          <h3 class="feature-title">Mobile Ready</h3>
          <p class="feature-desc">Access your dashboard from any device. Works seamlessly on mobile phones and tablets.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon blue">
            <span class="material-icons-round">security</span>
          </div>
          <h3 class="feature-title">Secure & Private</h3>
          <p class="feature-desc">Your data stays with you. Enterprise-grade security with role-based access control for your team.</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works" id="how-it-works">
      <div class="section-header">
        <div class="section-label">How It Works</div>
        <h2 class="section-title">Get Started in Minutes</h2>
        <p class="section-desc">Simple setup, no training required.</p>
      </div>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <h3 class="step-title">Create Account</h3>
          <p class="step-desc">Sign up with your email. Takes less than a minute.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3 class="step-title">Add Partners</h3>
          <p class="step-desc">Invite your partners and set up profit split rules.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3 class="step-title">Start Tracking</h3>
          <p class="step-desc">Record transactions and watch your dashboard come alive.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2 class="cta-title">Ready to Get Started?</h2>
      <p class="cta-desc">Join 100+ businesses already using Chitragupta to manage their finances.</p>
      <div class="cta-actions">
        <a href="signup.html" class="btn btn-primary">
          <span class="material-icons-round">rocket_launch</span>
          Create Free Account
        </a>
        <a href="login.html" class="btn btn-ghost">
          Already have account?
        </a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-brand">
      <div class="logo material-icons-round" style="font-size: 20px; width: 32px; height: 32px;">account_balance</div>
      <span class="name" style="font-size: 16px;">Chitragupta</span>
    </div>
    <p class="footer-text">© 2026 Chitragupta. Business Ledger for Xerox & Recharge.</p>
  </footer>
  <script>
    // Redirect to dashboard if already authenticated
    document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('token');
      if (token) {
        window.location.href = 'index.html';
      }
    });
  </script>
</body>
</html>
```
