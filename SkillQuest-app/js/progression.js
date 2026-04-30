/* ============================================================
   SkillQuest — PROGRESSION, STREAK & LEADERBOARD
   js/progression.js

   Features:
   - Feature 2:  XP level thresholds (level × 100)
   - Feature 6:  Full progress tracking in localStorage
   - Feature 7:  Dynamic leaderboard sorted by XP
   - Feature 8:  Date-based streak system with freeze support
   ============================================================ */

'use strict';

// ============================================================
//  FEATURE 8: STREAK SYSTEM (date-based)
// ============================================================
const StreakSystem = {
  FREEZE_MAX: 2,

  /**
   * Call this every time the dashboard loads.
   * Compares last login date to today and updates streak accordingly.
   */
  checkAndUpdate() {
    const progress = PROGRESS.get();
    const today     = new Date().toDateString();
    const lastLogin = progress.lastLoginDate;

    if (!lastLogin) {
      // First ever login
      PROGRESS.update(p => {
        p.lastLoginDate = today;
        p.streak = 1;
      });
      STATE.streak = 1;
      this._syncStateStreak();
      return;
    }

    if (lastLogin === today) {
      // Already logged in today — no change
      this._syncStateStreak();
      return;
    }

    // Calculate days since last login
    const daysDiff = Math.floor(
      (new Date(today) - new Date(lastLogin)) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      // Consecutive day — increase streak
      PROGRESS.update(p => {
        p.lastLoginDate = today;
        p.streak = (p.streak || 0) + 1;
      });
      STATE.streak = PROGRESS.get().streak;
      this._onStreakIncrease();

    } else if (daysDiff > 1) {
      // Missed days — check for freeze
      const p = PROGRESS.get();
      if (p.streakFreezes > 0 && daysDiff === 2) {
        // Use one freeze
        PROGRESS.update(q => {
          q.lastLoginDate = today;
          q.streakFreezes = q.streakFreezes - 1;
        });
        STATE.streak = PROGRESS.get().streak;
        showGuideMessage('❄️ Streak Freeze used! Streak maintained. One freeze remaining.');
      } else {
        // Streak broken
        const oldStreak = PROGRESS.get().streak || 0;
        PROGRESS.update(q => {
          q.lastLoginDate = today;
          q.streak = 1;
          q.streakFreezes = this.FREEZE_MAX; // Refill freezes on reset
        });
        STATE.streak = 1;
        if (oldStreak > 3) {
          speak(`Streak reset. You had a ${oldStreak}-day streak. Rebuild from today, Knight.`);
          if (typeof GFX_Streak !== 'undefined') GFX_Streak.activate();
        }
      }
    }

    this._syncStateStreak();
    saveGameState();
  },

  _syncStateStreak() {
    STATE.streak = PROGRESS.get().streak || STATE.streak;
    const els = document.querySelectorAll('#streak-val, #streak-val-mini');
    els.forEach(el => { if (el) el.textContent = STATE.streak; });

    // Danger mode if streak is low
    if (STATE.streak < 2 && typeof GFX_Streak !== 'undefined') {
      GFX_Streak.activate();
    } else if (typeof GFX_Streak !== 'undefined') {
      GFX_Streak.deactivate();
    }
  },

  _onStreakIncrease() {
    const streak = STATE.streak;
    const guide  = GUIDES[STATE.guide];

    // Streak milestone messages
    if (streak === 7) {
      speak('7-day streak achieved! Your discipline is legendary.');
      if (typeof GFX_Badges !== 'undefined') GFX_Badges.unlock('streak_7');
    } else if (streak === 30) {
      speak('30-DAY STREAK. You are unstoppable, Knight.');
      if (typeof GFX_Badges !== 'undefined') GFX_Badges.unlock('streak_30');
    } else if (guide) {
      const dailyLines = {
        nova: `Day ${streak} of active uptime. Performance metrics increasing.`,
        juhi: `Day ${streak} in a row! You're on FIRE! 🔥`
      };
      showGuideMessage(dailyLines[STATE.guide] || dailyLines.nova);
    }
  }
};

