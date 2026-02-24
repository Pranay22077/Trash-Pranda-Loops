# 🦝 Trash Panda Loops - Design Summary

## Quick Overview for Frontend Developer

### What You're Building
A modern, dark-themed gaming website for "Trash Panda Loops" - a browser-based roguelike game about a raccoon stealing snacks in 60-second time loops.

### Key Pages
1. **Landing Page** - Hero, features, how-to-play, game preview, leaderboard, CTA
2. **Game Page** - Full-screen playable game with HUD
3. **Leaderboard Page** - Global rankings
4. **Profile/Stats Page** - User progress and achievements

### Design Style
- **Theme:** Dark gaming aesthetic with neon cyan/purple accents
- **Vibe:** Cozy midnight heist, retro-futuristic
- **Colors:** Dark blue-black backgrounds (#0f1419) with cyan (#00d9ff) and purple (#b537f2) highlights
- **Fonts:** Poppins (headings), Inter (body), JetBrains Mono (stats)

### Main Components Needed
1. Navigation bar (sticky, with logo and links)
2. Hero section (full viewport with animated game preview)
3. Feature cards (6 cards in grid)
4. How-to-play timeline (4 steps)
5. Game canvas container (800x600px)
6. Leaderboard table (top 10 players)
7. Stats dashboard (4 stat cards)
8. Achievement badges (grid of unlockables)
9. Footer (4 columns with links)

### Key Features
- Smooth animations and transitions
- Hover effects on all interactive elements
- Responsive design (mobile, tablet, desktop)
- Dark mode by default
- Neon glow effects on accents
- Particle/star background animations

### Tech Stack Recommendation
- **Framework:** Next.js 14+ with TypeScript
- **Styling:** Tailwind CSS
- **Game:** HTML5 Canvas or Phaser.js
- **Deployment:** Vercel
- **Icons:** Lucide Icons

### Color Palette (Copy-Paste Ready)
```css
:root {
  --bg-primary: #0f1419;
  --bg-secondary: #1a1d2e;
  --bg-card: #252a3a;
  --accent-cyan: #00d9ff;
  --accent-purple: #b537f2;
  --accent-orange: #ff6b35;
  --text-primary: #f4f1de;
  --text-secondary: #9ba4b5;
}
```

### Button Styles
- **Primary:** Cyan-to-purple gradient, pill shape, glow effect
- **Secondary:** Transparent with cyan border
- **Hover:** Scale up 1.05x, stronger glow

### Spacing System
- Use 8px base unit (8, 16, 24, 32, 40, 48, 64, 80, 120px)

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 20px
- Pill: 28px+

### What Makes This Design Special
1. **Neon glow effects** on buttons and accents
2. **Animated raccoon character** in hero section
3. **Live game preview** embedded on landing page
4. **Real-time leaderboard** with medal icons
5. **Achievement system** with unlock animations
6. **Particle background** for depth
7. **Smooth page transitions** and micro-interactions

### Priority Order
1. Landing page (most important)
2. Game canvas integration
3. Leaderboard
4. Stats/profile page
5. Additional pages

### Assets You'll Need
- Raccoon logo (SVG)
- Game sprites (provided separately)
- Icons (use Lucide Icons library)
- Fonts (Google Fonts: Poppins, Inter, JetBrains Mono)

### Performance Goals
- Load time: < 3 seconds
- Time to interactive: < 5 seconds
- 60 FPS animations
- Mobile-optimized

### Accessibility Requirements
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Reduced motion support
- 4.5:1 text contrast minimum

---

## Next Steps for Developer

1. Read the full **COMPLETE_WEB_DESIGN_SPEC.md** document
2. Set up Next.js project with Tailwind
3. Create component library (buttons, cards, etc.)
4. Build landing page section by section
5. Integrate game canvas
6. Connect to backend API
7. Test on mobile devices
8. Deploy to Vercel

---

**Full detailed specification:** See COMPLETE_WEB_DESIGN_SPEC.md (50+ pages)

**Questions?** Refer to the detailed spec for exact measurements, colors, animations, and code examples.

🦝 Let's build something amazing!
