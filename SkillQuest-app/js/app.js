/* ============================================================
   SkillQuest - Core Game Engine
   app.js
   ============================================================ */

'use strict';

// ============================================================
//  GAME STATE
// ============================================================
const STATE = {
  guide: null,
  projectName: 'SkillQuest_01',
  xp: 700,
  xpMax: 1000,
  level: 10,
  streak: 15,
  hp: 100,
  currentScreen: 'screen-selection',
  bossHp: 100,
  bossTimerInterval: null,
  bossTimeLeft: 30,
  
  // Advanced Gamification & AI
  achievements: [],
  skills: {
    hint: false,
    skip: false,
    doubleXp: false,
    timeDilator: false
  },
  accuracyTracker: {
    syntax: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
    design: { correct: 0, total: 0 }
  },
  inventory: {
    mysteryBoxes: 2,
    badges: []
  },
  quests: {
    lesson: { active: true, progress: 0, target: 1,  claimed: false },
    write:  { active: true, progress: 0, target: 20, claimed: false },
    quiz:   { active: true, progress: 0, target: 1,  claimed: false }
  },
  notebookLines: 0,
  activeLanguage: 'javascript',
  lastLogin: new Date().toLocaleDateString(),
  subscription: 'free' // 'free' or 'pro'
};

// ============================================================
//  KNOWLEDGE BASE DATA (DAILY QUEST: LESSONS)
// ============================================================
const KNOWLEDGE_BASE = {
  html: {
    title: "HTML Architecture",
    desc: "The skeleton of the web. Learn Semantic Tags and Structure.",
    notes: [
      "HTML5 introduces semantic elements like <main>, <article>, and <section> for better SEO.",
      "The <head> contains metadata, while the <body> contains all visible content.",
      "Forms and Inputs are essential for user interaction and data collection."
    ]
  },
  css: {
    title: "CSS Visual Protocol",
    desc: "Aesthetic styling and layout mechanics. Master Flexbox and Grid.",
    notes: [
      "Flexbox: Ideal for one-dimensional layouts (rows or columns).",
      "CSS Grid: Powerful two-dimensional layout system for complex designs.",
      "Custom Variables: Use --var sets for consistent theme management."
    ]
  },
  javascript: {
    title: "JavaScript Logic Core",
    desc: "Interactive scripting and DOM manipulation. Essential for Knights.",
    notes: [
      "Variables: Use 'const' by default; 'let' only if reassignment is needed.",
      "Functions: Arrow functions provide a concise syntax and lexical 'this' binding.",
      "Fetch API: Standard way to request data from external systems."
    ]
  },
  python: {
    title: "Python Snake Scripting",
    desc: "Clean syntax and high-level automation. Perfect for AI protocols.",
    notes: [
      "Indentation: In Python, whitespace is functional and defines blocks.",
      "Lists: Dynamic arrays with built-in methods like .append() and .pop().",
      "Dictionaries: Key-value stores for efficient data retrieval."
    ]
  }
};

// ============================================================
//  QUIZ COLLECTION (UNIVERSAL QUIZ HUB)
// ============================================================
const QUIZZES = {
  web: [
    { q: "Which CSS property is used for 2D Grid layouts?", options: ["Flexbox", "Grid", "Table", "Float"], correct: 1 },
    { q: "What does HTML stand for?", options: ["Hypertext Markup Language", "High Tech Main Logic", "Home Tool Map Link", "None"], correct: 0 }
  ],
  python: [
    { q: "How do you start a code block in Python?", options: ["Semicolon", "Curly Braces", "Indentation", "Parentheses"], correct: 2 },
    { q: "Which keyword defines a function?", options: ["def", "func", "function", "define"], correct: 0 }
  ],
  logic: [
    { q: "What is 10 % 3?", options: ["0", "1", "3", "3.33"], correct: 1 },
    { q: "Which operator is used for 'AND' in JS?", options: ["||", "&&", "!", "&"], correct: 1 }
  ]
};

// ============================================================
//  BACKGROUND IMAGES
// ============================================================
const BACKGROUNDS = {
  'screen-selection':    '../codeing world/introduction level.jpeg',
  'screen-dashboard':    '../codeing world/Beginner Forest level.jpeg',
  'screen-map':          '../codeing world/Beginner Forest level.jpeg',
  'Beginner Forest':     '../codeing world/Beginner Forest level.jpeg',
  'Logic Desert':        '../codeing world/Logic Desert level.jpeg',
  'Code Dungeon':        '../codeing world/Code Dungeon level.jpeg',
  'Bug Mountain':        '../codeing world/Bug Mountain level.jpeg',
  'Final Arena':         '../codeing world/Final Arena level.jpeg',
  'screen-training':     '../codeing world/Beginner Forest level.jpeg',
  'screen-quiz':         '../codeing world/Bug Mountain level.jpeg',
  'screen-coding':       '../codeing world/Code Dungeon level.jpeg',
  'screen-profile':      '../codeing world/introduction level.jpeg',
  'screen-friend-challenges': '../codeing world/Final Arena level.jpeg',
  
  // Design World Levels
  'Pixel Village':       '../design world/Pixel Village level.jpeg',
  'Layout Labyrinth':    '../design world/UX Research Bay level.jpeg',
  'UX Research Bay':     '../design world/UX Research Bay level.jpeg',
  'Interaction City':    '../design world/Interaction City level.jpeg',
  'Design Arena':        '../design world/Design Arena level.jpeg'
};

// ============================================================
//  CHARACTER DATA
// ============================================================
const GUIDES = {
  nova: {
    name: 'Nova',
    img: 'assets/characters/nova.png',
    color: '#00f0ff',
    lines: {
      selection: ["Systems initialized. I am Nova. Together, we conquer all logic.", "Precision is my language. Let's begin, Knight."],
      dashboard: ["Your stats are optimal. Choose your next mission.", "The Code Kingdom awaits our calculations."],
      map:       ["I've mapped every zone. Start in Beginner Forest, Knight.", "Strategic path: Forest - Desert - Dungeon - Mountain - Arena."],
      training:  ["Absorb every line - knowledge is our primary weapon.", "These concepts form the core of your arsenal."],
      quiz:      ["Logic under pressure. You have all the data you need.", "Analyze each option carefully before committing."],
      coding:    ["Write clean, efficient code. I'll monitor the output.", "The solution is already in your mind. Execute."],
      design:    ["Interesting. Aesthetics have their own logic.", "Composition and balance - apply the grid system."],
      boss:      ["Threat detected. Exploit its weaknesses systematically.", "Each attack reduces its corruption index. Stay focused!"],
      leaderboard: ["Your ranking will improve with each victory.", "Data shows: consistency beats intensity every time."]
    }
  },
  juhi: {
    name: 'Juhi',
    img: 'assets/characters/juhi.png',
    color: '#ff007f',
    lines: {
      selection: ["I'm Juhi! Let's make this journey absolutely beautiful.", "Every great interface starts with a great idea - let's create!"],
      dashboard: ["You're on a 15-day streak! That's legendary dedication!", "The Code Kingdom is looking gorgeous today. Where shall we go?"],
      map:       ["Ooh the map! Every zone has its own vibe. I love Beginner Forest!", "Let's unlock the Design World - that's where the real magic is!"],
      training:  ["This module is so important - these concepts unlock everything!", "Pay attention to the visuals, not just the words. See the pattern!"],
      quiz:      ["Don't panic, think it through. I believe in you!", "Remember what we learned - the answer is in there!"],
      coding:    ["Your code should tell a story. Make it readable, make it beautiful.", "Think of the function like a recipe - clear inputs, clear outputs!"],
      design:    ["YES! This is my favorite part! Let's create something stunning!", "Balance the elements - good design has rhythm and flow!"],
      boss:      ["We can do this! Hit it with everything we've got!", "Don't let it intimidate you - we're stronger than any bug!"],
      leaderboard: ["Look at those rankings! We're climbing, one XP at a time!", "Every Knight here started at #1000. Our time is coming!"]
    }
  },

};

// ============================================================
//  PARTICLE SYSTEM
// ============================================================
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isPaused = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.hidden;
      if (!this.isPaused) this.animate();
    });
    this.spawnParticles(80);
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const colors = ['#00f0ff', '#9d00ff', '#ff007f', '#00ff88', '#ffe600'];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.1,
      radius: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.1,
      life: 1,
      decay: Math.random() * 0.003 + 0.001
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.alpha = p.life * 0.7;

      if (p.life <= 0 || p.y < 0) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.canvas.height + 5;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    if (!this.isPaused) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

// ============================================================
//  PARALLAX
// ============================================================
function initParallax() {
  const bg = document.getElementById('game-bg');
  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const x = ((e.clientX / window.innerWidth) - 0.5) * 25;
        const y = ((e.clientY / window.innerHeight) - 0.5) * 15;
        bg.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.12)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================================
//  BACKGROUND SWITCHER
// ============================================================
function setBackground(key) {
  const bg = document.getElementById('game-bg');
  const url = BACKGROUNDS[key];
  if (url) {
    bg.style.backgroundImage = `url('${url}')`;
  }
}

// ============================================================
//  SCREEN NAVIGATION
// ============================================================
function navigateTo(screenId) {
  if (screenId === STATE.currentScreen) return;
  console.log(`[NAV] Navigating to: ${screenId}`);

  const current = document.getElementById(STATE.currentScreen);
  const next    = document.getElementById(screenId);

  if (!next) {
    console.error(`[NAV] Screen not found: ${screenId}. Attempting failover to dashboard.`);
    if (screenId !== 'screen-dashboard') navigateTo('screen-dashboard');
    return;
  }

  // Handle current screen fade-out
  if (current) {
    current.classList.remove('active');
    current.classList.add('exit');
    setTimeout(() => {
      current.classList.remove('exit');
    }, 500);
  }

  // Activate next screen after brief delay to allow fade-out
  setTimeout(() => {
    try {
      next.classList.add('active');
      STATE.currentScreen = screenId;
      
      // Background and hooks with error boundaries
      try { setBackground(screenId); } catch(bgErr) { console.warn("Background set failed:", bgErr); }
      
      if (screenId.startsWith('screen-dw-')) {
        onDWScreenEnter(screenId);
      } else {
        onScreenEnter(screenId);
      }
    } catch (err) {
      console.error("[NAV] Transition error:", err);
      // Force visibility if something crashed
      next.style.opacity = "1";
      next.style.pointerEvents = "auto";
    }
  }, 300);
}

// ============================================================
//  ON SCREEN ENTER HOOKS
// ============================================================
function onScreenEnter(screenId) {
  const guide = GUIDES[STATE.guide];
  if (!guide) return;

  switch (screenId) {
    case 'screen-dashboard': {
      // Ensure dashboard starts at top when entered
      const dashEl = document.getElementById('screen-dashboard');
      if (dashEl) dashEl.scrollTop = 0;
      
      animateXPBar();
      showGuideMessage(guide.lines.dashboard);
      updateDashboardGreeting();
      updateStreakUI();
      updateDashboardProfile();
      // Update Mission Hub
      Object.keys(STATE.quests).forEach(updateMissionUI);
      break;
    }
    case 'screen-pathway':
      showGuideMessage("Select your training pathway to proceed.");
      break;
    case 'screen-map':
      showGuideMessage(guide.lines.map);
      initWorldMap();
      updateMapUI(); // Ensure node locked/unlocked states are current
      initMapHoverGuides(); // Character reacts on platform hover
      break;
    case 'screen-skills':
      showGuideMessage("Tactical Skill Tree active. Distributed neural points available.");
      break;
    case 'screen-analytics':
      showGuideMessage("Neural Diagnostics active. Analyzing your mastery levels.");
      renderAnalytics();
      break;
    case 'screen-mini-game':
      showGuideMessage("Memory Grid initializing. Maintain focus.");
      initMemoryGame();
      break;
    case 'screen-level-entry':
      showGuideMessage(guide.lines.training);
      // If we are at the boss node, adjust the buttons
      const isBossNode = STATE.currentNode === 'arena';
      const trainBtn = document.getElementById('btn-start-training');
      const quizBtn = document.getElementById('btn-start-quiz');
      
      if (trainBtn && quizBtn) {
        if (isBossNode) {
          trainBtn.innerHTML = 'COMMANDER BOSS FIGHT';
          trainBtn.onclick = () => navigateTo('screen-boss');
          quizBtn.style.display = 'none';
        } else {
          trainBtn.innerHTML = 'Start Training';
          trainBtn.onclick = () => navigateTo('screen-training');
          quizBtn.style.display = 'inline-flex';
        }
      }
      break;
    case 'screen-training':
      showGuideMessage(guide.lines.training);
      break;
    case 'screen-quiz':
      showGuideMessage(guide.lines.quiz);
      resetQuiz();
      break;
    case 'screen-coding':
      showGuideMessage(guide.lines.coding);
      break;
    case 'screen-design':
      showGuideMessage(guide.lines.design);
      break;
    case 'screen-boss':
      showGuideMessage(guide.lines.boss);
      startBossFight();
      break;
    case 'screen-leaderboard':
      showGuideMessage(guide.lines.leaderboard);
      break;
    case 'screen-profile':
      showGuideMessage(guide.lines.dashboard);
      renderProfile();
      break;
  }
}

// ============================================================
//  CHARACTER SELECTION
// ============================================================
function selectGuide(guideId) {
  const guide = GUIDES[guideId];
  if (!guide) return;
  STATE.guide = guideId;
  console.log("[GUIDE] Selected:", guideId);

  syncGuideUI(guideId);
  
  const guideEl = document.getElementById('global-guide');
  if (guideEl) {
    guideEl.classList.remove('hidden');
    if (typeof initGuideDrag === 'function') initGuideDrag();
    
    // Fail-safe speak
    try {
      setTimeout(() => speak(guide.lines.selection[0]), 600);
    } catch(e) { console.warn("Speak failed:", e); }
  }

  // Selection visual feedback - GSAP check
  const card = document.querySelector(`.char-card[data-guide="${guideId}"]`);
  if (card && window.gsap) {
    gsap.to(card, { 
      scale: 1.05, 
      borderColor: guide.color, 
      boxShadow: `0 0 30px ${guide.color}40`, 
      duration: 0.4 
    });
  }

  // Navigate - Snappier transition
  setTimeout(() => {
    navigateTo('screen-pathway');
  }, 1000);
}

// ============================================================
//  PATHWAY SELECTION
// ============================================================
function selectPathway(pathName) {
  STATE.pathway = pathName;
  showGuideMessage(`Ah, the path of ${pathName}. A noble choice!`);
  
  setTimeout(() => {
    navigateTo('screen-dashboard');
  }, 800);
}

// ============================================================
//  GUIDE DIALOG SYSTEM (v2)
// ============================================================
let guideTimeout = null;
let typeInterval = null;

/**
 * Enhanced speech system with character context and interruptible typewriter effect
 */
function speak(message, duration = 6000) {
  const bubble = document.getElementById('guide-bubble');
  const textEl = document.getElementById('guide-bubble-text');
  const guide = GUIDES[STATE.guide];

  if (!bubble || !textEl || !guide) return;

  // Interrupt any ongoing typing or timeouts
  if (guideTimeout) clearTimeout(guideTimeout);
  if (typeInterval) clearInterval(typeInterval);

  // Set up typewriter
  textEl.textContent = "";
  let i = 0;
  const typeSpeed = 25; 
  
  typeInterval = setInterval(() => {
    if (i < message.length) {
      textEl.textContent += message.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, typeSpeed);

  // Update name tag
  const nameTag = document.getElementById('guide-name-tag');
  if (nameTag) {
    nameTag.textContent = guide.name.toUpperCase();
    nameTag.style.color = guide.color;
  }

  // Show bubble with high-impact animation
  bubble.classList.add('visible');
  gsap.fromTo(bubble, 
    { x: 30, opacity: 0, scale: 0.8 }, 
    { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
  );

  // Hide bubble after duration plus typing time
  guideTimeout = setTimeout(() => {
    gsap.to(bubble, { 
      x: 20, opacity: 0, scale: 0.9, duration: 0.4, 
      onComplete: () => bubble.classList.remove('visible') 
    });
  }, duration + (message.length * typeSpeed));
}

// Idle Attention Logic: Bounce if user is inactive
let idleTimer = null;
function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const guideEl = document.getElementById('global-guide');
    if (guideEl && !guideEl.classList.contains('hidden')) {
      guideEl.classList.add('guide-attention-bounce');
      setTimeout(() => guideEl.classList.remove('guide-attention-bounce'), 1000);
      
      const guide = GUIDES[STATE.guide];
      if (guide) {
        const idleLines = ["Still there, Knight?", "The mission awaits your command.", "Focus is the key to mastery."];
        speak(idleLines[Math.floor(Math.random() * idleLines.length)]);
      }
    }
  }, 30000); // 30 seconds of idleness
}

document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keydown', resetIdleTimer);

/**
 * Initialize Draggable Guide
 */
function initGuideDrag() {
  // Draggable guides disabled by request to maintain corner positioning.
  return;
}

function showGuideMessage(lines, isArray = false) {
  const message = isArray && Array.isArray(lines)
    ? lines[Math.floor(Math.random() * lines.length)]
    : Array.isArray(lines)
      ? lines[Math.floor(Math.random() * lines.length)]
      : lines;
  speak(message);
}