// ============================================================
//  FEATURE 2: XP LEVEL SYSTEM (level × 100 threshold)
// ============================================================
const LevelSystem = {
  /**
   * Returns how much XP is needed to reach the next level from current.
   * Formula: xpNeeded = level * 100
   */
  xpForLevel(level) {
    return level * 100;
  },

  /**
   * Recalculates and sets STATE.xpMax based on current level.
   * Call this when loading saved state.
   */
  syncXPMax() {
    STATE.xpMax = this.xpForLevel(STATE.level);
  },

  getRankTitle(level) {
    if (level >= 30) return 'Mythic Architect';
    if (level >= 20) return 'Code Lord';
    if (level >= 15) return 'Master Knight';
    if (level >= 10) return 'Elite Knight';
    if (level >= 5)  return 'Vanguard Knight';
    return 'Recruit';
  },

  /**
   * Full level-up loop. Keeps leveling up if XP is still over the threshold.
   */
  processXP() {
    let leveledUp = false;
    while (STATE.xp >= STATE.xpMax) {
      const old = STATE.level;
      STATE.xp    -= STATE.xpMax;
      if (STATE.xp < 0) STATE.xp = 0;
      STATE.level++;
      STATE.xpMax  = this.xpForLevel(STATE.level);
      leveledUp    = true;

      if (typeof showLevelUpCeremony === 'function') {
        showLevelUpCeremony(old, STATE.level);
      }
    }
    if (leveledUp) {
      saveGameState();
      this._updateAllLevelDisplays();
    }
    return leveledUp;
  },

  _updateAllLevelDisplays() {
    const ids = ['player-lvl-hero', 'dashboard-lvl', 'ph-lvl', 'profile-lvl'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = STATE.level;
    });
    const rankEls = document.querySelectorAll('#dashboard-player-rank, #ph-rank, #player-rank-name');
    rankEls.forEach(el => {
      if (el) {
        el.textContent = this.getRankTitle(STATE.level);
        const guide = GUIDES[STATE.guide];
        if (guide) el.style.color = guide.color;
      }
    });
  }
};

// ============================================================
//  FEATURE 7: DYNAMIC LEADERBOARD
// ============================================================
const LeaderboardSystem = {
  MOsq_PLAYERS: [
    { name: 'ByteKnight',    xp: 9999, level: 50, avatar: '🧙', badge: '👑' },
    { name: 'NullSec',       xp: 8540, level: 42, avatar: '🤖', badge: '🥈' },
    { name: 'Glitch_Coder',  xp: 7200, level: 36, avatar: '💀', badge: '🥉' },
    { name: 'DevLancer',     xp: 5800, level: 29, avatar: '⚡', badge: '⭐' },
    { name: 'SyntaxWitch',   xp: 4100, level: 20, avatar: '🌙', badge: '🌟' }
  ],

  render() {
    const container = document.querySelector('.ranking-panel');
    if (!container) return;

    // Build full player list: mock players + current user
    const allPlayers = [
      ...this.MOsq_PLAYERS.map((p, i) => ({ ...p, isPlayer: false, origRank: i + 1 })),
      {
        name: STATE.projectName || 'SkillQuest_01',
        xp: STATE.xp + (STATE.level - 1) * STATE.xpMax, // Approximate total XP
        level: STATE.level,
        avatar: '🎮',
        badge: '⚡',
        isPlayer: true
      }
    ];

    // Sort by XP descending
    allPlayers.sort((a, b) => b.xp - a.xp);

    // Track player's rank and check for rank improvement
    const playerRank = allPlayers.findIndex(p => p.isPlayer) + 1;
    const prevRank   = parseInt(localStorage.getItem('sq_lastRank') || '99');

    if (playerRank < prevRank && typeof GFX_Leaderboard !== 'undefined') {
      GFX_Leaderboard._showRankUp(playerRank);
    }
    localStorage.setItem('sq_lastRank', String(playerRank));

    // Render
    container.innerHTML = allPlayers.map((player, i) => {
      const rank = i + 1;
      const isTop3 = rank <= 3;
      const cardClass = player.isPlayer
        ? 'rank-card my-rank'
        : rank === 1 ? 'rank-card gold'
        : rank === 2 ? 'rank-card silver'
        : rank === 3 ? 'rank-card bronze'
        : 'rank-card';

      return `
        <div class="${cardClass}" id="${player.isPlayer ? 'my-rank-row' : ''}">
          <span class="rank-position" style="${rank > 3 && !player.isPlayer ? 'color:rgba(255,255,255,0.4)' : ''}">
            #${rank}
          </span>
          <div class="rank-avatar" style="${player.isPlayer ? 'background:linear-gradient(135deg,var(--neon-blue),var(--neon-purple));' : isTop3 ? 'background:linear-gradient(135deg,#ffd700,#ff8c00);' : 'background:linear-gradient(135deg,#555,#888);'}">
            ${player.avatar}
          </div>
          <div class="rank-info">
            <div class="rank-player-name">${player.name}${player.isPlayer ? ' (You)' : ''}</div>
            <div class="rank-xp">${player.xp.toLocaleString()} XP ⚡ Level ${player.level}</div>
          </div>
          <span class="rank-badge">${player.badge}</span>
        </div>
      `;
    }).join('');

    // Scroll to player row
    setTimeout(() => {
      const myRow = document.getElementById('my-rank-row');
      if (myRow) {
        myRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (window.gsap) {
          gsap.fromTo(myRow,
            { boxShadow: '0 0 0px transparent', x: -20 },
            { boxShadow: '0 0 30px rgba(0,240,255,0.5)', x: 0, duration: 0.8, ease: 'back.out' }
          );
        }
      }
    }, 300);
  }
};

