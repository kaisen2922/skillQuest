const fs = require('fs');
const path = 'd:/SkillQuest/SkillQuest-app/css/style.css';
let content = fs.readFileSync(path, 'utf8');

// The clean end point
const marker = '.modal-overlay.active { display: flex; }';
const idx = content.indexOf(marker);

if (idx !== -1) {
  const cleanContent = content.substring(0, idx + marker.length);
  const newStyles = `

/* ============================================================
   LESSON OVERLAY SYSTEM
   ============================================================ */
.lesson-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 2, 10, 0.92);
  backdrop-filter: blur(20px);
  z-index: 1500;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  opacity: 1;
  visibility: visible;
  transition: all 0.4s var(--ease-out);
}

.lesson-overlay.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: scale(1.05);
}

.lesson-pad {
  width: 100%;
  max-width: 800px;
  background: rgba(10, 10, 30, 0.85);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: 3.5rem;
  box-shadow: 0 0 80px rgba(0, 240, 255, 0.1), var(--shadow-drop);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--neon-blue) transparent;
}

/* Custom Scrollbar for Lesson Pad */
.lesson-pad::-webkit-scrollbar {
  width: 6px;
}
.lesson-pad::-webkit-scrollbar-track {
  background: transparent;
}
.lesson-pad::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.3);
  border-radius: 10px;
}
.lesson-pad::-webkit-scrollbar-thumb:hover {
  background: var(--neon-blue);
}

.lesson-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
}

.lesson-notes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lesson-note {
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.lesson-notes .glass-panel {
  transition: all 0.3s var(--ease-out);
  background: rgba(255, 255, 255, 0.02);
}

.lesson-notes .glass-panel:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(10px);
  border-color: var(--neon-pink);
  box-shadow: -5px 0 15px rgba(255, 0, 127, 0.1);
}

/* SUCCESS / CONFETTI EFFECTS */
.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  pointer-events: none;
  z-index: 1000;
}
`;
  fs.writeFileSync(path, cleanContent + newStyles, 'utf8');
  console.log('Successfully fixed CSS corruption.');
} else {
  console.error('Marker not found!');
}
