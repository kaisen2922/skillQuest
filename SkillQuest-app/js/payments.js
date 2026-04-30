/* ============================================================
   SkillQuest — PAYMENTS & SUBSCRIPTION SYSTEM
   js/payments.js
   ============================================================ */

'use strict';

const PaymentsSystem = {
  FREE_TRACKS: ['Java', 'Python', 'C', 'Design', 'JavaScript', 'HTML', 'CSS', 'C++'],

  init() {
    console.log('[PAYMENTS] System Initialized');
    this.updateUI();
  },

  updateUI() {
    const isPro = STATE.subscription === 'pro';
    const upgradeBtn = document.getElementById('btn-upgrade-pro');
    
    if (upgradeBtn) {
      if (isPro) {
        upgradeBtn.innerHTML = '<i class="ph-fill ph-crown"></i> PRO ACTIVE';
        upgradeBtn.className = 'game-btn btn-green btn-small';
        upgradeBtn.onclick = () => speak("You are already an Elite Knight with Pro access!");
      } else {
        upgradeBtn.innerHTML = '<i class="ph-bold ph-crown"></i> UPGRADE';
        upgradeBtn.className = 'game-btn btn-purple btn-small';
        upgradeBtn.onclick = () => navigateTo('screen-payments');
      }
    }

    // Update pricing cards in payments screen
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length >= 2) {
      const freeBtn = pricingCards[0].querySelector('button');
      const proBtn = pricingCards[1].querySelector('button');

      if (isPro) {
        if (freeBtn) {
          freeBtn.innerHTML = 'SWITCH TO BASIC';
          freeBtn.disabled = false;
          freeBtn.onclick = () => this.downgrade();
        }
        if (proBtn) {
          proBtn.innerHTML = '✅ CURRENT PLAN';
          proBtn.disabled = true;
          proBtn.className = 'game-btn btn-hollow';
        }
      } else {
        if (freeBtn) {
          freeBtn.innerHTML = '✅ CURRENT PLAN';
          freeBtn.disabled = true;
        }
        if (proBtn) {
          proBtn.innerHTML = 'UPGRADE NOW';
          proBtn.disabled = false;
          proBtn.className = 'game-btn btn-purple';
          proBtn.onclick = () => window.openCheckout();
        }
      }
    }

    // Lock/Unlock features
    this.enforceTierLimits();
  },

  enforceTierLimits() {
    const isPro = STATE.subscription === 'pro';
    
    // 1. Learning Tracks
    const pathwayButtons = document.querySelectorAll('#screen-pathway .game-btn');
    pathwayButtons.forEach(btn => {
      const trackName = btn.textContent.split(' ').pop().trim();
      const isFreeTrack = this.FREE_TRACKS.includes(trackName);
      
      if (!isPro && !isFreeTrack) {
        btn.classList.add('locked-feature');
        btn.innerHTML = `${btn.innerHTML} <i class="ph-bold ph-lock" style="font-size: 0.8rem; margin-left: 5px; opacity: 0.6;"></i>`;
        // Store original onclick if not already stored
        if (!btn.dataset.origClick) btn.dataset.origClick = btn.getAttribute('onclick');
        btn.setAttribute('onclick', `PaymentsSystem.showProLock('all learning tracks')`);
      } else {
        btn.classList.remove('locked-feature');
        if (btn.dataset.origClick) {
          btn.setAttribute('onclick', btn.dataset.origClick);
          // Remove lock icon
          const lock = btn.querySelector('.ph-lock');
          if (lock) lock.remove();
        }
      }
    });

    // 2. AI Missions Display
    const aiMissionDisplay = document.getElementById('ai-mission-display');
    if (aiMissionDisplay) {
      if (!isPro) {
        aiMissionDisplay.style.filter = 'none';
        aiMissionDisplay.style.pointerEvents = 'auto';
        aiMissionDisplay.title = "AI Missions Active";
        
        const overlay = aiMissionDisplay.querySelector('.pro-lock-overlay');
        if (overlay) overlay.remove();
      } else {
        aiMissionDisplay.style.filter = 'none';
        aiMissionDisplay.style.pointerEvents = 'auto';
        const overlay = aiMissionDisplay.querySelector('.pro-lock-overlay');
        if (overlay) overlay.remove();
      }
    }

    // 3. Pro Dashboard Buttons
    const mockBtn = document.getElementById('btn-ai-mock-test');
    const friendBtn = document.getElementById('btn-friend-challenges');
    
    [mockBtn, friendBtn].forEach(btn => {
      if (!btn) return;
      if (!isPro) {
        btn.style.opacity = '1';
        if (!btn.querySelector('.ph-lock')) {
          btn.innerHTML = `${btn.innerHTML} <i class="ph-bold ph-lock" style="font-size:0.8rem; opacity:0.3; margin-left:5px;"></i>`;
        }
      } else {
        btn.style.opacity = '1';
        const lock = btn.querySelector('.ph-lock');
        if (lock) lock.remove();
      }
    });
  },

  showMockTest() {
    if (STATE.subscription !== 'pro') {
      this.showProLock('AI Mock Tests');
      return;
    }
    speak("Initializing AI Mock Test protocol... Analyzing your skill gaps to generate the perfect assessment.");
    // In a real app, this would navigate to a specialized quiz screen
    setTimeout(() => {
      showGuideMessage("AI Mock Tests are active! Preparing your personalized exam based on recent performance.");
    }, 1000);
  },

  showFriendChallenges() {
    if (STATE.subscription !== 'pro') {
      this.showProLock('Friend Challenges');
      return;
    }
    
    navigateTo('screen-friend-challenges');
    this.renderRivals();
  },

  renderRivals() {
    const list = document.getElementById('rivals-list');
    if (!list) return;
    list.innerHTML = '';

    const rivals = [
      { name: 'NullPointer_99', level: 42, rank: 'ELITE CODER', status: 'Online', avatar: '🤖', color: 'var(--neon-blue)' },
      { name: 'Hex_Mistress', level: 38, rank: 'JS ARCHITECT', status: 'In Duel', avatar: '🧙', color: 'var(--neon-purple)' },
      { name: 'Cyber_Slayer', level: 50, rank: 'LEGENDARY KNIGHT', status: 'Online', avatar: '🗡️', color: 'var(--neon-cyan)' },
      { name: 'Code_Phantom', level: 25, rank: 'SHADOW DEVELOPER', status: 'Offline', avatar: '👻', color: 'rgba(255,255,255,0.3)' }
    ];

    rivals.forEach(rival => {
      const card = document.createElement('div');
      card.className = 'rival-card glass-panel';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.gap = '1.25rem';
      card.style.padding = '1.25rem';
      card.style.transition = 'all 0.3s ease';
      card.style.cursor = rival.status === 'Online' ? 'pointer' : 'default';
      card.style.opacity = rival.status === 'Offline' ? '0.5' : '1';

      card.innerHTML = `
        <div class="rival-avatar" style="width: 50px; height: 50px; background: ${rival.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 2px solid rgba(255,255,255,0.2);">
          ${rival.avatar}
        </div>
        <div class="rival-info" style="flex: 1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4 style="margin: 0; color: #fff; font-family: var(--font-display);">${rival.name}</h4>
            <span style="font-size: 0.7rem; color: ${rival.status === 'Online' ? 'var(--neon-green)' : (rival.status === 'In Duel' ? 'var(--neon-orange)' : 'rgba(255,255,255,0.4)')}; font-family: var(--font-mono); font-weight: bold;">
              ${rival.status}
            </span>
          </div>
          <div style="font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 4px;">
            ${rival.rank} • LVL ${rival.level}
          </div>
        </div>
        <button class="game-btn btn-small ${rival.status === 'Online' ? 'btn-purple' : 'btn-hollow'}" 
                ${rival.status !== 'Online' ? 'disabled' : ''} 
                onclick="speak('Challenge sent to ${rival.name}! Waiting for protocol acceptance...'); event.stopPropagation();">
          ${rival.status === 'Online' ? 'CHALLENGE' : 'BUSY'}
        </button>
      `;

      if (rival.status === 'Online') {
        card.onmouseover = () => {
          card.style.borderColor = 'var(--neon-purple)';
          card.style.background = 'rgba(157, 0, 255, 0.05)';
          card.style.transform = 'translateX(5px)';
        };
        card.onmouseout = () => {
          card.style.borderColor = 'rgba(255,255,255,0.1)';
          card.style.background = 'rgba(255,255,255,0.02)';
          card.style.transform = 'translateX(0)';
        };
      }

      list.appendChild(card);
    });
  },

  showProLock(featureName) {
    speak(`The ${featureName} feature is reserved for Pro Knights. Upgrade to unlock!`);
    navigateTo('screen-payments');
  },

  downgrade() {
    if (confirm("Are you sure you want to downgrade to the Free tier? You will lose access to Pro features.")) {
      STATE.subscription = 'free';
      PROGRESS.update(p => { p.subscription = 'free'; });
      this.updateUI();
      speak("Subscription downgraded to Basic.");
      navigateTo('screen-dashboard');
    }
  }
};

