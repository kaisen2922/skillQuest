/* ============================================================
   SkillQuest — DESIGN WORLD LOGIC
   js/design-logic.js
   ============================================================ */

'use strict';

let currentDesignTask = null;
let placedElements = [];

const DESIGN_CHALLENGES = {
  pixel: {
    title: 'Profile Card Design',
    subtitle: 'Branding & Visual Identity',
    instructions: 'Build a high-fidelity Profile Card. Focus on Visual Hierarchy and Typography.',
    tasks: [
      'Place a Base Card',
      'Add a Heading and Avatar',
      'Include Action Buttons'
    ],
    assets: [
      { id: 'card', icon: '🎴', label: 'Card', type: 'base' },
      { id: 'heading', icon: 'HT', label: 'Heading', type: 'text' },
      { id: 'input', icon: '⌨', label: 'Input Field', type: 'input' },
      { id: 'btn-p', icon: '➲', label: 'Primary Btn', type: 'btn' },
      { id: 'btn-s', icon: '➲', label: 'Secondary Btn', type: 'btn' },
      { id: 'label', icon: '🏷', label: 'Label', type: 'text' },
      { id: 'divider', icon: '─', label: 'Divider', type: 'shape' },
      { id: 'footer', icon: '⬚', label: 'Footer', type: 'base' }
    ]
  },
  labyrinth: {
    title: 'Wireframe Architecture',
    subtitle: 'Structural Logic',
    instructions: 'Define the layout structure for the Neural Dashboard. Focus on hierarchy.',
    tasks: [
      'Place the Global Navigation',
      'Define the Main Content Area',
      'Add the User Profile Widget'
    ],
    assets: [
      { id: 'nav-bar', icon: '══', label: 'Nav Bar', type: 'layout' },
      { id: 'main-view', icon: '▒▒', label: 'Main View', type: 'layout' },
      { id: 'sidebar', icon: '║', label: 'Sidebar', type: 'layout' },
      { id: 'profile', icon: '👤', label: 'Profile', type: 'widget' }
    ]
  },
  peaks: {
    title: 'UI Component Library',
    subtitle: 'Aesthetic Protocols',
    instructions: 'Select and arrange high-fidelity UI components that match the Glassmorphism theme.',
    tasks: [
      'Place 2 translucent cards',
      'Add neon action buttons',
      'Ensure clear readability'
    ],
    assets: [
      { id: 'glass-card', icon: '⬜', type: 'ui' },
      { id: 'neon-btn', icon: '▬', type: 'ui' },
      { id: 'icon-set', icon: '⌘', type: 'ui' }
    ]
  },
  research: {
    title: 'User Flow Mapping',
    subtitle: 'Empathy Engine',
    instructions: 'Connect user touchpoints to define a seamless onboarding experience.',
    tasks: [
      'Map the Entry Protocol',
      'Define the Choice Branch',
      'Confirm the Success Node'
    ],
    assets: [
      { id: 'entry-node', icon: '○', type: 'flow' },
      { id: 'decision', icon: '◇', type: 'flow' },
      { id: 'success', icon: '☆', type: 'flow' },
      { id: 'arrow', icon: '→', type: 'connector' }
    ]
  },
  tech: {
    title: 'Responsive Grid Master',
    subtitle: 'Device Synchronization',
    instructions: 'Adapt the layout for Mobile-First protocols. Ensure components stack correctly.',
    tasks: [
      'Define the 1-Column Stack',
      'Place the Hamburger Menu',
      'Add Hero Visual'
    ],
    assets: [
      { id: 'mobile-frame', icon: '📱', type: 'device' },
      { id: 'menu-icon', icon: '≡', type: 'ui' },
      { id: 'hero-img', icon: '🖼', type: 'media' }
    ]
  },
  arena: {
    title: 'The Final Prototype',
    subtitle: 'Chaos Canvas Resolution',
    instructions: 'Synthesize all skills to create the ultimate portal interface.',
    tasks: [
      'Integrate Branding',
      'Finalize Navigation',
      'Activate Interaction Nodes'
    ],
    assets: [
      { id: 'portal', icon: '🌀', type: 'core' },
      { id: 'node-lock', icon: '🔒', type: 'logic' },
      { id: 'pulse', icon: '◎', type: 'animation' }
    ]
  }
};

