/* ============================================================
   SkillQuest - GAME FEEDBACK ENGINE v2.0
   gameFeedback.js

   Implements:
   1. XP Burst Toasts (with origin tracking)
   2. Level-Up Ceremony (full-screen, particles, rank animation)
   3. Badge Unlock System (slide-in popups)
   4. Streak Danger Mode (UI tint, pulse, AI alert)
   5. AI Guide Personality (toned responses + typewriter)
   6. Mission Completion Moment (burst + next mission CTA)
   7. Leaderboard Drama (rank-up notification + glow)
   8. World Map Interactions (hover, lock, unlock, path glow)
   + Micro-interactions (cursor glow, card tilt, button effects)
   ============================================================ */

'use strict';

// ============================================================
//  1. XP BURST SYSTEM
//  Usage: GFX.xpBurst(amount, sourceEl?)
// ============================================================
const GFX = {
  /**
   * Fires an XP popup anchored near a source element (or screen center).
   */
  xpBurst(amount, sourceEl = null) {
    const el = document.createElement('div');
    el.className = 'gfx-xp-toast';
    el.innerHTML = `<span class="gfx-xp-plus">+</span>${amount}<span class="gfx-xp-label">XP</span>`;

    // Position: near source button or random upper-center
    if (sourceEl) {
      const rect = sourceEl.getBoundingClientRect();
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top  = `${rect.top - 10}px`;
    } else {
      el.style.left = `${30 + Math.random() * 40}%`;
      el.style.top  = `${25 + Math.random() * 25}%`;
    }

    document.body.appendChild(el);

    // Animate
    if (window.gsap) {
      gsap.fromTo(el,
        { y: 0, opacity: 0, scale: 0.4 },
        {
          y: -110, opacity: 1, scale: 1.15, duration: 0.6,
          ease: 'back.out(2)',
          onComplete: () => gsap.to(el, {
            y: -160, opacity: 0, scale: 0.9, duration: 0.7,
            delay: 0.5, ease: 'power2.in',
            onComplete: () => el.remove()
          })
        }
      );
    } else {
      el.style.animation = 'gfxXpFloat 1.5s ease forwards';
      setTimeout(() => el.remove(), 1600);
    }

    // Also animate main XP bar fill
    this._fillXPBar();
  },

  _fillXPBar() {
    const bars = [
      document.getElementById('xp-fill-hero'),
      document.getElementById('ph-xp-fill'),
      document.getElementById('xp-fill-main')
    ];
    bars.forEach(bar => {
      if (!bar) return;
      const pct = Math.min(100, (STATE.xp / STATE.xpMax) * 100);
      if (window.gsap) {
        gsap.to(bar, { width: pct + '%', duration: 1.2, ease: 'expo.out' });
      } else {
        bar.style.width = pct + '%';
      }
    });
  },

  /**
   * Multi-particle burst explosion at a point (for big moments)
   */
  particleBurst(x, y, count = 30) {
    const colors = ['#00f0ff', '#ff007f', '#9d00ff', '#00ff88', '#ffe600'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'gfx-particle';
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(p);
      
      const angle  = (Math.random() * Math.PI * 2);
      const speed  = 80 + Math.random() * 160;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed - 60;

      if (window.gsap) {
        gsap.fromTo(p,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: tx, y: ty, opacity: 0, scale: 0.2,
            duration: 0.9 + Math.random() * 0.5,
            ease: 'power2.out',
            onComplete: () => p.remove()
          }
        );
      } else {
        p.style.transform = `translate(${tx}px, ${ty}px)`;
        p.style.opacity = '0';
        p.style.transition = 'all 1s ease';
        setTimeout(() => p.remove(), 1100);
      }
    }
  }
};

