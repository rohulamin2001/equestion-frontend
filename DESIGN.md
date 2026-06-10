---
version: "glassmorphic-dashboard-v2-bengali"
name: "Dashboard — Glassmorphic UI (Bengali)"
description: "Modern glassmorphic dashboard design system optimised for Noto Sans Bengali — with depth, blur layers, and luminous accents."

# ─────────────────────────────────────────────
# FONT STACK
# ─────────────────────────────────────────────
fonts:
  primary:     "Noto Sans Bengali"   # বাংলা + Latin উভয়ই cover করে
  secondary:   "Geist Variable"      # English heading / numeric accent
  mono:        "JetBrains Mono"      # labels, badges, code, numbers
  fallback:    "sans-serif"

  source:
    bengali:   "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap"
    geist:     "@fontsource-variable/geist  (already in index.css)"
    mono:      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&display=swap"

  notes:
    - "Noto Sans Bengali weights 300–700 সব load হয়, তাই light থেকে bold সব কাজ করবে।"
    - "Geist Variable শুধু Latin numerics এবং English-only headings এ use করো।"
    - "বাংলা text কখনো letter-spacing বা font-feature-settings দিও না — Bengali script এ এগুলো rendering ভাঙে।"
    - "line-height Bengali তে minimum 1.7 রাখো — অক্ষরের উপরের মাত্রা (ঁ ঃ ং) clip হয় কম line-height এ।"

# ─────────────────────────────────────────────
# COLORS
# ─────────────────────────────────────────────
colors:
  background:       "#F5F5F7"             # Clean Light Grey (⚪ 25%)
  surface-glass:    "rgba(255,255,255,0.45)" # Translucent Light Glass
  surface-elevated: "rgba(255,255,255,0.65)"
  surface-hover:    "rgba(255,255,255,0.85)"

  primary:          "#4F46E5"             # Deep Royal Purple (🟣 70%)
  primary-glow:     "rgba(79,70,229,0.15)"
  secondary:        "#8B5CF6"             # Supporting Purple
  accent-orange:    "#F97316"             # Accent Orange (🟠 5%)
  accent-white:     "#FFFFFF"             # Crisp White

  # Palette Ratio Guideline
  ratio_purple:     "70%"                 # 🟣 Primary brand identity & active items
  ratio_white:      "25%"                 # ⚪ Supporting background & surface glass elements
  ratio_orange:     "5%"                  # 🟠 Contrast CTA highlights, warnings, notifications

  text-primary:     "#1E293B"             # High-contrast Slate Text
  text-secondary:   "#64748B"
  text-muted:       "#94A3B8"

  border-glass:     "rgba(0,0,0,0.06)"    # Soft border for light glass
  border-accent:    "rgba(79,70,229,0.20)"

  success:          "#10B981"
  warning:          "#F97316"
  danger:           "#F43F5E"
  info:             "#06B6D4"

# ─────────────────────────────────────────────
# TYPOGRAPHY
# ─────────────────────────────────────────────
typography:
  # — Bengali display moments (hero numbers, page titles) —
  display-xl:
    fontFamily:    "'Noto Sans Bengali', 'Geist Variable', sans-serif"
    fontSize:      "48px"
    fontWeight:    700
    lineHeight:    "1.15"        # Bengali এ 1.05 দিলে মাত্রা clip হয়
    letterSpacing: "0"           # Bengali তে letter-spacing দেওয়া যাবে না

  display-lg:
    fontFamily:    "'Noto Sans Bengali', 'Geist Variable', sans-serif"
    fontSize:      "32px"
    fontWeight:    600
    lineHeight:    "1.2"

  heading-md:
    fontFamily:    "'Noto Sans Bengali', sans-serif"
    fontSize:      "18px"
    fontWeight:    600
    lineHeight:    "1.5"

  heading-sm:
    fontFamily:    "'Noto Sans Bengali', sans-serif"
    fontSize:      "15px"
    fontWeight:    600
    lineHeight:    "1.5"

  # — Body copy — সব বাংলা prose —
  body-md:
    fontFamily:    "'Noto Sans Bengali', sans-serif"
    fontSize:      "14px"
    fontWeight:    400
    lineHeight:    "1.75"       # Bengali অক্ষরের উচ্চতার জন্য বেশি line-height

  body-sm:
    fontFamily:    "'Noto Sans Bengali', sans-serif"
    fontSize:      "13px"
    fontWeight:    400
    lineHeight:    "1.7"

  # — Metric numbers — Geist দিয়ে sharper numerics —
  number-xl:
    fontFamily:    "'Geist Variable', 'Noto Sans Bengali', sans-serif"
    fontSize:      "32px"
    fontWeight:    700
    lineHeight:    "1.0"
    letterSpacing: "-0.02em"   # শুধু Geist (Latin) এ letter-spacing দাও

  number-lg:
    fontFamily:    "'Geist Variable', 'Noto Sans Bengali', sans-serif"
    fontSize:      "24px"
    fontWeight:    700
    lineHeight:    "1.0"
    letterSpacing: "-0.01em"

  # — Labels, badges, mono code —
  label-mono:
    fontFamily:    "'JetBrains Mono', monospace"
    fontSize:      "11px"
    fontWeight:    600
    lineHeight:    "1.2"
    letterSpacing: "0.06em"
    textTransform: "uppercase"

  label-bengali:
    fontFamily:    "'Noto Sans Bengali', sans-serif"
    fontSize:      "12px"
    fontWeight:    500
    lineHeight:    "1.5"

