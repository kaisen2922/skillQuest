/* ============================================================
   SkillQuest — LEARNING MODULE SYSTEM
   js/learning.js

   Features:
   - Feature 1:  JavaScript Track (5 lessons + quizzes + challenges)
   - Feature 3:  Daily Challenge System (date-gated, 3 attempts)
   - Feature 9:  World Map Node click → real lesson/challenge flow
   - Feature 10: Skill Tree progressive unlock
   ============================================================ */

'use strict';

// ============================================================
//  JAVASCRIPT TRACK DATA (5 Full Lessons)
// ============================================================
const JS_TRACK = {

  beginner: {
    id: 'beginner',
    nodeId: 'beginner',
    title: 'Variable Village',
    subtitle: 'Chapter 1 — The Foundation of Every Program',
    videoUrl: 'https://www.youtube.com/embed/edlFjlzxkSI?controls=1&modestbranding=1',
    concepts: [
      {
        icon: 'ph-fill ph-code',
        title: 'var, let, const',
        body: 'Use <code>const</code> for values that never change, <code>let</code> for variables that will be reassigned, and avoid <code>var</code> in modern JS — it has confusing scope rules.'
      },
      {
        icon: 'ph-fill ph-number-square-one',
        title: 'Primitive Types',
        body: 'JavaScript has 7 primitives: <code>string</code>, <code>number</code>, <code>bigint</code>, <code>boolean</code>, <code>undefined</code>, <code>symbol</code>, and <code>null</code>.'
      },
      {
        icon: 'ph-fill ph-arrows-left-right',
        title: 'Type Coercion',
        body: '<code>"5" + 3</code> gives <code>"53"</code> but <code>"5" - 3</code> gives <code>2</code>. Always use <code>===</code> for strict equality to avoid surprises.'
      },
      {
        icon: 'ph-fill ph-terminal',
        title: 'Template Literals',
        body: 'Use backticks: <code>`Hello ${name}!`</code> instead of concatenation for cleaner, more readable strings.'
      }
    ],
    quiz: [
      { type: 'mcq', q: 'Which keyword declares a variable that CANNOT be reassigned?', options: ['var', 'let', 'const', 'def'], correct: 2 },
      { type: 'boolean', q: 'Is "5" === 5 in JavaScript?', options: ['True', 'False'], correct: 1 },
      { type: 'input', q: 'What keyword is used for modern variable reassignment (instead of var)?', correct: 'let' },
      { type: 'mcq', q: 'What is the output of: typeof null?', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correct: 1 },
      { type: 'mcq', q: 'Which of these is a valid template literal?', options: ['"Hello ${name}"', '\'Hello ${name}\'', '`Hello ${name}`', 'Hello + ${name}'], correct: 2 }
    ],
    challenge: {
      title: 'Variable Vault',
      description: 'Create a function <code>greetUser(name, age)</code> that returns a string: <code>"Hello, [name]! You are [age] years old."</code> using a template literal.',
      starterCode: '// Write your greetUser function here\nfunction greetUser(name, age) {\n  // your code here\n}',
      hint: 'Use backticks and ${} to create the string: `Hello, ${name}! You are ${age} years old.`',
      validate: (code) => {
        try {
          const fn = new Function(`${code}\nreturn greetUser('Alex', 25);`);
          return fn() === 'Hello, Alex! You are 25 years old.';
        } catch { return false; }
      },
      expected: 'greetUser("Alex", 25) → "Hello, Alex! You are 25 years old."'
    }
  },

  forest: {
    id: 'forest',
    nodeId: 'forest',
    title: 'Syntax Grove',
    subtitle: 'Chapter 2 — Reusable Code Blocks',
    videoUrl: 'https://www.youtube.com/embed/gigtS_5KFwc?controls=1&modestbranding=1',
    concepts: [
      {
        icon: 'ph-fill ph-function',
        title: 'Function Declaration vs Expression',
        body: 'Declarations are hoisted (<code>function add(){}</code>). Expressions are not (<code>const add = function(){}</code>). Arrow functions (<code>const add = () => {}</code>) also are not hoisted.'
      },
      {
        icon: 'ph-fill ph-arrow-right',
        title: 'Arrow Functions',
        body: 'Arrow functions have no own <code>this</code>. Single-expression returns can omit braces and <code>return</code>: <code>const double = n => n * 2</code>.'
      },
      {
        icon: 'ph-fill ph-stack',
        title: 'Default Parameters',
        body: '<code>function greet(name = "World") {}</code> — if no argument is passed, <code>name</code> defaults to <code>"World"</code>.'
      },
      {
        icon: 'ph-fill ph-arrows-in',
        title: 'Rest & Spread',
        body: '<code>function sum(...nums)</code> collects args into an array. The spread <code>...</code> expands arrays: <code>Math.max(...[1,2,3])</code>.'
      }
    ],
    quiz: [
      { type: 'boolean', q: 'Arrow functions have their own `this` binding?', options: ['True', 'False'], correct: 1 },
      { type: 'mcq', q: 'What does this return: (x => x * 2)(5)?', options: ['5', '10', 'error', 'undefined'], correct: 1 },
      { type: 'input', q: 'What operator is used to expand an array into individual elements?', correct: 'spread' },
      { type: 'mcq', q: 'Which is a valid default parameter?', options: ['function f(x = 0){}', 'function f(x : 0){}', 'function f(x || 0){}', 'function f(x default 0){}'], correct: 0 },
      { type: 'boolean', q: 'Function declarations are hoisted?', options: ['True', 'False'], correct: 0 }
    ],
    challenge: {
      title: 'Arrow Arsenal',
      description: 'Write an arrow function <code>multiply(a, b)</code> that returns <code>a * b</code>, and a <code>square(n)</code> arrow function using <code>multiply</code>.',
      starterCode: '// Arrow functions\nconst multiply = (a, b) => {\n  // your code here\n};\n\nconst square = (n) => {\n  // Use multiply here\n};',
      hint: 'square(n) should call multiply(n, n)',
      validate: (code) => {
        try {
          const fn = new Function(`${code}\nreturn multiply(3,4) === 12 && square(5) === 25;`);
          return fn() === true;
        } catch { return false; }
      },
      expected: 'multiply(3,4) → 12, square(5) → 25'
    }
  },

  city: {
    id: 'city',
    nodeId: 'city',
    title: 'Logic Plaza',
    subtitle: 'Chapter 3 — Data Structures of the Kingdom',
    videoUrl: 'https://www.youtube.com/embed/0ITmMFGKdFA?controls=1&modestbranding=1',
    concepts: [
      {
        icon: 'ph-fill ph-list-bullets',
        title: 'Array Methods',
        body: '<code>map()</code> transforms, <code>filter()</code> selects, <code>reduce()</code> accumulates. These are your most powerful tools for working with lists.'
      },
      {
        icon: 'ph-fill ph-brackets-curly',
        title: 'Object Literals',
        body: 'Objects store key-value pairs. Use <code>obj.key</code> or <code>obj["key"]</code>. Shorthand: <code>const x = 1; const obj = {x};</code> instead of <code>{x: x}</code>.'
      },
      {
        icon: 'ph-fill ph-arrows-split',
        title: 'Destructuring',
        body: '<code>const {name, age} = person;</code> and <code>const [first, ...rest] = array;</code> — extract values cleanly without repeated access.'
      },
      {
        icon: 'ph-fill ph-copy',
        title: 'Spread & Object Merge',
        body: '<code>const merged = {...obj1, ...obj2};</code> creates a shallow copy merged object. Arrays: <code>[...arr1, ...arr2]</code>.'
      }
    ],
    quiz: [
      { type: 'mcq', q: 'Which method creates a new array with transformed elements?', options: ['filter()', 'map()', 'find()', 'forEach()'], correct: 1 },
      { type: 'input', q: 'What method is used to keep only elements that pass a certain test?', correct: 'filter' },
      { type: 'mcq', q: 'const {x} = {x: 5, y: 10} — what is x?', options: ['undefined', '{x: 5}', '5', 'error'], correct: 2 },
      { type: 'boolean', q: 'The spread operator (...) creates a deep copy of an object?', options: ['True', 'False'], correct: 1 },
      { type: 'input', q: 'What array method reduces an array to a single value?', correct: 'reduce' }
    ],
    challenge: {
      title: 'Data Dungeon',
      description: 'Write a function <code>getTopScorers(players, n)</code> that takes an array of <code>{name, score}</code> objects and returns the names of the top <code>n</code> scorers sorted by score descending.',
      starterCode: '// players = [{name: "Alice", score: 90}, ...]\nfunction getTopScorers(players, n) {\n  // Sort by score, take top n, return names\n}',
      hint: 'Try: players.sort((a,b) => b.score - a.score).slice(0, n).map(p => p.name)',
      validate: (code) => {
        try {
          const fn = new Function(`${code}
            const players = [{name:"Alice",score:90},{name:"Bob",score:70},{name:"Eve",score:95}];
            const result = getTopScorers(players, 2);
            return Array.isArray(result) && result[0]==="Eve" && result[1]==="Alice";
          `);
          return fn() === true;
        } catch { return false; }
      },
      expected: 'getTopScorers([...], 2) → ["Eve", "Alice"]'
    }
  },

  arena: {
    id: 'arena',
    nodeId: 'arena',
    title: 'Boss Citadel',
    subtitle: 'Chapter 4 — Mastering Time & Requests',
    videoUrl: 'https://www.youtube.com/embed/_8gHHBlbziw?controls=1&modestbranding=1',
    concepts: [
      {
        icon: 'ph-fill ph-clock',
        title: 'Event Loop',
        body: 'JS is single-threaded. Async operations (fetch, setTimeout) go to the Web API, then the callback queue, then the call stack — allowing JS to be non-blocking.'
      },
      {
        icon: 'ph-fill ph-seal-check',
        title: 'Promises',
        body: 'A Promise is either pending, fulfilled, or rejected. Chain with <code>.then()</code> and handle errors with <code>.catch()</code>. Always <code>.finally()</code> to clean up.'
      },
      {
        icon: 'ph-fill ph-arrows-clockwise',
        title: 'async / await',
        body: '<code>async</code> functions always return a Promise. <code>await</code> pauses execution until a Promise resolves — making async code look synchronous.'
      },
      {
        icon: 'ph-fill ph-network',
        title: 'Fetch API',
        body: '<code>const data = await fetch(url).then(r => r.json())</code> — the modern way to make HTTP requests without any libraries.'
      }
    ],
    quiz: [
      { type: 'mcq', q: 'What does async before a function guarantee?', options: ['It runs synchronously', 'It always returns a Promise', 'It never throws errors', 'It runs in a worker'], correct: 1 },
      { type: 'boolean', q: 'await can be used in a regular (non-async) function?', options: ['True', 'False'], correct: 1 },
      { type: 'mcq', q: 'What does fetch() return?', options: ['JSON data', 'A string', 'A Promise', 'An XMLHttpRequest'], correct: 2 },
      { type: 'input', q: 'Which Promise method runs whether the promise was resolved or rejected?', correct: 'finally' },
      { type: 'boolean', q: 'Promise.all resolves only if ALL promises resolve?', options: ['True', 'False'], correct: 0 }
    ],
    challenge: {
      title: 'Async Arena',
      description: 'Write a function <code>wait(ms)</code> that returns a Promise that resolves after <code>ms</code> milliseconds. Then write <code>async function delayedGreet(name)</code> that waits 100ms then returns <code>"Hello, " + name</code>.',
      starterCode: '// Implement wait and delayedGreet\nfunction wait(ms) {\n  // Return a Promise\n}\n\nasync function delayedGreet(name) {\n  // await wait(100), then return greeting\n}',
      hint: 'wait(ms) uses: return new Promise(resolve => setTimeout(resolve, ms))',
      validate: (code) => {
        try {
          const fn = new Function(`
            ${code}
            return typeof wait === 'function' && typeof delayedGreet === 'function';
          `);
          return fn() === true;
        } catch { return false; }
      },
      expected: 'wait(100) resolves in 100ms, delayedGreet("Nova") → "Hello, Nova"'
    }
  },

  tech: {
    id: 'tech',
    nodeId: 'tech',
    title: 'Tech City',
    subtitle: 'Chapter 5 — Sets, Maps & Modern Storage',
    videoUrl: 'https://www.youtube.com/embed/hub04J6697s?controls=1&modestbranding=1',
    concepts: [
      {
        icon: 'ph-fill ph-intersect',
        title: 'Sets',
        body: 'A <code>Set</code> is a collection of unique values. Great for removing duplicates from an array: <code>[...new Set(arr)]</code>.'
      },
      {
        icon: 'ph-fill ph-map-trifold',
        title: 'Maps',
        body: 'A <code>Map</code> holds key-value pairs where keys can be ANY type (even objects). They maintain insertion order and are often faster than objects for frequent lookups.'
      },
      {
        icon: 'ph-fill ph-database',
        title: 'localStorage',
        body: 'Store data persistently in the browser. <code>localStorage.setItem("key", "val")</code> — data survives page refreshes!'
      },
      {
        icon: 'ph-fill ph-brackets-square',
        title: 'JSON Processing',
        body: '<code>JSON.stringify()</code> converts objects to strings for storage, <code>JSON.parse()</code> converts them back. Critical for persistence.'
      }
    ],
    quiz: [
      { type: 'mcq', q: 'What is the main property of a Set?', options: ['Ordered keys', 'Unique values', 'Key-value pairs', 'Fixed length'], correct: 1 },
      { type: 'boolean', q: 'A Map key can be an object?', options: ['True', 'False'], correct: 0 },
      { type: 'input', q: 'What method converts a JavaScript object into a JSON string?', correct: 'stringify' },
      { type: 'mcq', q: 'Where does localStorage data get saved?', options: ['The server', 'The browser', 'The OS', 'The RAM'], correct: 1 },
      { type: 'boolean', q: 'JSON.parse() is used to save data to localStorage?', options: ['True', 'False'], correct: 1 }
    ],
    challenge: {
      title: 'Tech Trek',
      description: 'Write a function <code>uniqueCount(arr)</code> that returns the number of unique elements in an array. Then write <code>saveData(key, obj)</code> to save an object to <code>localStorage</code> as a string.',
      starterCode: '// uniqueCount and saveData\nfunction uniqueCount(arr) {\n  // return size of unique set\n}\n\nfunction saveData(key, obj) {\n  // stringify and setItem\n}',
      hint: 'uniqueCount: return new Set(arr).size',
      validate: (code) => {
        try {
          const fn = new Function(`${code}\nreturn uniqueCount([1,2,2,3,3,3]) === 3;`);
          return fn() === true;
        } catch { return false; }
      },
      expected: 'uniqueCount([1,2,2,3,3,3]) → 3, saveData saves JSON'
    }
  }
};