// ============================================================
//  FEATURE 6: PROGRESS TRACKING
// ============================================================
const ProgressTracker = {
  /**
   * Returns a summary of the player's full learning progress.
   */
  getSummary() {
    const p = PROGRESS.get();
    return {
      lessonsCompleted: p.completedLessons.length,
      totalLessons:     Object.keys(JS_TRACK || {}).length || 4,
      quizzesTaken:     Object.keys(p.quizScores).length,
      avgQuizScore:     this._avgScore(p.quizScores),
      challengesSolved: p.challengesSolved.length,
      streak:           p.streak,
      level:            STATE.level,
      xp:               STATE.xp,
      badges:           STATE.inventory?.badges?.length || 0
    };
  },

  _avgScore(scores) {
    const vals = Object.values(scores);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  },

  /**
   * Updates all progress displays — called when loading profile screen.
   */
  renderProgressMeters() {
    const summary = this.getSummary();

    // Profile skill meters
    const meterContainer = document.getElementById('profile-skill-meters');
    if (meterContainer) {
      const lessonPct     = Math.round((summary.lessonsCompleted / summary.totalLessons) * 100);
      const challengePct  = Math.round((summary.challengesSolved / summary.totalLessons) * 100);
      const quizPct       = summary.avgQuizScore;

      meterContainer.innerHTML = `
        ${this._meterHtml('Lesson Completion', lessonPct, 'var(--neon-blue)')}
        ${this._meterHtml('Challenge Mastery', challengePct, 'var(--neon-pink)')}
        ${this._meterHtml('Quiz Average', quizPct, 'var(--neon-cyan)')}
        ${this._meterHtml('Overall Progress', Math.round((lessonPct + challengePct + quizPct) / 3), 'var(--neon-green)')}
      `;
    }

    // Profile badges
    this.renderBadges();
  },

  _meterHtml(label, pct, color) {
    return `
      <div class="skill-meter" style="margin-bottom:1rem;">
        <div class="s-label" style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.8rem;">
          <span>${label}</span>
          <span style="color:${color};">${pct}%</span>
        </div>
        <div class="s-bar-outer" style="background:rgba(255,255,255,0.05); border-radius:10px; height:8px; overflow:hidden;">
          <div class="s-bar-inner" style="width:${pct}%; background:${color}; height:100%; border-radius:10px; transition:width 1s ease; box-shadow:0 0 8px ${color};"></div>
        </div>
      </div>
    `;
  },

  renderBadges() {
    const container = document.getElementById('profile-badges-container');
    if (!container) return;

    const earned = STATE.inventory?.badges || [];
    const allBadges = typeof GFX_Badges !== 'undefined' ? GFX_Badges.BADGES : {};

    if (earned.length === 0) {
      container.innerHTML = `<div style="opacity:0.4; font-size:0.85rem; text-align:center; padding:1rem;">Complete missions to earn badges!</div>`;
      return;
    }

    container.innerHTML = earned.map(badgeId => {
      const b = allBadges[badgeId] || { icon: '🎖️', name: badgeId, desc: '' };
      return `
        <div class="ach-item unlocked" title="${b.desc}" style="cursor:pointer;">
          <span class="ach-icon">${b.icon}</span>
          <span class="ach-name" style="font-size:0.65rem;">${b.name}</span>
        </div>
      `;
    }).join('');
  },

  /**
   * Extend saveGameState to include full progress
   */
  extendSave() {
    const _orig = window.saveGameState;
    window.saveGameState = function() {
      _orig();
      // Progress is already auto-saved by PROGRESS.update()
      // Just sync STATE.streak to PROGRESS
      PROGRESS.update(p => { p.streak = STATE.streak; });
    };
  },

  /**
   * Extend loadGameState to restore full progress
   */
  extendLoad() {
    const _orig = window.loadGameState;
    window.loadGameState = function() {
      _orig();
      const p = PROGRESS.get();
      if (p.streak)   STATE.streak = p.streak;
      if (p.aiApiKey) window._AI_API_KEY = p.aiApiKey;
      if (p.subscription) STATE.subscription = p.subscription;
      LevelSystem.syncXPMax();
    };
  }
};

// ============================================================
//  INIT
// ============================================================
function initProgression() {
  ProgressTracker.extendSave();
  ProgressTracker.extendLoad();

  // Patch onScreenEnter for leaderboard and profile
  const _origScreenEnter = window.onScreenEnter;
  window.onScreenEnter = function(screenId) {
    _origScreenEnter(screenId);

    if (screenId === 'screen-leaderboard') {
      setTimeout(() => LeaderboardSystem.render(), 400);
    }

    if (screenId === 'screen-dashboard') {
      StreakSystem.checkAndUpdate();
      // Render daily challenge card
      if (typeof initDailyChallenge === 'function') initDailyChallenge();
    }

    if (screenId === 'screen-profile') {
      setTimeout(() => ProgressTracker.renderProgressMeters(), 300);
    }

    if (screenId === 'screen-leaderboard') {
      renderSkillTree();
    }
  };

  // Apply correct XP formula from the start
  LevelSystem.syncXPMax();
}

document.addEventListener('DOMContentLoaded', initProgression);