function toggleGuideDialog() {
  const bubble = document.getElementById('guide-bubble');
  if (bubble.classList.contains('visible')) {
    if (guideTimeout) clearTimeout(guideTimeout);
    bubble.classList.remove('visible');
  } else {
    const guide = GUIDES[STATE.guide];
    if (guide) {
      const all = Object.values(guide.lines).flat();
      speak(all[Math.floor(Math.random() * all.length)]);
    }
  }
}

// ============================================================
//  DASHBOARD
// ============================================================
function animateXPBar() {
  const bar = document.getElementById('xp-fill-hero');
  const xpCur = document.getElementById('player-xp-cur');
  const xpMax = document.getElementById('player-xp-max');
  const lvlEl = document.getElementById('player-lvl-hero');

  if (!bar) return;

  // Update text values
  if (xpCur) xpCur.textContent = STATE.xp;
  if (xpMax) xpMax.textContent = STATE.xpMax;
  if (lvlEl) lvlEl.textContent = STATE.level;

  // Animate bar width
  const targetPct = (STATE.xp / STATE.xpMax) * 100;
  gsap.to(bar, { width: `${targetPct}%`, duration: 1.2, ease: "expo.out" });
}

function updateDashboardGreeting() {
  const el = document.getElementById('dashboard-greeting');
  const playerName = document.getElementById('player-name-hero');
  const guide = GUIDES[STATE.guide];
  
  if (el && guide) {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    el.innerHTML = `${timeGreet.toUpperCase()}, <span id="player-name-hero">${STATE.projectName}</span>`;
    
    // Trigger AI Insight update when entering dashboard
    updateAIInsight();
  }
}

function updateStreakUI() {
  const mainVal = document.getElementById('streak-val');
  const miniVal = document.getElementById('streak-val-mini');
  const badge = document.getElementById('streak-badge-main');

  if (mainVal) mainVal.textContent = STATE.streak;
  if (miniVal) miniVal.textContent = STATE.streak;
  
  if (badge) {
    gsap.fromTo(badge, 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
  }
}

/**
 * Update the new mini profile block on the dashboard
 */
function updateDashboardProfile() {
  const guide = GUIDES[STATE.guide];
  if (!guide) return;

  // 1. Update Mini Profile (Top HUD)
  const miniAvatar = document.getElementById('dashboard-avatar');
  const miniName   = document.getElementById('dashboard-player-name');
  const miniRank   = document.getElementById('dashboard-player-rank');
  const miniLvl    = document.getElementById('dashboard-lvl');
  
  if (miniAvatar) miniAvatar.src = guide.img;
  if (miniName)   miniName.textContent = STATE.projectName;
  if (miniLvl)    miniLvl.textContent = STATE.level;

  // Calculate Rank
  let currentRank = "NOVICE KNIGHT";
  if (STATE.level >= 5)  currentRank = "VANGUARD KNIGHT";
  if (STATE.level >= 10) currentRank = "ELITE KNIGHT";
  if (STATE.level >= 15) currentRank = "LUMINARY KNIGHT";
  if (STATE.level >= 20) currentRank = "CODE LORD";

  if (miniRank) {
    miniRank.textContent = currentRank;
    miniRank.style.color = guide.color;
  }

  // 2. Update Profile Hub Hero (Main Dashboard)
  const phAvatar = document.getElementById('ph-avatar-img');
  const phName   = document.getElementById('ph-name');
  const phLvl    = document.getElementById('ph-lvl');
  const phRank   = document.getElementById('ph-rank');
  const phXpCur  = document.getElementById('ph-xp-cur');
  const phXpMax  = document.getElementById('ph-xp-max');
  const phXpFill = document.getElementById('ph-xp-fill');

  // Mastery Bars
  const mSyntax  = document.getElementById('ph-mastery-syntax');
  const mLogic   = document.getElementById('ph-mastery-logic');
  const mDesign  = document.getElementById('ph-mastery-design');

  if (phAvatar) phAvatar.src = guide.img;
  if (phName)   phName.textContent = STATE.projectName;
  if (phLvl)    phLvl.textContent = STATE.level;
  if (phRank)   phRank.textContent = currentRank;
  
  if (phXpCur)  phXpCur.textContent = STATE.xp;
  if (phXpMax)  phXpMax.textContent = STATE.xpMax;
  if (phXpFill) {
    const pct = (STATE.xp / STATE.xpMax) * 100;
    phXpFill.style.width = pct + '%';
  }

  // Update Mastery (Dynamic based on accuracy and progress)
  const computeMastery = (topic) => {
    const data = STATE.accuracyTracker[topic];
    if (!data || data.total === 0) return 40; // Default starter mastery
    return Math.round((data.correct / data.total) * 100);
  };

  if (mSyntax) mSyntax.style.width = computeMastery('syntax') + '%';
  if (mLogic)  mLogic.style.width  = computeMastery('logic')  + '%';
  if (mDesign) mDesign.style.width = computeMastery('design') + '%';

  // Animation for the mini profile
  const trigger = document.getElementById('profile-trigger');
  if (trigger) {
    gsap.fromTo(trigger, 
      { x: -20, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }
}

/**
 * Premium typing effect for neural diagnostics
 */
async function updateAIInsight() {
  const el = document.getElementById('ai-insight-text');
  if (!el) return;

  const insights = [
    "Neural patterns stable. Intelligence quotient rising by 4.2% this session.",
    "Data analysis complete: Your syntax consistency is at 98%. Tactical move: Master more complex loops.",
    "System diagnostics: Optimal performance detected. You are 2 missions away from Level 11.",
    "Neural link established. Your focus on Logic Desert has improved problem-solving speed by 12%."
  ];
  
  const text = insights[Math.floor(Math.random() * insights.length)];
  
  // Clear and type
  el.textContent = "";
  let i = 0;
  const speed = 30; // ms per char

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ============================================================
//  MAP - LEVEL
// ============================================================
function enterLevel(zoneName) {
  setBackground(zoneName);
  const levelTitle = document.getElementById('level-title');
  const levelDesc = document.getElementById('level-desc');

  const descriptions = {
    'Beginner Forest': 'Ancient variable scrolls lie hidden in the undergrowth. Master the basics to claim your first Syntax Blade.',
    'Logic Desert':    'Cross the sands of boolean storms. Only pure logic will guide you through.',
    'Code Dungeon':    'Dark corridors echo with nested functions. Debug your way to freedom.',
    'Bug Mountain':    'A lair crawling with runtime errors and null references. Face them head-on.',
    'Final Boss Arena': 'The ultimate test of a SkillQuest. Vanquish the Syntax Terror and restore balance to the kingdom.',
    'Design World':    'A realm where pixels reign. Craft interfaces worthy of a true UI Knight.',
    'Logo Design & Branding': 'Master the art of visual identity. Create logos that leave a lasting impression.',
    'Wireframing & User Flows': 'Build the blueprint of success. Map out user journeys through structural logic.',
    'UI/UX Principles': 'Master color, typography, and hierarchy. Create beautiful and accessible experiences.',
    'User Research & Personas': 'Understand your users. Build empathy and research protocols to guide your design.',
    'Web & App Design': 'Responsive layouts for a modern world. Design across devices with precision.',
    'Prototyping & Posters': 'Bring your designs to life. Create interactive prototypes and high-impact layouts.'
  };

  if (levelTitle) levelTitle.textContent = zoneName;
  if (levelDesc)  levelDesc.textContent = descriptions[zoneName] || '';

  // Trigger Quest 1: Complete 1 Lesson
  completeTask('lesson', 50);

  navigateTo('screen-level-entry');
}

// ============================================================
//  TRAINING CHAMBER — Module System
// ============================================================

// Embeddable YouTube videos (freeCodeCamp / open-license channels)
const TRAINING_MODULES = [
  {
    label:   'MODULE 1',
    title:   'Variables & Scope',
    desc:    'Store and label data in memory — the foundation of all programs.',
    // freeCodeCamp JavaScript Crash Course (embedding allowed)
    videoId: 'PkZNo7MFNFg',
    start:   0
  },
  {
    label:   'MODULE 2',
    title:   'Functions & Arrow Functions',
    desc:    'Reusable blocks of code that perform specific tasks on demand.',
    videoId: 'PkZNo7MFNFg',
    start:   3600   // jump to ~1h mark covering functions
  },
  {
    label:   'MODULE 3',
    title:   'Loops & Iteration',
    desc:    'Repeat operations automatically without duplicating code.',
    videoId: 'PkZNo7MFNFg',
    start:   5400   // ~1h30m covering loops
  },
  {
    label:   'MODULE 4',
    title:   'Conditionals & Logic',
    desc:    'Make decisions in your code with if/else logic branches.',
    videoId: 'PkZNo7MFNFg',
    start:   2700   // ~45m covering conditionals
  }
];

let activeModuleIndex = 0;

function selectModule(index) {
  activeModuleIndex = index;
  const mod = TRAINING_MODULES[index];

  // Update placeholder text
  const badge = document.getElementById('vid-module-badge');
  const title = document.getElementById('vid-module-title');
  const desc  = document.getElementById('vid-module-desc');
  if (badge) badge.textContent = mod.label;
  if (title) title.textContent = mod.title;
  if (desc)  desc.textContent  = mod.desc;

  // Highlight active tab
  document.querySelectorAll('.mod-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });

  // Highlight active concept card
  document.querySelectorAll('.concept-card').forEach((c, i) => {
    c.classList.toggle('active-concept', i === index);
  });

  // If video was playing, close it first so the new module placeholder shows
  closeVideo();
}

function loadVideo() {
  const placeholder = document.getElementById('video-placeholder');
  const iframe      = document.getElementById('training-iframe');
  const closeBtn    = document.getElementById('vid-close-btn');
  const mod = TRAINING_MODULES[activeModuleIndex];

  if (!placeholder || !iframe) return;

  const src = `https://www.youtube.com/embed/${mod.videoId}?autoplay=1&start=${mod.start}&controls=1&rel=0&modestbranding=1`;

  placeholder.style.display = 'none';
  iframe.src = src;
  iframe.style.display = 'block';
  if (closeBtn) closeBtn.classList.remove('hidden');

  // Guide feedback
  showGuideMessage(`Loading ${mod.title}... study hard, Knight! 📚`);
}

function closeVideo() {
  const placeholder = document.getElementById('video-placeholder');
  const iframe      = document.getElementById('training-iframe');
  const closeBtn    = document.getElementById('vid-close-btn');

  if (iframe) { iframe.src = 'about:blank'; iframe.style.display = 'none'; }
  if (placeholder) placeholder.style.display = '';
  if (closeBtn) closeBtn.classList.add('hidden');
}


// ============================================================
//  QUIZ SYSTEM
// ============================================================
const QUIZ_QUESTIONS = [
  {
    q: '"Halt! What keyword declares a variable that CANNOT be reassigned in JavaScript?"',
    options: ['A) var', 'B) const', 'C) let', 'D) static'],
    correct: 1
  },
  {
    q: '"Which HTML element defines the structure of a webpage at its root?"',
    options: ['A) <body>', 'B) <div>', 'C) <html>', 'D) <main>'],
    correct: 2
  },
  {
    q: '"What CSS property controls the spacing INSIDE an element?"',
    options: ['A) margin', 'B) border', 'C) gap', 'D) padding'],
    correct: 3
  }
];

let currentQuestion = 0;
let questionsAnswered = 0;

function resetQuiz() {
  currentQuestion = 0;
  STATE.hp = 100;
  loadQuestion(0);
  updatePlayerHP(100);
  const nextBtn = document.getElementById('btn-next-quiz');
  if (nextBtn) nextBtn.style.display = 'none';
}

function loadQuestion(index) {
  const q = QUIZ_QUESTIONS[index % QUIZ_QUESTIONS.length];
  const qEl = document.getElementById('quiz-question');
  if (qEl) qEl.textContent = q.q;

  const optionsContainer = document.getElementById('quiz-options');
  const inputContainer = document.getElementById('quiz-input-container');
  const nextBtn = document.getElementById('btn-next-quiz');
  if (nextBtn) nextBtn.style.display = 'none';

  if (q.type === 'input') {
    if (optionsContainer) optionsContainer.style.display = 'none';
    if (inputContainer) {
      inputContainer.style.display = 'block';
      const input = document.getElementById('quiz-text-input');
      if (input) {
        input.value = '';
        input.disabled = false;
        input.focus();
      }
    }
  } else {
    if (inputContainer) inputContainer.style.display = 'none';
    if (optionsContainer) {
      optionsContainer.style.display = 'grid';
      const opts = document.querySelectorAll('.quiz-btn');
      opts.forEach((btn, i) => {
        if (q.options && q.options[i] !== undefined) {
          btn.style.display = 'inline-flex';
          btn.textContent = (q.type === 'boolean' ? '' : (String.fromCharCode(65 + i) + ') ')) + q.options[i];
          btn.className = 'game-btn btn-hollow quiz-btn';
          btn.disabled = false;
          btn.onclick = () => answerQuiz(btn, i === q.correct);
        } else {
          btn.style.display = 'none';
        }
      });
    }
  }
}

function answerQuiz(btn, isCorrect) {
  const opts = document.querySelectorAll('.quiz-btn');
  opts.forEach(b => b.disabled = true);

  // AI Track
  const topic = currentQuestion % 2 === 0 ? 'syntax' : 'logic';
  trackAccuracy(topic, isCorrect);

  if (isCorrect) {
    if (btn) btn.classList.add('correct');
    gainXP(50, topic);
    showGuideMessage('Correct! +50 XP gained!');
  } else {
    if (btn) btn.classList.add('wrong');
    STATE.hp = Math.max(0, STATE.hp - 25);
    updatePlayerHP(STATE.hp);
    triggerScreenShake();
    showGuideMessage('Wrong! HP reduced by 25. Think carefully next time!');
    // highlight correct
    const q = QUIZ_QUESTIONS[currentQuestion % QUIZ_QUESTIONS.length];
    if (q.type !== 'input' && opts[q.correct]) {
      opts[q.correct].classList.add('correct');
    }
  }

  const nextBtn = document.getElementById('btn-next-quiz');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
  questionsAnswered++;
}

function submitQuizInput() {
  const input = document.getElementById('quiz-text-input');
  if (!input || input.disabled) return;

  const q = QUIZ_QUESTIONS[currentQuestion % QUIZ_QUESTIONS.length];
  const userAns = input.value.trim().toLowerCase();
  const isCorrect = userAns === q.correct.toLowerCase();

  input.disabled = true;
  answerQuiz(null, isCorrect);
  
  if (!isCorrect) {
    input.style.borderColor = 'var(--neon-red)';
    input.value = `Incorrect (Correct: ${q.correct})`;
  } else {
    input.style.borderColor = 'var(--neon-green)';
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= QUIZ_QUESTIONS.length) {
    showGuideMessage('Quiz complete! Advancing to Coding Challenge...');
    completeTask('quiz', 70); // Trigger Quest 3: Win a Quiz
    setTimeout(() => navigateTo('screen-coding'), 1500);
    return;
  }
  loadQuestion(currentQuestion);
}

function updatePlayerHP(hp) {
  const bar = document.getElementById('player-hp-bar');
  if (bar) bar.style.width = `${hp}%`;
}

// ============================================================
//  CODE EDITOR
// ============================================================
function runCode() {
  const code = document.getElementById('code-editor').value;
  const output = document.getElementById('console-output');
  if (!output) return;

  output.innerHTML = '';

  try {
    const logs = [];
    const fakeConsole = { log: (...args) => logs.push(args.join(' ')) };

    // Safe eval sandbox (eval is constrained intentionally here)
    const fn = new Function('console', `"use strict";\n${code}`);
    fn(fakeConsole);

    logs.forEach(line => {
      const div = document.createElement('div');
      div.className = 'console-line success';
      div.textContent = '> ' + line;
      output.appendChild(div);
    });

    if (logs.length === 0) {
      addConsoleLine('> Script executed with no output.', '');
    }

    // Trigger Quest 2: Write 20 Lines (Simulated by 5 lines per run)
    if (!STATE.writeLines) STATE.writeLines = 0;
    STATE.writeLines += 5;
    if (STATE.writeLines >= 20) {
      completeTask('write', 30);
    }
  } catch (err) {
    addConsoleLine('> ERROR: ' + err.message, 'error');
    triggerScreenShake();
  }
}

function submitCode() {
  const code = document.getElementById('code-editor').value;
  const output = document.getElementById('console-output');

  try {
    const fn = new Function(`"use strict";\n${code}\nreturn typeof calculateDamage !== 'undefined' ? calculateDamage(3) : null;`);
    const result = fn();

    if (result === 80) {
      addConsoleLine('  CHALLENGE PASSED! calculateDamage(3) = 80', 'success');
      gainXP(100);
      showGuideMessage('Brilliant code! +100 XP. Mission accomplished!');
      const nextBtn = document.getElementById('btn-code-next');
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.style.animation = 'pulseGlow 1s infinite';
        // Instead of hardcoded navigateTo('screen-boss'), it will now return to map
        nextBtn.onclick = () => {
          completeLevel(STATE.currentWorld || 'coding', STATE.currentNode || 'beginner');
          navigateTo('screen-map');
        };
      }
      document.getElementById('ide-layout')?.classList.add('do-success');
    } else {
      addConsoleLine(`L Expected 80, got ${result}. Check your return statement.`, 'error');
      triggerScreenShake();
    }
  } catch (err) {
    addConsoleLine('> ERROR: ' + err.message, 'error');
    triggerScreenShake();
  }
}

function addConsoleLine(text, type = '') {
  const output = document.getElementById('console-output');
  if (!output) return;
  const div = document.createElement('div');
  div.className = `console-line ${type}`;
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

// ============================================================
//  DESIGN CHALLENGE
// ============================================================
function initDesignChallenge() {
  const canvas = document.getElementById('design-canvas');
  const tools  = document.querySelectorAll('.tool-item');
  let componentCount = 0;

  tools.forEach(tool => {
    tool.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', tool.dataset.type);
    });
  });

  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', () => {
    canvas.classList.remove('drag-over');
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');

    const type = e.dataTransfer.getData('text/plain');
    const rect = canvas.getBoundingClientRect();

    // Snap to grid (30px)
    const x = Math.round((e.clientX - rect.left - 40) / 30) * 30;
    const y = Math.round((e.clientY - rect.top - 20) / 30) * 30;

    dropComponent(type, x, y);
    componentCount++;

    // Update hint visibility
    const hint = document.getElementById('canvas-hint');
    if (hint) hint.style.display = 'none';

    // Update scores
    updateDesignScore(componentCount);

    // Feedback tip
    const tips = [
      '"Nice placement! Keep building the layout."',
      '"Good composition - try adding more elements!"',
      '"The grid is your friend. Align everything!"',
      '"Excellent UX instincts! Keep going!"'
    ];
    const tipEl = document.getElementById('feedback-tip');
    if (tipEl) tipEl.textContent = tips[Math.min(componentCount - 1, tips.length - 1)];
  });
}

function dropComponent(type, x, y) {
  const canvas = document.getElementById('design-canvas');

  const el = document.createElement('div');
  el.className = 'canvas-element';
  el.style.left = `${Math.max(0, x)}px`;
  el.style.top  = `${Math.max(0, y)}px`;
  el.style.position = 'absolute';

  switch (type) {
    case 'btn':
      el.innerHTML = '<button style="font-family:Orbitron,monospace;font-size:0.7rem;padding:8px 16px;border:2px solid #00f0ff;background:rgba(0,240,255,0.1);color:#00f0ff;border-radius:5px;cursor:pointer;white-space:nowrap;">Neon Button</button>';
      break;
    case 'card':
      el.innerHTML = '<div style="background:rgba(10,10,30,0.8);border:1px solid rgba(0,240,255,0.3);border-radius:10px;padding:1rem;width:140px;backdrop-filter:blur(10px);font-size:0.75rem;">Glass Card<br><span style="color:rgba(255,255,255,0.4);font-size:0.65rem;">Drop content here</span></div>';
      break;
    case 'input':
      el.innerHTML = '<input placeholder="Enter command..." style="background:rgba(0,0,0,0.5);border:1px solid rgba(0,240,255,0.3);color:white;padding:6px 12px;border-radius:5px;font-size:0.75rem;outline:none;width:160px;" readonly>';
      break;
    case 'badge':
      el.innerHTML = '<div style="background:linear-gradient(135deg,#00f0ff,#9d00ff);padding:4px 12px;border-radius:20px;font-size:0.65rem;font-family:Orbitron,monospace;font-weight:700;white-space:nowrap;">+50 XP</div>';
      break;
    case 'avatar':
      el.innerHTML = '<div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#9d00ff,#ff007f);border:2px solid #ff007f;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">>_</div>';
      break;
  }

  // Make draggable in canvas
  makeDraggable(el);
  canvas.appendChild(el);
}

function makeDraggable(el) {
  let startX, startY, origLeft, origTop;
  el.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    origLeft = parseInt(el.style.left) || 0;
    origTop  = parseInt(el.style.top)  || 0;
    el.style.zIndex = 100;

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      el.style.left = `${Math.round((origLeft + dx) / 30) * 30}px`;
      el.style.top  = `${Math.round((origTop  + dy) / 30) * 30}px`;
    }

    function onUp() {
      el.style.zIndex = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function updateDesignScore(count) {
  const layout = Math.min(100, count * 20);
  const ux     = Math.min(100, count * 15);
  const crea   = Math.min(100, count * 25);

  animateBar('sbar-layout', layout);
  animateBar('sbar-ux', ux);
  animateBar('sbar-creativity', crea);

  const sl = document.getElementById('score-layout');
  const su = document.getElementById('score-ux');
  const sc = document.getElementById('score-creativity');
  if (sl) sl.textContent = layout + '%';
  if (su) su.textContent = ux + '%';
  if (sc) sc.textContent = crea + '%';
}

function animateBar(id, pct) {
  const bar = document.getElementById(id);
  if (bar) {
    requestAnimationFrame(() => { bar.style.width = pct + '%'; });
  }
}

function submitDesign() {
  gainXP(150);
  showGuideMessage('Design submitted! Excellence achieved - outstanding work!');
  setTimeout(() => navigateTo('screen-boss'), 1800);
}

// ============================================================
//  BOSS FIGHT
// ============================================================
function startBossFight() {
  STATE.bossHp = 100;
  STATE.bossTimeLeft = 30;
  updateBossHP(100);
  startBossTimer();
}

function startBossTimer() {
  clearInterval(STATE.bossTimerInterval);
  const timerEl = document.getElementById('boss-timer-display');

  STATE.bossTimerInterval = setInterval(() => {
    STATE.bossTimeLeft--;
    if (timerEl) {
      const sec = String(STATE.bossTimeLeft).padStart(2, '0');
      timerEl.textContent = `00:${sec}`;
    }

    if (STATE.bossTimeLeft <= 0) {
      clearInterval(STATE.bossTimerInterval);
      bossDefeat();
    }
  }, 1000);
}

function bossAttack(btn, damage) {
  if (STATE.bossHp <= 0) return;

  STATE.bossHp = Math.max(0, STATE.bossHp - damage);
  updateBossHP(STATE.bossHp);

  const feedback = document.getElementById('boss-feedback');
  if (feedback) feedback.textContent = `>_ Hit! Boss took ${damage} damage!`;

  gainXP(damage);

  // Boss shakes on hit
  const sprite = document.getElementById('boss-sprite');
  if (sprite) {
    sprite.classList.add('do-shake');
    setTimeout(() => sprite.classList.remove('do-shake'), 500);
  }

  btn.disabled = true;
  setTimeout(() => { btn.disabled = false; }, 1500);

  if (STATE.bossHp <= 0) {
    clearInterval(STATE.bossTimerInterval);
    bossDefeat();
  } else {
    // Progress Quest
    completeTask('boss', damage);
  }
}

function updateBossHP(hp) {
  const bar = document.getElementById('boss-hp-bar');
  if (bar) bar.style.width = `${hp}%`;
}

function bossDefeat() {
  const sprite = document.getElementById('boss-sprite');
  if (sprite) {
    sprite.style.animation = 'none';
    sprite.style.filter = 'grayscale(1) brightness(0.3)';
    sprite.style.transform = 'scale(0.8)';
    sprite.style.transition = 'all 0.6s ease';
  }
  gainXP(500);
  showGuideMessage('BOSS DEFEATED! +500 XP! You are a true SkillQuest!');
  const feedback = document.getElementById('boss-feedback');
  if (feedback) feedback.textContent = '>- VICTORY - Syntax Terror has been vanquished!';
  setTimeout(() => navigateTo('screen-leaderboard'), 3000);
}

// ============================================================
//  XP SYSTEM
// ============================================================
// ============================================================
//  XP & PROGRESS SYSTEM
// ============================================================
function gainXP(amount, topic = null) {
  let finalAmount = amount;
  if (STATE.skills.doubleXp) finalAmount *= 2;
  
  STATE.xp += finalAmount;
  
  // Track AI Data
  if (topic && STATE.accuracyTracker[topic]) {
    STATE.accuracyTracker[topic].total++;
  }

  // Animate XP bars (text + hero bar)
  const pct = Math.min(100, (STATE.xp / STATE.xpMax) * 100);
  const bars = [
    document.getElementById('xp-fill-main'),
    document.getElementById('xp-fill-hero'),
    document.getElementById('ph-xp-fill')
  ];
  bars.forEach(bar => {
    if (bar) {
      if (window.gsap) gsap.to(bar, { width: pct + '%', duration: 0.8, ease: 'expo.out' });
      else bar.style.width = pct + '%';
    }
  });

  // Update XP text counters
  const xpCurEls = document.querySelectorAll('#player-xp-cur, #ph-xp-cur');
  xpCurEls.forEach(el => { if (el) el.textContent = STATE.xp; });

  // XP float toast (only if gameFeedback.js not loaded — which overrides this)
  if (typeof GFX === 'undefined') {
    triggerXPFloating(finalAmount);
  }

  // Check Level up
  if (STATE.xp >= STATE.xpMax) {
    triggerLevelUp();
  }
}

function triggerLevelUp() {
  const oldLvl = STATE.level;
  STATE.xp -= STATE.xpMax;
  if (STATE.xp < 0) STATE.xp = 0;
  STATE.level++;
  STATE.xpMax = Math.round(STATE.xpMax * 1.5);

  // Reset visual XP bar to 0 then refill for new level
  const bars = [
    document.getElementById('xp-fill-main'),
    document.getElementById('xp-fill-hero'),
    document.getElementById('ph-xp-fill')
  ];
  bars.forEach(bar => {
    if (bar && window.gsap) gsap.to(bar, { width: '0%', duration: 0.4, ease: 'power2.out' });
    else if (bar) bar.style.width = '0%';
  });

  // Update level counters
  ['player-lvl-hero','dashboard-lvl','ph-lvl','profile-lvl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = STATE.level;
  });

  // Use the premium ceremony from gameFeedback.js if available,
  // otherwise fall back to the simpler built-in modal
  if (typeof showLevelUpCeremony === 'function') {
    showLevelUpCeremony(oldLvl, STATE.level);
  } else {
    // Fallback: old premium modal
    const modal = document.getElementById('premium-lvl-modal');
    if (modal) {
      modal.classList.add('active');
      const oldEl = document.getElementById('modal-lvl-old');
      const newEl = document.getElementById('modal-lvl-new');
      if (oldEl) oldEl.textContent = oldLvl;
      if (newEl) newEl.textContent = STATE.level;
      speak(`RANK EVOLUTION COMPLETE. Welcome to Level ${STATE.level}, Knight.`);
    }
  }

  showLevelUpEffect();
  if (typeof triggerScreenShake === 'function') triggerScreenShake();
  saveGameState();
}

function closePremiumLvlModal() {
  const modal = document.getElementById('premium-lvl-modal');
  if (modal) modal.classList.remove('active');
}

function showCompletionPopup(type, xp) {
  // Simple check if mission hub card exists to add a glow
  const card = document.getElementById(`mission-${type}`);
  if (card) {
    card.classList.add('do-success');
    setTimeout(() => card.classList.remove('do-success'), 2000);
  }
}

function showLevelUpEffect() {
  const hero = document.querySelector('.xp-hero-section');
  if (hero) {
    gsap.fromTo(hero, 
      { boxShadow: "0 0 0px var(--neon-blue)" },
      { boxShadow: "0 0 50px var(--neon-blue)", duration: 0.5, yoyo: true, repeat: 3 }
    );
  }
}

function triggerXPFloating(amount) {
  const el = document.createElement('div');
  el.className = 'xp-numeric-float';
  el.innerHTML = `<span>+${amount}</span><small>XP</small>`;
  el.style.left = `${Math.random() * 40 + 30}%`;
  el.style.top  = `${Math.random() * 20 + 40}%`;
  document.body.appendChild(el);
  
  gsap.fromTo(el,
    { y: 0, opacity: 0, scale: 0.5 },
    { y: -120, opacity: 1, scale: 1.2, duration: 1, ease: "power2.out", onComplete: () => {
      gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.5, onComplete: () => el.remove() });
    }}
  );
}