const DESIGN_TRACK = {
  pixel: {
    id: 'pixel',
    nodeId: 'pixel',
    title: 'Logo Design & Branding',
    subtitle: 'Branding — Visual Identity Protocols',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-circles-three-plus', title: 'Iconography', body: 'Symbols should be simple and memorable at any size.' },
      { icon: 'ph-fill ph-palette', title: 'Color Theory', body: 'Use contrasting colors to create visual hierarchy and brand emotion.' }
    ],
    quiz: [
      { q: 'What is the primary goal of a logo?', options: ['Complexity', 'Memorable Identity', 'Using 10 colors', 'Photorealism'], correct: 1 }
    ],
    challenge: {
      instructions: 'Define a <code>brandIdentity</code> object with properties <code>name</code> and <code>primaryColor</code>.',
      starterCode: 'const brandIdentity = {\n  // Add properties here\n};',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn brandIdentity;')();
          return evalCode.name && evalCode.primaryColor;
        } catch { return false; }
      },
      expected: 'brandIdentity { name: "...", primaryColor: "..." }'
    }
  },
  labyrinth: {
    id: 'labyrinth',
    nodeId: 'labyrinth',
    title: 'Wireframing & User Flows',
    subtitle: 'UX Labyrinth — Structural Mechanics',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-layout', title: 'Wireframes', body: 'Low-fidelity blueprints that focus on structure over style.' },
      { icon: 'ph-fill ph-arrow-bend-double-up-right', title: 'User Flows', body: 'Mapping every step a user takes to complete a goal.' }
    ],
    quiz: [
      { q: 'What is a low-fidelity wireframe?', options: ['A final mockup', 'A blueprint of structure', 'A high-res image', 'A code file'], correct: 1 }
    ],
    challenge: {
      instructions: 'Create a <code>userFlow</code> array containing three steps: "Login", "Dashboard", and "Settings".',
      starterCode: 'const userFlow = [];',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn userFlow;')();
          return evalCode.includes('Login') && evalCode.includes('Dashboard') && evalCode.includes('Settings');
        } catch { return false; }
      },
      expected: 'userFlow ["Login", "Dashboard", "Settings"]'
    }
  },
  peaks: {
    id: 'peaks',
    nodeId: 'peaks',
    title: 'UI/UX Principles',
    subtitle: 'Color Peaks — Aesthetic & Experience',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-swatches', title: 'Color Psychology', body: 'Blue evokes trust; Red evokes urgency or energy.' },
      { icon: 'ph-fill ph-text-t', title: 'Typography', body: 'Hierarchy ensures the most important info is read first.' }
    ],
    quiz: [
      { q: 'Which color is often used to signify "Trust" in banking?', options: ['Blue', 'Orange', 'Pink', 'Neon Green'], correct: 0 }
    ],
    challenge: {
      instructions: 'Create a <code>uiHierarchy</code> array with elements: "Heading", "Subheading", "Body Text".',
      starterCode: 'const uiHierarchy = [];',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn uiHierarchy;')();
          return evalCode[0] === 'Heading' && evalCode.length === 3;
        } catch { return false; }
      },
      expected: 'uiHierarchy ["Heading", "Subheading", "Body Text"]'
    }
  },
  research: {
    id: 'research',
    nodeId: 'research',
    title: 'User Research & Personas',
    subtitle: 'Persona Research — Empathy Protocols',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-users-three', title: 'User Personas', body: 'Fictional characters representing different user types.' },
      { icon: 'ph-fill ph-magnifying-glass', title: 'Usability Testing', body: 'Observing real users as they interact with your design.' }
    ],
    quiz: [
      { q: 'Why do we create personas?', options: ['To guess', 'To represent target users', 'To use AI', 'To add art'], correct: 1 }
    ],
    challenge: {
      instructions: 'Create a <code>userPersona</code> object with <code>age</code> (number) and <code>goal</code> (string).',
      starterCode: 'const userPersona = {\n  // Add here\n};',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn userPersona;')();
          return typeof evalCode.age === 'number' && typeof evalCode.goal === 'string';
        } catch { return false; }
      },
      expected: 'userPersona { age: 25, goal: "..." }'
    }
  },
  tech: {
    id: 'tech',
    nodeId: 'tech',
    title: 'Web & App Design',
    subtitle: 'Layout Logic — Responsive Frameworks',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-device-mobile', title: 'Mobile First', body: 'Designing for small screens first, then scaling up.' },
      { icon: 'ph-fill ph-grid-four', title: 'Grid Systems', body: 'Aligning elements to a consistent 12-column or 8pt grid.' }
    ],
    quiz: [
      { q: 'What is "Responsive Design"?', options: ['Fast loading', 'Adapting to screen size', 'A dark theme', 'Using JS'], correct: 1 }
    ],
    challenge: {
      instructions: 'Define a <code>breakPoints</code> object with <code>mobile: 480</code> and <code>desktop: 1024</code>.',
      starterCode: 'const breakPoints = {};',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn breakPoints;')();
          return evalCode.mobile === 480 && evalCode.desktop === 1024;
        } catch { return false; }
      },
      expected: 'breakPoints { mobile: 480, desktop: 1024 }'
    }
  },
  arena: {
    id: 'arena',
    nodeId: 'arena',
    title: 'Prototyping & Posters',
    subtitle: 'Canvas Chaos — Interactive Final Protocol',
    videoUrl: 'https://www.youtube.com/embed/YpXpja6_A3o?controls=1',
    concepts: [
      { icon: 'ph-fill ph-cursor-click', title: 'Interactive Prototypes', body: 'Adding triggers and transitions to simulate the app flow.' },
      { icon: 'ph-fill ph-image', title: 'Poster Layout', body: 'Visual composition for high-impact communication.' }
    ],
    quiz: [
      { q: 'What is a prototype?', options: ['Finished code', 'Interactive simulation', 'A blank page', 'A logo'], correct: 1 }
    ],
    challenge: {
      instructions: 'Create an <code>interactiveState</code> object with <code>hover: true</code> and <code>click: true</code>.',
      starterCode: 'const interactiveState = {};',
      validate: (code) => {
        try {
          const evalCode = new Function(code + '\nreturn interactiveState;')();
          return evalCode.hover === true && evalCode.click === true;
        } catch { return false; }
      },
      expected: 'interactiveState { hover: true, click: true }'
    }
  }
};

