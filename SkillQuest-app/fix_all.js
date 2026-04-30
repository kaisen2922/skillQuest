const fs = require('fs');

// ============================================================
// COMPREHENSIVE FIX SCRIPT FOR SkillQuest
// ============================================================

function fixHTML() {
  let h = fs.readFileSync('d:/SkillQuest/SkillQuest-app/index.html', 'utf8');

  // 1. Fix null bytes in comments
  h = h.replace(/\u0000\u0000/g, '⚡');

  // 2. Fix pathway buttons (lines 115-122) - contextual replacements
  h = h.replace(/>\u0015 Java</, '>☕ Java<');
  h = h.replace(/>=\r Python</, '>🐍 Python<');
  h = h.replace(/>\ufffd\u000f C</, '>💻 C<');
  h = h.replace(/><\ufffd Design</, '>🎨 Design<');
  h = h.replace(/>\ufffd JavaScript</, '>⚡ JavaScript<');
  h = h.replace(/><\ufffd\u000f HTML</, '>🌐 HTML<');
  h = h.replace(/>=\ufffd CSS</, '>🎨 CSS<');
  h = h.replace(/>=\ufffd C\+\+</, '>🔧 C++<');

  // 3. Fix fire emoji for streaks
  h = h.replace(/=%/g, '🔥');

  // 4. Fix dashboard nav buttons
  h = h.replace(/>=\ufffd World Map</, '>🗺️ World Map<');
  h = h.replace(/>\ufffd\u000f Training</, '>⚔️ Training<');
  h = h.replace(/><\ufffd Leaderboard</, '>🏆 Leaderboard<');

  // 5. Fix back/nav buttons - \u0005 is the corrupted back arrow
  h = h.replace(/\u0005 HQ/g, '◀ HQ');
  h = h.replace(/\u0005 Back to Map/g, '◀ Back to Map');
  h = h.replace(/\u0005 Back/g, '◀ Back');
  h = h.replace(/\u0005 Flee/g, '◀ Flee');
  h = h.replace(/\u0005 Escape/g, '◀ Escape');
  h = h.replace(/\u0005 Return to HQ/g, '◀ Return to HQ');
  h = h.replace(/\u0005 Retreat/g, '◀ Retreat');
  h = h.replace(/\u0005 Dash/g, '◀ Dash');
  h = h.replace(/\u0005 Abandon/g, '◀ Abandon');
  h = h.replace(/\u0005 Mark as Studied/g, '✅ Mark as Studied');
  h = h.replace(/\u0005 Sync/g, '✅ Sync');

  // 6. Fix submit button
  h = h.replace(/\u0006 Submit/g, '✅ Submit');

  // 7. Fix map title
  h = h.replace(/\ufffd\u000f Code Kingdom .{1,3} World Map/, '⚔️ Code Kingdom — World Map');

  // 8. Fix level entry buttons
  h = h.replace(/>\ufffd\u000f Start Training</, '>⚔️ Start Training<');
  h = h.replace(/>=\ufffd Quiz Challenge</, '>🎯 Quiz Challenge<');

  // 9. Fix play icons
  h = h.replace(/>\ufffd<\/div>/g, '>▶</div>');

  // 10. Fix HP label
  h = h.replace(/d\u000f PLAYER HP/g, '❤️ PLAYER HP');

  // 11. Fix various emoji in text content
  h = h.replace(/>L<\/button>/g, '>✕</button>');  // close button
  h = h.replace(/>\ufffd Enter Code Challenge</, '>⚡ Enter Code Challenge<');
  h = h.replace(/<\ufffd Design Challenge/, '🎨 Design Challenge');

  // 12. Fix achievement icons
  h = h.replace(/><1<\/span>/g, '>🌱</span>');
  h = h.replace(/>=\t<\/span>/g, '>⚔️</span>');
  h = h.replace(/><\ufffd<\/span>/g, '>🎬</span>');

  // 13. Fix skill tree icons
  h = h.replace(/>\ufffd\u000f JS Advanced</, '>🔒 JS Advanced<');
  h = h.replace(/>=\. Algorithms</, '>🧩 Algorithms<');
  h = h.replace(/>=Q FullStack Lord</, '>👑 FullStack Lord<');

  // 14. Fix leaderboard avatars and badges
  h = h.replace(/>\ufffd\u000f<\/div>/g, '>🧙</div>');
  h = h.replace(/>=\ufffd<\/div>/g, '>🤖</div>');
  h = h.replace(/>=Q<\/span>/g, '>👑</span>');
  h = h.replace(/>>\ufffd<\/div>/g, '>🧝</div>');
  h = h.replace(/>>\ufffd<\/div>/g, '>🧝</div>');
  h = h.replace(/>><\/span>/g, '>🥈</span>');
  // Fix rank badges with specific patterns
  h = h.replace(/>H<\/span>/g, '>🥈</span>');
  h = h.replace(/>I<\/span>/g, '>🥉</span>');
  h = h.replace(/>\ufffd<\/span>\s*\n\s*<\/div>\s*\n\s*<div class="rank-card">/g, 
    '>⭐</span>\n          </div>\n          <div class="rank-card">');
  h = h.replace(/>\(<\/span>/g, '>🌟<\/span>');

  // 15. Fix profile section
  h = h.replace(/>=\ufffd Knight Protocol</, '>⚔️ Knight Protocol<');
  h = h.replace(/>=\ufffd<\/button>/g, '>💾</button>');
  h = h.replace(/><\ufffd ACHIEVEMENTS</, '>🏆 ACHIEVEMENTS<');
  h = h.replace(/>=\ufffd\u000f SKILL PROTOCOLS</, '>⚔️ SKILL PROTOCOLS<');

  // 16. Fix design world entries
  h = h.replace(/><8 Pixel Village</, '>🎨 Pixel Village<');
  h = h.replace(/><\ufffd Start Training</, '>🎨 Start Training<');
  h = h.replace(/>=\. Design Quiz</, '>🧩 Design Quiz<');
  h = h.replace(/>\( Design Training Chamber</, '>🎨 Design Training Chamber<');
  h = h.replace(/><\ufffd Enter Design Challenge</, '>🎨 Enter Design Challenge<');
  h = h.replace(/><\ufffd UI Forge/g, '🎨 UI Forge');
  h = h.replace(/>\( Submit Design</, '>✨ Submit Design<');

  // 17. Fix DW boss
  h = h.replace(/>\ufffd\u000f Final Submit</, '>⚔️ Final Submit<');

  // 18. Fix study/notebook screen titles  
  h = h.replace(/>=\ufffd Library of Syntax/, '>📚 Library of Syntax');
  h = h.replace(/>=\ufffd Digital Notebook/, '>📝 Digital Notebook');
  h = h.replace(/>=\ufffd Save to Device</, '>💾 Save to Device<');
  h = h.replace(/>=\ufffd Save Entry</, '>💾 Save Entry<');

  // 19. Fix next buttons
  h = h.replace(/>Next Question \ufffd</, '>Next Question ➡<');
  h = h.replace(/>Next \ufffd</, '>Next ➡<');

  // 20. Fix console/system headers
  h = h.replace(/>\ufffd SYSTEM OUTPUT</, '>🖥️ SYSTEM OUTPUT<');
  h = h.replace(/>\ufffd NOTEBOOK OUTPUT</, '>🖥️ NOTEBOOK OUTPUT<');

  // 21. Fix component toolbox
  h = h.replace(/>\ufffd COMPONENTS</, '>🧩 COMPONENTS<');

  // 22. Fix weekly milestone reward icon
  h = h.replace(/><\ufffd<\/div>/, '>🏆</div>');

  // 23. Fix remaining misc garbled chars
  h = h.replace(/\ufffd/g, '⚡');

  // 24. Remove duplicate screen-notebook (lines 675-711 duplicate of 1271-1289)
  // The first one (675-711) is the old version, keep the second one (1271-1289)
  // Actually both exist but serve different purposes. Let me check...
  // Line 675 has id="screen-notebook" AND line 1271 also has id="screen-notebook"
  // This causes duplicate IDs. Remove the first one.
  const firstNotebookStart = h.indexOf('<section id="screen-notebook" class="screen">\n      <h1 class="screen-title neon-text glow-blue">');
  if (firstNotebookStart !== -1) {
    const firstNotebookEnd = h.indexOf('</section>', firstNotebookStart) + '</section>'.length;
    const secondNotebook = h.indexOf('<section id="screen-notebook"', firstNotebookEnd);
    if (secondNotebook !== -1) {
      // Remove the first one
      h = h.substring(0, firstNotebookStart) + h.substring(firstNotebookEnd);
    }
  }

  // 25. Fix challenge modal - add 'hidden' class so it doesn't show on load
  h = h.replace(
    '<div id="challenge-modal" class="modal-overlay">',
    '<div id="challenge-modal" class="modal-overlay hidden">'
  );

  fs.writeFileSync('d:/SkillQuest/SkillQuest-app/index.html', h, 'utf8');
  console.log('✅ HTML fixed');
}

function fixJS() {
  let j = fs.readFileSync('d:/SkillQuest/SkillQuest-app/js/app.js', 'utf8');

  // 1. Fix broken image paths
  j = j.replace("'../codeing world/Nova in game guide.jpeg'", "'../codeing world/Nova in game guied.jpeg'");
  j = j.replace("'../codeing world/juhi in game guide.png'", "'../codeing world/juhi in game guied.png'");
  j = j.replace("'../design world/The UX Forge level.jpeg'", "'../design world/Interaction City level.jpeg'");
  j = j.replace("'../design world/Chaos Canvas Arena.jpeg'", "'../design world/Design Arena level.jpeg'");

  // 2. Fix STATE.playerName vs STATE.projectName inconsistency
  j = j.replace(/STATE\.playerName/g, 'STATE.projectName');

  // 3. Fix boss feedback - wrong quotes (single instead of backticks)
  j = j.replace(
    "if (feedback) feedback.textContent = '> Hit! Boss took ${damage} damage!';",
    "if (feedback) feedback.textContent = `>_ Hit! Boss took ${damage} damage!`;"
  );

  // 4. Fix claimQuestReward wrong element IDs
  j = j.replace(
    "const claimBtn = document.getElementById(`claim-${type}`);",
    "const claimBtn = document.getElementById(`btn-claim-${type}`);"
  );
  j = j.replace(
    "const card = document.getElementById(`quest-${type}`);",
    "const card = document.getElementById(`mission-${type}`);"
  );
  // Make card null-safe
  j = j.replace(
    "const card = document.getElementById(`mission-${type}`);\n  const check = card.querySelector('.status-check');",
    "const card = document.getElementById(`mission-${type}`);\n  const check = card ? card.querySelector('.mission-complete-check') : null;"
  );

  // 5. Add missing saveGameState function
  if (!j.includes('function saveGameState()')) {
    j += `
// ============================================================
//  PERSISTENCE (localStorage)
// ============================================================
function saveGameState() {
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
      accuracy: STATE.accuracyTracker
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
  } catch(e) { console.warn('Load failed:', e); }
}
`;
  }

  // 6. Add missing spawnXPPopup function
  if (!j.includes('function spawnXPPopup(')) {
    j += `
function spawnXPPopup(amount) {
  triggerXPFloating(amount);
}
`;
  }

  // 7. Fix startMission quiz route - should go to quiz-hub not screen-quiz
  j = j.replace(
    "quiz:   { screen: 'screen-quiz', line: \"Logic Mastery trial selected. Calibrating quiz parameters.\" }",
    "quiz:   { screen: 'screen-quiz-hub', line: \"Logic Mastery trial selected. Calibrating quiz parameters.\" }"
  );

  // 8. Fix dashboard scroll - ensure screen-dashboard allows scrolling
  j = j.replace(
    "case 'screen-dashboard':\n      // Ensure dashboard starts at top when entered\n      const dashEl = document.getElementById('screen-dashboard');\n      if (dashEl) dashEl.scrollTop = 0;",
    "case 'screen-dashboard': {\n      // Ensure dashboard starts at top when entered\n      const dashEl = document.getElementById('screen-dashboard');\n      if (dashEl) dashEl.scrollTop = 0;"
  );

  // 9. Fix corrupted emoji in JS strings
  j = j.replace(/=%/g, '🔥');
  j = j.replace(/=\u0012/g, '🔒');
  j = j.replace(/\u0000\u0000/g, '⚡');

  // 10. Fix null bytes in comments
  j = j.replace(/\r\n/g, '\n');

  fs.writeFileSync('d:/SkillQuest/SkillQuest-app/js/app.js', j, 'utf8');
  console.log('✅ JS fixed');
}

function fixCSS() {
  let c = fs.readFileSync('d:/SkillQuest/SkillQuest-app/css/style.css', 'utf8');

  // 1. Add missing --ease-out variable
  c = c.replace(
    '--transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);',
    '--transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);\n  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);'
  );

  // 2. Add missing --darker variable
  if (!c.includes('--darker:')) {
    c = c.replace(
      '--ease-out: cubic-bezier(0.16, 1, 0.3, 1);',
      '--ease-out: cubic-bezier(0.16, 1, 0.3, 1);\n  --darker: #020210;'
    );
  }

  // 3. Fix dashboard overflow for scrolling
  if (!c.includes('#screen-dashboard { overflow-y: auto;')) {
    c += `
/* Dashboard scroll fix */
#screen-dashboard { overflow-y: auto; }

/* Challenge modal hidden state */
.modal-overlay.hidden { display: none; }
.modal-overlay.active { display: flex; }
`;
  }

  fs.writeFileSync('d:/SkillQuest/SkillQuest-app/css/style.css', c, 'utf8');
  console.log('✅ CSS fixed');
}

// Run all fixes
fixHTML();
fixJS();
fixCSS();
console.log('\\n🎉 All fixes applied!');
