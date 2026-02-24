# 🦝 Trash Panda Loops - Complete Web Design Specification

## 📋 Table of Contents
1. Overview & Theme
2. Color Palette
3. Typography
4. Page-by-Page Breakdown
5. Component Details
6. Animations & Interactions
7. Responsive Design
8. Technical Requirements

---

## 1. OVERVIEW & THEME

### Design Philosophy
- **Style:** Modern dark gaming website with neon accents
- **Mood:** Cozy midnight heist, playful yet mysterious
- **Inspiration:** Retro arcade meets modern web design
- **Key Elements:** Raccoon mascot, kitchen theme, time loop visuals

### Target Experience
- Immediately engaging and fun
- Easy to understand game mechanics
- Smooth, polished interactions
- Mobile-friendly and fast-loading

---

## 2. COLOR PALETTE

### Background Colors
```css
--bg-primary: #0f1419;        /* Deep dark blue-black */
--bg-secondary: #1a1d2e;      /* Slightly lighter dark blue */
--bg-card: #252a3a;           /* Card/panel background */
--bg-elevated: #2d3548;       /* Hover states, elevated elements */
```

### Accent Colors
```css
--accent-primary: #00d9ff;    /* Neon cyan - main CTA */
--accent-secondary: #b537f2;  /* Electric purple - highlights */
--accent-warm: #ff6b35;       /* Warm orange - warnings */
--accent-success: #4ecca3;    /* Green - success states */
--accent-warning: #ffd93d;    /* Yellow - alerts */
--accent-danger: #ff6b6b;     /* Red - errors */
```

### Text Colors
```css
--text-primary: #f4f1de;      /* Main text - soft cream */
--text-secondary: #9ba4b5;    /* Secondary text - muted gray */
--text-muted: #6b7280;        /* Disabled/muted text */
```

### Game-Specific Colors
```css
--raccoon-color: #8b8b8b;     /* Raccoon character */
--snack-common: #ffd700;      /* Common snacks - gold */
--snack-uncommon: #4ecca3;    /* Uncommon - green */
--snack-rare: #6c5ce7;        /* Rare - blue */
--snack-legendary: #fd79a8;   /* Legendary - pink */
```

---

## 3. TYPOGRAPHY

### Font Families
```css
--font-heading: 'Poppins', sans-serif;     /* Headings - bold, modern */
--font-body: 'Inter', sans-serif;          /* Body text - clean, readable */
--font-mono: 'JetBrains Mono', monospace;  /* Code, stats - technical */
--font-game: 'Press Start 2P', cursive;    /* Retro game elements */
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px - tiny labels */
--text-sm: 0.875rem;   /* 14px - small text */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - large body */
--text-xl: 1.25rem;    /* 20px - small headings */
--text-2xl: 1.5rem;    /* 24px - section headings */
--text-3xl: 1.875rem;  /* 30px - page headings */
--text-4xl: 2.25rem;   /* 36px - hero headings */
--text-5xl: 3rem;      /* 48px - main title */
```

---

## 4. PAGE-BY-PAGE BREAKDOWN


### PAGE 1: LANDING PAGE / HOME

