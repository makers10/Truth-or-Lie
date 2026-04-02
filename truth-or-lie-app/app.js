// ── SESSION USER (simulated logged-in user) ─────────────────────────────────
// In a real app this comes from auth. Here we use sessionStorage.
let currentUser = JSON.parse(sessionStorage.getItem('tf_user')) || {
  id: 99,
  xp: 0,
  path: 'wolf',   // chosen at signup: wolf | eagle | lion | fox
  isToxic: false,
  toxicReports: 0,
  publicName: null,   // set on first post if null
  hiddenTierId: 'kit' // dual identity — private tier (fox kit by default)
};

function saveUser() {
  sessionStorage.setItem('tf_user', JSON.stringify(currentUser));
}

function getCurrentTierId() {
  return resolveTier(currentUser.xp, currentUser.path, currentUser.isToxic);
}

function addXP(amount) {
  if (currentUser.isToxic) return; // toxic users can't earn XP
  currentUser.xp = Math.max(0, currentUser.xp + amount);
  saveUser();
  renderProfile();
}

// ── STATE ───────────────────────────────────────────────────────────────────
let posts = INITIAL_POSTS.map(p => ({ ...p }));
let nextId = posts.length + 1;
const voted = {};

// ── AUTH GUARD ───────────────────────────────────────────────────────────────
if (!sessionStorage.getItem('tf_authed')) {
  window.location.href = 'login.html';
}

// ── TAB SWITCHING ────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
    if (target === 'map') setTimeout(initEmotionMap, 50);
  });
});

// ── COMPOSER TOGGLE ──────────────────────────────────────────────────────────
document.getElementById('add-post-btn').addEventListener('click', () => {
  document.getElementById('composer').classList.toggle('hidden');
});

// ── SUBMIT POST ──────────────────────────────────────────────────────────────
document.getElementById('submit-post').addEventListener('click', () => {
  const text = document.getElementById('post-input').value.trim();
  if (!text) return;

  const category  = document.getElementById('post-category').value;
  const isPrivate = document.getElementById('post-private').checked;

  posts.unshift({
    id: nextId++,
    authorId: currentUser.id,
    text,
    category,
    truthVotes: 0,
    lieVotes: 0,
    time: 'just now',
    isNight: false,
    isPrivate  // uses hidden animal identity if true
  });

  addXP(10); // +10 XP for posting
  document.getElementById('post-input').value = '';
  document.getElementById('composer').classList.add('hidden');
  renderFeed();
});

// ── VOTING ───────────────────────────────────────────────────────────────────
function castVote(postId, type) {
  if (voted[postId]) return;
  voted[postId] = type;

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (type === 'truth') post.truthVotes++;
  else post.lieVotes++;

  // XP for post author (simulated — in real app would be server-side)
  if (post.authorId === currentUser.id) {
    addXP(type === 'truth' ? 2 : 1);
  }

  renderFeed();
}

// ── TOXIC REPORT ─────────────────────────────────────────────────────────────
function reportToxic(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  // Simulate: if this is the current user's post, apply penalty
  if (post.authorId === currentUser.id) {
    currentUser.toxicReports = (currentUser.toxicReports || 0) + 1;
    currentUser.xp = Math.max(0, currentUser.xp - 20);

    if (currentUser.toxicReports >= 3) {
      currentUser.isToxic = true;
    }

    saveUser();
    renderProfile();
    showToast(`⚠️ Toxic report filed. ${currentUser.isToxic ? 'You have been downgraded to 🐀 Rat.' : `XP -20. ${3 - currentUser.toxicReports} reports until downgrade.`}`);
  } else {
    showToast('🚩 Report submitted.');
  }

  renderFeed();
}

// ── RENDER FEED ───────────────────────────────────────────────────────────────
function renderFeed() {
  const container = document.getElementById('posts-container');
  container.innerHTML = posts
    .filter(p => !p.isNight) // night posts shown in night feed tab
    .map(post => buildPostCard(post))
    .join('');

  container.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', () => castVote(Number(btn.dataset.id), btn.dataset.type));
  });

  container.querySelectorAll('.report-btn').forEach(btn => {
    btn.addEventListener('click', () => reportToxic(Number(btn.dataset.id)));
  });
}

