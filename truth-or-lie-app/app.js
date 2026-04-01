// ── State ──────────────────────────────────────────────
let posts = INITIAL_POSTS.map(p => ({ ...p }));
let nextId = posts.length + 1;
const voted = {}; // { postId: 'truth' | 'lie' }

// ── Tab switching ───────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');

    if (target === 'map') {
      // Leaflet needs the container visible before init
      setTimeout(initEmotionMap, 50);
    }
  });
});

// ── Composer toggle ─────────────────────────────────────
document.getElementById('add-post-btn').addEventListener('click', () => {
  document.getElementById('composer').classList.toggle('hidden');
});

// ── Submit new post ─────────────────────────────────────
document.getElementById('submit-post').addEventListener('click', () => {
  const text = document.getElementById('post-input').value.trim();
  if (!text) return;

  const category = document.getElementById('post-category').value;

  posts.unshift({
    id: nextId++,
    text,
    category,
    truthVotes: 0,
    lieVotes: 0,
    time: 'just now'
  });

  document.getElementById('post-input').value = '';
  document.getElementById('composer').classList.add('hidden');
  renderFeed();
});

// ── Voting ──────────────────────────────────────────────
function castVote(postId, type) {
  if (voted[postId]) return;
  voted[postId] = type;

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (type === 'truth') post.truthVotes++;
  else post.lieVotes++;

  renderFeed();
}

// ── Render feed ─────────────────────────────────────────
function renderFeed() {
  const container = document.getElementById('posts-container');
  container.innerHTML = posts.map(post => buildPostCard(post)).join('');

  // Attach vote listeners
  container.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      castVote(Number(btn.dataset.id), btn.dataset.type);
    });
  });
}

const AVATARS = ['🦊','🐺','🦁','🐸','🦋','🐙','🦄','🐬','🦅','🐲'];
const NAMES   = ['Anonymous Fox','Shadow Wolf','Curious Lion','Green Frog','Night Owl',
                 'Deep Octopus','Wild Unicorn','Blue Dolphin','Eagle Eye','Fire Dragon'];

function buildPostCard(post) {
  const total    = post.truthVotes + post.lieVotes;
  const truthPct = total ? Math.round((post.truthVotes / total) * 100) : 50;
  const liePct   = 100 - truthPct;
  const userVote = voted[post.id];
  const cardClass = userVote ? `post-card voted-${userVote}` : 'post-card';

  const categoryLabel = {
    science: '🔬 Science',
    history: '📜 History',
    pop:     '🎤 Pop Culture',
    random:  '🎲 Random'
  }[post.category] || post.category;

  const verdictText = total > 0
    ? `${total} votes — crowd says: <span>${truthPct >= 60 ? '✅ Probably True' : liePct >= 60 ? '❌ Probably Lie' : '🤔 Too close to call'}</span>`
    : 'Be the first to vote';

  const disabledAttr = userVote ? 'disabled' : '';
  const avatarIdx = post.id % AVATARS.length;

  return `
    <div class="${cardClass}" data-id="${post.id}">
      <div class="post-top">
        <div class="post-author">
          <div class="author-avatar">${AVATARS[avatarIdx]}</div>
          <div class="author-info">
            <span class="author-name">${NAMES[avatarIdx]}</span>
            <span class="author-time">${post.time}</span>
          </div>
        </div>
        <span class="post-badge">${categoryLabel}</span>
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
        <button class="vote-btn truth ${userVote === 'truth' ? 'selected' : ''}"
          data-id="${post.id}" data-type="truth" ${disabledAttr}>
          ✅ That's True
        </button>
        <button class="vote-btn lie ${userVote === 'lie' ? 'selected' : ''}"
          data-id="${post.id}" data-type="lie" ${disabledAttr}>
          ❌ That's a Lie
        </button>
      </div>
      <p class="verdict">${verdictText}</p>
    </div>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Init ────────────────────────────────────────────────
renderFeed();