// ============================================================
//  PROGRESS STORE (localStorage key: 'sq_progress')
// ============================================================
const PROGRESS = {
  _key: 'sq_progress',

  _defaults() {
    return {
      completedLessons: [],
      quizScores: {},          // { lessonId: highScore }
      challengesSolved: [],
      lastLoginDate: null,
      streak: 0,
      streakFreezes: 2,
      dailyChallenge: {
        lastDate: null,
        attemptsLeft: 3,
        solvedToday: false
      },
      aiApiKey: null,
      skillTree: {
        html: true, css: true, js_basics: true,
        js_advanced: false, algorithms: false, fullstack: false
      },
      subscription: 'free'
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      return raw ? { ...this._defaults(), ...JSON.parse(raw) } : this._defaults();
    } catch { return this._defaults(); }
  },

  save(data) {
    try {
      localStorage.setItem(this._key, JSON.stringify(data));
    } catch(e) { console.warn('[CK] Progress save failed:', e); }
  },

  get() {
    if (!this._cache) this._cache = this.load();
    return this._cache;
  },

  update(fn) {
    const data = this.get();
    fn(data);
    this._cache = data;
    this.save(data);
    return data;
  }
};

// ============================================================
//  LESSON LOADER — populates screen-training dynamically
// ============================================================
function loadJSLesson(lessonId) {
  // Check both tracks
  const lesson = JS_TRACK[lessonId] || DESIGN_TRACK[lessonId];
  if (!lesson) {
    console.error(`[Learning] Lesson ${lessonId} not found in any track.`);
    return;
  }
  
  console.log(`[Learning] Loading ${lessonId} curriculum...`);

  STATE.currentLesson = lessonId;
  const isDesign = !!DESIGN_TRACK[lessonId];
  const trainingScreen = document.getElementById('screen-training');
  
  if (trainingScreen) {
    if (isDesign) trainingScreen.classList.add('design-mode');
    else trainingScreen.classList.remove('design-mode');
  }

  // Update screen title
  const mainHeader = document.getElementById('training-main-header');
  if (mainHeader) {
    mainHeader.textContent = isDesign ? 'DESIGN TRAINING CHAMBER' : 'CODE TRAINING CHAMBER';
  }

  const conceptHeader = document.getElementById('concept-sidebar-header');
  if (conceptHeader) {
    conceptHeader.textContent = isDesign ? 'DESIGN CONCEPTS' : 'DATA PROTOCOLS';
  }

  const title = document.getElementById('lesson-title') || document.querySelector('#screen-training h1');
  if (title) {
    title.innerHTML = `<span class="neon-text ${isDesign ? 'pink-neon' : 'blue-neon'}">${lesson.title}</span>`;
  }

  // Populate iframe
  const iframe = document.getElementById('training-iframe');
  const placeholder = document.getElementById('video-placeholder');
  if (iframe) {
    iframe.src = lesson.videoUrl;
    iframe.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  }

  // Populate concept cards dynamically
  const sidebar = document.querySelector('.concept-sidebar');
  if (sidebar) {
    const header = document.getElementById('concept-sidebar-header');
    sidebar.innerHTML = '';
    if (header) sidebar.appendChild(header);

    if (lesson.concepts) {
      lesson.concepts.forEach((c, idx) => {
        const card = document.createElement('div');
        card.className = `concept-card ${idx === 0 ? 'active-concept' : ''}`;
        card.innerHTML = `
          <h3>${c.icon ? `<i class="${c.icon}"></i> ` : ''}${c.title}</h3>
          <p>${c.body}</p>
        `;
        card.onclick = () => {
          document.querySelectorAll('.concept-card').forEach(el => el.classList.remove('active-concept'));
          card.classList.add('active-concept');
        };
        sidebar.appendChild(card);
      });
    }
  }

  // Hide legacy tabs as we are in a specific level context
  const tabs = document.getElementById('module-tabs');
  if (tabs) tabs.style.display = 'none';

  // Inject/update lesson header
  const padEl = document.querySelector('.lesson-pad');
  if (padEl) {
    const existing = padEl.querySelector('.lesson-header');
    if (existing) {
      existing.innerHTML = `
        <h2 style="font-family:var(--font-display); font-size:1.4rem; margin-bottom:0.4rem; color:var(--neon-blue);">${lesson.title}</h2>
        <p style="opacity:0.6; font-size:0.85rem;">${lesson.subtitle}</p>
      `;
    }
  }

  // Show/update complete button
  const progress = PROGRESS.get();
  const alreadyDone = progress.completedLessons.includes(lessonId);

  _upsertLessonCompleteBtn(lessonId, alreadyDone);

  // AI Guide reacts
  const guide = GUIDES[STATE.guide];
  if (guide) {
    const isDesign = !!DESIGN_TRACK[lessonId];
    const msg = isDesign ? (guide.lines.dwEntry?.[0] || guide.lines.training) : guide.lines.training;
    showGuideMessage(msg);
  }
}

function _upsertLessonCompleteBtn(lessonId, alreadyDone) {
  const container = document.querySelector('.lesson-pad') || document.getElementById('screen-training');
  if (!container) return;

  let btn = document.getElementById('btn-lesson-complete');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-lesson-complete';
    btn.className = 'game-btn btn-green btn-large';
    btn.style.cssText = 'margin-top:1.5rem; width:100%;';
    container.appendChild(btn);
  }

  if (alreadyDone) {
    btn.innerHTML = '✅ Lesson Complete — Replay Quiz?';
    btn.onclick = () => loadJSQuiz(lessonId);
    btn.style.background = 'rgba(0,255,136,0.1)';
    btn.style.borderColor = 'var(--neon-green)';
  } else {
    btn.innerHTML = '⚡ Mark Lesson Complete (+10 XP)';
    btn.onclick = () => completeJSLesson(lessonId);
    btn.style.background = '';
    btn.style.borderColor = '';
  }
}

function completeJSLesson(lessonId) {
  const btn = document.getElementById('btn-lesson-complete');
  if (btn) { btn.disabled = true; btn.innerHTML = 'LESSON COMPLETE ✅'; }

  PROGRESS.update(p => {
    if (!p.completedLessons.includes(lessonId)) {
      p.completedLessons.push(lessonId);
    }
  });

  gainXP(10, 'syntax', btn);
  completeTask('lesson', 50);

  // Badge check
  if (typeof GFX_Badges !== 'undefined') {
    const p = PROGRESS.get();
    if (p.completedLessons.length === 1) GFX_Badges.unlock('first_mission');
    if (p.completedLessons.length >= Object.keys(JS_TRACK).length) GFX_Badges.unlock('all_missions');
  }

  speak(`Lesson logged. Proceeding to the assessment phase, Knight.`);

  setTimeout(() => {
    if (btn) btn.innerHTML = '▶ Start Quiz Now';
    if (btn) btn.onclick = () => loadJSQuiz(lessonId);
    if (btn) btn.disabled = false;
  }, 2000);
}

