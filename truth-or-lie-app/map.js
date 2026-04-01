// Emotion Map — Leaflet-powered
let emotionMap = null;

const MOOD_EMOJI = {
  "😔 Stressed": "😔",
  "😄 Happy":    "😄",
  "😶 Lonely":   "😶",
  "😌 Calm":     "😌",
  "😡 Angry":    "😡"
};

function initEmotionMap() {
  if (emotionMap) return; // already initialized

  emotionMap = L.map('emotion-map').setView([40.7282, -73.9942], 12);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 19
  }).addTo(emotionMap);

  EMOTION_ZONES.forEach(zone => {
    const emoji = MOOD_EMOJI[zone.mood] || "😐";

    const icon = L.divIcon({
      html: `<div class="emotion-marker" title="${zone.name}: ${zone.mood}">${emoji}</div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([zone.lat, zone.lng], { icon }).addTo(emotionMap);

    // Pulse circle
    L.circle([zone.lat, zone.lng], {
      radius: 600,
      color: zone.color,
      fillColor: zone.color,
      fillOpacity: 0.12,
      weight: 1.5
    }).addTo(emotionMap);

    marker.on('click', () => openEmotionPanel(zone));
  });
}

function openEmotionPanel(zone) {
  const panel = document.getElementById('emotion-panel');
  document.getElementById('panel-location').textContent = `📍 ${zone.name}`;
  document.getElementById('panel-mood').textContent = `Mood: ${zone.mood}`;

  const postsEl = document.getElementById('panel-posts');
  postsEl.innerHTML = zone.posts
    .map(p => `<div class="anon-post">${p}</div>`)
    .join('');

  panel.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-panel').addEventListener('click', () => {
    document.getElementById('emotion-panel').classList.add('hidden');
  });
});