function trackAccuracy(topic, isCorrect) {
  if (!STATE.accuracyTracker[topic]) return;
  STATE.accuracyTracker[topic].total++;
  if (isCorrect) STATE.accuracyTracker[topic].correct++;
  
  updateAIInsights();
}

function updateAIInsights() {
  // Simple AI logic: identify weak areas
  let weakest = null;
  let minRatio = 1.1;
  
  for (const [topic, stats] of Object.entries(STATE.accuracyTracker)) {
    if (stats.total > 0) {
      const ratio = stats.correct / stats.total;
      if (ratio < minRatio) {
        minRatio = ratio;
        weakest = topic;
      }
    }
  }
  
  if (weakest && minRatio < 0.7) {
    showGuideMessage(`AI Insight: Your ${weakest} mastery is low (${Math.round(minRatio*100)}%). Recommend Tech City training.`);
  }
}

// ============================================================
//  CHALLENGE MODES
// ============================================================
function startTimedChallenge(durationSeconds = 60) {
  STATE.mode = 'timed';
  STATE.timer = durationSeconds;
  
  const timerOverlay = document.createElement('div');
  timerOverlay.className = 'timed-overlay';
  timerOverlay.innerHTML = `<div class="timer-ring"></div><div class="timer-text">${durationSeconds}</div>`;
  document.body.appendChild(timerOverlay);
  
  const interval = setInterval(() => {
    STATE.timer--;
    const text = timerOverlay.querySelector('.timer-text');
    if (text) text.textContent = STATE.timer;
    
    if (STATE.timer <= 10) timerOverlay.classList.add('low-time');
    
    if (STATE.timer <= 0) {
      clearInterval(interval);
      timerOverlay.remove();
      failChallenge('Time Expired!');
    }
  }, 1000);
}

function failChallenge(reason) {
  speak(`Mission Failed: ${reason}`);
  navigateTo('screen-map');
}

/**
 * Functional entry point for mission "START" buttons
 */
function startMission(type) {
  const guide = GUIDES[STATE.guide];
  const missionMap = {
    lesson: { screen: 'screen-study', line: "Initiating Protocol Study. Accessing programming language study materials." },
    write:  { screen: 'screen-notebook', line: "Digital notebook link active. Prepare for code input and save to device." },
    quiz:   { screen: 'screen-quiz-hub', line: "Logic Mastery trial selected. Calibrating quiz parameters." }
  };

  const choice = missionMap[type];
  if (!choice) return;

  if (guide) speak(choice.line);
  
  setTimeout(() => {
    navigateTo(choice.screen);
  }, 1000);
}

// ============================================================
//  STUDY MATERIALS LOGIC
// ============================================================
// -- LESSON ACTIONS ---------------------
function openLesson(lang) {
  loadStudyMaterial(lang);
  const overlay = document.getElementById('lesson-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    // Set active language for completion tracking
    STATE.activeLanguage = lang;
  }
}