/**
 * SMART ROUTER: Navigates to either Code Challenge or Design Challenge
 */
function navigateToChallenge() {
  const lessonId = STATE.currentLesson;
  if (!lessonId) return navigateTo('screen-map');
  loadJSChallenge(lessonId);
}

// ============================================================
//  QUIZ LOADER — populates screen-quiz with lesson questions
// ============================================================
let _quizSession = { lessonId: null, questions: [], index: 0, score: 0 };

function loadJSQuiz(lessonId) {
  const lesson = JS_TRACK[lessonId] || DESIGN_TRACK[lessonId];
  if (!lesson) {
    console.error(`[Learning] Quiz data not found for: ${lessonId}`);
    return;
  }

  _quizSession  = { lessonId, questions: lesson.quiz, index: 0, score: 0 };
  window.QUIZ_QUESTIONS = lesson.quiz.map(q => ({
    q: q.q,
    options: q.options.map((o, i) => `${String.fromCharCode(65+i)}) ${o}`),
    correct: q.correct
  }));

  navigateTo('screen-quiz');

  setTimeout(() => {
    resetQuiz();
    const header = document.querySelector('#screen-quiz .screen-title');
    if (header) header.textContent = `⚡ ${lesson.title} Quiz`;
  }, 400);

  // Hook nextQuestion completion to route to challenge
  _patchQuizCompletion(lessonId);
}

function _patchQuizCompletion(lessonId) {
  // Override nextQuestion to detect quiz end and award correct XP
  const _origNext = window.nextQuestion;
  window.nextQuestion = function() {
    currentQuestion++;
    if (currentQuestion >= QUIZ_QUESTIONS.length) {
      const score = questionsAnswered > 0
        ? Math.round((window._quizCorrect || 0) / QUIZ_QUESTIONS.length * 100)
        : 50;
      _finalizeJSQuiz(lessonId, score);
      window.nextQuestion = _origNext; // Restore
      return;
    }
    loadQuestion(currentQuestion);
  };
}

function _finalizeJSQuiz(lessonId, score) {
  const xpEarned = Math.round((score / 100) * 20);

  PROGRESS.update(p => {
    if (!p.quizScores[lessonId] || p.quizScores[lessonId] < score) {
      p.quizScores[lessonId] = score;
    }
  });

  gainXP(Math.max(5, xpEarned), 'logic');
  completeTask('quiz', 70);

  if (typeof GFX_AI !== 'undefined') GFX_AI.react(score >= 80 ? 'correct' : 'wrong');

  const msg = score >= 80
    ? `Quiz complete! ${score}% accuracy — excellent. +${xpEarned} XP earned.`
    : `Quiz complete. ${score}% — Study the material and retry for higher rewards.`;

  showGuideMessage(msg);

  // Personalized mission update
  if (typeof generatePersonalizedMission === 'function') generatePersonalizedMission();

  setTimeout(() => {
    showGuideMessage(`Moving to the coding challenge for this module...`);
    setTimeout(() => loadJSChallenge(lessonId), 1500);
  }, 2000);
}

// ============================================================
//  CHALLENGE LOADER — populates screen-coding with lesson challenge
// ============================================================
function loadJSChallenge(lessonId) {
  // Check if it is a design world lesson
  const isDesign = !!DESIGN_TRACK[lessonId];
  
  if (isDesign) {
    if (typeof loadDesignChallenge === 'function') {
      loadDesignChallenge(lessonId);
    } else {
      console.error("[Learning] loadDesignChallenge not found!");
      navigateTo('screen-coding');
    }
    return;
  }

  const lesson = JS_TRACK[lessonId];
  if (!lesson) return navigateTo('screen-coding');

  STATE.currentLesson = lessonId;
  STATE.currentChallenge = lesson.challenge;
  navigateTo('screen-coding');

  setTimeout(() => {
    // Update challenge title
    const title = document.querySelector('#screen-coding .screen-title');
    if (title) title.innerHTML = `⚔️ <span class="neon-text">${lesson.challenge.title}</span>`;

    // Update description panel
    const descEl = document.getElementById('coding-challenge-desc');
    if (descEl) {
      descEl.innerHTML = `
        <div style="font-family:var(--font-mono); font-size:0.8rem; opacity:0.5; margin-bottom:0.5rem; letter-spacing:2px;">CHALLENGE BRIEF</div>
        <p style="font-size:0.9rem; line-height:1.65; color:rgba(255,255,255,0.85);">${lesson.challenge.description}</p>
        <div style="margin-top:1rem; padding:0.8rem; background:rgba(0,240,255,0.05); border:1px solid rgba(0,240,255,0.2); border-radius:8px; font-size:0.8rem; font-family:var(--font-mono); color:var(--neon-cyan);">
          Expected: ${lesson.challenge.expected}
        </div>
      `;
    }

    // Set starter code
    const editor = document.getElementById('code-editor');
    if (editor && !editor.value.trim()) {
      editor.value = lesson.challenge.starterCode;
    }

    // Override submitCode for this challenge
    window.submitCode = () => submitJSChallenge(lessonId);

    // Hint button
    _upsertHintBtn(lesson.challenge.hint);

  }, 400);
}

function _upsertHintBtn(hintText) {
  const actionsEl = document.querySelector('.code-actions') || document.getElementById('screen-coding');
  if (!actionsEl) return;

  let hintBtn = document.getElementById('btn-challenge-hint');
  if (!hintBtn) {
    hintBtn = document.createElement('button');
    hintBtn.id = 'btn-challenge-hint';
    hintBtn.className = 'game-btn btn-hollow';
    hintBtn.style.cssText = 'font-size:0.75rem; padding:0.4rem 1rem;';
    hintBtn.textContent = '💡 Hint (-5 XP)';
    actionsEl.appendChild(hintBtn);
  }

  let used = false;
  hintBtn.onclick = () => {
    if (!used) {
      used = true;
      gainXP(-5);
      speak(`Hint: ${hintText}`);
      if (typeof GFX_Badges === 'undefined') showGuideMessage(`💡 Hint: ${hintText}`);
    } else {
      showGuideMessage('Hint already used for this challenge.');
    }
  };
}

function submitJSChallenge(lessonId) {
  const lesson = JS_TRACK[lessonId] || DESIGN_TRACK[lessonId];
  if (!lesson) {
    console.error(`[Learning] Challenge data not found for: ${lessonId}`);
    return;
  }

  const code = document.getElementById('code-editor')?.value || '';
  const output = document.getElementById('console-output');

  try {
    const passed = lesson.challenge.validate(code);

    if (passed) {
      addConsoleLine('✅ CHALLENGE PASSED! Great execution, Knight.', 'success');

      PROGRESS.update(p => {
        if (!p.challengesSolved.includes(lessonId)) {
          p.challengesSolved.push(lessonId);
        }
      });

      gainXP(50, 'logic');
      completeTask('write', 30);

      if (typeof GFX_AI !== 'undefined') GFX_AI.react('correct');
      if (typeof GFX_Badges !== 'undefined' && lessonId === 'arena') {
        GFX_Badges.unlock('boss_first');
      }

      // Unlock next skill in tree
      _advanceSkillTree(lessonId);

      // ⚡ IMMEDIATE UNLOCK ⚡
      const currentWorld = STATE.currentWorld || 'coding';
      STATE.currentNode = lessonId; // Sync current node
      console.log(`[Learning] Passing ${lessonId} in ${currentWorld}. Triggering unlock...`);
      if (typeof finalizeLevelUnlock === 'function') {
        finalizeLevelUnlock(currentWorld, lessonId);
      } else {
        const sequence = WORLD_SEQUENCES[currentWorld];
        const currentIndex = sequence.indexOf(lessonId);
        if (currentIndex !== -1 && currentIndex < sequence.length - 1) {
          const nextNode = sequence[currentIndex + 1];
          if (currentWorld === 'coding') MAP_STATE[nextNode] = 'unlocked';
          else DW_MAP_STATE[nextNode] = 'unlocked';
          if (typeof saveGameState === 'function') saveGameState();
          if (typeof updateMapUI === 'function') updateMapUI();
        }
      }

      // Show next button
      const nextBtn = document.getElementById('btn-code-next');
      if (nextBtn) {
        const sequence = WORLD_SEQUENCES[currentWorld];
        const currentIndex = sequence.indexOf(lessonId);
        const nextNodeId = (currentIndex !== -1 && currentIndex < sequence.length - 1) ? sequence[currentIndex + 1] : null;

        nextBtn.style.display = 'inline-flex';
        
        if (nextNodeId && JS_TRACK[nextNodeId]) {
          nextBtn.innerHTML = '🚀 Next Level: ' + JS_TRACK[nextNodeId].title;
          nextBtn.onclick = () => {
            handleNodeClickWithLessons(nextNodeId, currentWorld);
            window.submitCode = submitCode; // Restore original
          };
        } else {
          nextBtn.innerHTML = '🗺️ Return to Map';
          nextBtn.onclick = () => {
            navigateTo('screen-map');
            window.submitCode = submitCode; // Restore original
          };
        }
      }

      // Personalized mission refresh
      if (typeof generatePersonalizedMission === 'function') generatePersonalizedMission();

    } else {
      addConsoleLine(`❌ Not quite right. Expected: ${lesson.challenge.expected}`, 'error');
      addConsoleLine('   Check your logic and try again.', 'error');
      triggerScreenShake();
      if (typeof GFX_AI !== 'undefined') GFX_AI.react('wrong');
    }
  } catch(err) {
    addConsoleLine('❌ ERROR: ' + err.message, 'error');
    triggerScreenShake();
  }
}

