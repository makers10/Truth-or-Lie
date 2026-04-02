// ── ANIMAL EVOLUTION SYSTEM ────────────────────────────────────────────────
// Each tier has: emoji, name prefix, xpRequired (total XP to reach this tier)
// XP is earned by: posting (+10), getting truth votes (+2), getting lie votes (+1)
// Toxic reports cost XP (-20) and can force a downgrade path

const ANIMAL_TIERS = [
  // ── WOLF PATH ──
  { id: 'cub',        emoji: '🐻', label: 'Cub',        path: 'wolf',  xpRequired: 0   },
  { id: 'wolf',       emoji: '🐺', label: 'Wolf',       path: 'wolf',  xpRequired: 100 },
  { id: 'alpha_wolf', emoji: '🐺', label: 'Alpha Wolf', path: 'wolf',  xpRequired: 300, crown: true },

  // ── EAGLE PATH ──
  { id: 'hatchling',  emoji: '🐣', label: 'Hatchling',  path: 'eagle', xpRequired: 0   },
  { id: 'eagle',      emoji: '🦅', label: 'Eagle',      path: 'eagle', xpRequired: 100 },
  { id: 'sky_king',   emoji: '🦅', label: 'Sky King',   path: 'eagle', xpRequired: 300, crown: true },

  // ── LION PATH ──
  { id: 'kitten',     emoji: '🐱', label: 'Kitten',     path: 'lion',  xpRequired: 0   },
  { id: 'lion',       emoji: '🦁', label: 'Lion',       path: 'lion',  xpRequired: 100 },
  { id: 'pride_king', emoji: '🦁', label: 'Pride King', path: 'lion',  xpRequired: 300, crown: true },

  // ── FOX PATH ──
  { id: 'kit',        emoji: '🦊', label: 'Kit',        path: 'fox',   xpRequired: 0   },
  { id: 'fox',        emoji: '🦊', label: 'Fox',        path: 'fox',   xpRequired: 100 },
  { id: 'shadow_fox', emoji: '🦊', label: 'Shadow Fox', path: 'fox',   xpRequired: 300, crown: true },

  // ── TOXIC DOWNGRADE TIER (punishment) ──
  { id: 'rat',        emoji: '🐀', label: 'Rat',        path: 'toxic', xpRequired: -1  },
];

// Adjectives used to build unique animal display names
const ANIMAL_ADJECTIVES = [
  'Silent','Shadow','Crimson','Neon','Frozen','Ancient','Blazing',
  'Hollow','Cosmic','Phantom','Silver','Golden','Iron','Storm','Void'
];

// Returns a deterministic display name for a user based on their id + tier
function getAnimalName(userId, tierId) {
  const tier = ANIMAL_TIERS.find(t => t.id === tierId) || ANIMAL_TIERS[0];
  const adj  = ANIMAL_ADJECTIVES[userId % ANIMAL_ADJECTIVES.length];
  const crown = tier.crown ? ' 👑' : '';
  return `${adj} ${tier.label}${crown}`;
}

function getAnimalEmoji(tierId) {
  const tier = ANIMAL_TIERS.find(t => t.id === tierId);
  return tier ? tier.emoji : '🐾';
}

// Resolve which tier a user is in based on XP + toxic flag
function resolveTier(xp, path = 'wolf', isToxic = false) {
  if (isToxic) return 'rat';
  const pathTiers = ANIMAL_TIERS.filter(t => t.path === path).sort((a,b) => b.xpRequired - a.xpRequired);
  const reached = pathTiers.find(t => xp >= t.xpRequired);
  return reached ? reached.id : pathTiers[pathTiers.length - 1].id;
}

// ── MOCK USERS (simulated session data) ────────────────────────────────────
const MOCK_USERS = [
  { id: 0,  xp: 420, path: 'wolf',  isToxic: false },
  { id: 1,  xp: 80,  path: 'wolf',  isToxic: false },
  { id: 2,  xp: 310, path: 'eagle', isToxic: false },
  { id: 3,  xp: 50,  path: 'lion',  isToxic: false },
  { id: 4,  xp: 200, path: 'fox',   isToxic: false },
  { id: 5,  xp: 0,   path: 'wolf',  isToxic: true  }, // toxic — shows as Rat
  { id: 6,  xp: 150, path: 'eagle', isToxic: false },
  { id: 7,  xp: 95,  path: 'lion',  isToxic: false },
  { id: 8,  xp: 305, path: 'fox',   isToxic: false },
  { id: 9,  xp: 60,  path: 'wolf',  isToxic: false },
];

// ── MOCK POSTS ──────────────────────────────────────────────────────────────
const INITIAL_POSTS = [
  {
    id: 1,
    authorId: 2,
    text: "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    category: "history",
    truthVotes: 312,
    lieVotes: 88,
    time: "2h ago",
    isNight: false
  },
  {
    id: 2,
    authorId: 4,
    text: "A group of flamingos is called a 'flamboyance'.",
    category: "science",
    truthVotes: 204,
    lieVotes: 156,
    time: "4h ago",
    isNight: false
  },
  {
    id: 3,
    authorId: 6,
    text: "The Beatles were rejected by Decca Records who said 'guitar groups are on the way out'.",
    category: "pop",
    truthVotes: 445,
    lieVotes: 55,
    time: "6h ago",
    isNight: false
  },
  {
    id: 4,
    authorId: 1,
    text: "Humans share 50% of their DNA with bananas.",
    category: "science",
    truthVotes: 178,
    lieVotes: 222,
    time: "8h ago",
    isNight: false
  },
  {
    id: 5,
    authorId: 8,
    text: "The Eiffel Tower grows about 15cm taller in summer due to thermal expansion.",
    category: "random",
    truthVotes: 390,
    lieVotes: 110,
    time: "12h ago",
    isNight: false
  }
];

// ── EMOTION MAP ZONES ───────────────────────────────────────────────────────
const EMOTION_ZONES = [
  {
    id: 1, name: "Downtown", lat: 40.7128, lng: -74.0060,
    mood: "😔 Stressed", color: "#f59e0b",
    posts: ["Traffic is insane today, been stuck for 40 mins","Deadline at work is killing me rn","Why is everything so expensive here"]
  },
  {
    id: 2, name: "Riverside Park", lat: 40.7282, lng: -74.0776,
    mood: "😄 Happy", color: "#22c55e",
    posts: ["Perfect morning run, sun is out 🌞","Saw a dog wedding in the park lol","Finally feeling at peace today"]
  },
  {
    id: 3, name: "East Village", lat: 40.7265, lng: -73.9815,
    mood: "😶 Lonely", color: "#6c63ff",
    posts: ["Eating lunch alone again...","New to the city, haven't made friends yet","Crowded place but somehow feels empty"]
  },
  {
    id: 4, name: "Brooklyn Heights", lat: 40.6960, lng: -73.9937,
    mood: "😌 Calm", color: "#38bdf8",
    posts: ["Coffee + book + no plans. Perfect Sunday","Neighborhood is so quiet today, love it","Just grateful for small things today"]
  },
  {
    id: 5, name: "Midtown", lat: 40.7549, lng: -73.9840,
    mood: "😡 Angry", color: "#ef4444",
    posts: ["Someone stole my cab AGAIN","Construction noise at 7am is criminal","This city tests my patience every single day"]
  },
  {
    id: 6, name: "Harlem", lat: 40.8116, lng: -73.9465,
    mood: "😄 Happy", color: "#22c55e",
    posts: ["Block party vibes all week 🎶","Community garden is blooming!","Neighbors brought food, feeling the love"]
  }
];