function closeLesson() {
  const overlay = document.getElementById('lesson-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function completeLessonTask() {
  completeTask('lesson', 1);
  showGuideMessage("Lesson complete! Neural pathways expanded.");
  closeLesson();
}

function loadStudyMaterial(lang) {
  const contentMap = {
    python: {
      title: 'Python Fundamentals',
      icon: 'ph-file-py',
      modules: [
        { name: 'Syntax Check', desc: 'Indentation, Printing, Variables' },
        { name: 'Data Structures', desc: 'Lists, Tuples, Dictionaries' },
        { name: 'Control Flow', desc: 'If/Else, Loops, Functions' }
      ]
    },
    javascript: {
      title: 'JavaScript Essentials',
      icon: 'ph-lightning',
      modules: [
        { name: 'ES6 Syntax', desc: 'Let, Const, Arrow Functions' },
        { name: 'DOM Manipulation', desc: 'Selecting elements, Events' },
        { name: 'Async JS', desc: 'Promises, Async/Await, Fetch' }
      ]
    },
    html: {
      title: 'HTML/CSS Basics',
      icon: 'ph-file-html',
      modules: [
        { name: 'Tags & Elements', desc: 'Headers, Divs, Spans' },
        { name: 'CSS Flexbox', desc: 'Layouts, Alignment, Spacing' },
        { name: 'CSS Grid', desc: 'Rows, Columns, Areas' }
      ]
    },
    java: {
      title: 'Java Core',
      icon: 'ph-coffee',
      modules: [
        { name: 'OOP Fundamentals', desc: 'Classes, Objects, Inheritance' },
        { name: 'Types & Variables', desc: 'Primitives, Strings, Arrays' },
        { name: 'Exception Handling', desc: 'Try, Catch, Finally' }
      ]
    },
    cpp: {
      title: 'C++ Memory Management',
      icon: 'ph-gear',
      modules: [
        { name: 'Pointers', desc: 'Memory Addresses, Dereferencing' },
        { name: 'Memory Allocation', desc: 'New, Delete, Malloc' },
        { name: 'STL', desc: 'Vectors, Maps, Iterators' }
      ]
    }
  };

  const data = contentMap[lang];
  if (!data) return;

  const titleEl = document.getElementById('lesson-title');
  const descEl  = document.getElementById('lesson-desc');
  const notesEl = document.getElementById('lesson-notes');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl)  descEl.textContent  = `Master the core concepts of ${data.title}.`;

  if (notesEl) {
    let htmlStr = `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
    data.modules.forEach(mod => {
      htmlStr += `
        <div class="glass-panel hover-lift ripple" style="padding: 1rem; cursor: pointer; border-left: 3px solid var(--neon-pink);">
          <h3 style="margin: 0; display:flex; justify-content:space-between; font-size:0.9rem;">${mod.name} <i class="ph-bold ph-caret-right" style="color:var(--neon-pink)"></i></h3>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: rgba(255,255,255,0.5);">${mod.desc}</p>
        </div>
      `;
    });
    htmlStr += `</div>`;
    notesEl.innerHTML = htmlStr;
  }
}

// ============================================================
//  DIGITAL NOTEBOOK LOGIC
// ============================================================
function runNotebook() {
  const code = document.getElementById('notebook-editor').value;
  const outputEl = document.getElementById('notebook-output');
  if (!outputEl) return;
  
  outputEl.innerHTML = ''; // Clear previous output
  
  const addLine = (text, type = '') => {
    const div = document.createElement('div');
    div.className = `console-line ${type}`;
    div.textContent = text;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  };

  // Capture console.log
  const originalLog = console.log;
  let logs = [];
  console.log = (...args) => {
    logs.push(args.join(' '));
    originalLog(...args);
  };

  try {
    const fn = new Function(`"use strict";\n${code}`);
    fn();
    
    if (logs.length > 0) {
      logs.forEach(msg => addLine('> ' + msg));
    } else {
      addLine('// Code executed successfully. No output.', 'success');
    }
  } catch (err) {
    addLine('> ERROR: ' + err.message, 'error');
  } finally {
    console.log = originalLog;
  }
}

function saveNotebook() {
  const code = document.getElementById('notebook-editor').value;
  let filename = document.getElementById('notebook-filename').value;
  if (!filename) filename = "SkillQuest_snippet.js";

  const blob = new Blob([code], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showGuideMessage(`File ${filename} saved securely to your local device.`);
}

// ============================================================
//  MISSION HUB LOGIC
// ============================================================
function completeTask(type, progressAmt = 1) {
  const q = STATE.quests[type];
  if (!q || q.claimed) return;

  q.progress = Math.min(q.target, q.progress + progressAmt);
  
  updateMissionUI(type);
  
  if (q.progress >= q.target) {
    console.log(`Quest ${type} completed!`);
    
    // UI Update
    const startBtn = document.getElementById(`btn-start-${type}`);
    const claimBtn = document.getElementById(`btn-claim-${type}`);
    
    if (startBtn) startBtn.classList.add('hidden');
    if (claimBtn) {
      claimBtn.classList.remove('hidden');
      gsap.from(claimBtn, { scale: 0.5, opacity: 0, duration: 0.5, ease: "back.out" });
    }
  }
}

function updateMissionUI(type) {
  const q = STATE.quests[type];
  const bar = document.getElementById(`prog-bar-${type}`);
  const pctEl = document.getElementById(`prog-pct-${type}`);
  if (!bar || !pctEl) return;

  const pct = Math.round((q.progress / q.target) * 100);
  
  // Update linear bar with GSAP for smoothness
  gsap.to(bar, { width: `${pct}%`, duration: 0.8, ease: "power2.out" });
  pctEl.textContent = `${pct}%`;

  // Update button visibility based on completion
  const startBtn = document.getElementById(`btn-start-${type}`);
  const claimBtn = document.getElementById(`btn-claim-${type}`);
  const check = document.querySelector(`#mission-${type} .mission-complete-check`);
  
  if (q.progress >= q.target) {
    if (startBtn) startBtn.classList.add('hidden');
    
    if (q.claimed) {
      if (claimBtn) claimBtn.classList.add('hidden');
      if (check) check.classList.remove('hidden');
    } else {
      if (claimBtn) claimBtn.classList.remove('hidden');
      if (check) check.classList.add('hidden');
    }
  }
}

function claimQuestReward(type, xp, event) {
  if (event) event.stopPropagation(); // Don't trigger card click
  
  const q = STATE.quests[type];
  if (!q || q.claimed || q.progress < q.target) return;

  q.claimed = true;
  gainXP(xp);
  
  // Premium Feedback 1: Floating XP Text
  const btn = document.getElementById(`btn-claim-${type}`);
  if (btn) {
    triggerXPFloating(xp, btn);
  }

  // Premium Feedback 2: Mission Complete Popup
  showCompletionPopup(type, xp);
  
  // UI Update
  const claimBtn = document.getElementById(`btn-claim-${type}`);
  if (claimBtn) {
    gsap.to(claimBtn, { scale: 0, opacity: 0, duration: 0.3, onComplete: () => claimBtn.classList.add('hidden') });
  }
  
  const card = document.getElementById(`mission-${type}`);
  const check = card ? card.querySelector('.mission-complete-check') : null;
  if (check) {
    check.classList.remove('hidden');
    gsap.from(check, { scale: 0.5, opacity: 0, duration: 0.5, ease: "back.out" });
  }

  // Guide Comment
  const guide = GUIDES[STATE.guide];
  if (guide) {
    const congrats = [
      `Excellent work! +${xp} XP transferred to your neural core.`,
      `Efficiency levels rising. That's a solid +${xp} XP.`,
      `Mission accomplished. Your profile has been updated.`
    ];
    speak(congrats[Math.floor(Math.random() * congrats.length)]);
  }
}

// ------------------------------------------------------------
// FEEDBACK UTILITIES
// ------------------------------------------------------------

function triggerXPFloating(amount, element = null) {
  const el = document.createElement('div');
  el.className = 'xp-numeric-float';
  el.innerHTML = `<span>+${amount}</span><small>XP</small>`;
  
  if (element) {
    const rect = element.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top}px`;
  } else {
    el.style.left = `${Math.random() * 40 + 30}%`;
    el.style.top  = `${Math.random() * 20 + 40}%`;
  }
  
  document.body.appendChild(el);
  
  gsap.fromTo(el,
    { y: 0, opacity: 0, scale: 0.5 },
    { y: -120, opacity: 1, scale: 1.2, duration: 1, ease: "power2.out", onComplete: () => {
      gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.5, onComplete: () => el.remove() });
    }}
  );
}

function showCompletionPopup(questType, xp) {
  const popup = document.createElement('div');
  popup.className = 'completion-popup glass-panel';
  popup.innerHTML = `
    <div class="popup-inner">
      <div class="confetti-cannon">🎉</div>
      <h3>MISSION COMPLETE</h3>
      <p>${questType.toUpperCase()} SUCCESSFUL</p>
      <div class="reward-tag">+${xp} XP RECEIVED</div>
      <button class="game-btn btn-blue" onclick="this.parentElement.parentElement.remove()">ACKNOWLEDGE</button>
    </div>
  `;
  document.body.appendChild(popup);

  gsap.fromTo(popup, 
    { scale: 0.5, opacity: 0, y: 50 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(2)" }
  );

  // Auto-remove after 4s if not clicked
  setTimeout(() => {
    if (popup.parentElement) {
      gsap.to(popup, { opacity: 0, scale: 0.8, duration: 0.5, onComplete: () => popup.remove() });
    }
  }, 4000);
}

function initMissionTimer() {
  const timerEl = document.getElementById('mission-timer');
  if (!timerEl) return;

  function update() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow - now;
    
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    timerEl.textContent = `RESETS IN: ${h}H ${m}M ${s}S`;
  }
  
  update();
  setInterval(update, 1000);
}

// ============================================================
//  SCREEN SHAKE
// ============================================================
function triggerScreenShake() {
  const app = document.getElementById('app-container');
  app.classList.add('do-shake');
  setTimeout(() => app.classList.remove('do-shake'), 500);
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Particle system
  const canvas = document.getElementById('particle-canvas');
  if (canvas) new ParticleSystem(canvas);

  // Parallax
  initParallax();

  initDesignChallenge();

  // Initialize Mission Timer
  initMissionTimer();

  // Initial navigation
  setBackground('screen-selection');
  navigateTo('screen-selection');

  // Welcome - no guide yet, show title glow
  console.log('%cSkillQuest Initialized', 'color:#00f0ff; font-size:1.2rem; font-weight:bold;');
});

/* ============================================================
   DESIGN WORLD ENGINE
   ============================================================ */

// Extended state for Design World
const DW_STATE = {
  currentWorld: 'coding',
  currentZone:  'Pixel Village',
  dwHp: 100,
  dwBossHp: 100,
  dwBossTimeLeft: 60,
  dwBossInterval: null,
  dwBossScore: 0,
  dwChallengeScores: { ui: 0, layout: 0, color: 0, typo: 0 },
  dwCanvasComponents: [],
  dwBossComponents: []
};

// Additional backgrounds for Design World
Object.assign(BACKGROUNDS, {
  'beginner':            'assets/coding-world/beginner.jpg',
  'forest':              'assets/coding-world/forest.jpg',
  'city':                'assets/coding-world/city.jpg',
  'tech':                'assets/coding-world/city.jpg',
  'arena':               'assets/coding-world/arena.jpg',
  'pixel':               'assets/design-world/pixel.jpg',
  'labyrinth':           'assets/design-world/labyrinth.jpg',
  'research':            'assets/design-world/research.jpg',
  'Interaction City':    'assets/design-world/labyrinth.jpg',
  'Design Arena':        'assets/design-world/arena.jpg',
  'screen-map':          'assets/coding-world/beginner.jpg',
  'screen-dw-entry':     'assets/design-world/pixel.jpg',
  'screen-dw-training':  'assets/design-world/labyrinth.jpg',
  'screen-dw-quiz':      'assets/design-world/research.jpg',
  'screen-dw-challenge': 'assets/design-world/labyrinth.jpg',
  'screen-dw-boss':      'assets/design-world/arena.jpg'
});



// Zone configuration
const DW_ZONE_DATA = {
  'Logo Design & Branding': {
    mentor: 'Elena',
    mentorHint: 'Branding is more than a logo. It is a feeling.',
    mentorTraining: 'Logo & Identity Protocols',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  },
  'Wireframing & User Flows': {
    mentor: 'Elena',
    mentorHint: 'Think about the path, not just the pixels.',
    mentorTraining: 'UX Structural Mechanics',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  },
  'UI/UX Principles': {
    mentor: 'Elena',
    mentorHint: 'White space is your most powerful design element.',
    mentorTraining: 'Visual Hierarchy is your most powerful fundamental skill.',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  },
  'User Research & Personas': {
    mentor: 'Elena',
    mentorHint: 'The user is the heart of every design.',
    mentorTraining: 'Empathy Protocols',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  },
  'Web & App Design': {
    mentor: 'Elena',
    mentorHint: 'Responsive design is not optional.',
    mentorTraining: 'Layout Logic',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  },
  'Prototyping & Posters': {
    mentor: 'Elena',
    mentorHint: 'Make it alive. Make it move.',
    mentorTraining: 'Interactive Final Protocol',
    video: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1'
  }
};

// Extend main guides with Design World lines
function extendGuideDesignLines() {
  GUIDES.nova.lines.dwEntry   = ["Interesting - visual logic is still logic.", "Composition follows mathematical principles. Let's analyze.", "Structure first, aesthetics second. Grid is everything."];
  GUIDES.nova.lines.dwMap     = ["Design World unlocked. 5 zones of visual mastery.", "Approach each design zone with systematic precision."];
  GUIDES.juhi.lines.dwEntry   = ["YES! Welcome to my world! This is where the magic happens!", "Design is where emotion meets function. Let's create!", "Every great product begins with a great design. Let's go!"];
  GUIDES.juhi.lines.dwMap     = ["Design World! My absolute favorite place", "The Design Arena at the end is legendary!"];
}

/**
 * WORLD TOGGLE: Switch between Coding and Design worlds on the map screen
 */
function switchWorld(world) {
  if (world === 'design' && STATE.subscription !== 'pro') {
    showProModal('Design World is a Premium zone. Upgrade to Pro to unlock visual logic training and advanced UI mastery!');
    return;
  }
  const mapScreen = document.getElementById('screen-map');
  const codingNodes = document.getElementById('coding-world-nodes');
  const designNodes = document.getElementById('design-world-nodes');
  const mapTitle = document.getElementById('map-title');
  const logoText = document.querySelector('.map-logo-icon + .map-zone-info h2');

  DW_STATE.currentWorld = world;

  if (world === 'design') {
    if (mapScreen) mapScreen.classList.add('design-world');
    codingNodes?.classList.add('hidden');
    designNodes?.classList.remove('hidden');
    if (mapTitle) mapTitle.classList.add('hidden');
    
    document.getElementById('tab-design-map')?.classList.add('active');
    document.getElementById('tab-coding-map')?.classList.remove('active');

    ['path-coding-1','path-coding-2','path-coding-3','path-coding-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden-path');
    });
    document.querySelectorAll('.journey-line-glow.coding-path').forEach(el => el.classList.add('hidden-path'));

    ['path-design-1','path-design-2','path-design-3', 'path-design-4', 'path-design-5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden-path');
    });
    document.querySelectorAll('.journey-line-glow.design-path').forEach(el => el.classList.remove('hidden-path'));

    const designSeq = WORLD_SEQUENCES.design;
    let activeNode  = designSeq[0];
    for (let nodeId of designSeq) {
      if (DW_MAP_STATE[nodeId] === 'unlocked') activeNode = nodeId;
    }
    
    if (logoText) {
      let label = document.getElementById('node-' + (activeNode === 'pixel' ? 'pixel' : activeNode === 'dw-tech' ? 'dw-tech' : activeNode === 'dw-arena' ? 'dw-arena' : activeNode))?.querySelector('.node-card-title')?.textContent || 'Design Zone';
      // Wait, the id for design nodes:
      // node-pixel, node-labyrinth, node-peaks, node-research, node-dw-tech, node-dw-arena.
      // So 'node-' + activeNode should work except for some? Let's check: pixel, labyrinth, peaks, research, tech, arena.
      // In switchWorld, activeNode comes from WORLD_SEQUENCES.design: ['pixel', 'labyrinth', 'peaks', 'research', 'tech', 'arena']
      // The IDs in HTML are node-pixel, node-labyrinth, node-peaks, node-research, node-dw-tech, node-dw-arena.
      let nodeIdHtml = activeNode;
      if (activeNode === 'tech') nodeIdHtml = 'dw-tech';
      if (activeNode === 'arena') nodeIdHtml = 'dw-arena';
      
      let labelEl = document.getElementById('node-' + nodeIdHtml)?.querySelector('.node-card-title');
      logoText.textContent = labelEl ? labelEl.textContent : 'Design Zone';
    }

    applyMapTheme('design', activeNode);
    moveMapAvatar(activeNode, 'design');
    updateMapHUD();
  } else {
    if (mapScreen) mapScreen.classList.remove('design-world');
    designNodes?.classList.add('hidden');
    codingNodes?.classList.remove('hidden');
    if (mapTitle) {
      mapTitle.classList.remove('hidden');
      mapTitle.innerHTML = '&#9876; CODE KINGDOM &mdash; WORLD MAP';
    }

    document.getElementById('tab-coding-map')?.classList.add('active');
    document.getElementById('tab-design-map')?.classList.remove('active');

    ['path-design-1','path-design-2','path-design-3', 'path-design-4', 'path-design-5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden-path');
    });
    document.querySelectorAll('.journey-line-glow.design-path').forEach(el => el.classList.add('hidden-path'));

    ['path-coding-1','path-coding-2','path-coding-3','path-coding-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden-path');
    });
    document.querySelectorAll('.journey-line-glow.coding-path').forEach(el => el.classList.remove('hidden-path'));

    const codingSeq = WORLD_SEQUENCES.coding;
    let activeNode = codingSeq[0];
    for (let nodeId of codingSeq) {
      if (MAP_STATE[nodeId] === 'unlocked') activeNode = nodeId;
    }
    
    if (logoText) {
      const label = NODE_COORDINATES[activeNode]?.label || activeNode;
      logoText.textContent = label;
    }

    applyMapTheme('coding', activeNode);
    moveMapAvatar(activeNode, 'coding');
    updateMapHUD();
  }
}

function enterDesignLevel(zoneName) {
  DW_STATE.currentZone = zoneName;
  const data = DW_ZONE_DATA[zoneName] || DW_ZONE_DATA['Pixel Village'];
  setBackground(zoneName);

  const elems = {
    'dw-zone-badge':   data.badge,
    'dw-level-title':  zoneName,
    'dw-level-desc':   data.desc,
    'dw-mission-name': data.mission,
    'dw-video-label':  'Module: ' + data.mentorTraining
  };
  Object.entries(elems).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  dwNavigate('screen-dw-entry');
}

// -- DW NAVIGATION (Unified) ---------
function dwNavigate(screenId) {
  navigateTo(screenId);
}

// -- DW SCREEN ENTER EVENTS --------------------------------
function onDWScreenEnter(screenId) {
  const guide = GUIDES[STATE.guide];

  switch (screenId) {
    case 'screen-dw-entry': {
      const data = DW_ZONE_DATA[DW_STATE.currentZone];
      if (data) showGuideMessage(data.mentorHint);
      if (guide) showGuideMessage(guide.lines.dwEntry || guide.lines.design);
      
      // Handle Boss Node Buttons for Design World
      const isDWBoss = STATE.currentNode === 'arena';
      const dwTrainBtn = document.getElementById('btn-dw-training');
      const dwQuizBtn = document.getElementById('btn-dw-challenge');
      
      if (dwTrainBtn && dwQuizBtn) {
        if (isDWBoss) {
          dwTrainBtn.innerHTML = '🔥 DEFEAT CHAOS CANVAS';
          dwTrainBtn.onclick = () => dwNavigate('screen-dw-boss');
          dwQuizBtn.style.display = 'none';
        } else {
          dwTrainBtn.innerHTML = '🎨 Start Training';
          dwTrainBtn.onclick = () => navigateTo('screen-dw-training');
          dwQuizBtn.style.display = 'inline-flex';
        }
      }
      break;
    }
    case 'screen-dw-training':
      updateDWTrainingModule();
      break;
    case 'screen-dw-quiz':
      resetDesignQuiz();
      break;
    case 'screen-dw-challenge':
      initDWChallenge();
      break;
    case 'screen-dw-boss':
      showGuideMessage("Face the Chaos Canvas. Use your design skills to restore order!");
      startDWBoss();
      break;
  }
}

// DESIGN TRAINING
function updateDWTrainingModule() {
  const data = DW_ZONE_DATA[DW_STATE.currentZone];
  if (!data) return;
  const vlabel = document.getElementById('dw-video-label');
  if (vlabel) vlabel.textContent = 'Module: ' + data.mentorTraining;
  const iframe = document.getElementById('dw-training-iframe');
  const ph     = document.getElementById('dw-video-placeholder');
  if (iframe) { iframe.src = 'about:blank'; iframe.style.display = 'none'; }
  if (ph)     ph.style.display = 'flex';
}

function loadDesignVideo() {
  const iframe = document.getElementById('dw-training-iframe');
  const ph     = document.getElementById('dw-video-placeholder');
  const data   = DW_ZONE_DATA[DW_STATE.currentZone];
  if (iframe && data) {
    if (ph) ph.style.display = 'none';
    iframe.src = data.video;
    iframe.style.display = 'block';
  }
}

// DESIGN QUIZ
const DW_QUIZ = [
  {
    q: '"Which principle ensures users can always find their way back on a website?"',
    opts: ["A) Fitts's Law", 'B) Breadcrumb Navigation', 'C) F-Pattern', 'D) Gestalt Similarity'],
    correct: 1
  },
  {
    q: '"Visual hierarchy primarily controls what in a UI?"',
    opts: ['A) Color palettes', 'B) Animation speed', 'C) The order users notice elements', 'D) Font licensing'],
    correct: 2
  },
  {
    q: '"Which of Nielsen\'s heuristics focuses on preventing errors BEFORE they happen?"',
    opts: ['A) Flexibility', 'B) Error Prevention', 'C) Aesthetic Design', 'D) Match Real World'],
    correct: 1
  },
  {
    q: '"White space in design primarily improves what?"',
    opts: ['A) Download speed', 'B) Color accuracy', 'C) Readability and focus', 'D) Animation smoothness'],
    correct: 2
  }
];

let dwCurrentQ = 0;
let dwCurrentHp = 100;

function resetDesignQuiz() {
  dwCurrentQ  = 0;
  dwCurrentHp = 100;
  loadDWQuestion(0);
  const bar = document.getElementById('dw-player-hp-bar');
  if (bar) bar.style.width = '100%';
  const btn = document.getElementById('btn-dw-next-quiz');
  if (btn) btn.style.display = 'none';
}

function loadDWQuestion(idx) {
  const q    = DW_QUIZ[idx % DW_QUIZ.length];
  const qEl  = document.getElementById('dw-quiz-question');
  const opts = document.querySelectorAll('.dw-quiz-btn');
  if (qEl) qEl.textContent = q.q;

  opts.forEach((btn, i) => {
    btn.textContent = q.opts[i];
    btn.className   = 'game-btn btn-hollow quiz-btn dw-quiz-btn';
    btn.disabled    = false;
    btn.onclick     = () => answerDWQuiz(btn, i === q.correct, idx);
  });

  const next = document.getElementById('btn-dw-next-quiz');
  if (next) next.style.display = 'none';
}

function answerDWQuiz(btn, isCorrect, qIdx) {
  const opts = document.querySelectorAll('.dw-quiz-btn');
  opts.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    gainXP(50);
    showGuideMessage('Correct! Excellent design thinking! ⚡');
  } else {
    btn.classList.add('wrong');
    dwCurrentHp = Math.max(0, dwCurrentHp - 25);
    const bar = document.getElementById('dw-player-hp-bar');
    if (bar) bar.style.width = dwCurrentHp + '%';
    triggerScreenShake();
    const q = DW_QUIZ[qIdx % DW_QUIZ.length];
    opts[q.correct].classList.add('correct');
    showGuideMessage('Not quite - study UX principles carefully!');
  }

  const next = document.getElementById('btn-dw-next-quiz');
  if (next) next.style.display = 'inline-flex';
}

function nextDesignQuestion() {
  dwCurrentQ++;
  if (dwCurrentQ >= DW_QUIZ.length) {
    showGuideMessage("Quiz complete! Now let's build something amazing!");
    completeTask('quiz', 70); // Trigger Quest 3: Win a Quiz
    setTimeout(() => navigateTo('screen-dw-challenge'), 1500);
    return;
  }
  loadDWQuestion(dwCurrentQ);
}

// �-��-� DESIGN CHALLENGE BUILDER �-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-�
const DW_FEEDBAsq_MAP = {
  card:           { type: 'positive', msg: '=� Great foundation! Card gives layout structure. +Layout', ux: 5,  layout: 20, color: 5  },
  heading:        { type: 'positive', msg: '�-� Clear hierarchy  - users know where to look. +UX',       ux: 15, layout: 10, color: 5  },
  input:          { type: 'positive', msg: '=� Input invites interaction! +UX',                         ux: 20, layout: 10, color: 3  },
  'btn-primary':  { type: 'positive', msg: '� Strong CTA! Color pops effectively. +Color',             ux: 10, layout: 5,  color: 20 },
  'btn-secondary':{ type: 'info',     msg: '� Secondary option adds choice. +UX',                       ux: 8,  layout: 5,  color: 10 },
  label:          { type: 'info',     msg: '<� Labels improve accessibility. +UX',                      ux: 10, layout: 3,  color: 3  },
  divider:        { type: 'info',     msg: '�-��-� Breathing room creates clarity. +Layout',                 ux: 5,  layout: 12, color: 2  },
  avatar:         { type: 'positive', msg: '=d Personal touch adds warmth. +Color',                     ux: 5,  layout: 3,  color: 12 },
  logo:           { type: 'positive', msg: '�-� Brand anchor placed. +Color & Layout',                   ux: 5,  layout: 10, color: 15 }
};

function initDWChallenge() {
  DW_STATE.dwChallengeScores = { ui: 0, layout: 0, color: 0, typo: 0 };
  DW_STATE.dwCanvasComponents = [];
  updateDWScores(0, 0, 0, 0);

  const canvas  = document.getElementById('dw-canvas');
  const hint    = document.getElementById('dw-canvas-hint');
  const feedLog = document.getElementById('dw-feedback-log');
  if (!canvas) return;

  Array.from(canvas.querySelectorAll('.dw-canvas-el')).forEach(el => el.remove());
  if (hint)    hint.style.display = '';
  if (feedLog) feedLog.innerHTML = '<div class="dw-fb-entry">System is watching your design...</div>';

  // Tool drag events
  document.querySelectorAll('.dw-tool').forEach(t => {
    t.ondragstart = (e) => e.dataTransfer.setData('dw-type', t.dataset.type);
  });

  canvas.ondragover  = (e) => { e.preventDefault(); canvas.classList.add('dw-drag-over'); };
  canvas.ondragleave = ()  => canvas.classList.remove('dw-drag-over');
  canvas.ondrop = (e) => {
    e.preventDefault();
    canvas.classList.remove('dw-drag-over');
    const type = e.dataTransfer.getData('dw-type');
    if (!type) return;
    const rect = canvas.getBoundingClientRect();
    const snap = 24;
    const x = Math.round((e.clientX - rect.left - 50) / snap) * snap;
    const y = Math.round((e.clientY - rect.top  - 20) / snap) * snap;
    spawnDWElement(type, Math.max(0, x), Math.max(0, y), canvas);
    if (hint) hint.style.display = 'none';
    processDWComponent(type);
  };
}

function spawnDWElement(type, x, y, canvas) {
  const templates = {
    card:           `<div style="background:rgba(10,10,30,0.85);border:1px solid rgba(255,0,127,0.35);border-radius:10px;padding:1.2rem;min-width:160px;backdrop-filter:blur(10px);font-size:0.75rem;color:rgba(255,255,255,0.8);">Glass Card<br><span style="font-size:0.6rem;color:rgba(255,255,255,0.3);">Container</span></div>`,
    heading:        `<div style="font-family:Rajdhani,sans-serif;font-size:1.3rem;font-weight:700;letter-spacing:2px;color:#fff;text-shadow:0 0 10px rgba(255,0,127,0.5);">Page Title</div>`,
    input:          `<div style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,0,127,0.4);border-radius:6px;padding:8px 14px;min-width:180px;font-size:0.75rem;color:rgba(255,255,255,0.4);">Enter your email...</div>`,
    'btn-primary':  `<div style="background:#ff007f;color:#fff;padding:10px 24px;border-radius:6px;font-size:0.75rem;font-family:Orbitron,monospace;font-weight:700;white-space:nowrap;box-shadow:0 0 15px rgba(255,0,127,0.5);">Sign In</div>`,
    'btn-secondary':`<div style="border:2px solid rgba(255,0,127,0.5);color:rgba(255,0,127,0.9);padding:8px 20px;border-radius:6px;font-size:0.75rem;white-space:nowrap;">Register</div>`,
    label:          `<div style="font-size:0.65rem;letter-spacing:1px;text-transform:uppercase;color:rgba(255,0,127,0.8);font-family:Orbitron,monospace;">Email Address</div>`,
    divider:        `<div style="width:200px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,0,127,0.5),transparent);"></div>`,
    avatar:         `<div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#ff007f,#9d00ff);border:2px solid rgba(255,0,127,0.7);display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 0 15px rgba(255,0,127,0.4);">=d</div>`,
    logo:           `<div style="font-family:Orbitron,monospace;font-size:0.9rem;font-weight:900;background:linear-gradient(135deg,#ff007f,#9d00ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:3px;">SkillQuest</div>`
  };

  const el = document.createElement('div');
  el.className = 'dw-canvas-el drop-glow';
  el.style.cssText = `left:${x}px; top:${y}px; position:absolute;`;
  el.innerHTML = templates[type] || templates['label'];
  makeDWCanvasDraggable(el, canvas);
  canvas.appendChild(el);
  setTimeout(() => el.classList.remove('drop-glow'), 600);
}