function _advanceSkillTree(lessonId) {
  const unlockMap = {
    beginner: 'js_advanced',
    forest:   'algorithms',
    city:     'algorithms',
    arena:    'fullstack'
  };

  const nextSkill = unlockMap[lessonId];
  if (!nextSkill) return;

  PROGRESS.update(p => { p.skillTree[nextSkill] = true; });
  renderSkillTree();
}

// ============================================================
//  SKILL TREE RENDER (Feature 10)
// ============================================================
const SKILL_TREE_NODES = [
  { id: 'html',         label: 'HTML Mastery',    icon: '📄', prereq: null },
  { id: 'css',          label: 'CSS Wizardry',     icon: '🎨', prereq: 'html' },
  { id: 'js_basics',    label: 'JS Basics',        icon: '⚡', prereq: 'css' },
  { id: 'js_advanced',  label: 'JS Advanced',      icon: '🔥', prereq: 'js_basics' },
  { id: 'algorithms',   label: 'Algorithms',       icon: '🧩', prereq: 'js_advanced' },
  { id: 'fullstack',    label: 'FullStack Lord',   icon: '👑', prereq: 'algorithms' }
];

function renderSkillTree() {
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  const progress = PROGRESS.get();
  const tree = progress.skillTree;

  container.innerHTML = SKILL_TREE_NODES.map((node, i) => {
    const unlocked = !!tree[node.id];
    const connector = i < SKILL_TREE_NODES.length - 1
      ? `<div class="skill-connector ${unlocked ? '' : 'locked-line'}"></div>`
      : '';

    return `
      <div class="skill-node ${unlocked ? 'unlocked' : 'locked'}"
           id="skill-${node.id}"
           title="${unlocked ? 'Unlocked!' : 'Complete previous skills to unlock'}"
           onclick="showSkillInfo('${node.id}', ${unlocked})">
        ${node.icon} ${node.label}
        ${unlocked ? '' : ' 🔒'}
      </div>
      ${connector}
    `;
  }).join('');
}

function showSkillInfo(skillId, unlocked) {
  const node = SKILL_TREE_NODES.find(n => n.id === skillId);
  if (!node) return;
  const msg = unlocked
    ? `${node.icon} ${node.label}: MASTERED. Your arsenal grows, Knight.`
    : `${node.icon} ${node.label}: Locked. Complete the prerequisite challenge to unlock.`;
  speak(msg);
}