/**
 * Global functions for checkout UI
 */
window.openCheckout = function() {
  const overlay = document.getElementById('checkout-overlay');
  if (overlay) overlay.style.display = 'block';
  const status = document.getElementById('checkout-status');
  if (status) status.innerHTML = '';
};

window.closeCheckout = function() {
  const overlay = document.getElementById('checkout-overlay');
  if (overlay) overlay.style.display = 'none';
};

window.processPurchase = function() {
  const status = document.getElementById('checkout-status');
  const btn = document.getElementById('btn-complete-purchase');
  
  if (btn) btn.disabled = true;
  if (status) {
    status.style.color = 'var(--neon-cyan)';
    status.innerHTML = 'Connecting to Secure Vault...';
  }

  setTimeout(() => {
    if (status) status.innerHTML = 'Verifying Knight Credentials...';
    setTimeout(() => {
      if (status) {
        status.style.color = 'var(--neon-green)';
        status.innerHTML = 'Purchase Successful! Leveling Up Account...';
      }
      
      setTimeout(() => {
        STATE.subscription = 'pro';
        PROGRESS.update(p => { p.subscription = 'pro'; });
        PaymentsSystem.updateUI();
        window.closeCheckout();
        
        // Celebration
        speak("Welcome to the Elite, Knight! All systems and tracks are now unlocked.");
        if (typeof showLevelUpCeremony === 'function') {
           // Reuse the ceremony for pro upgrade if appropriate
           // showLevelUpCeremony(STATE.level, STATE.level);
        }
        
        // Re-run the screen enter logic to update visuals
        navigateTo('screen-dashboard');
        
        if (btn) btn.disabled = false;
      }, 1500);
    }, 1500);
  }, 1000);
};

// Hook into onScreenEnter
const _origPaymentsEnter = window.onScreenEnter;
window.onScreenEnter = function(screenId) {
  if (typeof _origPaymentsEnter === 'function') _origPaymentsEnter(screenId);
  
  if (screenId === 'screen-payments' || screenId === 'screen-dashboard' || screenId === 'screen-pathway' || screenId === 'screen-profile') {
    PaymentsSystem.updateUI();
  }
};

document.addEventListener('DOMContentLoaded', () => PaymentsSystem.init());