// ── BUILD POST CARD ───────────────────────────────────────────────────────────
function buildPostCard(post) {
  const total    = post.truthVotes + post.lieVotes;
  const truthPct = total ? Math.round((post.truthVotes / total) * 100) : 50;
  const liePct   = 100 - truthPct;
  const userVote = voted[post.id];
  const cardClass = userVote ? `post-card voted-${userVote}` : 'post-card';

  // Resolve author animal identity
  const useHidden = post.isPrivate;
  let authorEmoji, authorName;

  if (useHidden) {
    // Private post — show hidden animal identity
    authorEmoji = getAnimalEmoji(currentUser.hiddenTierId);
    authorName  = '??? ' + getAnimalEmoji(currentUser.hiddenTierId);
  } else {
    const author = MOCK_USERS.find(u => u.id === (post.authorId % MOCK_USERS.length)) || MOCK_USERS[0];
    const tierId = resolveTier(author.xp, author.path, author.isToxic);
    authorEmoji  = getAnimalEmoji(tierId);
    authorName   = getAnimalName(post.authorId, tierId);
  }

  const categoryLabel = {
    science: '🔬 Science', history: '📜 History',
    pop: '🎤 Pop Culture', random: '🎲 Random'
  }[post.category] || post.category;

  const verdictText = total > 0
    ? `${total} votes — crowd says: <span>${truthPct >= 60 ? '✅ Probably True' : liePct >= 60 ? '❌ Probably Lie' : '🤔 Too close to call'}</span>`
    : 'Be the first to vote';

  const disabledAttr = userVote ? 'disabled' : '';

  return `
    <div class="${cardClass}" data-id="${post.id}">
      <div class="post-top">
        <div class="post-author">
          <div class="author-avatar">${authorEmoji}</div>
          <div class="author-info">
            <span class="author-name">${authorName}</span>
            <span class="author-time">${post.time}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="post-badge">${categoryLabel}</span>
          <button class="report-btn" data-id="${post.id}" title="Report toxic" style="background:none;border:none;cursor:pointer;font-size:0.8rem;opacity:0.4;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.4">🚩</button>
        </div>
      </div>
      <p class="post-text">${escapeHtml(post.text)}</p>
      <div class="vote-bar-wrap">
        <div class="vote-bar-track">
          <div class="vote-bar-truth" style="width:${truthPct}%"></div>
        </div>
        <div class="vote-counts">
          <span class="truth-count">✅ Truth · ${post.truthVotes}</span>
          <span class="lie-count">❌ Lie · ${post.lieVotes}</span>
        </div>
      </div>
      <div class="vote-buttons">
        <button class="vote-btn truth ${userVote === 'truth' ? 'selected' : ''}" data-id="${post.id}" data-type="truth" ${disabledAttr}>✅ That's True</button>
        <button class="vote-btn lie ${userVote === 'lie' ? 'selected' : ''}" data-id="${post.id}" data-type="lie" ${disabledAttr}>❌ That's a Lie</button>
      </div>
      <p class="verdict">${verdictText}</p>
    </div>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── PROFILE PANEL ─────────────────────────────────────────────────────────────
function renderProfile() {
  const tierId    = getCurrentTierId();
  const tierData  = ANIMAL_TIERS.find(t => t.id === tierId);
  const name      = getAnimalName(currentUser.id, tierId);
  const emoji     = getAnimalEmoji(tierId);
  const xp        = currentUser.xp;

  // Find next tier in same path
  const pathTiers = ANIMAL_TIERS.filter(t => t.path === currentUser.path).sort((a,b) => a.xpRequired - b.xpRequired);
  const nextTier  = pathTiers.find(t => t.xpRequired > xp);
  const xpToNext  = nextTier ? nextTier.xpRequired - xp : 0;
  const maxXP     = nextTier ? nextTier.xpRequired : xp;
  const prevXP    = tierData ? tierData.xpRequired : 0;
  const pct       = nextTier ? Math.round(((xp - prevXP) / (maxXP - prevXP)) * 100) : 100;

  const isToxic   = currentUser.isToxic;

  document.getElementById('profile-panel').innerHTML = `
    <div class="profile-animal">${emoji}</div>
    <div class="profile-info">
      <span class="profile-name">${name}</span>
      <span class="profile-xp">${isToxic ? '🐀 Downgraded — toxic behaviour detected' : `${xp} XP${nextTier ? ` · ${xpToNext} to ${nextTier.label}` : ' · Max tier reached 👑'}`}</span>
      ${!isToxic ? `
      <div class="xp-bar-track">
        <div class="xp-bar-fill" style="width:${pct}%"></div>
      </div>` : ''}
    </div>
    <div class="dual-identity" title="Your hidden identity for private posts">
      🎭 Hidden: ${getAnimalEmoji(currentUser.hiddenTierId)}
    </div>
  `;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderFeed();
renderProfile();
initDailyBriefing();