// ============================================================
//  DAILY CHALLENGE SYSTEM (Feature 3)
// ============================================================
const DAILY_CHALLENGES = [
  {
    id: 'dc_palindrome',
    title: 'Palindrome Check',
    description: 'Write a function <code>isPalindrome(str)</code> that returns <code>true</code> if <code>str</code> reads the same forwards and backwards.',
    starterCode: 'function isPalindrome(str) {\n  // your code here\n}',
    hint: 'Compare str with str.split("").reverse().join("")',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nreturn isPalindrome("racecar") === true && isPalindrome("hello") === false;`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'isPalindrome("racecar") → true, isPalindrome("hello") → false',
    xp: 75
  },
  {
    id: 'dc_fizzbuzz',
    title: 'FizzBuzz Classic',
    description: 'Write <code>fizzBuzz(n)</code> that returns "Fizz" if divisible by 3, "Buzz" by 5, "FizzBuzz" by both, else the number.',
    starterCode: 'function fizzBuzz(n) {\n  // your code here\n}',
    hint: 'Check n % 15 === 0 first, then n % 3, then n % 5',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nreturn fizzBuzz(15)==="FizzBuzz" && fizzBuzz(3)==="Fizz" && fizzBuzz(5)==="Buzz" && fizzBuzz(7)===7;`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'fizzBuzz(15) → "FizzBuzz", fizzBuzz(3) → "Fizz"',
    xp: 60
  },
  {
    id: 'dc_factorial',
    title: 'Recursive Factorial',
    description: 'Write <code>factorial(n)</code> using recursion that returns n! (e.g. factorial(5) = 120).',
    starterCode: 'function factorial(n) {\n  // Base case + recursive case\n}',
    hint: 'Base case: if (n <= 1) return 1; else return n * factorial(n - 1)',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nreturn factorial(5)===120 && factorial(0)===1 && factorial(1)===1;`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'factorial(5) → 120, factorial(0) → 1',
    xp: 80
  },
  {
    id: 'dc_flatten',
    title: 'Flatten Array',
    description: 'Write <code>flatten(arr)</code> that takes a nested array and returns a flat array (one level deep).',
    starterCode: 'function flatten(arr) {\n  // your code here\n}',
    hint: 'Try: arr.reduce((acc, val) => acc.concat(val), [])',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nreturn JSON.stringify(flatten([[1,2],[3,4],[5]])) === JSON.stringify([1,2,3,4,5]);`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'flatten([[1,2],[3,4]]) → [1,2,3,4]',
    xp: 70
  },
  {
    id: 'dc_unique',
    title: 'Unique Values',
    description: 'Write <code>unique(arr)</code> that returns an array with duplicate values removed.',
    starterCode: 'function unique(arr) {\n  // your code here\n}',
    hint: 'The Set object only stores unique values: return [...new Set(arr)]',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nconst r = unique([1,2,2,3,3,3]); return r.length===3 && r.includes(1) && r.includes(2) && r.includes(3);`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'unique([1,2,2,3]) → [1,2,3]',
    xp: 65
  },
  {
    id: 'dc_debounce',
    title: 'Debounce Function',
    description: 'Write <code>debounce(fn, delay)</code> that returns a debounced version of <code>fn</code> that only runs after <code>delay</code>ms of inactivity.',
    starterCode: 'function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    // your code here\n  };\n}',
    hint: 'clearTimeout(timer); timer = setTimeout(() => fn(...args), delay)',
    validate: (code) => {
      try {
        const fn = new Function(`${code}\nreturn typeof debounce === 'function' && typeof debounce(() => {}, 100) === 'function';`);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'debounce(fn, 200) returns a function that delays fn execution',
    xp: 90
  },
  {
    id: 'dc_deepclone',
    title: 'Deep Clone',
    description: 'Write <code>deepClone(obj)</code> that creates a true deep copy of a plain object (no circular refs needed).',
    starterCode: 'function deepClone(obj) {\n  // your code here\n}',
    hint: 'For plain objects: JSON.parse(JSON.stringify(obj)) works for most cases',
    validate: (code) => {
      try {
        const fn = new Function(`${code}
          const original = {a: 1, b: {c: 2}};
          const clone = deepClone(original);
          clone.b.c = 99;
          return original.b.c === 2 && clone.b.c === 99;
        `);
        return fn() === true;
      } catch { return false; }
    },
    expected: 'Changes to clone.b.c do not affect original.b.c',
    xp: 85
  }
];

function getTodayDailyChallenge() {
  const dayOfWeek = new Date().getDay(); // 0–6
  return DAILY_CHALLENGES[dayOfWeek];
}

function initDailyChallenge() {
  const progress = PROGRESS.get();
  const today = new Date().toDateString();

  // Reset if new day
  if (progress.dailyChallenge.lastDate !== today) {
    PROGRESS.update(p => {
      p.dailyChallenge = { lastDate: today, attemptsLeft: 3, solvedToday: false };
    });
  }

  renderDailyChallengeCard();
}

function renderDailyChallengeCard() {
  const container = document.getElementById('daily-challenge-hub');
  if (!container) return;

  const dc = getTodayDailyChallenge();
  const progress = PROGRESS.get();
  const dcp = progress.dailyChallenge;

  const isSolved = dcp.solvedToday;
  const attemptsLeft = dcp.attemptsLeft;

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:1rem;">
      <span style="font-size:1.8rem;">🏆</span>
      <div>
        <div class="section-hdr" style="margin-bottom:0.2rem;">DAILY CHALLENGE</div>
        <div style="font-size:0.75rem; opacity:0.5;">Resets at midnight · ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left</div>
      </div>
    </div>
    <div class="glass-panel" style="padding:1rem; border-color:${isSolved ? 'var(--neon-green)' : 'rgba(255,255,255,0.1)'}; margin-bottom:1rem;">
      <div style="font-family:var(--font-display); font-size:1rem; margin-bottom:0.5rem; color:${isSolved ? 'var(--neon-green)' : 'var(--neon-blue)'};">
        ${isSolved ? '✅' : '⚡'} ${dc.title}
      </div>
      <div style="font-size:0.8rem; opacity:0.7;">${dc.description.replace(/<[^>]*>/g, '')}</div>
      <div style="margin-top:0.8rem; font-size:0.75rem; font-family:var(--font-mono); color:var(--neon-cyan);">Reward: +${dc.xp} XP</div>
    </div>
    ${isSolved
      ? '<div class="game-btn btn-hollow" style="width:100%; text-align:center; opacity:0.5;">✅ Solved Today — Come back tomorrow!</div>'
      : attemptsLeft > 0
        ? `<button class="game-btn btn-cyan" style="width:100%;" onclick="openDailyChallenge()">⚔️ ATTEMPT CHALLENGE (${attemptsLeft} left)</button>`
        : '<div class="game-btn btn-hollow" style="width:100%; text-align:center; opacity:0.5; border-color:var(--neon-red);">❌ No Attempts Left — Try tomorrow</div>'
    }
  `;
}

function openDailyChallenge() {
  const progress = PROGRESS.get();
  if (progress.dailyChallenge.attemptsLeft <= 0 || progress.dailyChallenge.solvedToday) return;

  const dc = getTodayDailyChallenge();
  STATE.currentChallenge = dc;
  STATE.isDailyChallenge = true;

  // Play "wow" animation before navigating
  _playChallengeEntryAnimation(() => {
    navigateTo('screen-coding');
    setTimeout(() => {
      const title = document.querySelector('#screen-coding .screen-title');
      if (title) title.innerHTML = `🏆 <span class="neon-text">Daily: ${dc.title}</span>`;

      const editor = document.getElementById('code-editor');
      if (editor) editor.value = dc.starterCode;

      const descEl = document.getElementById('coding-challenge-desc');
      if (descEl) {
        descEl.innerHTML = `
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--neon-cyan); margin-bottom:0.5rem;">DAILY CHALLENGE</div>
          <p style="font-size:0.9rem; line-height:1.6; color:rgba(255,255,255,0.85);">${dc.description}</p>
          <div style="margin-top:0.8rem; padding:0.6rem; background:rgba(0,240,255,0.05); border:1px solid rgba(0,240,255,0.2); border-radius:6px; font-size:0.75rem; font-family:var(--font-mono);">
            Expected: ${dc.expected}
          </div>
        `;
      }

      window.submitCode = submitDailyChallenge;
      _upsertHintBtn(dc.hint);

      showGuideMessage(`Today's challenge: ${dc.title}. You have ${progress.dailyChallenge.attemptsLeft} attempts. Make them count.`);
    }, 400);
  });
}

/**
 * Premium entry animation for Daily Challenges
 */
function _playChallengeEntryAnimation(callback) {
  // Create overlay if not exists
  let overlay = document.querySelector('.challenge-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'challenge-transition-overlay';
    overlay.innerHTML = `
      <div class="grid-matrix"></div>
      <div class="scanner-line"></div>
      <div class="protocol-container">
        <div class="protocol-text">PROTOCOL: CHALLENGE</div>
        <div class="protocol-subtext">Initializing Neural Matrix...</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const tl = gsap.timeline({
    onComplete: () => {
      // Small delay at the peak of the animation
      setTimeout(() => {
        if (callback) callback();
        
        // Phase 2: Fade out overlay
        gsap.to(overlay, { 
          opacity: 0, 
          duration: 0.8, 
          delay: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            overlay.classList.remove('active');
          }
        });
      }, 500);
    }
  });

  // Phase 1: Animate in
  overlay.classList.add('active');
  
  tl.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" })
    .to('.protocol-text', { opacity: 1, y: -20, duration: 0.6, ease: "back.out(1.7)" }, "-=0.2")
    .to('.protocol-subtext', { opacity: 1, duration: 0.4 }, "-=0.3")
    .fromTo('.scanner-line', 
      { top: '0%' }, 
      { top: '100%', duration: 1.5, ease: "none", repeat: 1, yoyo: true }, 
      0
    );
}

/**
 * Dynamic Hint button for Daily Challenges
 */
function _upsertHintBtn(hintText) {
  let btn = document.getElementById('btn-coding-hint');
  const container = document.getElementById('screen-coding');
  
  if (!btn && container) {
    btn = document.createElement('button');
    btn.id = 'btn-coding-hint';
    btn.className = 'game-btn btn-hollow btn-small';
    btn.style.cssText = 'position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); min-width: 150px; z-index: 10; font-size: 0.7rem;';
    container.appendChild(btn);
  }

  if (btn) {
    btn.style.display = 'flex';
    btn.style.opacity = '1';
    btn.disabled = false;
    btn.innerHTML = `<i class="ph-bold ph-lightbulb"></i> HINT (-5 XP)`;
    btn.onclick = () => {
      if (STATE.xp >= 5) {
        gainXP(-5);
        showGuideMessage(`💡 HINT: ${hintText}`);
        btn.disabled = true;
        btn.style.opacity = '0.5';
        speak("Hint protocol accessed. XP penalty applied.");
      } else {
        showGuideMessage("Insufficient XP for hint unlock.");
      }
    };
  }
}



function submitDailyChallenge() {
  const dc = getTodayDailyChallenge();
  const code = document.getElementById('code-editor')?.value || '';
  const progress = PROGRESS.get();

  // Decrement attempt
  PROGRESS.update(p => { p.dailyChallenge.attemptsLeft = Math.max(0, p.dailyChallenge.attemptsLeft - 1); });

  try {
    const passed = dc.validate(code);

    if (passed) {
      addConsoleLine('✅ DAILY CHALLENGE COMPLETE! Outstanding performance.', 'success');
      PROGRESS.update(p => { p.dailyChallenge.solvedToday = true; });

      gainXP(dc.xp, 'logic');
      if (typeof GFX_Badges !== 'undefined') GFX_Badges.unlock('quiz_perfect');

      speak(`Daily challenge vanquished. ${dc.xp} XP absorbed into your neural matrix.`);
      STATE.isDailyChallenge = false;

      setTimeout(() => navigateTo('screen-dashboard'), 2500);
    } else {
      const remaining = PROGRESS.get().dailyChallenge.attemptsLeft;
      addConsoleLine(`❌ Incorrect. Expected: ${dc.expected}`, 'error');
      addConsoleLine(`   ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`, 'error');
      triggerScreenShake();
      if (remaining === 0) {
        speak('All attempts exhausted. Regroup and return tomorrow, Knight.');
        setTimeout(() => navigateTo('screen-dashboard'), 2000);
      }
    }
  } catch(err) {
    addConsoleLine('❌ ERROR: ' + err.message, 'error');
    triggerScreenShake();
  }
}

// ============================================================
//  WORLD MAP WIRING (Feature 9)
// ============================================================
const NODE_TO_LESSON = {
  beginner: 'beginner',
  forest:   'forest',
  city:     'city',
  arena:    'arena',
  // Design world
  pixel:    'pixel',
  research: 'research',
  labyrinth:'labyrinth',
  peaks:    'peaks',
  tech_dw:  'tech',
  arena_dw: 'arena'
};

/**
 * Called when a map node is clicked. Routes to the correct lesson flow.
 * Integrates with existing MAP_STATE and enterLevel().
 */
function handleNodeClickWithLessons(nodeId, world = 'coding') {
  const stateMap = world === 'coding' ? MAP_STATE : DW_MAP_STATE;
  let nodeState = stateMap[nodeId];
  
  // ⚡ DYNAMIC UNLOCK FAIL-SAFE ⚡
  // If the previous node in the sequence is 'done', this node SHOULD be unlocked.
  const sequence = (world === 'coding') ? WORLD_SEQUENCES.coding : WORLD_SEQUENCES.design;
  const myIdx = sequence.indexOf(nodeId);
  if (myIdx > 0) {
    const prevNode = sequence[myIdx - 1];
    if (stateMap[prevNode] === 'done' && nodeState === 'locked') {
      console.log(`[Learning] Fail-safe: Force unlocking ${nodeId} because ${prevNode} is done.`);
      stateMap[nodeId] = 'unlocked';
      nodeState = 'unlocked';
      if (typeof saveGameState === 'function') saveGameState();
      if (typeof updateMapUI === 'function') updateMapUI();
    }
  }

  console.log(`[Learning] Click Attempt -> Node: ${nodeId}, World: ${world}, State: ${nodeState}`);

  if (nodeState === 'locked') {
    showGuideMessage('⛔ Node locked. Complete the previous level to unlock this zone.');
    triggerScreenShake();
    const el = document.getElementById(`node-${nodeId}`);
    if (el && window.gsap) gsap.to(el, { x: 8, duration: 0.06, yoyo: true, repeat: 7 });
    return;
  }

  // Set current context
  STATE.currentNode  = nodeId;
  STATE.currentWorld = world;

  // Curriculum Routing (JS Track or Design Track)
  const track = world === 'coding' ? JS_TRACK : DESIGN_TRACK;
  if (track[nodeId]) {
    const curriculum = track[nodeId];
    const p = PROGRESS.get();
    const done = p.completedLessons.includes(nodeId);

    // Show level entry with specifics
    navigateTo('screen-level-entry');
    setTimeout(() => {
      const titleEl = document.getElementById('level-title');
      const descEl = document.getElementById('level-desc');
      if (titleEl) titleEl.textContent = curriculum.title;
      if (descEl)  descEl.textContent  = curriculum.subtitle;

      const trainBtn = document.getElementById('btn-start-training');
      const quizBtn  = document.getElementById('btn-start-quiz');

      if (trainBtn) {
        trainBtn.innerHTML = done ? '📖 Review Module' : '📖 Start Module';
        trainBtn.onclick = () => { loadJSLesson(nodeId); navigateTo('screen-training'); };
      }
      if (quizBtn) {
        quizBtn.style.display = 'inline-flex';
        quizBtn.innerHTML = '🎯 Take Quiz';
        quizBtn.onclick = () => loadJSQuiz(nodeId);
      }

      const challengeBtn = document.getElementById('btn-start-challenge');
      if (challengeBtn) {
        if (curriculum.challenge) {
          challengeBtn.style.display = 'inline-flex';
          challengeBtn.innerHTML = '⚔️ Coding Trial';
          challengeBtn.onclick = () => loadJSChallenge(nodeId);
        } else {
          challengeBtn.style.display = 'none';
        }
      }
    }, 400);
  } else {
    // Fallback to existing flow
    const zoneName = {
      'beginner': 'Beginner Forest',
      'forest':   'Beginner Forest',
      'city':     'Logic Desert',
      'arena':    'Final Arena',
      'pixel':    'Pixel Village',
      'research': 'UX Research Bay',
      'labyrinth':'Layout Labyrinth'
    }[nodeId] || nodeId;
    enterLevel(zoneName);
  }
}

// ============================================================
//  INIT (called on DOMContentLoaded)
// ============================================================
function initLearningModule() {
  initDailyChallenge();
  renderSkillTree();
  initLearningPaths(); // New call
}

document.addEventListener('DOMContentLoaded', initLearningModule);

// ============================================================
//  LEARNING PATHS (New Feature)
// ============================================================

const LEARNING_PATHS = {
  web: {
    id: 'web', title: 'Web Development', icon: 'ph-globe',
    levels: [
      { id: 'web_beg', title: 'Beginner', subtitle: 'HTML, CSS & JS Basics', video: 'https://www.youtube.com/embed/UB1O30fR-EE', reading: 'Understand the basic structure, styling, and interactivity of the web.', quiz: 'web_beg_quiz', challenge: 'web_beg_chal' },
      { id: 'web_int', title: 'Intermediate', subtitle: 'React & Frontend Frameworks', video: 'https://www.youtube.com/embed/SqcY0GlETPk', reading: 'Learn about component-based architecture and state management.', quiz: 'web_int_quiz', challenge: 'web_int_chal' },
      { id: 'web_adv', title: 'Advanced', subtitle: 'Fullstack & Next.js', video: 'https://www.youtube.com/embed/jMy4pVZMyLM', reading: 'Master server-side rendering, API routes, and fullstack deployment.', quiz: 'web_adv_quiz', challenge: 'web_adv_chal' }
    ]
  },
  dsa: {
    id: 'dsa', title: 'DSA', icon: 'ph-tree-structure',
    levels: [
      { id: 'dsa_beg', title: 'Beginner', subtitle: 'Arrays & Strings', video: 'https://www.youtube.com/embed/dummy1', reading: 'Master basic data structures and their operations.', quiz: 'dsa_beg_quiz', challenge: 'dsa_beg_chal' },
      { id: 'dsa_int', title: 'Intermediate', subtitle: 'Trees & Graphs', video: 'https://www.youtube.com/embed/dummy2', reading: 'Explore hierarchical and relational data structures.', quiz: 'dsa_int_quiz', challenge: 'dsa_int_chal' },
      { id: 'dsa_adv', title: 'Advanced', subtitle: 'Dynamic Programming', video: 'https://www.youtube.com/embed/dummy3', reading: 'Solve complex problems by breaking them down into simpler subproblems.', quiz: 'dsa_adv_quiz', challenge: 'dsa_adv_chal' }
    ]
  },
  system_design: {
    id: 'system_design', title: 'System Design', icon: 'ph-hard-drives',
    levels: [
      { id: 'sd_beg', title: 'Beginner', subtitle: 'Client-Server Model', video: 'https://www.youtube.com/embed/dummy4', reading: 'Understand how clients communicate with servers.', quiz: 'sd_beg_quiz', challenge: 'sd_beg_chal' },
      { id: 'sd_int', title: 'Intermediate', subtitle: 'Load Balancing & Caching', video: 'https://www.youtube.com/embed/dummy5', reading: 'Learn to scale applications horizontally and optimize performance.', quiz: 'sd_int_quiz', challenge: 'sd_int_chal' },
      { id: 'sd_adv', title: 'Advanced', subtitle: 'Microservices & Distributed Data', video: 'https://www.youtube.com/embed/dummy6', reading: 'Design robust, distributed architectures.', quiz: 'sd_adv_quiz', challenge: 'sd_adv_chal' }
    ]
  },
  database: {
    id: 'database', title: 'Database', icon: 'ph-database',
    levels: [
      { id: 'db_beg', title: 'Beginner', subtitle: 'SQL Basics', video: 'https://www.youtube.com/embed/dummy7', reading: 'Learn relational database concepts and basic queries.', quiz: 'db_beg_quiz', challenge: 'db_beg_chal' },
      { id: 'db_int', title: 'Intermediate', subtitle: 'Joins & Indexing', video: 'https://www.youtube.com/embed/dummy8', reading: 'Combine data and optimize retrieval speeds.', quiz: 'db_int_quiz', challenge: 'db_int_chal' },
      { id: 'db_adv', title: 'Advanced', subtitle: 'NoSQL & Scaling', video: 'https://www.youtube.com/embed/dummy9', reading: 'Understand non-relational data modeling and database scaling strategies.', quiz: 'db_adv_quiz', challenge: 'db_adv_chal' }
    ]
  },
  devops: {
    id: 'devops', title: 'DevOps Basics', icon: 'ph-cloud',
    levels: [
      { id: 'devops_beg', title: 'Beginner', subtitle: 'Git & Version Control', video: 'https://www.youtube.com/embed/dummy10', reading: 'Track changes and collaborate using Git.', quiz: 'devops_beg_quiz', challenge: 'devops_beg_chal' },
      { id: 'devops_int', title: 'Intermediate', subtitle: 'Docker & Containers', video: 'https://www.youtube.com/embed/dummy11', reading: 'Package applications into portable containers.', quiz: 'devops_int_quiz', challenge: 'devops_int_chal' },
      { id: 'devops_adv', title: 'Advanced', subtitle: 'CI/CD Pipelines', video: 'https://www.youtube.com/embed/dummy12', reading: 'Automate testing and deployment workflows.', quiz: 'devops_adv_quiz', challenge: 'devops_adv_chal' }
    ]
  },
  api: {
    id: 'api', title: 'API Development', icon: 'ph-plug',
    levels: [
      { id: 'api_beg', title: 'Beginner', subtitle: 'RESTful Basics', video: 'https://www.youtube.com/embed/dummy13', reading: 'Design standard REST APIs and handle HTTP verbs.', quiz: 'api_beg_quiz', challenge: 'api_beg_chal' },
      { id: 'api_int', title: 'Intermediate', subtitle: 'Authentication & JWT', video: 'https://www.youtube.com/embed/dummy14', reading: 'Secure your APIs using modern authentication methods.', quiz: 'api_int_quiz', challenge: 'api_int_chal' },
      { id: 'api_adv', title: 'Advanced', subtitle: 'GraphQL & WebSockets', video: 'https://www.youtube.com/embed/dummy15', reading: 'Implement real-time features and advanced querying.', quiz: 'api_adv_quiz', challenge: 'api_adv_chal' }
    ]
  }
};

let currentPathAction = null;

function initLearningPaths() {
  const p = PROGRESS.get();
  if (!p.learningPaths) {
    p.learningPaths = {};
    Object.keys(LEARNING_PATHS).forEach(k => {
      p.learningPaths[k] = { progress: 0, completedTasks: [] };
    });
    PROGRESS.save(p);
  }
  
  // Update overall progress
  updateOverallPathProgress();
}

function updateOverallPathProgress() {
  const p = PROGRESS.get();
  let totalTasks = 0;
  let completedTasks = 0;
  
  Object.keys(LEARNING_PATHS).forEach(trackId => {
    totalTasks += LEARNING_PATHS[trackId].levels.length * 4; // 4 tasks per level
    completedTasks += (p.learningPaths[trackId]?.completedTasks?.length || 0);
  });
  
  const pct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const bar = document.getElementById('overall-path-progress');
  const txt = document.getElementById('overall-path-pct');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = pct + '%';
}

function loadLearningPaths() {
  initLearningPaths();
  renderTracksSidebar();
  
  // Select first track by default
  const firstTrack = Object.keys(LEARNING_PATHS)[0];
  selectTrack(firstTrack);
}

function renderTracksSidebar() {
  const list = document.getElementById('track-list');
  if (!list) return;
  
  const p = PROGRESS.get();
  
  list.innerHTML = Object.values(LEARNING_PATHS).map(track => {
    const totalLevelTasks = track.levels.length * 4;
    const completed = p.learningPaths[track.id]?.completedTasks?.length || 0;
    const pct = Math.round((completed / totalLevelTasks) * 100);
    
    return `
      <div class="glass-panel" style="padding: 1rem; cursor: pointer; border-color: rgba(0,240,255,0.2); transition: all 0.3s;" onclick="selectTrack('${track.id}')" id="track-btn-${track.id}">
        <div style="display:flex; align-items:center; gap: 0.8rem;">
          <i class="ph-bold ${track.icon}" style="font-size:1.5rem; color:var(--neon-blue);"></i>
          <div style="flex-grow: 1;">
            <div style="font-family:var(--font-display); font-size:1rem; letter-spacing:1px; margin-bottom:0.2rem;">${track.title}</div>
            <div class="xp-bar-wrap" style="height: 6px;"><div class="xp-bar-fill" style="width:${pct}%; background:var(--neon-cyan);"></div></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectTrack(trackId) {
  const track = LEARNING_PATHS[trackId];
  if (!track) return;
  
  // Highlight active
  document.querySelectorAll('[id^="track-btn-"]').forEach(el => el.style.borderColor = 'rgba(0,240,255,0.2)');
  const activeEl = document.getElementById('track-btn-' + trackId);
  if (activeEl) activeEl.style.borderColor = 'var(--neon-blue)';
  
  const p = PROGRESS.get();
  const completed = p.learningPaths[trackId]?.completedTasks || [];
  
  const details = document.getElementById('path-details-panel');
  if (!details) return;
  
  let html = `
    <h2 class="neon-text glow-blue" style="margin-bottom: 0.5rem; display:flex; align-items:center; gap:1rem;"><i class="ph-bold ${track.icon}"></i> ${track.title} Track</h2>
    <p style="color:rgba(255,255,255,0.6); margin-bottom: 2rem;">Complete all tasks in a level to unlock the next one.</p>
    <div style="display: flex; flex-direction: column; gap: 1.5rem; position: relative;">
      <!-- Line connecting levels -->
      <div style="position: absolute; left: 1.5rem; top: 1rem; bottom: 1rem; width: 4px; background: rgba(0,240,255,0.1); border-radius: 4px; z-index: 0;"></div>
  `;
  
  let isLocked = false; // First level always unlocked
  
  track.levels.forEach((lvl, idx) => {
    // Check if previous level is complete (all 4 tasks done)
    if (idx > 0) {
      const prevLvl = track.levels[idx-1];
      const prevDone = ['video','reading','quiz','challenge'].every(t => completed.includes(prevLvl.id + '_' + t));
      if (!prevDone) isLocked = true;
    }
    
    const isLvlDone = ['video','reading','quiz','challenge'].every(t => completed.includes(lvl.id + '_' + t));
    const lvlColor = isLocked ? 'rgba(255,255,255,0.2)' : (isLvlDone ? 'var(--neon-green)' : 'var(--neon-blue)');
    const lvlBg = isLocked ? 'rgba(0,0,0,0.4)' : (isLvlDone ? 'rgba(0,255,136,0.05)' : 'var(--glass-bg)');
    
    html += `
      <div class="glass-panel" style="margin-left: 3rem; padding: 1.5rem; position: relative; background: ${lvlBg}; border-color: ${isLocked ? 'rgba(255,255,255,0.1)' : 'var(--glass-border)'}; opacity: ${isLocked ? 0.6 : 1};">
        <!-- Node Dot -->
        <div style="position: absolute; left: -2.3rem; top: 1.5rem; width: 1.5rem; height: 1.5rem; background: ${isLocked ? '#222' : '#000'}; border: 3px solid ${lvlColor}; border-radius: 50%; z-index: 1; box-shadow: 0 0 10px ${lvlColor}; display:flex; justify-content:center; align-items:center;">
          ${isLvlDone ? '<i class="ph-bold ph-check" style="font-size:0.8rem; color:var(--neon-green);"></i>' : (isLocked ? '<i class="ph-bold ph-lock" style="font-size:0.7rem; color:#aaa;"></i>' : '')}
        </div>
        
        <h3 style="color:${lvlColor}; margin-bottom: 0.2rem;">${lvl.title}</h3>
        <p style="font-size:0.85rem; color:rgba(255,255,255,0.6); margin-bottom: 1rem;">${lvl.subtitle}</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.8rem;">
          ${renderPathTaskBtn(trackId, lvl, 'video', 'Video Lesson', 'ph-video-camera', completed, isLocked)}
          ${renderPathTaskBtn(trackId, lvl, 'reading', 'Reading', 'ph-book-open', completed, isLocked)}
          ${renderPathTaskBtn(trackId, lvl, 'quiz', 'Level Quiz', 'ph-target', completed, isLocked)}
          ${renderPathTaskBtn(trackId, lvl, 'challenge', 'Challenge', 'ph-code', completed, isLocked)}
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  details.innerHTML = html;
}

function renderPathTaskBtn(trackId, lvl, type, label, icon, completedArr, isLocked) {
  const taskId = lvl.id + '_' + type;
  const isDone = completedArr.includes(taskId);
  const color = isDone ? 'var(--neon-green)' : (isLocked ? '#666' : '#fff');
  const border = isDone ? 'var(--neon-green)' : (isLocked ? '#444' : 'var(--neon-blue)');
  
  return `
    <button class="game-btn btn-hollow" style="display:flex; align-items:center; gap:0.5rem; padding: 0.6rem; color: ${color}; border-color: ${border}; ${isLocked ? 'pointer-events:none;' : ''}" onclick="openPathAction('${trackId}', '${lvl.id}', '${type}')">
      <i class="ph-bold ${icon}"></i>
      <span style="font-size: 0.7rem;">${label}</span>
      ${isDone ? '<i class="ph-bold ph-check" style="margin-left:auto;"></i>' : ''}
    </button>
  `;
}

function openPathAction(trackId, lvlId, type) {
  const track = LEARNING_PATHS[trackId];
  const lvl = track.levels.find(l => l.id === lvlId);
  const p = PROGRESS.get();
  const taskId = lvlId + '_' + type;
  const isDone = p.learningPaths[trackId]?.completedTasks?.includes(taskId);
  
  currentPathAction = { trackId, taskId };
  
  const modal = document.getElementById('path-action-modal');
  const title = document.getElementById('path-action-title');
  const content = document.getElementById('path-action-content');
  const btn = document.getElementById('btn-complete-path-action');
  
  title.textContent = `${lvl.title} - ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  
  if (type === 'video') {
    content.innerHTML = `<iframe width="100%" height="400" src="${lvl.video}" frameborder="0" allowfullscreen style="border-radius:var(--radius-md);"></iframe>`;
  } else if (type === 'reading') {
    content.innerHTML = `
      <div style="background: rgba(0,240,255,0.05); padding: 2rem; border-radius: var(--radius-md); border: 1px solid rgba(0,240,255,0.2); line-height: 1.8; font-size: 1.1rem;">
        <h3 style="margin-bottom: 1rem; color: var(--neon-blue);">Reading Material</h3>
        <p>${lvl.reading}</p>
        <br><br>
        <p><em>(Placeholder for extensive reading content based on the level.)</em></p>
      </div>
    `;
  } else if (type === 'quiz') {
    content.innerHTML = `
      <div style="text-align:center; padding: 3rem;">
        <i class="ph-fill ph-target" style="font-size: 4rem; color: var(--neon-pink); margin-bottom: 1rem;"></i>
        <h3>Interactive Quiz</h3>
        <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">Test your knowledge on ${lvl.title} concepts.</p>
        <p style="margin-top: 2rem; font-size: 0.8rem; color: var(--neon-cyan);">[Mock Quiz System Loaded]</p>
      </div>
    `;
  } else if (type === 'challenge') {
    content.innerHTML = `
      <div style="text-align:center; padding: 3rem;">
        <i class="ph-fill ph-code" style="font-size: 4rem; color: var(--neon-purple); margin-bottom: 1rem;"></i>
        <h3>Mini Coding Challenge</h3>
        <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">Apply what you've learned in a simulated IDE environment.</p>
        <p style="margin-top: 2rem; font-size: 0.8rem; color: var(--neon-cyan);">[Mock IDE Environment Loaded]</p>
      </div>
    `;
  }
  
  if (isDone) {
    btn.innerHTML = '✅ Completed';
    btn.disabled = true;
    btn.style.opacity = 0.5;
  } else {
    btn.innerHTML = '✅ Mark Completed (+25 XP)';
    btn.disabled = false;
    btn.style.opacity = 1;
  }
  
  modal.classList.remove('hidden');
  setTimeout(() => modal.style.opacity = 1, 10);
  modal.style.pointerEvents = 'auto';
}

function closePathAction() {
  const modal = document.getElementById('path-action-modal');
  modal.style.opacity = 0;
  modal.style.pointerEvents = 'none';
  setTimeout(() => {
    modal.classList.add('hidden');
    document.getElementById('path-action-content').innerHTML = '';
  }, 300);
}

function completePathAction() {
  if (!currentPathAction) return;
  const { trackId, taskId } = currentPathAction;
  
  PROGRESS.update(p => {
    if (!p.learningPaths[trackId]) p.learningPaths[trackId] = { progress: 0, completedTasks: [] };
    if (!p.learningPaths[trackId].completedTasks.includes(taskId)) {
      p.learningPaths[trackId].completedTasks.push(taskId);
    }
  });
  
  const btn = document.getElementById('btn-complete-path-action');
  btn.innerHTML = '✅ Completed';
  btn.disabled = true;
  
  gainXP(25, 'logic', btn);
  showGuideMessage('Task completed! Your neural pathways are strengthening.');
  
  updateOverallPathProgress();
  renderTracksSidebar();
  selectTrack(trackId); // Refresh details
  
  setTimeout(closePathAction, 1000);
}



