/* ============================================================
   SkillQuest — AI ASSISTANT + PERSONALIZED MISSIONS
   js/aiAssistant.js

   Features:
   - Feature 4: Real AI assistant (OpenAI API + rich fallback)
   - Feature 5: AI personalized missions based on player data
   ============================================================ */

'use strict';

// ============================================================
//  AI FALLBACK KNOWLEDGE BASE
//  Used when OpenAI API is unavailable or no key set
// ============================================================
const AI_KNOWLEDGE = {
  // Topic explanations
  topics: {
    'variable':    'Variables are named containers for data. Use <const> for fixed values, <let> for changing ones. Example: const name = "Knight"; let xp = 0;',
    'let':         'let declares a block-scoped variable that can be reassigned. It is NOT hoisted like var. Use it when a value will change.',
    'const':       'const declares a block-scoped constant. You cannot reassign it, but you CAN mutate objects/arrays it holds. Use it by default.',
    'function':    'Functions are reusable blocks of code. Declaration: function add(a,b){return a+b}. Arrow: const add = (a,b) => a+b. Both are callable with add(2,3).',
    'arrow':       'Arrow functions use => syntax: const double = n => n*2. They inherit the outer <this>, unlike regular functions. Great for callbacks.',
    'array':       'Arrays store ordered lists. Key methods: .map() transforms, .filter() selects, .reduce() accumulates, .find() locates, .forEach() iterates.',
    'object':      'Objects are key-value stores. Access with obj.key or obj["key"]. Destructure with: const {name, age} = person;',
    'promise':     'Promises represent future values. Chain: fetch(url).then(r => r.json()).catch(err => console.error(err)). States: pending, fulfilled, rejected.',
    'async':       'async/await makes async code readable. Mark a function async, then await Promises inside it. Always wrap in try/catch for error handling.',
    'class':       'Classes are blueprints for objects. class Knight { constructor(name){ this.name = name; } attack(){ return this.name + " strikes!"; } }',
    'closure':     'A closure is a function that remembers its outer scope. Example: function counter(){ let n=0; return () => ++n; } — the inner fn closes over n.',
    'event':       'DOM events fire when users interact. Add listeners: element.addEventListener("click", handler). Remove them to prevent memory leaks.',
    'fetch':       'Fetch makes HTTP requests. const data = await fetch(url).then(r => r.json()); Always handle errors with .catch() or try/catch.',
    'loop':        'Loops iterate over data. for(let i=0; i<n; i++) for counting, for...of for iterables, for...in for object keys, .forEach() for arrays.',
    'recursion':   'Recursion is a function calling itself. Always needs a base case to stop. Example: function fact(n){ return n<=1 ? 1 : n * fact(n-1); }',
    'scope':       'Scope defines where variables live. Global scope = everywhere. Function scope = inside that function. Block scope = inside {} with let/const.',
    'hoisting':    'var declarations and function declarations are moved to the top of their scope at parse time. let/const are NOT hoisted (temporal dead zone).',
    'prototype':   'Every JS object has a prototype chain. Arrays get .map() from Array.prototype. You can extend built-ins (but don\'t in production code).',
    'dom':         'The DOM is the live representation of your HTML. Access elements with getElementById, querySelector. Modify with el.textContent, el.style, el.classList.',
    'event loop':  'JS is single-threaded. The event loop checks the call stack and callback queue. Async ops (setTimeout, fetch) go to Web APIs, then the queue.',
    'map':         '.map() creates a NEW array by transforming each element. [1,2,3].map(n => n*2) → [2,4,6]. It never mutates the original.',
    'filter':      '.filter() creates a NEW array with elements where callback returns true. [1,2,3,4].filter(n => n>2) → [3,4].',
    'reduce':      '.reduce(fn, init) accumulates array to single value. [1,2,3].reduce((acc,n) => acc+n, 0) → 6.'
  },

  // Hint responses per screen context
  hints: {
    'screen-training': [
      'Read all the concept cards before taking the quiz — the answers are in there!',
      'Mark the lesson complete to earn +10 XP, then tackle the quiz for up to +20 XP.',
      'Take notes mentally: what does each concept DO? How does it differ from others?'
    ],
    'screen-quiz': [
      'Eliminate obviously wrong answers first. Usually 2 can be ruled out quickly.',
      'If stuck, think about what you just read in the lesson. Trust your memory.',
      'Every wrong answer costs HP. Stay calm and read ALL options before clicking.'
    ],
    'screen-coding': [
      'Read the expected output first, then work backwards to the function signature.',
      'Test with simple inputs first. If the logic works for 1 case, generalize it.',
      'Use console.log() to debug — run first to see what your code outputs, then adjust.'
    ],
    'screen-dashboard': [
      'Complete all 3 daily missions to maximize your XP intake today.',
      'The coding challenge gives the most XP (+50). Prioritize it!',
      'A consistent streak multiplies your learning speed. Log in every day.'
    ],
    'default': [
      'Break the problem into smaller parts. Solve each part independently.',
      'If you\'re stuck, take a 5-minute break. Your brain works on problems in the background.',
      'Refer back to the lesson concepts. The answer is usually simpler than it seems.'
    ]
  },

  // Mission generators
  missionTemplates: {
    lowQuiz:       (avg) => `⚠️ Quiz average: ${avg}%. Mission: Complete 2 quizzes and score above 80%.`,
    lowChallenge:  (n)   => `⚠️ Only ${n} challenge${n===1?'':'s'} solved. Mission: Solve 1 coding challenge today.`,
    noLesson:             ()    => `📖 No lessons completed yet. Mission: Finish your first JavaScript lesson.`,
    streakRisk:    (n)   => `🔥 Streak: ${n} day${n===1?'':'s'}. Mission: Log in for 7 consecutive days.`,
    levelUp:       (l)   => `⬆️ You're Level ${l}. Mission: Earn ${(l+1)*100 - STATE.xp} more XP to reach Level ${l+1}.`,
    allGood:             ()    => `✅ On track! Mission: Explore the next world map zone.`
  }
};