function makeDWCanvasDraggable(el, canvas) {
  el.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const origLeft = parseFloat(el.style.left) || 0;
    const origTop  = parseFloat(el.style.top)  || 0;
    el.style.zIndex = '50';
    const snap = 24;

    const onMove = (ev) => {
      el.style.left = `${Math.round((origLeft + ev.clientX - startX) / snap) * snap}px`;
      el.style.top  = `${Math.round((origTop  + ev.clientY - startY) / snap) * snap}px`;
    };
    const onUp = () => {
      el.style.zIndex = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function processDWComponent(type) {
  DW_STATE.dwCanvasComponents.push(type);
  const fb = DW_FEEDBAsq_MAP[type] || { type: 'info', msg: 'Component added!', ui: 5, layout: 5, color: 5, typo: 0 };

  DW_STATE.dwChallengeScores.ui     = Math.min(100, DW_STATE.dwChallengeScores.ui     + (fb.ui || 0));
  DW_STATE.dwChallengeScores.layout = Math.min(100, DW_STATE.dwChallengeScores.layout + (fb.layout || 0));
  DW_STATE.dwChallengeScores.color  = Math.min(100, DW_STATE.dwChallengeScores.color  + (fb.color || 0));
  DW_STATE.dwChallengeScores.typo   = Math.min(100, DW_STATE.dwChallengeScores.typo   + (fb.typo || 0));

  const { ui, layout, color, typo } = DW_STATE.dwChallengeScores;
  updateDWScores(ui, layout, color, typo);
  addDWFeedbackEntry(fb.msg, fb.type);

  showGuideMessage("Great addition! Your layout is evolving.");
  gainXP(10);
  spawnXPPopup(10);
}

function updateDWScores(ui, layout, color, typo) {
  const total = Math.round((ui + layout + color + typo) / 4);
  const updates = { 'sc-ui': ui, 'sc-layout': layout, 'sc-color': color, 'sc-typo': typo, 'sc-total': total };
  Object.entries(updates).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });

  [['dw-bar-ui', ui], ['dw-bar-layout', layout], ['dw-bar-color', color], ['dw-bar-typo', typo]].forEach(([id, val]) => {
    const bar = document.getElementById(id);
    if (bar) requestAnimationFrame(() => bar.style.width = val + '%');
  });

  [['dw-pct-ui', ui], ['dw-pct-layout', layout], ['dw-pct-color', color], ['dw-pct-typo', typo]].forEach(([id, val]) => {
    const el = document.getElementById(id); if (el) el.textContent = val + '%';
  });
}

function addDWFeedbackEntry(msg, type = 'info') {
  const log = document.getElementById('dw-feedback-log');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = `dw-fb-entry ${type}`;
  entry.textContent = msg;
  log.insertBefore(entry, log.firstChild);
  while (log.children.length > 5) log.removeChild(log.lastChild);
}

function clearDWCanvas() {
  const canvas = document.getElementById('dw-canvas');
  if (!canvas) return;
  Array.from(canvas.querySelectorAll('.dw-canvas-el')).forEach(el => el.remove());
  DW_STATE.dwCanvasComponents = [];
  DW_STATE.dwChallengeScores = { ui: 0, layout: 0, color: 0, typo: 0 };
  updateDWScores(0, 0, 0, 0);
  const hint = document.getElementById('dw-canvas-hint');
  if (hint) hint.style.display = '';
  addDWFeedbackEntry('Canvas cleared. Start fresh!', 'info');
  showGuideMessage('Fresh canvas! Begin with a card container for structure.');
}

function submitDWChallenge() {
  if (DW_STATE.dwCanvasComponents.length < 3) {
    showGuideMessage('Place at least 3 components before submitting!');
    addDWFeedbackEntry('� Need at least 3 components!', 'warning');
    return;
  }
  const { ui, layout, color, typo } = DW_STATE.dwChallengeScores;
  const total = Math.round((ui + layout + color + typo) / 4);
  const xpGain = total * 3;
  gainXP(xpGain);
  showGuideMessage('Outstanding design! Score: ' + total + '/100. +' + xpGain + ' XP!');
  addDWFeedbackEntry(' Submitted! Score: ' + total + '/100', 'positive');
  
  // Return to map instead of skipping to boss
  setTimeout(() => {
    completeLevel(STATE.currentWorld || 'design', STATE.currentNode || 'pixel');
    navigateTo('screen-map');
  }, 2500);
}

// �-��-� DESIGN BOSS FIGHT �-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-�
function startDWBoss() {
  clearInterval(DW_STATE.dwBossInterval);
  DW_STATE.dwBossHp   = 100;
  DW_STATE.dwBossScore = 0;
  DW_STATE.dwBossTimeLeft = 60;
  DW_STATE.dwBossComponents = [];
  updateDWBossHpBar(100);
  updateDWBossScoreDisplay(0);
  startDWBossTimer();
  initDWBossCanvas();
}

function startDWBossTimer() {
  const timerEl = document.getElementById('dw-boss-timer');
  DW_STATE.dwBossInterval = setInterval(() => {
    DW_STATE.dwBossTimeLeft--;
    if (timerEl) {
      const m = String(Math.floor(DW_STATE.dwBossTimeLeft / 60)).padStart(2, '0');
      const s = String(DW_STATE.dwBossTimeLeft % 60).padStart(2, '0');
      timerEl.textContent = m + ':' + s;
    }
    if (DW_STATE.dwBossTimeLeft <= 0) {
      clearInterval(DW_STATE.dwBossInterval);
      submitDWBoss();
    }
  }, 1000);
}

function initDWBossCanvas() {
  const canvas = document.getElementById('dw-boss-canvas');
  const hint   = document.getElementById('dw-boss-canvas-hint');
  if (!canvas) return;
  Array.from(canvas.querySelectorAll('.dw-canvas-el')).forEach(el => el.remove());
  if (hint) hint.style.display = '';

  document.querySelectorAll('.dw-boss-tool').forEach(t => {
    t.ondragstart = (e) => {
      e.dataTransfer.setData('dw-boss-type', t.dataset.type);
      e.dataTransfer.setData('dw-boss-pts',  t.dataset.pts || '10');
    };
  });

  canvas.ondragover  = (e) => { e.preventDefault(); canvas.style.borderColor = 'rgba(255,0,127,0.6)'; };
  canvas.ondragleave = ()  => { canvas.style.borderColor = ''; };
  canvas.ondrop = (e) => {
    e.preventDefault();
    canvas.style.borderColor = '';
    const type = e.dataTransfer.getData('dw-boss-type');
    const pts  = parseInt(e.dataTransfer.getData('dw-boss-pts') || '10');
    if (!type) return;
    const rect = canvas.getBoundingClientRect();
    const snap = 24;
    const x = Math.round((e.clientX - rect.left - 30) / snap) * snap;
    const y = Math.round((e.clientY - rect.top - 15)  / snap) * snap;
    spawnDWElement(type, Math.max(0, x), Math.max(0, y), canvas);
    if (hint) hint.style.display = 'none';

    DW_STATE.dwBossScore += pts;
    DW_STATE.dwBossComponents.push(type);
    updateDWBossScoreDisplay(DW_STATE.dwBossScore);
    updateDWBossHpBar(Math.max(0, 100 - DW_STATE.dwBossScore));
    gainXP(pts);

    const fb = document.getElementById('dw-boss-feedback');
    if (fb) fb.textContent = '=� ' + type + ' placed! +' + pts + ' score';

  };
}