/**
 * LOADS the design challenge based on lessonId
 */
function loadDesignChallenge(lessonId) {
  const challenge = DESIGN_CHALLENGES[lessonId];
  if (!challenge) return navigateTo('screen-map');

  currentDesignTask = { id: lessonId, ...challenge };
  placedElements = [];

  // Update UI
  document.getElementById('dc-title').textContent = challenge.title;
  document.getElementById('dc-subtitle').textContent = challenge.subtitle;
  document.getElementById('dc-instructions').textContent = challenge.instructions;

  // Task list
  const taskList = document.getElementById('dc-task-list');
  taskList.innerHTML = challenge.tasks.map(t => `
    <div class="dc-task-item">
      <i class="ph-bold ph-circle"></i>
      <span>${t}</span>
    </div>
  `).join('');

  // Assets
  const tray = document.getElementById('dc-assets');
  tray.innerHTML = challenge.assets.map(a => `
    <div class="dc-asset" draggable="true" ondragstart="handleDesignDragStart(event, '${a.id}', '${a.icon}')">
      <span class="dc-asset-icon">${a.icon}</span>
      <span class="dc-asset-label">${a.label}</span>
    </div>
  `).join('');

  // Reset Canvas
  const canvas = document.getElementById('dc-canvas');
  canvas.innerHTML = '<div class="dc-canvas-hint">Drop elements here to build your design</div>';
  
  // Reset Stats
  document.getElementById('dc-precision').textContent = '0%';
  document.getElementById('dc-score').textContent = '0';

  navigateTo('screen-design-challenge');
  
  // Init Drop Zone
  canvas.ondragover = (e) => e.preventDefault();
  canvas.ondrop = handleDesignDrop;
}

function handleDesignDragStart(e, id, icon) {
  e.dataTransfer.setData('assetId', id);
  e.dataTransfer.setData('assetIcon', icon);
}

function handleDesignDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('assetId');
  const icon = e.dataTransfer.getData('assetIcon');
  if (!id) return;

  const canvas = document.getElementById('dc-canvas');
  const hint = canvas.querySelector('.dc-canvas-hint');
  if (hint) hint.style.display = 'none';

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const el = document.createElement('div');
  el.className = 'placed-element';
  el.innerHTML = icon;
  el.style.left = (x - 20) + 'px';
  el.style.top = (y - 20) + 'px';
  el.style.width = '60px';
  el.style.height = '60px';
  
  canvas.appendChild(el);
  placedElements.push({ id, x, y });

  updateDesignScore();
}

function updateDesignScore() {
  const count = placedElements.length;
  const score = count * 250;
  const precision = Math.min(100, count * 33);

  document.getElementById('dc-score').textContent = score;
  document.getElementById('dc-precision').textContent = precision + '%';

  // Mark tasks complete
  const items = document.querySelectorAll('.dc-task-item');
  if (count >= 1 && items[0]) items[0].classList.add('complete');
  if (count >= 2 && items[1]) items[1].classList.add('complete');
  if (count >= 3 && items[2]) items[2].classList.add('complete');
}

function submitDesignChallenge() {
  if (placedElements.length < 3) {
    showGuideMessage("Your design is incomplete, Knight. Place at least 3 elements.");
    return;
  }

  const lessonId = currentDesignTask.id;
  
  // Visual Success Feedback
  const canvas = document.getElementById('dc-canvas');
  canvas.style.borderColor = 'var(--neon-green)';
  canvas.style.boxShadow = '0 0 50px rgba(0, 255, 136, 0.2)';

  setTimeout(() => {
    // Reward
    gainXP(100, 'design');
    completeTask('design', 50);
    
    // Unlock Progression
    if (typeof finalizeLevelUnlock === 'function') {
      finalizeLevelUnlock('design', lessonId);
    }

    showGuideMessage("Visual Logic Mastered! Proceed to the next zone.");
    
    setTimeout(() => {
      navigateTo('screen-map');
    }, 1500);
  }, 1000);
}