// ============================================================
//  OPENAI API INTEGRATION
// ============================================================
const AIAssistant = {
  _apiKey: null,
  _isThinking: false,

  getApiKey() {
    if (this._apiKey) return this._apiKey;
    // Check PROGRESS store
    const p = PROGRESS.get();
    if (p.aiApiKey) { this._apiKey = p.aiApiKey; return this._apiKey; }
    return null;
  },

  setApiKey(key) {
    this._apiKey = key;
    PROGRESS.update(p => { p.aiApiKey = key; });
  },

  /**
   * Main entry point — called when user presses Enter in the guide AI input
   */
  async handleInput(message) {
    if (!message.trim() || this._isThinking) return;
    this._isThinking = true;

    const inputEl = document.getElementById('guide-ai-input');
    if (inputEl) { inputEl.value = ''; inputEl.placeholder = 'Thinking...'; }

    // Show thinking indicator
    speak('Processing your query...');

    try {
      const apiKey = this.getApiKey();
      let response;

      if (apiKey) {
        response = await this._callOpenAI(message, apiKey);
      } else {
        response = this._getFallback(message);
      }

      speak(response, 8000);
    } catch(err) {
      console.warn('[AI] Error:', err);
      speak(this._getFallback(message), 8000);
    } finally {
      this._isThinking = false;
      if (inputEl) inputEl.placeholder = 'Ask AI Assistant...';
    }
  },

  async _callOpenAI(message, apiKey) {
    const systemPrompt = this._buildSystemPrompt();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: message }
        ]
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || this._getFallback(message);
  },

  _buildSystemPrompt() {
    const guide  = GUIDES[STATE.guide] || GUIDES.nova;
    const p      = PROGRESS.get();
    const summary = `Player: Level ${STATE.level}, XP ${STATE.xp}, Streak ${STATE.streak}, Lessons: ${p.completedLessons.length}, Challenges: ${p.challengesSolved.length}.`;

    const personas = {
      nova:  'You are Nova, a cold analytical AI guide. Be concise, data-driven, and precise. No emojis. Max 2 sentences.',
      juhi:  'You are Juhi, an enthusiastic friendly guide. Be warm, encouraging, and fun. Use 1-2 emojis. Max 2 sentences.'
    };

    return `${personas[STATE.guide] || personas.nova} This is a gamified coding learning app. ${summary} Answer the user's question about programming. Keep it short, clear, and actionable.`;
  },

  /**
   * Smart fallback — works entirely offline
   */
  _getFallback(message) {
    const lower = message.toLowerCase();

    // "Explain X" pattern
    if (lower.startsWith('explain') || lower.startsWith('what is') || lower.startsWith('what are')) {
      const topic = lower.replace(/^(explain|what is|what are)\s+/, '').trim();
      for (const [key, explanation] of Object.entries(AI_KNOWLEDGE.topics)) {
        if (topic.includes(key) || key.includes(topic.split(' ')[0])) {
          return this._tonify(explanation.replace(/</g, '`').replace(/>/g, '`'));
        }
      }
      return this._tonify(`I don't have specific data on "${topic}" yet. Try searching MDN Docs at developer.mozilla.org — the most accurate JS reference available.`);
    }

    // "Give hint" pattern
    if (lower.includes('hint') || lower.includes('help') || lower.includes('stuck')) {
      const ctx    = STATE.currentScreen || 'default';
      const hints  = AI_KNOWLEDGE.hints[ctx] || AI_KNOWLEDGE.hints.default;
      return this._tonify(hints[Math.floor(Math.random() * hints.length)]);
    }

    // "Generate mission" pattern
    if (lower.includes('mission') || lower.includes('generate') || lower.includes('task')) {
      return generatePersonalizedMission(true);
    }

    // "How do I" pattern
    if (lower.includes('how do i') || lower.includes('how to')) {
      const subject = lower.replace(/how (do i|to)\s+/, '').trim();
      return this._tonify(`To ${subject}: break it into steps. Define what you want as output, then work backwards to write the function. Test with simple inputs first.`);
    }

    // General programming question detection
    for (const [key, explanation] of Object.entries(AI_KNOWLEDGE.topics)) {
      if (lower.includes(key)) {
        return this._tonify(explanation.replace(/</g, '`').replace(/>/g, '`'));
      }
    }

    // Default fallback
    const defaults = {
      nova:  'Query unclear. Specify the exact function, concept, or error you need analyzed.',
      juhi:  'Hmm, I need a bit more detail! Try asking "Explain promises" or "Give hint" 😊'
    };
    return defaults[STATE.guide] || defaults.nova;
  },

  /**
   * Apply guide persona tone to any message
   */
  _tonify(msg) {
    const prefixes = {
      nova:  ['Analysis: ', 'Data: ', 'Protocol: ', ''],
      juhi:  ['Oh! ', 'Great question! ', '']
    };
    const pool = prefixes[STATE.guide] || [''];
    return pool[Math.floor(Math.random() * pool.length)] + msg;
  }
};