# ─────────────────────────────────────────────
# SPACING
# ─────────────────────────────────────────────
spacing:
  xs:      "4px"
  sm:      "8px"
  md:      "16px"
  lg:      "24px"
  xl:      "32px"
  xxl:     "48px"
  section: "64px"

rounded:
  sm:   "8px"
  md:   "12px"
  lg:   "16px"
  xl:   "20px"
  pill: "9999px"

# ─────────────────────────────────────────────
# EFFECTS
# ─────────────────────────────────────────────
effects:
  glass-base:
    background:     "rgba(255,255,255,0.45)"
    backdropFilter: "blur(20px) saturate(190%)"
    border:         "1px solid rgba(0,0,0,0.06)"
    boxShadow:      "0 8px 32px rgba(31,38,135,0.04), inset 0 1px 1px rgba(255,255,255,0.80)" # Soft light-mode shadow + inner glow

  glass-elevated:
    background:     "rgba(255,255,255,0.70)"
    backdropFilter: "blur(24px) saturate(200%)"
    border:         "1px solid rgba(0,0,0,0.08)"
    boxShadow:      "0 16px 48px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.90)"

  glass-sidebar:
    background:     "rgba(255,255,255,0.30)"
    backdropFilter: "blur(40px)"
    borderRight:    "1px solid rgba(0,0,0,0.05)"

  inner-glow:
    boxShadow:      "inset 0 1px 0 rgba(255,255,255,0.80)"

  accent-glow-purple:
    boxShadow:      "0 8px 24px rgba(79,70,229,0.15)"

# ─────────────────────────────────────────────
# AMBIENT BACKGROUND
# ─────────────────────────────────────────────
background_system:
  base: "#F5F5F7"
  orbs:
    - color: "rgba(79,70,229,0.06)"
      size:  "600px"
      blur:  "120px"
      position: "top-left"
    - color: "rgba(139,92,246,0.04)"
      size:  "500px"
      blur:  "100px"
      position: "top-right"
    - color: "rgba(249,115,22,0.02)"
      size:  "400px"
      blur:  "80px"
      position: "bottom-center"

