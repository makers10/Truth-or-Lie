// Mock posts for the Truth or Lie feed
const INITIAL_POSTS = [
  {
    id: 1,
    text: "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    category: "history",
    truthVotes: 312,
    lieVotes: 88,
    time: "2h ago"
  },
  {
    id: 2,
    text: "A group of flamingos is called a 'flamboyance'.",
    category: "science",
    truthVotes: 204,
    lieVotes: 156,
    time: "4h ago"
  },
  {
    id: 3,
    text: "The Beatles were rejected by Decca Records who said 'guitar groups are on the way out'.",
    category: "pop",
    truthVotes: 445,
    lieVotes: 55,
    time: "6h ago"
  },
  {
    id: 4,
    text: "Humans share 50% of their DNA with bananas.",
    category: "science",
    truthVotes: 178,
    lieVotes: 222,
    time: "8h ago"
  },
  {
    id: 5,
    text: "The Eiffel Tower grows about 15cm taller in summer due to thermal expansion.",
    category: "random",
    truthVotes: 390,
    lieVotes: 110,
    time: "12h ago"
  }
];

// Mock emotion map data — city zones with mood + anonymous posts
const EMOTION_ZONES = [
  {
    id: 1,
    name: "Downtown",
    lat: 40.7128,
    lng: -74.0060,
    mood: "😔 Stressed",
    color: "#f59e0b",
    posts: [
      "Traffic is insane today, been stuck for 40 mins",
      "Deadline at work is killing me rn",
      "Why is everything so expensive here"
    ]
  },
  {
    id: 2,
    name: "Riverside Park",
    lat: 40.7282,
    lng: -74.0776,
    mood: "😄 Happy",
    color: "#22c55e",
    posts: [
      "Perfect morning run, sun is out 🌞",
      "Saw a dog wedding in the park lol",
      "Finally feeling at peace today"
    ]
  },
  {
    id: 3,
    name: "East Village",
    lat: 40.7265,
    lng: -73.9815,
    mood: "😶 Lonely",
    color: "#6c63ff",
    posts: [
      "Eating lunch alone again...",
      "New to the city, haven't made friends yet",
      "Crowded place but somehow feels empty"
    ]
  },
  {
    id: 4,
    name: "Brooklyn Heights",
    lat: 40.6960,
    lng: -73.9937,
    mood: "😌 Calm",
    color: "#38bdf8",
    posts: [
      "Coffee + book + no plans. Perfect Sunday",
      "Neighborhood is so quiet today, love it",
      "Just grateful for small things today"
    ]
  },
  {
    id: 5,
    name: "Midtown",
    lat: 40.7549,
    lng: -73.9840,
    mood: "😡 Angry",
    color: "#ef4444",
    posts: [
      "Someone stole my cab AGAIN",
      "Construction noise at 7am is criminal",
      "This city tests my patience every single day"
    ]
  },
  {
    id: 6,
    name: "Harlem",
    lat: 40.8116,
    lng: -73.9465,
    mood: "😄 Happy",
    color: "#22c55e",
    posts: [
      "Block party vibes all week 🎶",
      "Community garden is blooming!",
      "Neighbors brought food, feeling the love"
    ]
  }
];