// ============================================================
//  2. LEVEL-UP CEREMONY
//  Called inside triggerLevelUp() after state update
// ============================================================
function showLevelUpCeremony(oldLevel, newLevel) {
  // Determine rank title
  const RANKS = [
    { threshold: 0,  title: 'Recruit',       suffix: 'You have joined the order.' },
    { threshold: 5,  title: 'Vanguard Knight', suffix: 'Your blade grows sharper.' },
    { threshold: 10, title: 'Elite Knight',    suffix: 'The battlefield trembles.' },
    { threshold: 15, title: 'Master Knight',   suffix: 'Legend is within reach.' },
    { threshold: 20, title: 'Code Lord',       suffix: 'Few have stood this high.' },
    { threshold: 30, title: 'Mythic Architect', suffix: 'You have transcended.' }
  ];
  const rank = RANKS.slice().reverse().find(r => newLevel >= r.threshold) || RANKS[0];

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'gfx-levelup-overlay';
  overlay.className = 'gfx-levelup-overlay';
  overlay.innerHTML = `
    <div class="gfx-levelup-bg-glow"></div>
    <div class="gfx-levelup-card">
      <div class="gfx-levelup-top-bar"></div>
      <div class="gfx-bolt-icon">⚡</div>
      <div class="gfx-levelup-headline">LEVEL UP</div>
      <div class="gfx-levelup-nums">
        <span class="gfx-old-lvl">${oldLevel}</span>
        <span class="gfx-arrow">→</span>
        <span class="gfx-new-lvl">${newLevel}</span>
      </div>
      <div class="gfx-rank-title">${rank.title.toUpperCase()}</div>
      <div class="gfx-rank-sub">${rank.suffix}</div>
      <div id="gfx-lvlup-confetti"></div>
      <button class="game-btn btn-blue gfx-levelup-btn" onclick="closeLevelUpCeremony()">
        CONTINUE ⚡
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Confetti
  const confettiContainer = overlay.querySelector('#gfx-lvlup-confetti');
  const colors = ['#00f0ff','#ff007f','#9d00ff','#00ff88','#ffe600','#fff'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'gfx-confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = '50%';
    piece.style.top  = '50%';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confettiContainer.appendChild(piece);
    if (window.gsap) {
      gsap.to(piece, {
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 500 - 150,
        rotation: Math.random() * 720,
        opacity: 0,
        duration: 1.5 + Math.random() * 0.8,
        ease: 'power2.out',
        onComplete: () => piece.remove()
      });
    }
  }

  // Screen entrance animation
  if (window.gsap) {
    gsap.fromTo('.gfx-levelup-card',
      { scale: 0.5, opacity: 0, y: 60 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)', delay: 0.1 }
    );
    gsap.fromTo('.gfx-levelup-overlay',
      { opacity: 0 }, { opacity: 1, duration: 0.4 }
    );
    // Pop the new level number
    gsap.fromTo('.gfx-new-lvl',
      { scale: 0.3, opacity: 0 },
      { scale: 1.3, opacity: 1, duration: 0.5, delay: 0.6, ease: 'back.out(2)',
        onComplete: () => gsap.to('.gfx-new-lvl', { scale: 1, duration: 0.3 })
      }
    );
  } else {
    overlay.style.animation = 'gfxFadeIn 0.4s ease forwards';
  }

  // AI Guide reacts in character
  const guideReactions = {
    nova:  [`Level ${newLevel} achieved. You are performing above projections, Knight.`, `Neural capacity upgraded to Level ${newLevel}. The data doesn't lie — you're exceptional.`],
    juhi:  [`LEVEL ${newLevel}!! I KNEW you could do it! This is INCREDIBLE! 🎉`, `Oh my gosh, you're Level ${newLevel}! You're basically unstoppable right now!`]
  };
  const guide = STATE.guide;
  const lines = guideReactions[guide] || guideReactions.nova;
  setTimeout(() => speak(lines[Math.floor(Math.random() * lines.length)]), 600);

  // Screen shake
  if (typeof triggerScreenShake === 'function') triggerScreenShake();
}

function closeLevelUpCeremony() {
  const overlay = document.getElementById('gfx-levelup-overlay');
  if (!overlay) return;
  if (window.gsap) {
    gsap.to(overlay, { opacity: 0, scale: 1.05, duration: 0.4, onComplete: () => overlay.remove() });
  } else {
    overlay.remove();
  }
}


// ============================================================
//  3. BADGE UNLOCK SYSTEM
//  Usage: GFX_Badges.unlock('Streak Warrior', '🔥', 'Maintain a 7-day streak')
// ============================================================
const GFX_Badges = {
  _queue: [],
  _showing: false,

  // Central badge definitions
  BADGES: {
    first_mission:  { icon: '🎖️', name: 'First Strike',      desc: 'Complete your first mission.' },
    streak_7:       { icon: '🔥', name: 'Streak Warrior',    desc: 'Maintain a 7-day streak.' },
    streak_30:      { icon: '⚡', name: 'Eternal Flame',     desc: '30-day streak achieved.' },
    boss_first:     { icon: '💀', name: 'Boss Slayer',        desc: 'Defeat your first boss.' },
    quiz_perfect:   { icon: '🧠', name: 'Neural Ace',        desc: 'Perfect quiz score.' },
    level_10:       { icon: '👑', name: 'Elite Status',      desc: 'Reach Level 10.' },
    design_master:  { icon: '🎨', name: 'Pixel Lord',        desc: 'Complete Design World.' },
    all_missions:   { icon: '🏆', name: 'Daily Legend',      desc: 'Complete all daily missions.' }
  },

  unlock(badgeId, customIcon, customName, customDesc) {
    // Support both ID lookup and direct params
    let badge;
    if (this.BADGES[badgeId]) {
      badge = this.BADGES[badgeId];
    } else {
      badge = { icon: customIcon || '🎖️', name: customName || badgeId, desc: customDesc || '' };
    }

    // Track in STATE
    if (!STATE.inventory.badges.includes(badgeId)) {
      STATE.inventory.badges.push(badgeId);
      this._queue.push(badge);
      this._processQueue();
      if (typeof saveGameState === 'function') saveGameState();
    }
  },

  _processQueue() {
    if (this._showing || this._queue.length === 0) return;
    this._showing = true;
    const badge = this._queue.shift();
    this._show(badge, () => {
      this._showing = false;
      setTimeout(() => this._processQueue(), 400);
    });
  },

  _show(badge, onDone) {
    const popup = document.createElement('div');
    popup.className = 'gfx-badge-popup';
    popup.innerHTML = `
      <div class="gfx-badge-icon">${badge.icon}</div>
      <div class="gfx-badge-text">
        <div class="gfx-badge-headline">🎖️ Badge Unlocked!</div>
        <div class="gfx-badge-name">${badge.name}</div>
        <div class="gfx-badge-desc">${badge.desc}</div>
      </div>
      <button class="gfx-badge-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(popup);

    if (window.gsap) {
      gsap.fromTo(popup,
        { x: 120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
      gsap.to(popup, {
        x: 120, opacity: 0, duration: 0.5, delay: 4,
        ease: 'power2.in',
        onComplete: () => { popup.remove(); onDone(); }
      });
    } else {
      popup.style.animation = 'gfxSlideInRight 0.5s ease forwards';
      setTimeout(() => { popup.remove(); onDone(); }, 4600);
    }
  }
};


// ============================================================
//  4. STREAK DANGER MODE
//  Call GFX_Streak.check() on dashboard enter
// ============================================================
const GFX_Streak = {
  DANGER_THRESHOLD: 1,  // Days since last login considered "at risk"

  check() {
    // For demo: treat streak < 3 as "at risk"
    const atRisk = STATE.streak < 3;
    this._setMode(atRisk);
  },

  activate() { this._setMode(true); },
  deactivate() { this._setMode(false); },

  _setMode(danger) {
    const body = document.body;
    const streakEls = document.querySelectorAll('#streak-val, #streak-val-mini');

    if (danger) {
      body.classList.add('gfx-streak-danger');
      streakEls.forEach(el => el.classList.add('gfx-streak-pulse'));

      // Show alert banner (once per session)
      if (!document.getElementById('gfx-streak-alert')) {
        const alert = document.createElement('div');
        alert.id = 'gfx-streak-alert';
        alert.className = 'gfx-streak-alert';
        alert.innerHTML = `
          <span>⚠️ Your streak is at risk! Complete a mission to keep it alive.</span>
          <button onclick="document.getElementById('gfx-streak-alert').remove()">✕</button>
        `;
        document.body.appendChild(alert);
        if (window.gsap) {
          gsap.fromTo(alert, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' });
        }
      }

      // AI reacts in character
      const guideWarnings = {
      nova:  "Warning: Streak continuity at risk. An incomplete day reduces your performance index.",
      juhi:  "Hey! Your streak is about to break! Quick, do a lesson — I believe in you! 💪"
      };
      speak(guideWarnings[STATE.guide] || guideWarnings.nova);

    } else {
      body.classList.remove('gfx-streak-danger');
      streakEls.forEach(el => el.classList.remove('gfx-streak-pulse'));
      const alert = document.getElementById('gfx-streak-alert');
      if (alert) alert.remove();
    }
  }
};


// ============================================================
//  5. AI GUIDE PERSONALITY ENHANCEMENT
//  Enhanced speak() wrapper with persona-aware line variants
// ============================================================
const GFX_AI = {
  // Persona-specific response modifiers
  TONE: {
    nova: {
      correct:   ["Correct. Expected response — well executed.", "Processed. Accuracy confirmed.", "Your logic is sound. Proceeding..."],
      wrong:     ["Incorrect. Recalibrate and retry.", "That data is flawed. Analyze again.", "Error detected. Correct your vector."],
      mission:   ["Mission parameters fulfilled. XP allocated.", "Objective complete. Performance: optimal.", "Data logged. Proceeding to next directive."],
      levelup:   ["Level threshold crossed. New protocols initialized.", "You exceeded calculations. Rank evolution confirmed."],
      idle:      ["Inactivity detected. Override the delay.", "Waiting for your command, Knight.", "Time is a resource. Deploy it wisely."]
    },
    juhi: {
      correct:   ["YES!! That's so right! You're on fire! 🔥", "Oh wow, you just nailed it! Love that energy!", "Perfect! I knew you'd get it — you're brilliant!"],
      wrong:     ["Oops, not quite! But hey, we learn from this! Try again! 💪", "Aww, so close! Let's think this through together.", "Don't worry! That one was tricky — you've got this!"],
      mission:   ["MISSION DONE!! You're absolutely crushing it! 🎉", "That was AMAZING! I'm so proud of you right now!", "Yes yes YES! You completed it! Let's go! 🚀"],
      levelup:   ["LEVEL UP!! 🎉🎉 I literally screamed!! You're incredible!", "OH MY GOSH you leveled up!! We're going to the TOP!"],
      idle:      ["Hey, don't forget about me! Let's do something! 😊", "Helloooo? I miss you! Come back and let's learn! 💕", "I'm getting a little bored over here… adventure awaits!"]
    },

  },

  react(event = 'correct') {
    const guide = STATE.guide || 'nova';
    const pool = this.TONE[guide]?.[event] || this.TONE.nova[event] || ['...'];
    speak(pool[Math.floor(Math.random() * pool.length)]);
  }
};


// ============================================================
//  6. MISSION COMPLETION MOMENT
//  Call after quest claim for a dramatic moment
// ============================================================
function showMissionCompleteEffect(questType, xpAmount, sourceEl) {
  // XP burst near button
  GFX.xpBurst(xpAmount, sourceEl);

  // Particle burst at element center
  if (sourceEl) {
    const rect = sourceEl.getBoundingClientRect();
    GFX.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
  }

  // Overlay popup
  const overlay = document.createElement('div');
  overlay.className = 'gfx-mission-complete';
  overlay.innerHTML = `
    <div class="gfx-mc-inner glass-panel">
      <div class="gfx-mc-icon">⚔️</div>
      <div class="gfx-mc-title">MISSION COMPLETE</div>
      <div class="gfx-mc-quest">${questType.toUpperCase()}</div>
      <div class="gfx-mc-xp-reward">+${xpAmount} XP EARNED</div>
      <div class="gfx-mc-actions">
        <button class="game-btn btn-blue" onclick="this.closest('.gfx-mission-complete').remove()">
          ⚡ Next Mission
        </button>
        <button class="game-btn btn-hollow" onclick="this.closest('.gfx-mission-complete').remove()">
          ✕ Dismiss
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  if (window.gsap) {
    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo('.gfx-mc-inner',
      { scale: 0.5, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.1 }
    );
  }

  // Auto-close after 5s
  setTimeout(() => {
    if (overlay.parentElement) {
      if (window.gsap) {
        gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => overlay.remove() });
      } else {
        overlay.remove();
      }
    }
  }, 5000);

  // Badge check — first mission?
  if (!STATE.inventory.badges.includes('first_mission')) {
    setTimeout(() => GFX_Badges.unlock('first_mission'), 1200);
  }

  // All missions complete check
  const allDone = Object.values(STATE.quests).every(q => q.claimed);
  if (allDone && !STATE.inventory.badges.includes('all_missions')) {
    setTimeout(() => GFX_Badges.unlock('all_missions'), 2500);
  }

  // AI personality react
  setTimeout(() => GFX_AI.react('mission'), 700);
}


// ============================================================
//  7. LEADERBOARD DRAMA
//  Adds rank-up notification and player row glow
// ============================================================
const GFX_Leaderboard = {
  _previousRank: null,

  init() {
    this._highlightPlayerRow();
    const currentRank = this._getSimulatedRank();
    if (this._previousRank !== null && currentRank < this._previousRank) {
      this._showRankUp(currentRank);
    }
    this._previousRank = currentRank;
  },

  _getSimulatedRank() {
    // Simulate rank based on XP
    if (STATE.xp >= 5000) return 3;
    if (STATE.xp >= 2000) return 10;
    if (STATE.xp >= 1000) return 30;
    if (STATE.xp >= 700)  return 84;
    return 100;
  },

  _highlightPlayerRow() {
    const myRow = document.querySelector('.rank-card.my-rank');
    if (!myRow) return;

    // Update dynamic XP/Level text
    const xpEl = myRow.querySelector('.rank-xp');
    if (xpEl) xpEl.textContent = `${STATE.xp} XP ⚡ Level ${STATE.level}`;

    const nameEl = myRow.querySelector('.rank-player-name');
    if (nameEl) nameEl.textContent = STATE.projectName;

    // Add position
    const posEl = myRow.querySelector('.rank-position');
    if (posEl) posEl.textContent = `#${this._getSimulatedRank()}`;

    // Pulse glow
    if (window.gsap) {
      gsap.fromTo(myRow,
        { boxShadow: '0 0 0px transparent' },
        { boxShadow: `0 0 30px var(--neon-blue), 0 0 60px rgba(0,240,255,0.2)`, duration: 1, yoyo: true, repeat: 2, ease: 'power2.inOut' }
      );
      gsap.fromTo(myRow, { x: -15 }, { x: 0, duration: 0.6, ease: 'back.out' });
    }
  },

  _showRankUp(newRank) {
    const el = document.createElement('div');
    el.className = 'gfx-rank-up';
    el.innerHTML = `⬆ You moved to <strong>#${newRank}</strong>`;
    document.body.appendChild(el);
    if (window.gsap) {
      gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' });
      gsap.to(el, { y: -20, opacity: 0, duration: 0.5, delay: 3, onComplete: () => el.remove() });
    } else {
      setTimeout(() => el.remove(), 3600);
    }
  }
};


// ============================================================
//  8. WORLD MAP INTERACTIONS
//  Enhanced hover, locked shake, unlocked glow, path animation
// ============================================================
const GFX_Map = {
  init() {
    this._setupNodeEffects();
    this._animatePath();
  },

  _setupNodeEffects() {
    const nodes = document.querySelectorAll('.map-node');
    nodes.forEach(node => {
      const isLocked = node.classList.contains('locked');

      // Hover: tilt card effect
      node.addEventListener('mouseenter', () => {
        if (isLocked) {
          // Lock shake hint
          if (window.gsap) gsap.to(node, { x: 6, duration: 0.07, yoyo: true, repeat: 5 });
        } else {
          if (window.gsap) {
            gsap.to(node, { scale: 1.12, duration: 0.25, ease: 'power2.out' });
            // Emit a subtle glow ring
            node.classList.add('gfx-node-active');
          }
        }
      });

      node.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(node, { scale: 1, x: 0, duration: 0.3, ease: 'power2.out' });
        }
        node.classList.remove('gfx-node-active');
      });

      // Unlocked: apply persistent glow pulse
      if (!isLocked) {
        node.classList.add('gfx-node-unlocked');
      }
    });
  },

  _animatePath() {
    const path = document.getElementById('journey-path');
    if (!path || !window.gsap) return;
    const len = path.getTotalLength ? path.getTotalLength() : 2000;
    gsap.fromTo(path,
      { strokeDasharray: len, strokeDashoffset: len, opacity: 0.3 },
      { strokeDashoffset: 0, opacity: 0.7, duration: 2.5, ease: 'power2.out', delay: 0.5 }
    );
  },

  /**
   * Call when a node is newly unlocked (after finalizeLevelUnlock)
   */
  celebrateNodeUnlock(nodeId) {
    const el = document.getElementById(`node-${nodeId}`);
    if (!el) return;
    el.classList.remove('locked');
    el.classList.add('unlocked', 'gfx-node-unlocked');
    el.classList.remove('gfx-node-active');

    // Burst at node center
    const rect = el.getBoundingClientRect();
    GFX.particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);

    if (window.gsap) {
      gsap.fromTo(el,
        { scale: 1.4, opacity: 0.3 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' }
      );
    }
  }
};