function updateDWBossHpBar(hp) {
  DW_STATE.dwBossHp = hp;
  const bar = document.getElementById('dw-boss-hp');
  if (bar) bar.style.width = hp + '%';
  if (hp <= 0) { clearInterval(DW_STATE.dwBossInterval); dwBossVictory(); }
}

function updateDWBossScoreDisplay(score) {
  const el = document.getElementById('dw-boss-score');
  if (el) el.textContent = score;
}

function submitDWBoss() {
  clearInterval(DW_STATE.dwBossInterval);
  if (DW_STATE.dwBossComponents.length < 3) {
    showGuideMessage('Place at least 3 components to defeat the boss!');
    return;
  }
  dwBossVictory();
}

function dwBossVictory() {
  const img = document.getElementById('dw-boss-img');
  if (img) { img.style.filter = 'grayscale(1) brightness(0.3)'; img.style.transform = 'scale(0.8)'; img.style.transition = 'all 0.8s'; }
  const xpGain = 800 + Math.min(DW_STATE.dwBossScore * 5, 500);
  gainXP(xpGain);
  showGuideMessage('CHAOS CANVAS DEFEATED! Score: ' + DW_STATE.dwBossScore + ' - Design Knight achieved! +' + xpGain + ' XP!');
  const guide = GUIDES[STATE.guide];
  if (guide) showGuideMessage('INCREDIBLE! Design Arena conquered! +' + xpGain + ' XP!');
  const fb = document.getElementById('dw-boss-feedback');
  if (fb) fb.textContent = '<� VICTORY! Final Score: ' + DW_STATE.dwBossScore;
  setTimeout(() => navigateTo('screen-leaderboard'), 3500);
}

// �-��-� INIT Design World extension �-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-��-�
(function initDesignWorldExtension() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', extendGuideDesignLines);
  } else {
    extendGuideDesignLines();
  }
})();

// ============================================================
//  WORLD MAP (REMASTERED)
// ============================================================

const MAP_THEMES = {
  coding: {
    beginner: '../codeing world/Beginner Forest level.jpeg',
    forest:   '../codeing world/Logic Desert level.jpeg',
    city:     '../codeing world/Code Dungeon level.jpeg',
    arena:    '../codeing world/Final Arena level.jpeg'
  },
  design: {
    pixel:     '../design world/Pixel Village level.jpeg',
    research:  '../design world/UX Research Bay level.jpeg',
    labyrinth: '../design world/Layout Labyrinth level.jpeg',
    arena:     '../design world/Design Arena level.jpeg'
  }
};

/**
 * Dynamically updates the world map background based on player progress
 */
function applyMapTheme(world, nodeId) {
  const el = document.getElementById('screen-map');
  const themeUrl = MAP_THEMES[world][nodeId];

  if (el && themeUrl) {
    el.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${themeUrl}')`;
    console.log(`[THEME] Applied ${nodeId} to ${world} world`);
  }
}
let mapDragInitialized = false;

function initWorldMap() {
  updateMapUI();

  if (mapDragInitialized) {
    console.log('[MAP] Drag logic already initialized.');
  } else {
    // Try GSAP Draggable first, fall back to native drag
    if (typeof Draggable !== 'undefined') {
      try {
        Draggable.create("#map-stage", {
          type: "x",
          edgeResistance: 0.65,
          bounds: "#map-viewport",
          inertia: typeof InertiaPlugin !== 'undefined',
          onDragStart: function() {
            document.getElementById('map-viewport').style.cursor = 'grabbing';
          },
          onDragEnd: function() {
            document.getElementById('map-viewport').style.cursor = 'grab';
          }
        });
        console.log('[MAP] GSAP Draggable initialized');
        mapDragInitialized = true;
      } catch(e) {
        console.warn('[MAP] GSAP Draggable failed, using native drag:', e);
        initNativeMapDrag();
        mapDragInitialized = true;
      }
    } else {
      console.warn('[MAP] GSAP Draggable not available, using native drag');
      initNativeMapDrag();
      mapDragInitialized = true;
    }
  }

  // Animate nodes on map enter (opacity removed to prevent invisible lock state)
  gsap.from(".map-node", {
    duration: 0.8,
    scale: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
    delay: 0.5
  });

  // Animate journey lines — draw-on effect per segment, staggered
  const journeyLines = document.querySelectorAll('.journey-line:not(.hidden-path)');
  journeyLines.forEach((line, i) => {
    const len = line.getTotalLength ? line.getTotalLength() : 1200;
    // Set up for draw-on
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 1.8,
      delay: 0.6 + i * 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        // After draw, let CSS take over (restore dasharray for animated dots)
        gsap.set(line, { clearProps: 'strokeDasharray,strokeDashoffset' });
      }
    });
  });

  // Fade in glow underlays
  gsap.from('.journey-line-glow:not(.hidden-path)', {
    opacity: 0,
    duration: 1.5,
    delay: 0.4,
    ease: 'power1.out'
  });

  // Initial Theme Check (Apply based on current state)
  // For simplicity, we use the last unlocked node from sequences
  const currentWorld = DW_STATE.currentWorld || 'coding';
  const currentSeq   = WORLD_SEQUENCES[currentWorld];
  const currentState = currentWorld === 'coding' ? MAP_STATE : DW_MAP_STATE;
  
  // Find highest unlocked node
  let activeNode = currentSeq[0];
  for(let nodeId of currentSeq) {
    if(currentState[nodeId] === 'unlocked') activeNode = nodeId;
  }
  
  applyMapTheme(currentWorld, activeNode);
  
  // ⚡ Update HUD Title (Top Left)
  const logoText = document.querySelector('.map-logo-icon + .map-zone-info h2');
  const mapTitle = document.getElementById('map-title');
  const mapScreen = document.getElementById('screen-map');

  if (currentWorld === 'design') {
    if (mapScreen) mapScreen.classList.add('design-world');
    if (mapTitle) mapTitle.classList.add('hidden');
    
    if (logoText) {
      let nodeIdHtml = activeNode;
      if (activeNode === 'tech') nodeIdHtml = 'dw-tech';
      if (activeNode === 'arena') nodeIdHtml = 'dw-arena';
      let labelEl = document.getElementById('node-' + nodeIdHtml)?.querySelector('.node-card-title');
      logoText.textContent = labelEl ? labelEl.textContent : 'Design Zone';
    }
  } else {
    if (mapScreen) mapScreen.classList.remove('design-world');
    if (mapTitle) {
      mapTitle.classList.remove('hidden');
      mapTitle.innerHTML = '&#9876; CODE KINGDOM &mdash; WORLD MAP';
    }
    
    if (logoText) {
      const label = NODE_COORDINATES[activeNode]?.label || activeNode;
      logoText.textContent = label;
    }
  }

  // ⚡ Center Camera on Active Node
  panCameraToNode(activeNode, currentWorld);
}

// REMOVED redundant renderMapSidebarLegend, merged into updateSidebarZoneList below.

// ============================================================
//  NATIVE MAP DRAG FALLBACK
// ============================================================
function initNativeMapDrag() {
  const viewport = document.getElementById('map-viewport');
  const stage = document.getElementById('map-stage');
  if (!viewport || !stage) return;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  function getTranslateX(el) {
    const style = window.getComputedStyle(el);
    const matrix = style.transform || style.webkitTransform || style.mozTransform;
    if (!matrix || matrix === 'none') return 0;

    const matrixValues = matrix.match(/matrix.*\((.+)\)/);
    if (matrixValues) {
      const values = matrixValues[1].split(', ');
      return parseFloat(values[4]) || 0;
    }
    return 0;
  }

  function onDown(e) {
    if (e.target.closest('.map-node, button, a, input')) return;
    
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    startX = clientX;
    scrollLeft = getTranslateX(stage);
    
    viewport.style.cursor = 'grabbing';
    // Removed e.preventDefault() to allow potential sibling interactions if needed, 
    // but kept it for touch to prevent scroll.
    if (e.type.includes('touch')) e.preventDefault();
  }

  function onMove(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startX;
    let newX = scrollLeft + dx;
    
    // Bounds clamping
    const minX = viewport.clientWidth - stage.scrollWidth;
    if (newX > 0) newX = 0;
    if (newX < minX) newX = minX;
    
    stage.style.transform = `translateX(${newX}px)`;
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = 'grab';
  }

  viewport.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  viewport.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);

  console.log('[MAP] Native robust drag initialized');
}

// ============================================================
//  PROFILE SECTION
// ============================================================
function renderProfile() {
  const profileImg = document.getElementById('profile-avatar');
  const profileNameInput = document.getElementById('profile-name-input');
  const profileLvl = document.getElementById('profile-lvl');
  const profileXp = document.getElementById('profile-xp');
  const profileStreak = document.getElementById('profile-streak');
  const guide = GUIDES[STATE.guide];

  if (profileImg && guide) profileImg.src = guide.img;
  if (profileNameInput) profileNameInput.value = STATE.projectName;
  if (profileLvl) profileLvl.textContent = STATE.level;
  if (profileXp) profileXp.textContent = STATE.xp;
  if (profileStreak) profileStreak.textContent = STATE.streak;

  // Sync Rank Name
  const ranks = ['ROOKIE DEVELOPER', 'JUNIOR CODER', 'FRONTEND APPRENTICE', 'FULL STACK KNIGHT', 'SYSTEM ARCHITECT', 'ALGORITHMIC LEGEND'];
  const rankIdx = Math.min(Math.floor(STATE.level / 5), ranks.length - 1);
  const rankEl = document.getElementById('player-rank-name');
  if(rankEl) rankEl.textContent = ranks[rankIdx];

  updateProfileBadges();
  updateProfileSkills();
  generateHeatmap();
  checkStreakRisk();
}

function updateProfileBadges() {
  const container = document.getElementById('profile-badges-container');
  if (!container) return;
  container.innerHTML = '';

  if (STATE.inventory.badges.length === 0) {
    container.innerHTML = '<span class="empty-msg">Complete missions to earn badges!</span>';
    return;
  }

  STATE.inventory.badges.forEach(badge => {
    const bEl = document.createElement('div');
    bEl.className = 'badge-item-new';
    bEl.innerHTML = `
      <div class="badge-icon-wrap">${badge.icon || '🏆'}</div>
      <div class="badge-name-mini">${badge.name}</div>
    `;
    container.appendChild(bEl);
  });
}