#### Navigation Bar (Fixed at top)
**Position:** Sticky, always visible
**Height:** 70px
**Background:** Semi-transparent dark (#0f1419 with 90% opacity, blur effect)
**Border:** 1px solid rgba(255,255,255,0.1) at bottom

**Left Side:**
- Logo: Raccoon icon (40x40px) + "Trash Panda Loops" text
- Font: Poppins Bold, 20px, color: #f4f1de
- Raccoon icon has subtle glow effect (#00d9ff)

**Right Side (Desktop):**
- "Home" link - active state with cyan underline
- "How to Play" link
- "Leaderboard" link
- "About" link
- "Play Now" button (primary CTA)
  - Background: Linear gradient (#00d9ff to #b537f2)
  - Padding: 12px 32px
  - Border radius: 25px (pill shape)
  - Font: Poppins SemiBold, 16px
  - Hover: Slight scale up (1.05), glow effect
  - Box shadow: 0 4px 20px rgba(0,217,255,0.4)

**Mobile:**
- Hamburger menu icon (right side)
- Slides in from right with smooth animation
- Full-screen overlay menu with same links

---

#### Hero Section
**Height:** 100vh (full viewport)
**Background:** 
- Dark gradient from #0f1419 to #1a1d2e
- Animated particles/stars floating slowly
- Subtle grid pattern overlay (very faint)

**Layout:** Two columns (60/40 split on desktop)

**Left Column:**
- Main Heading:
  - Text: "Steal Snacks in 60-Second Time Loops"
  - Font: Poppins ExtraBold, 56px (desktop), 36px (mobile)
  - Color: #f4f1de
  - Line height: 1.2
  - Margin bottom: 24px
  
- Subheading:
  - Text: "You're a clever raccoon stuck in a temporal anomaly. Master the perfect heist, avoid detection, and unlock new abilities."
  - Font: Inter Regular, 20px (desktop), 16px (mobile)
  - Color: #9ba4b5
  - Line height: 1.6
  - Max width: 600px
  - Margin bottom: 40px

- CTA Buttons (horizontal row):
  1. Primary Button "Play Now"
     - Size: 56px height, 200px width
     - Background: Gradient #00d9ff to #b537f2
     - Font: Poppins Bold, 18px
     - Border radius: 28px
     - Icon: Play triangle on left
     - Hover: Scale 1.05, stronger glow
     - Box shadow: 0 8px 30px rgba(0,217,255,0.5)
  
  2. Secondary Button "Watch Trailer"
     - Size: 56px height, 180px width
     - Background: Transparent
     - Border: 2px solid #00d9ff
     - Font: Poppins SemiBold, 18px
     - Color: #00d9ff
     - Border radius: 28px
     - Icon: Play circle on left
     - Hover: Background #00d9ff with 10% opacity

- Stats Row (below buttons, margin top 48px):
  - Three stat boxes in a row
  - Each box:
    - Background: #252a3a
    - Padding: 16px 24px
    - Border radius: 12px
    - Border: 1px solid rgba(255,255,255,0.05)
    
  - Stat 1: "10K+ Players"
    - Number: Poppins Bold, 24px, #00d9ff
    - Label: Inter Regular, 14px, #9ba4b5
  
  - Stat 2: "60 Seconds"
    - Number: Poppins Bold, 24px, #b537f2
    - Label: Inter Regular, 14px, #9ba4b5
  
  - Stat 3: "∞ Replayability"
    - Number: Poppins Bold, 24px, #4ecca3
    - Label: Inter Regular, 14px, #9ba4b5

**Right Column:**
- Animated Game Preview
  - Container: 500x500px (desktop), full width (mobile)
  - Background: #252a3a
  - Border radius: 24px
  - Border: 2px solid rgba(0,217,255,0.2)
  - Box shadow: 0 20px 60px rgba(0,0,0,0.5)
  - Glow effect around border
  
  - Content: Animated raccoon character
    - Pixel art style raccoon (200x200px)
    - Idle animation (subtle breathing)
    - Floating snacks around it (rotating slowly)
    - Kitchen background (blurred)
    - Timer countdown animation (60 to 0)
    - Detection meter at bottom (animated fill)

---

#### Features Section
**Background:** #1a1d2e
**Padding:** 120px vertical, 80px horizontal
**Max width:** 1200px centered

**Section Header:**
- Small label above: "GAME FEATURES"
  - Font: JetBrains Mono, 12px, uppercase
  - Color: #00d9ff
  - Letter spacing: 2px
  - Margin bottom: 16px

- Main heading: "Master the Perfect Heist"
  - Font: Poppins Bold, 48px (desktop), 32px (mobile)
  - Color: #f4f1de
  - Margin bottom: 16px

- Description: "Every loop is a chance to learn, adapt, and steal the ultimate snack"
  - Font: Inter Regular, 18px
  - Color: #9ba4b5
  - Max width: 700px
  - Margin bottom: 64px

**Feature Cards Grid:**
- Layout: 3 columns on desktop, 1 column on mobile
- Gap: 32px between cards

**Card 1: Time Loop Mechanics**
- Container:
  - Background: #252a3a
  - Padding: 40px
  - Border radius: 20px
  - Border: 1px solid rgba(0,217,255,0.1)
  - Hover: Border color #00d9ff, lift up 8px
  - Transition: 0.3s ease
  
- Icon at top:
  - Clock/loop icon (64x64px)
  - Color: #00d9ff
  - Glow effect
  - Margin bottom: 24px

- Title: "60-Second Loops"
  - Font: Poppins SemiBold, 24px
  - Color: #f4f1de
  - Margin bottom: 16px

- Description:
  - Font: Inter Regular, 16px
  - Color: #9ba4b5
  - Line height: 1.6
  - Text: "Each run lasts exactly 60 seconds. Time resets, but your knowledge persists. Learn patterns and optimize your route."

**Card 2: Stealth Gameplay**
- Same container style as Card 1
- Icon: Eye/stealth icon (64x64px)
- Color: #b537f2
- Title: "Avoid Detection"
- Description: "Movement generates noise. NPCs detect via sight and sound. Hide strategically and time your moves perfectly."

**Card 3: Progression System**
- Same container style
- Icon: Star/unlock icon (64x64px)
- Color: #4ecca3
- Title: "Unlock Abilities"
- Description: "Earn points from successful heists. Unlock permanent abilities like Dash, Silent Paws, and Time Sense."

**Card 4: Risk vs Reward**
- Icon: Treasure/snack icon
- Color: #ffd93d
- Title: "High-Value Snacks"
- Description: "Better snacks are harder to reach and make more noise. Push your luck or play it safe."

**Card 5: NPC AI**
- Icon: Person/guard icon
- Color: #ff6b35
- Title: "Smart Enemies"
- Description: "Humans and pets patrol with predictable patterns. They investigate sounds and remember your last position."

**Card 6: Procedural Elements**
- Icon: Dice/random icon
- Color: #fd79a8
- Title: "Always Fresh"
- Description: "Snack positions randomize each loop. Multiple strategies viable. High replayability."

---

#### How It Works Section
**Background:** Gradient from #1a1d2e to #2d1b3d
**Padding:** 120px vertical

**Section Header:**
- Label: "HOW TO PLAY"
- Heading: "Simple to Learn, Hard to Master"
- Description: "Get started in seconds, spend hours perfecting your runs"

**Timeline/Steps (Vertical on mobile, Horizontal on desktop):**

**Step 1:**
- Number badge: "01"
  - Circle: 60px diameter
  - Background: Gradient #00d9ff to #b537f2
  - Font: Poppins Bold, 24px
  - Position: Left side

- Content (right of badge):
  - Title: "Enter the Kitchen"
  - Font: Poppins SemiBold, 22px
  - Color: #f4f1de
  
  - Description: "You spawn at the entrance. 60 seconds on the clock. NPCs begin their patrol routes."
  - Font: Inter Regular, 16px
  - Color: #9ba4b5

- Visual: Small animated GIF/video showing spawn (300x200px)
  - Border radius: 12px
  - Border: 2px solid rgba(0,217,255,0.2)

**Step 2:**
- Number badge: "02"
- Title: "Collect Snacks"
- Description: "Navigate the kitchen, avoid NPCs, and collect snacks. Better snacks = more points but higher risk."
- Visual: Snack collection animation

**Step 3:**
- Number badge: "03"
- Title: "Manage Stealth"
- Description: "Watch your noise meter and detection level. Hide when needed. Use abilities strategically."
- Visual: Stealth meter animation

**Step 4:**
- Number badge: "04"
- Title: "Complete or Reset"
- Description: "Survive 60 seconds or get caught. Either way, earn points and unlock new abilities for the next loop."
- Visual: Loop reset animation

---

#### Game Preview Section
**Background:** #0f1419
**Padding:** 120px vertical

**Section Header:**
- Label: "LIVE PREVIEW"
- Heading: "See It In Action"
- Description: "Play a quick demo right here"

**Game Canvas Container:**
- Width: 800px max (desktop), full width (mobile)
- Height: 600px
- Background: #252a3a
- Border radius: 24px
- Border: 3px solid #00d9ff
- Box shadow: 0 30px 80px rgba(0,217,255,0.3)
- Glow effect

**Canvas Content:**
- Embedded game (HTML5 Canvas or iframe)
- Full interactive demo
- Controls overlay at bottom:
  - WASD keys visual
  - E key for interact
  - Space for hide
  - Semi-transparent background
  - Icons + text labels

**Below Canvas:**
- Control hints in a row:
  - Each hint: Icon + text
  - Background: #252a3a
  - Padding: 12px 20px
  - Border radius: 20px
  - Gap: 16px between hints

---

#### Leaderboard Section
**Background:** #1a1d2e
**Padding:** 120px vertical

**Section Header:**
- Label: "TOP PLAYERS"
- Heading: "Global Leaderboard"
- Description: "Compete for the highest scores"

**Leaderboard Table:**
- Container:
  - Max width: 900px
  - Background: #252a3a
  - Border radius: 20px
  - Padding: 40px
  - Border: 1px solid rgba(255,255,255,0.05)

**Table Header:**
- Columns: Rank | Player | Score | Snacks | Time
- Font: Poppins SemiBold, 14px, uppercase
- Color: #9ba4b5
- Border bottom: 2px solid rgba(255,255,255,0.1)
- Padding: 16px

**Table Rows (Top 10):**
- Each row:
  - Padding: 20px 16px
  - Border bottom: 1px solid rgba(255,255,255,0.05)
  - Hover: Background #2d3548
  - Transition: 0.2s

- Rank column:
  - Top 3 have special badges:
    - 1st: Gold medal icon, #ffd700
    - 2nd: Silver medal icon, #c0c0c0
    - 3rd: Bronze medal icon, #cd7f32
  - Others: Just number, #9ba4b5

- Player column:
  - Avatar (32x32px circle) + Username
  - Font: Inter SemiBold, 16px
  - Color: #f4f1de

- Score column:
  - Font: JetBrains Mono Bold, 18px
  - Color: #00d9ff

- Snacks column:
  - Number + snack icon
  - Font: Inter Regular, 16px
  - Color: #9ba4b5

- Time column:
  - Format: "45.2s"
  - Font: JetBrains Mono Regular, 16px
  - Color: #9ba4b5

**Below Table:**
- "View Full Leaderboard" button
  - Style: Secondary button
  - Border: 2px solid #00d9ff
  - Hover: Fill with cyan

---

#### Stats & Achievements Section
**Background:** Gradient #2d1b3d to #0f1419
**Padding:** 120px vertical

**Section Header:**
- Label: "YOUR PROGRESS"
- Heading: "Track Your Journey"

**Stats Dashboard:**
- Grid: 2x2 on desktop, 1 column on mobile
- Gap: 24px

**Stat Card 1: Total Loops**
- Background: #252a3a
- Padding: 32px
- Border radius: 16px
- Border left: 4px solid #00d9ff

- Icon: Loop icon (48x48px), color #00d9ff
- Number: "127" - Poppins Bold, 48px, #f4f1de
- Label: "Total Loops" - Inter Regular, 16px, #9ba4b5
- Trend: "+12 today" - Inter Regular, 14px, #4ecca3

**Stat Card 2: Snacks Collected**
- Border left: 4px solid #ffd93d
- Icon: Snack icon, color #ffd93d
- Number: "1,234"
- Label: "Snacks Collected"
- Trend: "+89 today"

**Stat Card 3: Best Score**
- Border left: 4px solid #b537f2
- Icon: Trophy icon, color #b537f2
- Number: "2,450"
- Label: "Best Score"
- Trend: "Top 5%"

**Stat Card 4: Abilities Unlocked**
- Border left: 4px solid #4ecca3
- Icon: Star icon, color #4ecca3
- Number: "3/5"
- Label: "Abilities Unlocked"
- Progress bar below showing 60%

**Achievements Grid:**
- Below stats
- Grid: 4 columns on desktop, 2 on mobile
- Gap: 16px

**Achievement Badge:**
- Size: 120x140px
- Background: #252a3a
- Border radius: 12px
- Padding: 16px
- Border: 1px solid rgba(255,255,255,0.05)

- Icon at top (64x64px)
  - Locked: Grayscale, opacity 0.3
  - Unlocked: Full color, glow effect

- Title below icon
  - Font: Poppins SemiBold, 14px
  - Color: #f4f1de (unlocked) or #6b7280 (locked)

- Progress bar at bottom (if in progress)
  - Height: 4px
  - Background: #1a1d2e
  - Fill: Gradient based on achievement type

**Example Achievements:**
1. "First Heist" - Complete first loop
2. "Speed Demon" - Complete in under 30s
3. "Ghost" - Complete with <10% detection
4. "Collector" - Collect 10 snacks in one loop
5. "Veteran" - Complete 50 loops
6. "Legendary Thief" - Collect a legendary snack

---

#### Call-to-Action Section
**Background:** Solid #00d9ff (full width)
**Padding:** 80px vertical

**Content (centered):**
- Heading: "Ready to Start Your Heist?"
  - Font: Poppins Bold, 42px
  - Color: #0f1419 (dark on cyan)
  - Margin bottom: 16px

- Subheading: "Join thousands of raccoons stealing snacks"
  - Font: Inter Regular, 20px
  - Color: rgba(15,20,25,0.8)
  - Margin bottom: 40px

- Large CTA Button:
  - Text: "Play Now - It's Free"
  - Size: 64px height, 280px width
  - Background: #0f1419 (dark)
  - Color: #00d9ff
  - Font: Poppins Bold, 20px
  - Border radius: 32px
  - Hover: Scale 1.05, box shadow
  - Icon: Raccoon icon on left

- Small text below: "No download required • Works on all devices"
  - Font: Inter Regular, 14px
  - Color: rgba(15,20,25,0.6)

---

#### Footer
**Background:** #0f1419
**Padding:** 60px vertical, 80px horizontal
**Border top:** 1px solid rgba(255,255,255,0.1)

**Layout:** 4 columns on desktop, 1 column on mobile

**Column 1: Brand**
- Logo + name (same as nav)
- Tagline: "The ultimate raccoon heist game"
  - Font: Inter Regular, 14px
  - Color: #9ba4b5
  - Margin top: 16px

- Social icons row:
  - Twitter, Discord, GitHub icons
  - Size: 40x40px each
  - Background: #252a3a
  - Border radius: 50%
  - Color: #9ba4b5
  - Hover: Color changes to #00d9ff, background lighter
  - Gap: 12px

**Column 2: Game**
- Heading: "Game"
  - Font: Poppins SemiBold, 16px
  - Color: #f4f1de
  - Margin bottom: 20px

- Links (vertical list):
  - "How to Play"
  - "Features"
  - "Leaderboard"
  - "Updates"
  - Font: Inter Regular, 14px
  - Color: #9ba4b5
  - Hover: Color #00d9ff
  - Line height: 2

**Column 3: Resources**
- Heading: "Resources"
- Links:
  - "Documentation"
  - "API"
  - "GitHub"
  - "Report Bug"

**Column 4: Legal**
- Heading: "Legal"
- Links:
  - "Privacy Policy"
  - "Terms of Service"
  - "Cookie Policy"

**Bottom Bar:**
- Full width
- Margin top: 48px
- Padding top: 24px
- Border top: 1px solid rgba(255,255,255,0.05)

- Left: "© 2024 Trash Panda Loops. All rights reserved."
  - Font: Inter Regular, 14px
  - Color: #6b7280

- Right: "Made with ❤️ by [Your Name]"
  - Font: Inter Regular, 14px
  - Color: #6b7280

---


## 5. COMPONENT DETAILS

### Buttons

**Primary Button:**
```css
Background: Linear gradient(135deg, #00d9ff 0%, #b537f2 100%)
Padding: 14px 32px
Border radius: 28px (pill shape)
Font: Poppins SemiBold, 16px
Color: #ffffff
Border: none
Box shadow: 0 4px 20px rgba(0,217,255,0.4)
Cursor: pointer

Hover state:
  Transform: scale(1.05)
  Box shadow: 0 6px 30px rgba(0,217,255,0.6)
  Transition: all 0.3s ease

Active state:
  Transform: scale(0.98)
```

**Secondary Button:**
```css
Background: transparent
Padding: 14px 32px
Border radius: 28px
Font: Poppins SemiBold, 16px
Color: #00d9ff
Border: 2px solid #00d9ff
Box shadow: none
Cursor: pointer

Hover state:
  Background: rgba(0,217,255,0.1)
  Border color: #00d9ff
  Transition: all 0.3s ease

Active state:
  Background: rgba(0,217,255,0.2)
```

**Icon Button:**
```css
Size: 48x48px
Background: #252a3a
Border radius: 50%
Border: 1px solid rgba(255,255,255,0.1)
Display: flex, center aligned
Cursor: pointer

Icon:
  Size: 24x24px
  Color: #9ba4b5

Hover state:
  Background: #2d3548
  Border color: #00d9ff
  Icon color: #00d9ff
```

---

### Cards

**Feature Card:**
```css
Background: #252a3a
Padding: 40px
Border radius: 20px
Border: 1px solid rgba(0,217,255,0.1)
Box shadow: 0 4px 12px rgba(0,0,0,0.2)

Hover state:
  Transform: translateY(-8px)
  Border color: #00d9ff
  Box shadow: 0 12px 30px rgba(0,217,255,0.2)
  Transition: all 0.3s ease
```

**Stat Card:**
```css
Background: #252a3a
Padding: 32px
Border radius: 16px
Border left: 4px solid [accent color]
Box shadow: 0 2px 8px rgba(0,0,0,0.1)

Layout:
  Icon at top left (48x48px)
  Number below icon (large, bold)
  Label below number (small, muted)
  Trend indicator at bottom (small, colored)
```

**Achievement Badge:**
```css
Size: 120x140px
Background: #252a3a
Border radius: 12px
Padding: 16px
Border: 1px solid rgba(255,255,255,0.05)
Display: flex, column, center aligned

Locked state:
  Icon: Grayscale filter, opacity 0.3
  Title color: #6b7280

Unlocked state:
  Icon: Full color with glow effect
  Title color: #f4f1de
  Border: 1px solid [achievement color]
  Box shadow: 0 0 20px [achievement color with 0.3 opacity]
```

---

### Input Fields

**Text Input:**
```css
Background: #252a3a
Padding: 14px 20px
Border radius: 12px
Border: 2px solid rgba(255,255,255,0.1)
Font: Inter Regular, 16px
Color: #f4f1de
Width: 100%

Placeholder:
  Color: #6b7280

Focus state:
  Border color: #00d9ff
  Box shadow: 0 0 0 3px rgba(0,217,255,0.1)
  Outline: none

Error state:
  Border color: #ff6b6b
  Box shadow: 0 0 0 3px rgba(255,107,107,0.1)
```

**Search Input:**
```css
Same as text input but with:
  Icon on left (search icon, 20x20px)
  Padding left: 48px
  Clear button on right (when text present)
```

---

### Progress Bars

**Standard Progress Bar:**
```css
Height: 8px
Background: #1a1d2e
Border radius: 4px
Overflow: hidden

Fill:
  Background: Linear gradient(90deg, #00d9ff 0%, #b537f2 100%)
  Height: 100%
  Border radius: 4px
  Transition: width 0.3s ease
  
  Animation: Shimmer effect moving left to right
```

**Circular Progress:**
```css
Size: 120x120px
Background: Transparent
Border: 8px solid #1a1d2e

Progress arc:
  Stroke: Linear gradient #00d9ff to #b537f2
  Stroke width: 8px
  Stroke linecap: round
  Animation: Smooth fill from 0 to target percentage

Center text:
  Font: Poppins Bold, 24px
  Color: #f4f1de
```

---

### Modals/Dialogs

**Modal Overlay:**
```css
Position: Fixed, full screen
Background: rgba(15,20,25,0.9)
Backdrop filter: blur(8px)
Z-index: 1000
Display: flex, center aligned
Animation: Fade in 0.3s
```

**Modal Container:**
```css
Background: #252a3a
Max width: 600px
Width: 90%
Border radius: 24px
Border: 1px solid rgba(0,217,255,0.2)
Box shadow: 0 20px 60px rgba(0,0,0,0.5)
Padding: 40px
Animation: Scale up from 0.9 to 1, 0.3s ease

Header:
  Display: flex, space between
  Margin bottom: 24px
  
  Title:
    Font: Poppins Bold, 28px
    Color: #f4f1de
  
  Close button:
    Size: 40x40px
    Background: transparent
    Border: none
    Color: #9ba4b5
    Cursor: pointer
    Hover: Color #ff6b6b

Body:
  Font: Inter Regular, 16px
  Color: #9ba4b5
  Line height: 1.6
  Margin bottom: 32px

Footer:
  Display: flex, justify end
  Gap: 16px
  
  Buttons: Primary and secondary styles
```

---

### Tooltips

**Tooltip:**
```css
Position: Absolute
Background: #0f1419
Padding: 8px 12px
Border radius: 8px
Border: 1px solid rgba(0,217,255,0.3)
Font: Inter Regular, 14px
Color: #f4f1de
Box shadow: 0 4px 12px rgba(0,0,0,0.3)
Z-index: 9999
Max width: 200px
White space: normal

Arrow:
  Size: 8px triangle
  Color: #0f1419
  Border: 1px solid rgba(0,217,255,0.3)
  Position: Depends on tooltip placement

Animation:
  Fade in 0.2s
  Slight slide from direction (5px)
```

---

### Badges

**Status Badge:**
```css
Padding: 4px 12px
Border radius: 12px (pill)
Font: Inter SemiBold, 12px, uppercase
Letter spacing: 0.5px
Display: inline-flex
Align items: center
Gap: 6px (if icon present)

Success:
  Background: rgba(78,204,163,0.15)
  Color: #4ecca3
  Border: 1px solid rgba(78,204,163,0.3)

Warning:
  Background: rgba(255,217,61,0.15)
  Color: #ffd93d
  Border: 1px solid rgba(255,217,61,0.3)

Error:
  Background: rgba(255,107,107,0.15)
  Color: #ff6b6b
  Border: 1px solid rgba(255,107,107,0.3)

Info:
  Background: rgba(0,217,255,0.15)
  Color: #00d9ff
  Border: 1px solid rgba(0,217,255,0.3)
```

**Notification Badge:**
```css
Size: 20px circle
Background: #ff6b6b
Color: #ffffff
Font: Inter Bold, 11px
Display: flex, center aligned
Position: Absolute, top right of parent
Border: 2px solid #0f1419
Animation: Pulse effect
```

---

### Tabs

**Tab Container:**
```css
Display: flex
Background: #252a3a
Padding: 4px
Border radius: 12px
Gap: 4px
```

**Tab Button:**
```css
Padding: 12px 24px
Border radius: 8px
Font: Poppins Medium, 15px
Color: #9ba4b5
Background: transparent
Border: none
Cursor: pointer
Transition: all 0.3s ease

Hover state:
  Color: #f4f1de
  Background: rgba(255,255,255,0.05)

Active state:
  Color: #f4f1de
  Background: #00d9ff
  Box shadow: 0 2px 8px rgba(0,217,255,0.3)
```

---

### Dropdown Menu

**Dropdown Trigger:**
```css
Same as secondary button
Icon on right: Chevron down (16x16px)
```

**Dropdown Panel:**
```css
Position: Absolute
Top: 100% + 8px
Background: #252a3a
Border radius: 12px
Border: 1px solid rgba(255,255,255,0.1)
Box shadow: 0 8px 24px rgba(0,0,0,0.3)
Padding: 8px
Min width: 200px
Z-index: 100
Animation: Fade in + slide down 0.2s

Menu item:
  Padding: 12px 16px
  Border radius: 8px
  Font: Inter Regular, 15px
  Color: #f4f1de
  Cursor: pointer
  Display: flex
  Align items: center
  Gap: 12px
  
  Icon (if present):
    Size: 20x20px
    Color: #9ba4b5
  
  Hover state:
    Background: #2d3548
    Icon color: #00d9ff
  
  Divider:
    Height: 1px
    Background: rgba(255,255,255,0.1)
    Margin: 8px 0
```

---

### Loading States

**Spinner:**
```css
Size: 40x40px
Border: 4px solid rgba(0,217,255,0.2)
Border top: 4px solid #00d9ff
Border radius: 50%
Animation: Spin 1s linear infinite
```

**Skeleton Loader:**
```css
Background: Linear gradient(90deg, 
  #252a3a 0%, 
  #2d3548 50%, 
  #252a3a 100%)
Background size: 200% 100%
Animation: Shimmer 1.5s infinite
Border radius: 8px

For text: Height 16px, width varies
For image: Aspect ratio maintained
For card: Full card dimensions
```

**Progress Indicator:**
```css
Fixed at top of page
Height: 3px
Background: Linear gradient(90deg, #00d9ff 0%, #b537f2 100%)
Width: Percentage of completion
Transition: width 0.3s ease
Z-index: 9999
```

---

## 6. ANIMATIONS & INTERACTIONS

### Page Transitions
```css
Fade in:
  From: opacity 0
  To: opacity 1
  Duration: 0.5s
  Easing: ease-out

Slide up:
  From: transform translateY(30px), opacity 0
  To: transform translateY(0), opacity 1
  Duration: 0.6s
  Easing: cubic-bezier(0.4, 0, 0.2, 1)

Scale in:
  From: transform scale(0.95), opacity 0
  To: transform scale(1), opacity 1
  Duration: 0.4s
  Easing: ease-out
```

### Hover Effects
```css
Lift:
  Transform: translateY(-4px)
  Box shadow: Increase
  Duration: 0.3s
  Easing: ease

Glow:
  Box shadow: 0 0 20px [color with 0.5 opacity]
  Duration: 0.3s
  Easing: ease

Scale:
  Transform: scale(1.05)
  Duration: 0.3s
  Easing: ease

Shine:
  Pseudo-element with gradient
  Animation: Move across element
  Duration: 0.6s
  Easing: ease
```

### Micro-interactions
```css
Button click:
  Transform: scale(0.98)
  Duration: 0.1s
  Then: Return to normal

Success feedback:
  Background: Flash green
  Duration: 0.3s
  Then: Return to normal

Error shake:
  Transform: translateX(-10px) to translateX(10px)
  Repeat: 3 times
  Duration: 0.5s total

Pulse:
  Transform: scale(1) to scale(1.05) to scale(1)
  Duration: 2s
  Repeat: infinite
  Easing: ease-in-out
```

### Scroll Animations
```css
Fade in on scroll:
  Initial: opacity 0, translateY(30px)
  When visible: opacity 1, translateY(0)
  Duration: 0.8s
  Easing: ease-out
  Stagger: 0.1s between elements

Parallax:
  Background moves slower than foreground
  Speed: 0.5x scroll speed

Number counter:
  Animate from 0 to target number
  Duration: 2s
  Easing: ease-out
  Trigger: When element enters viewport
```

### Loading Animations
```css
Spinner rotation:
  Transform: rotate(0deg) to rotate(360deg)
  Duration: 1s
  Repeat: infinite
  Easing: linear

Shimmer:
  Background position: -200% 0 to 200% 0
  Duration: 1.5s
  Repeat: infinite
  Easing: linear

Dots:
  Three dots bouncing
  Stagger: 0.2s
  Duration: 1.2s
  Repeat: infinite
```

---

## 7. RESPONSIVE DESIGN

### Breakpoints
```css
Mobile: 0 - 640px
Tablet: 641px - 1024px
Desktop: 1025px - 1440px
Large Desktop: 1441px+
```

### Mobile Adjustments (0-640px)

**Navigation:**
- Hamburger menu instead of links
- Logo size: 32x32px
- Nav height: 60px
- Full-screen menu overlay

**Hero Section:**
- Single column layout
- Heading: 32px
- Subheading: 16px
- Buttons: Stack vertically, full width
- Stats: Stack vertically
- Game preview: Full width, 300px height

**Feature Cards:**
- Single column
- Padding: 24px
- Icon size: 48x48px
- Title: 20px

**How It Works:**
- Vertical timeline
- Steps stack
- Visuals: Full width

**Leaderboard:**
- Horizontal scroll
- Smaller font sizes
- Hide some columns (keep rank, player, score)

**Footer:**
- Single column
- Center aligned
- Social icons: Larger (48x48px)

### Tablet Adjustments (641-1024px)

**Navigation:**
- Show all links
- Slightly smaller spacing

**Hero Section:**
- Two columns maintained
- Slightly smaller fonts
- Game preview: 400x400px

**Feature Cards:**
- Two columns
- Adjust padding

**Stats:**
- Two columns

**Footer:**
- Two columns

### Touch Interactions

**Tap targets:**
- Minimum size: 44x44px
- Spacing: 8px minimum

**Swipe gestures:**
- Carousel: Swipe left/right
- Menu: Swipe from edge
- Dismiss: Swipe down

**Long press:**
- Show tooltip/context menu
- Feedback: Haptic vibration (if supported)

---

## 8. TECHNICAL REQUIREMENTS

### Performance

**Loading:**
- Initial load: < 3 seconds
- Time to interactive: < 5 seconds
- Lazy load images below fold
- Code splitting for routes

**Optimization:**
- Minify CSS/JS
- Compress images (WebP format)
- Use CDN for assets
- Enable gzip compression
- Cache static assets

**Animations:**
- Use CSS transforms (GPU accelerated)
- Avoid layout thrashing
- Use requestAnimationFrame for JS animations
- Reduce motion for accessibility

### Accessibility

**ARIA:**
- Proper landmarks (nav, main, footer)
- ARIA labels for icons
- ARIA live regions for dynamic content
- ARIA expanded/collapsed for menus

**Keyboard Navigation:**
- Tab order logical
- Focus visible (outline)
- Escape closes modals
- Enter/Space activates buttons
- Arrow keys for menus

**Screen Readers:**
- Alt text for images
- Descriptive link text
- Form labels
- Error messages announced

**Color Contrast:**
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Browser Support
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- Mobile Safari: iOS 12+
- Chrome Mobile: Android 8+

### Technologies

**Frontend Framework:**
- React 18+ or Next.js 14+
- TypeScript for type safety

**Styling:**
- Tailwind CSS or Styled Components
- CSS Modules for component styles
- PostCSS for processing

**Game Canvas:**
- HTML5 Canvas API
- Or Phaser.js framework
- WebGL for performance

**State Management:**
- React Context or Zustand
- Local storage for persistence

**API Integration:**
- Fetch API or Axios
- WebSocket for real-time features
- REST API for backend

**Build Tools:**
- Vite or Next.js
- ESLint for linting
- Prettier for formatting

**Deployment:**
- Vercel (optimized for Next.js)
- Environment variables for config
- Automatic deployments from Git

### SEO

**Meta Tags:**
```html
<title>Trash Panda Loops - Steal Snacks in Time Loops</title>
<meta name="description" content="A roguelike game where you play as a raccoon stealing snacks in 60-second time loops. Master stealth, unlock abilities, and compete on the leaderboard.">
<meta name="keywords" content="roguelike, game, raccoon, time loop, browser game">

<!-- Open Graph -->
<meta property="og:title" content="Trash Panda Loops">
<meta property="og:description" content="Steal snacks in 60-second time loops">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://trashpandaloops.com">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Trash Panda Loops">
<meta name="twitter:description" content="Steal snacks in 60-second time loops">
<meta name="twitter:image" content="/twitter-image.jpg">
```

**Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Trash Panda Loops",
  "description": "A roguelike game about a raccoon stealing snacks",
  "genre": "Roguelike",
  "playMode": "SinglePlayer",
  "gamePlatform": "Web Browser"
}
```

---

## 9. ASSETS NEEDED

### Images

**Logo & Icons:**
- Raccoon logo (SVG, multiple sizes)
- Favicon (16x16, 32x32, 180x180)
- App icons (various sizes for PWA)

**Game Assets:**
- Raccoon character sprite (animated)
- NPC sprites (human, pet)
- Snack icons (common, uncommon, rare, legendary)
- Kitchen tiles (floor, wall, furniture)
- UI icons (clock, eye, star, etc.)

**Marketing:**
- Hero image/animation (1920x1080)
- Feature screenshots (800x600)
- Social media images (1200x630)
- Tutorial GIFs/videos

### Fonts

**Primary:**
- Poppins (Google Fonts)
  - Weights: 400, 500, 600, 700, 800

**Secondary:**
- Inter (Google Fonts)
  - Weights: 400, 500, 600, 700

**Monospace:**
- JetBrains Mono (Google Fonts)
  - Weights: 400, 700

**Game Font:**
- Press Start 2P (Google Fonts)
  - Weight: 400

### Icons

**Icon Library:**
- Lucide Icons or Heroicons
- Custom game-specific icons (SVG)

**Required Icons:**
- Play, Pause, Stop
- Clock, Timer
- Eye, Eye-off
- Star, Trophy
- Arrow keys, WASD
- Menu, Close
- Social media logos
- Achievement badges

---

## 10. EXAMPLE CODE SNIPPETS

### Button Component (React + Tailwind)
```jsx
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon, 
  ...props 
}) => {
  const baseStyles = "font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/40 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/60",
    secondary: "bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-12 py-4 text-lg",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
```

### Card Component
```jsx
const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <div className="bg-card-bg p-10 rounded-3xl border border-white/10 hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300 group">
      <div className={`w-16 h-16 mb-6 text-${color}-400 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-cream mb-4">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
```

### Tailwind Config
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f1419',
        'bg-secondary': '#1a1d2e',
        'bg-card': '#252a3a',
        'cyan-400': '#00d9ff',
        'purple-500': '#b537f2',
        'cream': '#f4f1de',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'game': ['Press Start 2P', 'cursive'],
      },
    },
  },
};
```

---

## 11. FINAL NOTES

### Design Principles
1. **Consistency:** Use the same spacing, colors, and patterns throughout
2. **Hierarchy:** Clear visual hierarchy guides the user
3. **Feedback:** Every interaction has visual feedback
4. **Performance:** Smooth animations, fast loading
5. **Accessibility:** Usable by everyone

### Quality Checklist
- [ ] All colors meet contrast requirements
- [ ] All interactive elements have hover states
- [ ] All buttons have focus states
- [ ] All images have alt text
- [ ] All animations respect reduced motion
- [ ] Mobile layout tested on real devices
- [ ] Loading states for all async operations
- [ ] Error states for all forms
- [ ] Success feedback for all actions
- [ ] Keyboard navigation works everywhere

### Handoff to Developer
Provide:
1. This design specification document
2. Figma/design files (if available)
3. Asset folder with all images/icons
4. Color palette as CSS variables
5. Component library examples
6. API documentation for backend integration

---

**END OF SPECIFICATION**

This document contains everything needed to build the Trash Panda Loops website. Follow it closely for a consistent, beautiful, and functional result. Good luck! 🦝
