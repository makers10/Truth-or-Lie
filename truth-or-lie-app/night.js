// ── NIGHT FEED — Anonymous confessions, auto-delete after 6 hours ────────────

const NIGHT_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours in ms

// Load from localStorage (persists across page refresh)
function loadNightPosts() {
  try {
    const raw = localStorage.getItem('tf_night_posts');
    if (!raw) return [];
    const posts = JSON.parse(raw);
    // Filter out expired posts
    const now = Date.now();
    return posts.filter(p => (now - p.createdAt) < NIGHT_TTL_MS);
  } catch { return []; }
}

function saveNightPosts(posts) {
  localStorage.setItem('tf_night_posts', JSON.stringify(posts));
}

let nightPosts = loadNightPosts();
let nightNextId = nightPosts.length + 1;

// ── COMPOSER TOGGLE ───────────────────────────────────────────────────────────
document.getElementById('night-post-btn').addEventListener('click', () => {
  document.getElementById('night-composer').classList.toggle('hidden');
});

// ── SUBMIT NIGHT POST ─────────────────────────────────────────────────────────
document.getElementById('submit-night').addEventListener('click', () => {
  const text = document.getElementById('night-input').value.trim();
  if (!text) return;

  const post = {
    id: nightNextId++,
    text,
    createdAt: Date.now(),
    reactions: { '🤍': 0, '😢': 0, '😮': 0, '🔥': 0 }
  };

  nightPosts.unshift(post);
  saveNightPosts(nightPosts);

  document.getElementById('night-input').value = '';
  document.getElementById('night-composer').classList.add('hidden');
  renderNightFeed();
});

// ── REACT TO NIGHT POST ───────────────────────────────────────────────────────
function reactNight(postId, emoji) {
  const post = nightPosts.find(p => p.id === postId);
  if (!post) return;
  post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;
  saveNightPosts(nightPosts);
  renderNightFeed();
}

// ── TIME REMAINING ────────────────────────────────────────────────────────────
function timeRemaining(createdAt) {
  const remaining = NIGHT_TTL_MS - (Date.now() - createdAt);
  if (remaining <= 0) return 'Expiring...';
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

// ── RENDER NIGHT FEED ─────────────────────────────────────────────────────────
function renderNightFeed() {
  // Re-filter expired posts on each render
  nightPosts = nightPosts.filter(p => (Date.now() - p.createdAt) < NIGHT_TTL_MS);
  saveNightPosts(nightPosts);

  const container = document.getElementById('night-posts-container');

  if (nightPosts.length === 0) {
    container.innerHTML = `<p class="night-empty">🌙 No confessions yet tonight. Be the first.</p>`;
    return;
  }

  container.innerHTML = nightPosts.map(post => `
    <div class="night-card">
      <div class="night-card-top">
        <span class="night-anon">🌑 Anonymous</span>
        <span class="night-timer">⏳ ${timeRemaining(post.createdAt)}</span>
      </div>
      <p class="night-text">${escapeHtmlNight(post.text)}</p>
      <div class="night-reactions">
        ${Object.entries(post.reactions).map(([emoji, count]) => `
          <button class="reaction-btn" data-id="${post.id}" data-emoji="${emoji}">
            ${emoji} <span>${count}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => reactNight(Number(btn.dataset.id), btn.dataset.emoji));
  });
}

function escapeHtmlNight(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── AUTO-REFRESH every minute to update timers ────────────────────────────────
setInterval(renderNightFeed, 60000);

// ── INIT ──────────────────────────────────────────────────────────────────────
renderNightFeed();