# ─────────────────────────────────────────────
# COMPONENTS
# ─────────────────────────────────────────────
components:

  sidebar:
    width:           "240px"
    collapsedWidth:  "64px"
    effect:          "glass-sidebar"
    navItem:
      height:          "40px"
      borderRadius:    "10px"
      font:            "label-bengali"
      activeBackground: "rgba(79,70,229,0.15)"
      activeBorder:    "1px solid rgba(79,70,229,0.30)"
      activeGlow:      "0 0 16px rgba(79,70,229,0.15)"
      hoverBackground: "rgba(255,255,255,0.04)"

  topbar:
    height:          "60px"
    effect:          "glass-base"
    borderBottom:    "1px solid rgba(255,255,255,0.07)"
    pageTitle:       "heading-md"
    search:
      background:    "rgba(255,255,255,0.06)"
      border:        "1px solid rgba(255,255,255,0.10)"
      borderRadius:  "10px"
      font:          "body-sm"
      placeholder:   "Bengali তে placeholder লেখো"

  metric_card:
    effect:          "glass-base"
    borderRadius:    "16px"
    padding:         "20px 24px"
    label:           "label-bengali"      # বাংলায় লেবেল
    number:          "number-xl"          # Geist দিয়ে sharp number
    change_text:     "body-sm"            # বাংলায় পরিবর্তন বার্তা
    accent_bar:
      height:        "3px"
      colors:        ["#4F46E5", "#10B981", "#F97316", "#F43F5E"]
    hover:
      effect:        "glass-elevated"
      transform:     "translateY(-2px)"

  chart_card:
    effect:          "glass-base"
    borderRadius:    "20px"
    padding:         "24px"
    title:           "heading-sm"
    chartArea:
      gridColor:     "rgba(255,255,255,0.05)"
      axisColor:     "rgba(255,255,255,0.15)"
      axisFont:      "'Noto Sans Bengali', sans-serif"  # chart axis এও Bengali font
      tooltipBackground: "rgba(10,15,30,0.95)"
      tooltipBorder: "1px solid rgba(79,70,229,0.30)"
      tooltipFont:   "'Noto Sans Bengali', sans-serif"

  table_card:
    effect:          "glass-base"
    borderRadius:    "20px"
    headerFont:      "label-bengali"
    bodyFont:        "body-sm"
    rowHover:        "rgba(255,255,255,0.04)"
    divider:         "1px solid rgba(255,255,255,0.05)"

  badge:
    borderRadius:    "pill"
    padding:         "3px 10px"
    font:            "label-mono"         # badge এ সবসময় mono
    variants:
      success:
        background:  "rgba(16,185,129,0.15)"
        border:      "1px solid rgba(16,185,129,0.30)"
        color:       "#10B981"
      warning:
        background:  "rgba(245,158,11,0.15)"
        border:      "1px solid rgba(245,158,11,0.30)"
        color:       "#F59E0B"
      danger:
        background:  "rgba(244,63,94,0.15)"
        border:      "1px solid rgba(244,63,94,0.30)"
        color:       "#F43F5E"
      info:
        background:  "rgba(6,182,212,0.15)"
        border:      "1px solid rgba(6,182,212,0.30)"
        color:       "#06B6D4"

  button:
    font:            "body-md"            # Bengali button text
    primary:
      background:    "#4F46E5"
      hoverBackground: "#3B32C5"
      glow:          "0 0 20px rgba(79,70,229,0.40)"
      borderRadius:  "10px"
      padding:       "10px 20px"
      fontWeight:    600
    ghost:
      background:    "rgba(255,255,255,0.04)"
      border:        "1px solid rgba(255,255,255,0.08)"
      hoverBackground: "rgba(255,255,255,0.08)"
      borderRadius:  "10px"

# ─────────────────────────────────────────────
# LAYOUT
# ─────────────────────────────────────────────
layout:
  grid:
    sidebar:         "240px"
    main:            "1fr"
  dashboard_grid:
    metric_cards:    "repeat(4, 1fr)"
    charts_row:      "2fr 1fr"
    bottom_row:      "1fr 1fr"
    gap:             "20px"
  content_padding:   "28px 32px"

# ─────────────────────────────────────────────
# ANIMATION (Framer Motion Integration)
# ─────────────────────────────────────────────
animation:
  framer_motion:
    layout:
      layout: "position"
      transition: { type: "spring", stiffness: 300, damping: 30 }
    fade_in:
      initial: { opacity: 0, y: 15 }
      animate: { opacity: 1, y: 0 }
      exit: { opacity: 0, y: -15 }
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    hover_lift:
      whileHover: { y: -4, scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 25 } }
    tap_press:
      whileTap: { scale: 0.97 }
  enter_card:
    from:      "opacity:0; transform:translateY(12px)"
    to:        "opacity:1; transform:translateY(0)"
    duration:  "0.4s"
    easing:    "cubic-bezier(0.16,1,0.3,1)"
    stagger:   "0.06s"
  hover_lift_css:
    transform:  "translateY(-2px)"
    transition: "0.25s ease"
  glow_pulse:
    duration:   "2s ease-in-out infinite alternate"

# ─────────────────────────────────────────────
# GUARDRAILS — Bengali specific
# ─────────────────────────────────────────────
guardrails:
  bengali_typography:
    - "Bengali text এ কখনো letter-spacing দেওয়া যাবে না — অক্ষর জোড়া ভেঙে যায়।"
    - "line-height minimum 1.7 — মাত্রা (ঁ ঃ ং ্) এর জন্য জায়গা দরকার।"
    - "font-weight 300 Bengali এ ব্যবহার করো শুধু large display text এ — ছোট size এ অপঠ্যনযোগ্য।"
    - "বাংলা সংখ্যা (১২৩) দেখাতে চাইলে Noto Sans Bengali ই রাখো — Geist বাংলা সংখ্যা support করে না।"
    - "English metric numbers এ Geist Variable ব্যবহার করো — sharper and more readable."
    - "Chart axis label এ Bengali font set করতে ভুলো না (Chart.js এ font option আছে)।"

  glass_design:
    - "backdrop-filter: blur() অবশ্যই দিতে হবে।"
    - "Glass card এ border: 1px solid rgba(255,255,255,0.10) রাখতে হবে।"
    - "Glow effect শুধু accent element এ — সব card এ না।"
    - "Ambient orbs সব content এর পেছনে (z-index: 0)।"