// ============================================================
//  MICRO-INTERACTIONS
//  Cursor glow, button ripple, card 3D tilt
// ============================================================
function initMicroInteractions() {
  // 1. Custom cursor glow dot
  const cursor = document.createElement('div');
  cursor.id = 'gfx-cursor';
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  // 2. Card 3D tilt on glass panels
  document.querySelectorAll('.glass-panel, .char-card, .mission-card, .rank-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / (rect.height / 2)) * 4;
      const ry   = ((e.clientX - cx) / (rect.width  / 2)) * -4;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 3. Button ripple effect on click
  document.addEventListener('click', e => {
    const btn = e.target.closest('.game-btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'gfx-ripple';
    const rect = btn.getBoundingClientRect();
    ripple.style.left   = (e.clientX - rect.left) + 'px';
    ripple.style.top    = (e.clientY - rect.top)  + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}


// ============================================================
//  INTEGRATION HOOKS
//  Patch existing app.js functions non-destructively
// ============================================================

/**
 * Patch gainXP to add XP burst visual + badge checks
 * Note: triggerLevelUp (called inside gainXP) already calls showLevelUpCeremony
 */
(function patchGainXP() {
  if (typeof gainXP !== 'function') {
    console.warn('[GFX] gainXP not found — patch deferred');
    return;
  }
  const _origGainXP = gainXP;
  window.gainXP = function(amount, topic = null, sourceEl = null) {
    _origGainXP(amount, topic);

    // XP burst near source element (or random position)
    GFX.xpBurst(amount, sourceEl);

    // Badge checks
    if (STATE.streak >= 7  && !STATE.inventory.badges.includes('streak_7'))  GFX_Badges.unlock('streak_7');
    if (STATE.streak >= 30 && !STATE.inventory.badges.includes('streak_30')) GFX_Badges.unlock('streak_30');
    if (STATE.level >= 10  && !STATE.inventory.badges.includes('level_10'))  {
      setTimeout(() => GFX_Badges.unlock('level_10'), 800);
    }
  };
})();

/**
 * Patch claimQuestReward to show Mission Complete effect
 */
(function patchClaimQuest() {
  if (typeof claimQuestReward !== 'function') return;
  const _orig = claimQuestReward;
  window.claimQuestReward = function(type, xp, event) {
    const btn = event ? event.target : null;
    _orig(type, xp, event);
    // Show the dramatic mission complete overlay
    showMissionCompleteEffect(type, xp, btn);
  };
})();

/**
 * Patch navigateTo for screen-specific feedback
 */
(function patchNavigateTo() {
  if (typeof navigateTo !== 'function') return;
  const _orig = navigateTo;
  window.navigateTo = function(screenId) {
    _orig(screenId);
    setTimeout(() => {
      if (screenId === 'screen-leaderboard') {
        GFX_Leaderboard.init();
      }
      if (screenId === 'screen-map') {
        GFX_Map.init();
      }
      if (screenId === 'screen-dashboard') {
        GFX_Streak.check();
      }
    }, 400);
  };
})();

/**
 * Patch finalizeLevelUnlock to celebrate node unlock
 */
(function patchFinalizeLevelUnlock() {
  if (typeof finalizeLevelUnlock !== 'function') return;
  const _orig = finalizeLevelUnlock;
  window.finalizeLevelUnlock = function(world, nodeId) {
    _orig(world, nodeId);
    const seq = (world === 'coding') ? ['beginner','forest','city','arena'] : ['pixel','research','labyrinth','arena'];
    const idx  = seq.indexOf(nodeId);
    if (idx !== -1 && idx < seq.length - 1) {
      const nextNode = seq[idx + 1];
      setTimeout(() => GFX_Map.celebrateNodeUnlock(nextNode), 300);
    }
  };
})();

// ============================================================
//  INIT on DOM ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initMicroInteractions();
  // Small delay to ensure app.js has set up STATE
  setTimeout(() => {
    GFX_Streak.check();
  }, 1500);
});