function updateProfileSkills() {
  const container = document.getElementById('profile-skill-meters');
  if (!container) return;
  container.innerHTML = '';

  const skillKeys = Object.keys(STATE.accuracyTracker);
  skillKeys.forEach(skill => {
    const data = STATE.accuracyTracker[skill];
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    
    const skillEl = document.createElement('div');
    skillEl.className = 'skill-item-new';
    skillEl.innerHTML = `
      <div class="skill-header-new">
        <span class="skill-name-new">${skill.charAt(0).toUpperCase() + skill.slice(1)} Mastery</span>
        <span class="skill-pct-new">${pct}%</span>
      </div>
      <div class="skill-bar-outer-new">
        <div class="skill-bar-inner-new" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(skillEl);
  });
}

function saveName() {
  const input = document.getElementById('profile-name-input');
  if (!input) return;

  const newName = input.value.trim();
  if (newName.length < 3) {
    showGuideMessage("Name must be at least 3 characters!");
    return;
  }

  STATE.projectName = newName;
  
  // Update all UI instances of player name
  const nameDisplays = [
    document.getElementById('player-name-display'),
    document.getElementById('leaderboard-playername'),
    document.getElementById('dashboard-greeting'),
    document.getElementById('dashboard-player-name')
  ];

  nameDisplays.forEach(el => {
    if (el) {
      if (el.id === 'dashboard-greeting') {
        updateDashboardGreeting();
      } else {
        el.textContent = newName;
      }
    }
  });

  showGuideMessage("Name updated! Protocol established.");
  
  // Add a small success animation to the input
  input.style.borderColor = 'var(--neon-green)';
  setTimeout(() => input.style.borderColor = '', 1500);
}

function updateAchievements() {
  const achItems = document.querySelectorAll('.ach-item');
  if (!achItems.length) return;

  // Mock logic for demonstration: 
  // Forest = Completed if level > 1? Streak if streak > 7. Slayer if level > 15.
  const achs = [
    { id: 0, unlocked: STATE.level >= 1 },
    { id: 1, unlocked: STATE.streak >= 7 },
    { id: 2, unlocked: STATE.level >= 20 },
    { id: 3, unlocked: STATE.level >= 15 && STATE.guide === 'juhi' } 
  ];

  achItems.forEach((item, index) => {
    if (achs[index] && achs[index].unlocked) {
      item.classList.remove('locked');
      item.classList.add('unlocked');
    } else {
      item.classList.add('locked');
      item.classList.remove('unlocked');
    }
  });
}



// ============================================================
//  ANALYTICS ENGINE (PHASE 7)
// ============================================================
function renderAnalytics() {
  const tracker = STATE.accuracyTracker;
  const bars = {
    syntax: document.querySelector('#mastery-chart .bar-item:nth-child(1) .bar'),
    logic: document.querySelector('#mastery-chart .bar-item:nth-child(2) .bar'),
    design: document.querySelector('#mastery-chart .bar-item:nth-child(3) .bar')
  };

  for (const [topic, barEl] of Object.entries(bars)) {
    if (barEl && tracker[topic] && tracker[topic].total > 0) {
      const pct = (tracker[topic].correct / tracker[topic].total) * 100;
      gsap.to(barEl, { height: Math.max(10, pct) + '%', duration: 1, ease: 'power2.out' });
    }
  }
}

// ============================================================
//  MEMORY MINI-GAME LOGIC (PHASE 5)
// ============================================================
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;

  const icons = ['ph-code', 'ph-cpu', 'ph-terminal', 'ph-globe', 'ph-brain', 'ph-palette', 'ph-shield', 'ph-rocket'];
  const pool = [...icons, ...icons].sort(() => Math.random() - 0.5);

  pool.forEach((icon, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.icon = icon;
    card.innerHTML = `
      <div class='card-front'><i class='ph-bold ph-question'></i></div>
      <div class='card-back'><i class='ph-bold ${icon}'></i></div>
    `;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  const match = c1.dataset.icon === c2.dataset.icon;

  if (match) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    matchedPairs++;
    gainXP(50);
    flippedCards = [];
    if (matchedPairs === 8) {
      showGuideMessage('MEMORY SYNC COMPLETE! Neural pathways stabilized. +400 XP');
      gainXP(400);
      setTimeout(() => navigateTo('screen-dashboard'), 2000);
    }
  } else {
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}


// ============================================================
//  DAILY QUESTS & PERSISTENCE (USER SPEC)
// ============================================================


// ============================================================
//  EXPANSION MODULES: LOGIC (LIBRARY, NOTEBOOK, QUIZ HUB)
// ============================================================

// ⚡ KNOWLEDGE CENTER ⚡
function openLesson(lang) {
  const data = KNOWLEDGE_BASE[lang];
  if (!data) return;

  const title  = document.getElementById('lesson-title');
  const desc   = document.getElementById('lesson-desc');
  const notes  = document.getElementById('lesson-notes');
  const overlay = document.getElementById('lesson-overlay');

  if (title) title.textContent = data.title;
  if (desc)  desc.textContent  = data.desc;
  
  if (notes) {
    notes.innerHTML = '';
    data.notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'lesson-note';
      div.innerHTML = `<i class="ph-bold ph-caret-right" style="color:var(--neon-blue); margin-right:8px;"></i> ${note}`;
      notes.appendChild(div);
    });
  }

  if (overlay) overlay.classList.remove('hidden');
}

function closeLesson() {
  document.getElementById('lesson-overlay')?.classList.add('hidden');
}

function completeLessonTask() {
  completeTask('lesson', 100);
  closeLesson();
  showGuideMessage("Knowledge protocols synchronized. Lesson complete!");
}

// ⚡ NOTEBOOK SANDBOX ⚡
function syncNotebookGutter() {
  const textarea = document.getElementById('notebook-editor');
  const gutter   = document.getElementById('notebook-gutter');
  const counter  = document.getElementById('notebook-count');
  if (!textarea || !gutter) return;

  const lines = textarea.value.split('\n').length;
  gutter.innerHTML = Array.from({length: Math.max(5, lines)}, (_, i) => i + 1).join('<br>');
  
  if (counter) counter.textContent = lines;
}

function saveNotebook() {
  const textarea = document.getElementById('notebook-editor');
  if (!textarea) return;

  const lines = textarea.value.split('\n').filter(l => l.trim().length > 0).length;
  
  if (lines >= 20) {
    completeTask('write', 150);
    showGuideMessage("Entry archived! 20+ lines of research logged.");
  } else {
    showGuideMessage(`Entry partial. ${lines}/20 lines logged. Keep writing, Knight!`);
  }
}

// ⚡ UNIVERSAL QUIZ HUB ⚡
let CURRENT_QUIZ_SET = [];

function startCategoryQuiz(cat) {
  CURRENT_QUIZ_SET = QUIZZES[cat] || QUIZZES.logic;
  currentQuestion = 0; // Reset existing quiz global
  
  // Update the global QUIZ_QUESTIONS reference if app.js uses it
  // (Assuming and injecting support for categorized sets)
  window.QUIZ_QUESTIONS = CURRENT_QUIZ_SET; 

  showGuideMessage(`Loading ${cat.toUpperCase()} Logic Protocols...`);
  setTimeout(() => navigateTo('screen-quiz'), 800);
}

// ============================================================
//  GAMIFIED WORLD MAP LOGIC
// ============================================================

let MAP_STATE = {
  beginner: 'unlocked',
  forest: 'locked',
  city: 'locked',
  tech: 'locked',
  arena: 'locked'
};

let DW_MAP_STATE = {
  pixel: 'unlocked',
  labyrinth: 'locked',
  peaks: 'locked',
  research: 'locked',
  tech: 'locked',
  arena: 'locked'
};

const WORLD_SEQUENCES = {
  coding: ['beginner', 'forest', 'city', 'tech', 'arena'],
  design: ['pixel', 'labyrinth', 'peaks', 'research', 'tech', 'arena']
};

/**
 * Handles completing a level, unlocking the next node, and returning to map
 */
/**
 * Handles completing a level, INTERCEPTED by Game Gate system
 */
function completeLevel(world, nodeId) {
  // Store pending progression to be unlocked on challenge success
  STATE.pendingWorld = world;
  STATE.pendingNode  = nodeId;
  
  // Trigger the Gate Modal
  showChallengeModal(world, nodeId);
}

/**
 * The Actual Unlock Logic (called after challenge success)
 */
function finalizeLevelUnlock(world, nodeId) {
  console.log(`[SkillQuest] UNLOCK ATTEMPT: world=${world}, nodeId=${nodeId}`);
  
  const sequence = WORLD_SEQUENCES[world];
  if (!sequence) {
    console.error(`[SkillQuest] Invalid world: ${world}`);
    return;
  }

  const currentIndex = sequence.indexOf(nodeId);
  console.log(`[SkillQuest] Current Index: ${currentIndex} for node: ${nodeId}`);
  
  // 1. Mark current node as DONE in DOM immediately
  const currentEl = document.getElementById(world === 'coding' ? `node-${nodeId}` : (nodeId === 'tech' ? 'node-dw-tech' : (nodeId === 'arena' ? 'node-dw-arena' : `node-${nodeId}`)));
  if (currentEl) {
    const statusEl = currentEl.querySelector('.node-card-status');
    if (statusEl) {
      statusEl.innerHTML = '<i class="ph-fill ph-seal-check"></i> 100% DONE';
      statusEl.className = 'node-card-status status-done';
    }
  }

  // 2. Find and Unlock Next Node
  if (currentIndex !== -1 && currentIndex < sequence.length - 1) {
    const nextNodeId = sequence[currentIndex + 1];
    console.log(`[SkillQuest] Unlocking next node: ${nextNodeId}`);
    
    // Character guide feedback
    showGuideMessage("Impressive! Path unlocked 🔥");
    
    // Explicitly update global state
    if (world === 'coding') {
      MAP_STATE[nodeId] = 'done';
      MAP_STATE[nextNodeId] = 'unlocked';
      console.log(`[SkillQuest] MAP_STATE updated: ${nodeId}=done, ${nextNodeId}=unlocked`);
    } else {
      DW_MAP_STATE[nodeId] = 'done';
      DW_MAP_STATE[nextNodeId] = 'unlocked';
    }
    
    // Persist to local storage
    saveGameState();
    
    // Force a full UI sync
    updateMapUI();
    
    // Refresh mission panel for newly unlocked node
    if (typeof updateMapMissionCard === 'function') {
      updateMapMissionCard();
    }

    // Dynamically update world background theme
    applyMapTheme(world, nextNodeId);

    // Final check in DOM
    setTimeout(() => {
      const nextEl = document.getElementById(`node-${nextNodeId}`);
      if (nextEl) {
        console.log(`[SkillQuest] Next node DOM state: ${nextEl.className}`);
        if (nextEl.classList.contains('locked')) {
          console.warn(`[SkillQuest] Node ${nextNodeId} still has 'locked' class! Forcing unlock...`);
          nextEl.classList.remove('locked');
          nextEl.classList.add('unlocked');
          
          // Force update the internal status badge too
          const statusEl = nextEl.querySelector('.node-card-status');
          if (statusEl) {
            statusEl.innerHTML = '<i class="ph-fill ph-play-circle"></i> AVAILABLE';
            statusEl.className = 'node-card-status status-available';
          }
        }
      }
    }, 150);
  } else {
    console.log(`[SkillQuest] No more nodes to unlock or node not found in sequence.`);
    updateMapUI(); // Still refresh UI
  }
  
  // ⚡ SUPER SYNC ⚡
  // Save again to be absolutely sure
  saveGameState();
}

// ============================================================
//  CHALLENGE GATE MODAL LOGIC (MINI-GAMES)
// ============================================================

function showChallengeModal(world, nodeId) {
  const modal = document.getElementById('challenge-modal');
  const title = document.getElementById('ch-title');
  const desc  = document.getElementById('ch-desc');
  const viewport = document.getElementById('ch-game-viewport');
  const resOverlay = document.getElementById('ch-result-overlay');
  
  if (!modal) return;

  // Reset UI
  resOverlay.classList.remove('active');
  viewport.innerHTML = `
    <div class="ch-game-placeholder">
      <div class="neural-nodes"></div>
      <span>Initializing Protocol Challenge...</span>
    </div>
  `;

  // Set World-Specific Context
  if (world === 'coding') {
    title.textContent = "Logic Gate Detected";
    desc.textContent = "Prove your skills to advance. Fix the neural bug in the code below.";
  } else {
    title.textContent = "Visual Synchronization";
    desc.textContent = "Design integrity compromised. Identify the visual anomaly to proceed.";
  }

  modal.classList.add('active');
  showGuideMessage("Prove your skills to advance �");
}

function startMiniGame() {
  const world = STATE.pendingWorld;
  const viewport = document.getElementById('ch-game-viewport');
  const footer = document.getElementById('ch-footer');
  
  if (footer) footer.style.display = 'none';
  viewport.innerHTML = ""; // Clear placeholder

  if (world === 'coding') {
    loadCodingChallenge(viewport);
  } else {
    loadDesignChallenge(viewport);
  }
}

function loadCodingChallenge(container) {
  const challenges = [
    { code: "function init() {\n  let x = 10\n  x.protoype.val = 5 // BUG HERE\n  return x\n}", bugIndex: 2 },
    { code: "const data = { id: 1 };\nif (data = null) { // BUG HERE\n  console.log('empty')\n}", bugIndex: 1 },
    { code: "for (let i=0; i<10 i++) { // BUG HERE\n  process(i)\n}", bugIndex: 0 }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  const lines = challenge.code.split('\n');
  
  const gameWrap = document.createElement('div');
  gameWrap.className = 'bug-game-container';
  
  const snippet = document.createElement('div');
  snippet.className = 'code-snippet';
  
  lines.forEach((line, idx) => {
    const lineSpan = document.createElement('span');
    lineSpan.className = 'code-line';
    lineSpan.textContent = line;
    if (idx === challenge.bugIndex) lineSpan.classList.add('error-target');
    
    lineSpan.onclick = () => {
      if (idx === challenge.bugIndex) onChallengeSuccess();
      else onChallengeFail();
    };
    snippet.appendChild(lineSpan);
  });

  gameWrap.appendChild(snippet);
  container.appendChild(gameWrap);
}

function loadDesignChallenge(container) {
  const colors = ['#00f0ff', '#bc13fe', '#ff0044', '#00ff88', '#ff8800'];
  const baseColor = colors[Math.floor(Math.random() * colors.length)];
  const oddColor = adjustColor(baseColor, -30); // Slightly darker/different

  const gameWrap = document.createElement('div');
  gameWrap.className = 'color-game-container';

  const swatches = [baseColor, baseColor, baseColor, oddColor];
  // Shuffle
  swatches.sort(() => Math.random() - 0.5);

  swatches.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.onclick = () => {
      if (color === oddColor) onChallengeSuccess();
      else onChallengeFail();
    };
    gameWrap.appendChild(swatch);
  });

  container.appendChild(gameWrap);
}

function onChallengeSuccess() {
  const overlay = document.getElementById('ch-result-overlay');
  const title   = document.getElementById('res-title');
  const msg     = document.getElementById('res-msg');
  const action  = document.getElementById('btn-res-action');

  overlay.classList.add('active');
  title.textContent = "CHALLENGE COMPLETE";
  title.style.color = "var(--neon-green)";
  msg.textContent = "Path to next zone established. Neural link stabilized.";
  
  action.onclick = () => {
    document.getElementById('challenge-modal').classList.remove('active');
    document.getElementById('ch-footer').style.display = 'block';
    finalizeLevelUnlock(STATE.pendingWorld, STATE.pendingNode);
  };
}

function onChallengeFail() {
  showGuideMessage("Try again, warrior!");
  const overlay = document.getElementById('ch-result-overlay');
  const title   = document.getElementById('res-title');
  const msg     = document.getElementById('res-msg');
  const action  = document.getElementById('btn-res-action');

  overlay.classList.add('active');
  title.textContent = "CHALLENGE FAILED";
  title.style.color = "var(--neon-pink)";
  msg.textContent = "Neural sync failed. Rebooting challenge sequence...";
  
  action.textContent = "RETRY";
  action.onclick = () => {
    overlay.classList.remove('active');
    startMiniGame();
  };
}

// Helper: Adjust color brightness
function adjustColor(col, amt) {
  let usePound = false;
  if (col[0] == "#") { col = col.slice(1); usePound = true; }
  let num = parseInt(col,16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255; else if  (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255; else if  (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function updateMapUI() {
  console.log("[SkillQuest] Syncing Map UI with current state...");
  
  // Update Coding Nodes
  Object.entries(MAP_STATE).forEach(([id, status]) => {
    const el = document.getElementById(`node-${id}`);
    if (el) {
      console.log(`[SkillQuest] Syncing node-${id}: ${status}`);
      if (status === 'unlocked' || status === 'done') {
        el.classList.remove('locked');
        el.classList.add('unlocked');
        const statusEl = el.querySelector('.node-card-status');
        if (statusEl && !statusEl.classList.contains('status-done')) {
          statusEl.innerHTML = '<i class="ph-fill ph-play-circle"></i> AVAILABLE';
          statusEl.className = 'node-card-status status-available';
        }
      } else {
        el.classList.add('locked');
        el.classList.remove('unlocked');
        const statusEl = el.querySelector('.node-card-status');
        if (statusEl) {
          statusEl.innerHTML = '<i class="ph-fill ph-lock-simple"></i> LOCKED';
          statusEl.className = 'node-card-status status-locked';
        }
      }
    } else {
      console.warn(`[SkillQuest] Node element not found: node-${id}`);
    }
  });

  // Update Design Nodes
  Object.entries(DW_MAP_STATE).forEach(([id, status]) => {
    const nodeIds = {
      pixel:     'node-pixel',
      labyrinth: 'node-labyrinth',
      peaks:     'node-peaks',
      research:  'node-research',
      tech:      'node-dw-tech',
      arena:     'node-dw-arena'
    };
    const el = document.getElementById(nodeIds[id]);
    if (el) {
      if (status === 'unlocked' || status === 'done') {
        el.classList.remove('locked');
        el.classList.add('unlocked');
        const statusEl = el.querySelector('.node-card-status');
        if (statusEl && !statusEl.innerText.includes('COMPLETE')) {
          statusEl.innerHTML = '<i class="ph-fill ph-play-circle"></i> AVAILABLE';
          statusEl.className = 'node-card-status status-available';
        }
      } else {
        el.classList.add('locked');
        el.classList.remove('unlocked');
        const statusEl = el.querySelector('.node-card-status');
        if (statusEl) {
          statusEl.innerHTML = '<i class="ph-fill ph-lock-simple"></i> LOCKED';
          statusEl.className = 'node-card-status status-locked';
        }
      }
    }
  });

  // ⚡ Update Journey Paths (SVG Lines)
  // path-coding-1 is always unlocked (beginner node is always available)
  document.getElementById('path-coding-1')?.classList.add('unlocked');

  // Coding World — subsequent paths unlock with destination nodes
  if (MAP_STATE.forest  === 'unlocked') document.getElementById('path-coding-1')?.classList.add('unlocked');
  if (MAP_STATE.city    === 'unlocked') document.getElementById('path-coding-2')?.classList.add('unlocked');
  if (MAP_STATE.tech    === 'unlocked') document.getElementById('path-coding-3')?.classList.add('unlocked');
  if (MAP_STATE.arena   === 'unlocked') document.getElementById('path-coding-4')?.classList.add('unlocked');

  // Coding glow underlays always visible (they are the "road" the player can see)
  // They are shown/hidden by switchWorld, not lock state.

  // Design World paths
  if (DW_MAP_STATE.labyrinth === 'unlocked') document.getElementById('path-design-1')?.classList.add('unlocked');
  if (DW_MAP_STATE.peaks     === 'unlocked') document.getElementById('path-design-2')?.classList.add('unlocked');
  if (DW_MAP_STATE.research  === 'unlocked') document.getElementById('path-design-3')?.classList.add('unlocked');
  if (DW_MAP_STATE.tech      === 'unlocked') document.getElementById('path-design-4')?.classList.add('unlocked');
  if (DW_MAP_STATE.arena     === 'unlocked') document.getElementById('path-design-5')?.classList.add('unlocked');

  updateMapHUD();
  syncProStatus();
}

function updateMapHUD() {
  const streakEl = document.getElementById('map-hud-streak');
  const xpEl = document.getElementById('map-hud-xp');
  const levelHUD = document.getElementById('map-hud-level');
  
  const nameSidebar = document.getElementById('map-sidebar-name');
  const rankSidebar = document.getElementById('map-sidebar-rank-title');
  const xpSidebar = document.getElementById('map-sidebar-xp');
  const progressCircle = document.getElementById('map-progress-circle');
  const progressText = document.getElementById('map-progress-text');
  const streakBanner = document.getElementById('map-streak-banner');

  if (streakEl) streakEl.textContent = STATE.streak;
  if (xpEl) xpEl.textContent = `${STATE.xp.toLocaleString()} / ${STATE.xpMax.toLocaleString()}`;
  if (levelHUD) levelHUD.textContent = STATE.level;

  if (nameSidebar) nameSidebar.textContent = (STATE.guide ? GUIDES[STATE.guide].name.toUpperCase() : 'NEURALKNIGHT');
  if (rankSidebar) {
    if (STATE.level < 5) rankSidebar.textContent = 'Rookie Developer';
    else if (STATE.level < 15) rankSidebar.textContent = 'Frontend Apprentice';
    else rankSidebar.textContent = 'Master Architect';
  }
  if (xpSidebar) xpSidebar.textContent = STATE.xp;

  // World Progress Calculation
  if (progressCircle && progressText) {
    const totalNodes = 5 + 6; // Coding + Design (Design has 6 nodes)
    let unlockedCount = 0;
    Object.values(MAP_STATE).forEach(s => { if(s === 'unlocked' || s === 'done') unlockedCount++; });
    Object.values(DW_MAP_STATE).forEach(s => { if(s === 'unlocked' || s === 'done') unlockedCount++; });
    const totalPct = Math.round((unlockedCount / totalNodes) * 100);
    progressText.textContent = `${totalPct}%`;
    progressCircle.setAttribute('stroke-dasharray', `${totalPct}, 100`);
    
    // Update sidebar list highlights
    updateSidebarZoneList();
  }

  if (streakBanner) {
    streakBanner.style.display = (STATE.streak > 5) ? 'flex' : 'none';
  }

  updateMapMissionCard();
}

/**
 * Syncs the UI based on Pro/Free subscription status
 */
function syncProStatus() {
  const designTab = document.getElementById('tab-design-map');
  if (!designTab) return;

  if (STATE.subscription === 'pro') {
    designTab.classList.remove('locked');
    const lockIcon = designTab.querySelector('i.ph-lock-simple');
    if (lockIcon) lockIcon.remove();
  } else {
    designTab.classList.add('locked');
    if (!designTab.querySelector('i.ph-lock-simple')) {
      designTab.insertAdjacentHTML('afterbegin', '<i class="ph-fill ph-lock-simple"></i> ');
    }
  }
}

/**
 * Shows a premium upgrade modal
 */
function showProModal(message = "This feature requires a Pro subscription.") {
  const modal = document.createElement('div');
  modal.className = 'pro-lock-modal';
  modal.id = 'pro-lock-modal';
  modal.innerHTML = `
    <div class="pro-modal-content">
      <div class="pro-modal-header">
        <i class="ph-fill ph-crown pro-crown-icon"></i>
        <h2>UPGRADE TO PRO</h2>
        <button class="pro-modal-close" onclick="closeProModal()">&times;</button>
      </div>
      <div class="pro-modal-body">
        <p>${message}</p>
        <div class="pro-features-list">
          <div class="pro-feature"><i class="ph-bold ph-check"></i> Unlock Design World & All Levels</div>
          <div class="pro-feature"><i class="ph-bold ph-check"></i> Advanced AI Guide Insights</div>
          <div class="pro-feature"><i class="ph-bold ph-check"></i> Exclusive Profile Themes</div>
        </div>
        <button class="pro-upgrade-btn" onclick="upgradeToPro()">ACTIVATE PRO PROTOCOL &mdash; $9.99/mo</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Animation
  gsap.from(".pro-modal-content", {
    duration: 0.5,
    scale: 0.8,
    opacity: 0,
    ease: "back.out(1.7)"
  });
}

function closeProModal() {
  const modal = document.getElementById('pro-lock-modal');
  if (modal) {
    gsap.to(modal, {
      duration: 0.3,
      opacity: 0,
      onComplete: () => modal.remove()
    });
  }
}

function upgradeToPro() {
  // Mock upgrade process
  const btn = document.querySelector('.pro-upgrade-btn');
  if (btn) {
    btn.innerHTML = '<i class="ph-bold ph-spinner-gap spin"></i> PROCESSING NEURAL PAYMENT...';
    btn.disabled = true;
  }
  
  setTimeout(() => {
    STATE.subscription = 'pro';
    saveGameState();
    syncProStatus();
    closeProModal();
    showGuideMessage("Pro Protocol activated! Welcome to the elite tier, Knight.");
    
    // Auto-switch to design world if they were trying to access it
    switchWorld('design');
  }, 2000);
}

function updateSidebarZoneList() {
  const zoneList = document.getElementById('sidebar-zone-list');
  if (!zoneList) return;
  
  const currentWorld = DW_STATE.currentWorld || 'coding';
  const sequence = WORLD_SEQUENCES[currentWorld];
  const stateObj = currentWorld === 'coding' ? MAP_STATE : DW_MAP_STATE;
  const coords = currentWorld === 'coding' ? NODE_COORDINATES : DW_NODE_COORDINATES;

  let html = '';
  sequence.forEach(id => {
    const status = stateObj[id];
    const node = coords[id];
    
    let dotClass = 'locked';
    let pctClass = '';
    let pct = '0%';
    
    if (status === 'done') {
      dotClass = 'done';
      pctClass = 'done';
      pct = '100%';
    } else if (status === 'unlocked') {
      dotClass = 'active';
      pctClass = 'active';
      pct = 'Active';
    }
    
    html += `<div class="zone-row">
      <span class="zone-dot ${dotClass}"></span>
      <span class="zone-name">${node?.label || id}</span>
      <span class="zone-pct ${pctClass}">${pct}</span>
    </div>`;
  });
  
  zoneList.innerHTML = html;
}

function findCurrentTargetNode(sequence, stateObj) {
  for (let id of sequence) {
    if (stateObj[id] === 'locked') return id;
  }
  return sequence[sequence.length - 1];
}

function updateMapMissionCard() {
  const title = document.getElementById('map-mission-title');
  const desc = document.getElementById('map-mission-desc');
  
  // Find first non-done node in current world
  const currentWorld = DW_STATE.currentWorld || 'coding';
  const sequence = WORLD_SEQUENCES[currentWorld];
  const stateObj = currentWorld === 'coding' ? MAP_STATE : DW_MAP_STATE;
  
  let nextNode = sequence[0];
  for (let id of sequence) {
    if (stateObj[id] !== 'done') {
      nextNode = id;
      break;
    }
  }

  // Fallback if all are done
  if (stateObj[sequence[sequence.length-1]] === 'done') {
    if (title) title.textContent = 'Quest Complete';
    if (desc) desc.textContent = 'You have conquered this world!';
    return;
  }

  const coords = currentWorld === 'coding' ? NODE_COORDINATES : DW_NODE_COORDINATES;

  if (title) title.textContent = coords[nextNode]?.label || 'Next Mission';
  if (desc) desc.textContent = coords[nextNode]?.tooltip || 'Your next challenge awaits';

  // Wire up the button
  const startBtn = document.querySelector('.mission-start-btn');
  if (startBtn) {
    startBtn.onclick = () => handleNodeClick(nextNode, coords[nextNode]?.label || nextNode, currentWorld);
  }
}

function openAIChat() {
  const guide = GUIDES[STATE.guide] || GUIDES.nova;
  speak(`Greetings, Knight. I am ${guide.name}. How can I assist your journey?`);
  // Toggle AI widget if exists
  const aiWidget = document.getElementById('ai-assistant-widget');
  if (aiWidget) aiWidget.classList.add('active');
}


const NODE_COORDINATES = {
  beginner: { left: 300,  top: 500, label: 'Variable Village', tooltip: 'The Foundation' },
  forest:   { left: 1300, top: 400, label: 'Syntax Grove',    tooltip: 'Reusable Code' },
  city:     { left: 2300, top: 350, label: 'Logic Plaza',     tooltip: 'Data Structures' },
  tech:     { left: 3300, top: 450, label: 'Tech City',       tooltip: 'Modern Storage' },
  arena:    { left: 4300, top: 400, label: 'Boss Citadel',    tooltip: 'Time & Requests' }
};

const DW_NODE_COORDINATES = {
  pixel:     { left: 400,  top: 300, label: 'Pixel Village' },
  labyrinth: { left: 1200, top: 150, label: 'Layout Labyrinth' },
  peaks:     { left: 2000, top: 200, label: 'Glassmorph Peaks' },
  research:  { left: 1000, top: 500, label: 'Research Bay' },
  tech:      { left: 2600, top: 550, label: 'Tech City' },
  arena:     { left: 4000, top: 450, label: 'Final Boss Arena' }
};

function handleNodeClick(nodeId, levelName, world = 'coding') {
  const state = world === 'coding' ? MAP_STATE[nodeId] : DW_MAP_STATE[nodeId];
  const coords = world === 'coding' ? NODE_COORDINATES : DW_NODE_COORDINATES;
  
  if (state === 'locked') {
    broadcastMapDialogue("Complete previous level first! 🔒");
    
    // Character also speaks
    const guide = GUIDES[STATE.guide];
    if (guide) {
      const lockedLines = ["That zone is heavily encrypted, Knight.", "We need more data before we can breach that.", "Finish the previous mission first."];
      speak(lockedLines[Math.floor(Math.random() * lockedLines.length)]);
    }

    const htmlId = world === 'coding' ? `node-${nodeId}` : (nodeId === 'arena' ? 'node-dw-arena' : `node-${nodeId}`);
    const el = document.getElementById(htmlId);
    if (el) {
      el.classList.add('do-shake');
      setTimeout(() => el.classList.remove('do-shake'), 500);
    }
    return;
  }
  
  // Update state to track what node we are CURRENTLY in
  STATE.currentNode = nodeId;
  STATE.currentWorld = world;

  // Node is unlocked, move avatar to it
  moveMapAvatar(nodeId, world);
  panCameraToNode(nodeId, world);
  
  broadcastMapDialogue(`Entering ${levelName}... 🔥`);
  
  // Transition to Level Entry Screen after animation
  setTimeout(() => {
    if (typeof handleNodeClickWithLessons === 'function') {
      handleNodeClickWithLessons(nodeId, world);
      return;
    }

    if (world === 'coding') {
      const titleEl = document.getElementById('level-title');
      const descEl = document.getElementById('level-desc');
      if (titleEl) titleEl.textContent = levelName;
      if (descEl) descEl.textContent = `Welcome to ${levelName}. The trials await you.`;
      navigateTo('screen-level-entry');
    } else {
      // Enter Design Level handles its own navigation to screen-dw-entry
      enterDesignLevel(levelName);
    }
  }, 1200); // Wait for avatar to arrive
}

function moveMapAvatar(nodeId, world = 'coding') {
  const avatar = document.getElementById('map-avatar');
  const coords = world === 'coding' ? NODE_COORDINATES : DW_NODE_COORDINATES;
  const nodeData = coords[nodeId];
  
  if (!avatar || !nodeData) return;
  
  avatar.style.left = nodeData.left + 'px';
  avatar.style.top = nodeData.top + 'px'; 
}

function panCameraToNode(nodeId, world = 'coding') {
  const viewport = document.getElementById('map-viewport');
  const stage = document.getElementById('map-stage');
  const coords = world === 'coding' ? NODE_COORDINATES : DW_NODE_COORDINATES;
  const nodeData = coords[nodeId];
  
  if (!viewport || !stage || !nodeData) return;
  
  const viewWidth = viewport.clientWidth || 800;
  let targetX = -(nodeData.left - (viewWidth / 2));
  
  // Bounds clamping
  const minX = viewport.clientWidth - stage.scrollWidth;
  if (targetX > 0) targetX = 0;
  if (targetX < minX) targetX = minX;
  
  // Apply transform with smooth transition
  stage.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  stage.style.transform = `translateX(${targetX}px)`;
  
  // Clear transition after animation so dragging isn't laggy
  setTimeout(() => {
    stage.style.transition = '';
  }, 850);
}

function broadcastMapDialogue(msg) {
  const dialogue = document.getElementById('map-avatar-dialogue');
  if (dialogue) {
    dialogue.textContent = msg;
    // Brief highlight animation
    dialogue.style.opacity = '1';
    dialogue.style.transform = 'scale(1.1)';
    setTimeout(() => {
      dialogue.style.transform = 'scale(1)';
    }, 200);
  }
}

// Development helper to simulate completing a level and unlocking the next
function unlockNextMapNode(currentNodeId, nextNodeId) {
  MAP_STATE[nextNodeId] = 'unlocked';
  
  const nextNodeEl = document.getElementById(`node-${nextNodeId}`);
  if (nextNodeEl) {
    nextNodeEl.classList.remove('locked');
    nextNodeEl.classList.add('unlocked');
    nextNodeEl.classList.add('do-success'); // flash burst
    setTimeout(() => nextNodeEl.classList.remove('do-success'), 600);
  }
  
  broadcastMapDialogue(`Path to ${NODE_COORDINATES[nextNodeId].label} unlocked! 🚀`);
  
  // Character reaction to completion/unlock
  const guide = GUIDES[STATE.guide];
  if (guide) {
    const victoryLines = ["Masterful execution, Knight! The path is clear.", "Data stream restored. New coordinates unlocked!", "Your performance exceeded my expectations."];
    speak(victoryLines[Math.floor(Math.random() * victoryLines.length)]);
  }

  // Gain XP automatically
  if (typeof gainXP === 'function') gainXP(50);
}

/**
 * Initialize Map Node Hover Listeners for Guide Reactions
 */
function initMapHoverGuides() {
  const nodes = document.querySelectorAll('.map-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      if (node.classList.contains('locked')) return;
      
      const nodeId = node.id.replace('node-', '');
      const data = NODE_COORDINATES[nodeId];
      if (data && STATE.guide) {
        speak(`Calculating approach for ${data.label}...`);
      }
    });
  });
}

