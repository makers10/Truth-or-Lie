// ── DAILY ANIMAL BRIEFING ─────────────────────────────────────────────────────
// Shows once per day (tracked in localStorage). Gives the user a daily mission
// and personality vibe based on their current animal tier.

const DAILY_BRIEFINGS = {
  cub: {
    mood: 'Curious & Hungry',
    mission: 'Post your first claim today and earn your first XP.',
    tip: 'Every Alpha started as a Cub. Today is day one.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)'
  },
  wolf: {
    mood: 'Sharp & Focused',
    mission: 'Challenge 3 claims in the feed. Truth or Lie — trust your instincts.',
    tip: 'Wolves hunt in patterns. Find the lies hiding in plain sight.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)'
  },
  alpha_wolf: {
    mood: 'Dominant & Wise',
    mission: 'Lead the pack. Post a claim that makes people think twice.',
    tip: 'The Alpha doesn\'t chase — it sets the pace.',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.1)'
  },
  hatchling: {
    mood: 'Eager & Watchful',
    mission: 'Observe the feed. Vote on 5 posts before you spread your wings.',
    tip: 'Every Sky King was once too small to fly.',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.08)'
  },
  eagle: {
    mood: 'Precise & Fearless',
    mission: 'Spot the lie in today\'s top trending claim.',
    tip: 'Eagles see what others miss. Use that.',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)'
  },
  sky_king: {
    mood: 'Sovereign & Calm',
    mission: 'Drop one truth so undeniable it silences the crowd.',
    tip: 'You\'ve earned the sky. Now own it.',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)'
  },
  kitten: {
    mood: 'Playful & Bold',
    mission: 'Make your first post. Don\'t overthink it — just roar.',
    tip: 'Even lions start small. The pride is watching.',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)'
  },
  lion: {
    mood: 'Confident & Loud',
    mission: 'Post a claim that sparks a debate. Stir the feed.',
    tip: 'Lions don\'t whisper. Say it loud.',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)'
  },
  pride_king: {
    mood: 'Regal & Unstoppable',
    mission: 'Your word carries weight today. Use it on something that matters.',
    tip: 'The Pride King doesn\'t need validation — it gives it.',
    color: '#ea580c',
    bg: 'rgba(234,88,12,0.1)'
  },
  kit: {
    mood: 'Sneaky & Curious',
    mission: 'Find one lie in the feed that everyone else missed.',
    tip: 'Foxes are born tricksters. Use it for good.',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.08)'
  },
  fox: {
    mood: 'Clever & Quick',
    mission: 'Post something that sounds like a lie but is actually true.',
    tip: 'The best foxes blur the line between truth and fiction.',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)'
  },
  shadow_fox: {
    mood: 'Mysterious & Untouchable',
    mission: 'Use your hidden identity today. Say what your public self can\'t.',
    tip: 'The Shadow Fox lives in both worlds. That\'s the power.',
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.1)'
  },
  rat: {
    mood: 'Disgraced & Rebuilding',
    mission: 'No toxic posts today. Every clean post is a step back up.',
    tip: 'Even rats can evolve. It just takes longer.',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.08)'
  }
};

function getTodayKey() {
  const d = new Date();
  return `tf_daily_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function hasSeenTodaysBriefing() {
  return localStorage.getItem(getTodayKey()) === '1';
}

function markBriefingSeen() {
  localStorage.setItem(getTodayKey(), '1');
}

function showDailyBriefing(tierId, animalName, animalEmoji) {
  const briefing = DAILY_BRIEFINGS[tierId] || DAILY_BRIEFINGS['cub'];

  const overlay = document.createElement('div');
  overlay.id = 'daily-overlay';
  overlay.innerHTML = `
    <div class="daily-card" style="--accent:${briefing.color};--card-bg:${briefing.bg}">
      <div class="daily-glow"></div>

      <div class="daily-date">${getDayGreeting()} · ${getTodayDateStr()}</div>

      <div class="daily-animal-wrap">
        <div class="daily-animal-emoji">${animalEmoji}</div>
        <div class="daily-pulse"></div>
      </div>

      <h1 class="daily-name">${animalName}</h1>
      <p class="daily-mood">Today's vibe: <span>${briefing.mood}</span></p>

      <div class="daily-divider"></div>

      <div class="daily-mission-block">
        <p class="daily-mission-label">🎯 Today's Mission</p>
        <p class="daily-mission-text">${briefing.mission}</p>
      </div>

      <div class="daily-tip-block">
        <p class="daily-tip-text">"${briefing.tip}"</p>
      </div>

      <button class="daily-enter-btn" id="daily-enter">
        Enter the Feed →
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('visible'));
  });

  document.getElementById('daily-enter').addEventListener('click', () => {
    overlay.classList.remove('visible');
    overlay.classList.add('hiding');
    setTimeout(() => overlay.remove(), 500);
    markBriefingSeen();
  });
}

function getDayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTodayDateStr() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Called from app.js after user + tier are resolved
function initDailyBriefing() {
  if (hasSeenTodaysBriefing()) return;
  const tierId      = getCurrentTierId();
  const animalName  = getAnimalName(currentUser.id, tierId);
  const animalEmoji = getAnimalEmoji(tierId);
  showDailyBriefing(tierId, animalName, animalEmoji);
}