// ============================================================
//  FEATURE 5: PERSONALIZED MISSIONS
// ============================================================
function generatePersonalizedMission(returnOnly = false) {
  const p       = PROGRESS.get();
  const summary = {
    lessons:    p.completedLessons.length,
    challenges: p.challengesSolved.length,
    avgQuiz:    _avgQuizScore(p.quizScores),
    streak:     p.streak || STATE.streak
  };

  let mission;
  const tpl = AI_KNOWLEDGE.missionTemplates;

  if (summary.lessons === 0) {
    mission = tpl.noLesson();
  } else if (summary.avgQuiz < 60 && Object.keys(p.quizScores).length > 0) {
    mission = tpl.lowQuiz(summary.avgQuiz);
  } else if (summary.challenges === 0) {
    mission = tpl.lowChallenge(summary.challenges);
  } else if (summary.streak < 3) {
    mission = tpl.streakRisk(summary.streak);
  } else if (STATE.xp < STATE.xpMax * 0.5) {
    mission = tpl.levelUp(STATE.level);
  } else {
    mission = tpl.allGood();
  }

  if (returnOnly) return mission;

  // Render into dashboard AI mission card
  _renderAIMission(mission);

  return mission;
}

function _avgQuizScore(scores) {
  const vals = Object.values(scores || {});
  if (!vals.length) return 100; // No data = not applicable
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function _renderAIMission(missionText) {
  // Find or create the AI mission display element
  let el = document.getElementById('ai-mission-display');
  if (!el) {
    // Try to inject into the dashboard's AI insight area
    const parent = document.getElementById('ai-insight-text')?.closest('.glass-panel');
    if (parent) {
      el = document.createElement('div');
      el.id = 'ai-mission-display';
      el.style.cssText = `
        margin-top: 0.8rem;
        padding: 0.8rem 1rem;
        background: rgba(157,0,255,0.08);
        border: 1px solid rgba(157,0,255,0.3);
        border-radius: 8px;
        font-size: 0.82rem;
        line-height: 1.55;
        color: rgba(255,255,255,0.85);
        font-family: var(--font-mono);
      `;
      parent.appendChild(el);
    }
  }

  if (!el) return;

  // Typewriter effect
  el.textContent = '';
  let i = 0;
  const speed = 20;
  const label = '🤖 AI MISSION: ';
  const full = label + missionText;

  const type = () => {
    if (i < full.length) {
      el.textContent += full.charAt(i++);
      setTimeout(type, speed);
    }
  };
  type();
}

// ============================================================
//  API KEY SETUP UI
// ============================================================
function promptAIApiKey() {
  // Show a clean inline prompt
  const guideEl = document.getElementById('global-guide');
  if (!guideEl) return;

  const existingPrompt = document.getElementById('ai-key-prompt');
  if (existingPrompt) { existingPrompt.remove(); return; }

  const prompt = document.createElement('div');
  prompt.id = 'ai-key-prompt';
  prompt.style.cssText = `
    position: fixed; bottom: 120px; right: 20px;
    background: rgba(6,6,20,0.97);
    border: 1px solid rgba(0,240,255,0.4);
    border-radius: 12px;
    padding: 1.2rem 1.5rem;
    z-index: 9999;
    min-width: 300px;
    box-shadow: 0 0 30px rgba(0,240,255,0.1);
    font-family: var(--font-mono);
  `;
  prompt.innerHTML = `
    <div style="font-size:0.7rem; color:var(--neon-blue); letter-spacing:2px; margin-bottom:0.8rem;">🤖 AI ASSISTANT SETUP</div>
    <p style="font-size:0.8rem; opacity:0.7; margin-bottom:0.8rem;">Enter your OpenAI API key to enable real AI responses. Leave blank to use offline mode.</p>
    <input id="ai-key-input" type="password" placeholder="sk-..." style="
      width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(0,240,255,0.3);
      border-radius:4px; padding:0.6rem; color:#fff; font-family:var(--font-mono);
      font-size:0.8rem; outline:none; box-sizing:border-box; margin-bottom:0.8rem;
    ">
    <div style="display:flex; gap:0.5rem;">
      <button class="game-btn btn-blue" style="flex:1; font-size:0.75rem;" onclick="saveAIKey()">SAVE KEY</button>
      <button class="game-btn btn-hollow" style="flex:1; font-size:0.75rem;" onclick="document.getElementById('ai-key-prompt').remove()">USE OFFLINE</button>
    </div>
    <div style="margin-top:0.6rem; font-size:0.65rem; opacity:0.4;">Key stored in localStorage, never sent anywhere else.</div>
  `;
  document.body.appendChild(prompt);
  document.getElementById('ai-key-input').focus();
}

function saveAIKey() {
  const key = document.getElementById('ai-key-input')?.value?.trim();
  if (key) {
    AIAssistant.setApiKey(key);
    speak('API key saved. Real-time AI responses now active.');
  } else {
    speak('Continuing in offline mode. All AI responses will use built-in templates.');
  }
  document.getElementById('ai-key-prompt')?.remove();
}

// ============================================================
//  WIRE UP THE GUIDE AI INPUT BOX
// ============================================================
function initAIAssistant() {
  const input = document.getElementById('guide-ai-input');
  if (!input) return;

  // Override the existing handleGuideAI
  window.handleGuideAI = async function(e) {
    if (e.key === 'Enter') {
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      await AIAssistant.handleInput(msg);
    }
  };

  // Override makeAIHarder to generate a personalized mission instead
  window.makeAIHarder = function() {
    const mission = generatePersonalizedMission(true);
    speak(mission, 8000);
    _renderAIMission(mission);
    triggerScreenShake();
    showGuideMessage('🤖 AI Mission updated based on your current performance data.');
  };

  // Show API key setup option in input placeholder
  input.addEventListener('focus', () => {
    if (!AIAssistant.getApiKey() && !localStorage.getItem('sq_key_dismissed')) {
      // First focus — offer key setup
      input.placeholder = 'Try: "explain closures", "give hint", "generate mission"';
    }
  });

  // Keyboard shortcut: Ctrl+K to set API key
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      promptAIApiKey();
    }
  });

  // Auto-generate personalized mission when loading dashboard
  const _origScreenEnter = window.onScreenEnter;
  // (already patched by progression.js — we add AI mission refresh here)
  const _extendedEnter = window.onScreenEnter;
  window.onScreenEnter = function(screenId) {
    _extendedEnter(screenId);
    if (screenId === 'screen-dashboard') {
      setTimeout(() => generatePersonalizedMission(), 800);
    }
  };

  console.log('[AI] Assistant ready. Ctrl+K to configure API key.');
}

document.addEventListener('DOMContentLoaded', initAIAssistant);