// Attach hover listener once map screen entered
// (Usually called within navigateTo('screen-map'))


// ============================================================
//  PERSISTENCE (localStorage)
// ============================================================
function saveGameState() {
  console.log("[SkillQuest] Synchronizing progress to neural vault...");
  try {
    const data = {
      guide: STATE.guide,
      projectName: STATE.projectName,
      xp: STATE.xp,
      xpMax: STATE.xpMax,
      level: STATE.level,
      streak: STATE.streak,
      codingMap: MAP_STATE,
      designMap: DW_MAP_STATE,
      quests: STATE.quests,
      accuracy: STATE.accuracyTracker,
      currentWorld: DW_STATE.currentWorld,
      currentNode: STATE.currentNode
    };
    localStorage.setItem('SkillQuest_save', JSON.stringify(data));
  } catch(e) { console.warn('Save failed:', e); }
}

function loadGameState() {
  try {
    const raw = localStorage.getItem('SkillQuest_save');
    if (!raw) return;
    const data = JSON.parse(raw);
    
    if (data.guide) STATE.guide = data.guide;
    if (data.projectName) STATE.projectName = data.projectName;
    if (data.xp !== undefined) STATE.xp = data.xp;
    if (data.xpMax) STATE.xpMax = data.xpMax;
    if (data.level) STATE.level = data.level;
    if (data.streak) STATE.streak = data.streak;
    
    if (data.codingMap) Object.assign(MAP_STATE, data.codingMap);
    if (data.designMap) Object.assign(DW_MAP_STATE, data.designMap);
    if (data.quests) Object.assign(STATE.quests, data.quests);
    if (data.accuracy) Object.assign(STATE.accuracyTracker, data.accuracy);
    if (data.currentWorld) DW_STATE.currentWorld = data.currentWorld;
    if (data.currentNode) STATE.currentNode = data.currentNode;
    
    console.log("[SkillQuest] Neural link restored. Progression synchronized.");
    updateMapUI();
    updateMapMissionCard();
    
    // Update UI elements that depend on the guide
    if (STATE.guide) {
      const guide = GUIDES[STATE.guide];
      if (guide) {
        const avatarImg = document.getElementById('guide-avatar-img');
        if (avatarImg) {
          avatarImg.src = guide.img;
          avatarImg.style.borderColor = guide.color;
        }
        const guideEl = document.getElementById('global-guide');
        if (guideEl) guideEl.classList.remove('hidden');
        
        // Also update dashboard profile images if they exist
        const miniAvatar = document.getElementById('dashboard-avatar');
        if (miniAvatar) miniAvatar.src = guide.img;
        const phAvatar = document.getElementById('ph-avatar-img');
        if (phAvatar) phAvatar.src = guide.img;
      }
    }
  } catch(e) { console.warn('Load failed:', e); }
  
  if (STATE.guide) {
    syncGuideUI(STATE.guide);
  }
}

/**
 * Centrally syncs all guide-related UI elements
 */
function syncGuideUI(guideId) {
  const guide = GUIDES[guideId];
  if (!guide) return;

  // 1. Global Assistant
  const globalAvatar = document.getElementById('guide-avatar-img');
  if (globalAvatar) {
    globalAvatar.src = guide.img;
    globalAvatar.style.borderColor = guide.color;
  }

  // 2. Dashboard elements
  const dashAvatar = document.getElementById('dashboard-avatar');
  if (dashAvatar) dashAvatar.src = guide.img;
  
  const phAvatar = document.getElementById('ph-avatar-img');
  if (phAvatar) phAvatar.src = guide.img;

  // 3. Map elements
  const mapSideAvatar = document.getElementById('map-sidebar-avatar');
  if (mapSideAvatar) mapSideAvatar.src = guide.img;
  
  const mapAvatar = document.getElementById('map-avatar-img');
  if (mapAvatar) mapAvatar.src = guide.img;

  // 4. Any other elements with specific classes
  document.querySelectorAll('.ai-avatar-img').forEach(img => {
    img.src = guide.img;
  });

  console.log(`[UI] Synced guide visuals for: ${guideId}`);
}

function spawnXPPopup(amount) {
  triggerXPFloating(amount);
}

// ============================================================
//  PREMIUM UPGRADES (Heatmap, AI Guide, Streak)
// ============================================================

function generateHeatmap() {
  const container = document.getElementById('activity-heatmap');
  if(!container) return;
  container.innerHTML = '';
  
  // 120 days total (20x6 grid roughly)
  for(let i=0; i<100; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    
    // Random activity for visual appeal
    const streakThreshold = 100 - STATE.streak;
    if(i >= streakThreshold) {
      const rand = Math.random();
      if(rand > 0.6) cell.classList.add('active-high');
      else if(rand > 0.2) cell.classList.add('active-med');
      else cell.classList.add('active-low');
    } else {
      if(Math.random() > 0.85) {
         const rand = Math.random();
         if(rand > 0.5) cell.classList.add('active-low');
         else cell.classList.add('active-med');
      }
    }
    
    container.appendChild(cell);
  }
}

function applyMapTheme(world, nodeId) {
  const mapScreen = document.getElementById('screen-map');
  if (!mapScreen) return;

  const bgKey = (world === 'coding') ? nodeId : nodeId; // Key is the same as nodeId in BACKGROUNDS
  const bgPath = BACKGROUNDS[bgKey] || BACKGROUNDS['screen-map'];
  
  mapScreen.style.backgroundImage = `url('${bgPath}')`;
  
  // Transition effect
  mapScreen.style.transition = 'background 1.5s ease-in-out';
}

function handleGuideAI(e) {
  const input = e.target;
  const bubble = document.getElementById('ai-chat-bubble');
  const guide = GUIDES[STATE.guide] || GUIDES.nova;

  if (e.key === 'Enter') {
    const msg = input.value.trim();
    if (msg === '') return;
    
    // Clear input
    input.value = '';

    if (bubble) {
      bubble.textContent = "Processing neural request...";
      bubble.classList.add('glow-pulse');
      
      setTimeout(() => {
        bubble.classList.remove('glow-pulse');
        const responses = [
          `Fascinating query about ${msg}. I've updated your neural link.`,
          `Ah, "${msg}". A classic challenge in this zone. Stay focused!`,
          `I've analyzed your input. The path to mastery is clear.`,
          `Neural sync complete. Your approach to "${msg}" is unique.`
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        bubble.textContent = response;
        speak(response);
        
        // Randomly give some XP for interacting
        if (Math.random() > 0.5) {
          gainXP(15, null);
        }
      }, 1500);
    } else {
      // Fallback if bubble not found
      speak(`Analyzing request: "${msg}". Neural patterns updated. Executing...`);
    }
  }
}

function makeAIHarder() {
  speak("Difficulty matrix localized to maximum. Brace yourself, Knight.");
  triggerScreenShake();
  document.body.classList.add('hard-mode');
  showGuideMessage("🔥 Hard Mode Activated! Extra XP Enabled!");
  // Automatically give double XP temporarily via STATE manipulation or flag
  STATE.skills.doubleXp = true; 
}

function checkStreakRisk() {
  const indicator = document.getElementById('streak-danger-indicator');
  if (!indicator) return;
  
  // Logic: Show if streak > 0 but no activity today?
  // For demo, just toggle randomly or keep shown if streak > 5
  if (STATE.streak > 5) {
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }
}
