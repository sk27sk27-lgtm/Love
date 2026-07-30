/* ============================================================
   Our Constellation — script.js
   Edit the PHOTOS array below to change captions/messages.
   ============================================================ */

const PHOTOS = [
  {
    src: "images/1.jpg",
    caption: "Ordinary afternoon",
    message: "It’s funny — of all the photos we have, it’s the everyday ones I love most. Just us, on a random afternoon, being ourselves."
  },
  {
    src: "images/2.jpg",
    caption: "City lights",
    message: "Some streets we’ll forget, some we never will. This one, with you close and the lights above us, I’m keeping forever."
  },
  {
    src: "images/3.jpg",
    caption: "That evening out",
    message: "You, me, and nowhere else we needed to be. I could do a hundred more evenings exactly like this one."
  },
  {
    src: "images/4.jpg",
    caption: "Under the trees",
    message: "You fit right here, against me, like it was always meant to be this easy. It still amazes me that it is."
  },
  {
    src: "images/5.jpg",
    caption: "Dressed up, just because",
    message: "You in yellow, me trying not to stare too much. I don’t think I managed it — I never really do."
  },
  {
    src: "images/6.jpg",
    caption: "One more selfie",
    message: "We have a hundred selfies that look almost the same, and I want a hundred more. Never get tired of this view."
  }
];

/* ---------------- Gallery build ---------------- */
const cardsWrap = document.getElementById("cards");

PHOTOS.forEach((photo, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
        <span class="card-hint">✦</span>
        <span class="card-index">${String(i + 1).padStart(2, "0")} — ${photo.caption}</span>
      </div>
      <div class="card-face card-back">
        <span class="quote-mark">“</span>
        <p>${photo.message}</p>
        <span class="signoff">tap to flip back</span>
      </div>
    </div>
  `;
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  cardsWrap.appendChild(card);
});

/* Reveal cards on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".card").forEach((c) => io.observe(c));

/* ---------------- Starfield canvas ---------------- */
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let stars = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const count = Math.floor((W * H) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.3 + 0.3,
    baseAlpha: Math.random() * 0.6 + 0.3,
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));
}
window.addEventListener("resize", resize);
resize();

let t = 0;
function drawStars() {
  ctx.clearRect(0, 0, W, H);
  t += 1;
  for (const s of stars) {
    const twinkle = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
    const alpha = s.baseAlpha * (0.4 + twinkle * 0.6);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(247,236,224,${alpha.toFixed(3)})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
drawStars();

/* ---------------- Shooting stars ---------------- */
const shootLayer = document.getElementById("shooting-stars");
function spawnShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = Math.random() * 40 + "%";
  star.style.left = Math.random() * 60 + 30 + "%";
  shootLayer.appendChild(star);
  setTimeout(() => star.remove(), 1500);
}
setInterval(spawnShootingStar, 4500);
setTimeout(spawnShootingStar, 1200);

/* ---------------- Floating hearts ---------------- */
const heartsLayer = document.getElementById("hearts-layer");
const HEART_GLYPHS = ["♥", "❤", "💕"];
function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
  const size = Math.random() * 14 + 10;
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = size + "px";
  heart.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  heart.style.animationDuration = Math.random() * 6 + 8 + "s";
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}
setInterval(spawnHeart, 1400);

/* ---------------- Generative ambient "instrumental" ----------------
   No external audio file (keeps this fully self-contained & copyright-free).
   Builds a soft, slow, evolving pad + gentle plucked notes using WebAudio. */
let audioCtx = null;
let masterGain = null;
let padNodes = [];
let isPlaying = false;
let pluckTimer = null;

const NOTE_FREQS = { // a gentle, warm pentatonic-ish scale
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
};
const MELODY = ["C4","E4","G4","A4","G4","E4","D4","C5","A4","G4","E4","D4"];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);

  // Warm pad: three detuned oscillators through a low-pass filter
  const padGain = audioCtx.createGain();
  padGain.gain.value = 0.22;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  padGain.connect(filter);
  filter.connect(masterGain);

  [130.81, 164.81, 196.0].forEach((freq, i) => { // C3, E3, G3 chord
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = (i - 1) * 6;
    const g = audioCtx.createGain();
    g.gain.value = 0.5;
    osc.connect(g);
    g.connect(padGain);
    osc.start();
    padNodes.push(osc);
  });

  // slow filter sweep for movement
  let sweep = 0;
  setInterval(() => {
    if (!audioCtx) return;
    sweep += 0.02;
    const val = 700 + Math.sin(sweep) * 300;
    filter.frequency.linearRampToValueAtTime(val, audioCtx.currentTime + 2);
  }, 2000);

  padNodes.push({ stop: () => padGain.disconnect() });
}

function pluckNote() {
  if (!audioCtx || !isPlaying) return;
  const note = MELODY[Math.floor(Math.random() * MELODY.length)];
  const freq = NOTE_FREQS[note];
  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const g = audioCtx.createGain();
  g.gain.value = 0;
  osc.connect(g);
  g.connect(masterGain);
  const now = audioCtx.currentTime;
  g.gain.linearRampToValueAtTime(0.12, now + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
  osc.start(now);
  osc.stop(now + 2.3);
}

function scheduleMelody() {
  pluckNote();
  const next = Math.random() * 1600 + 900;
  pluckTimer = setTimeout(scheduleMelody, next);
}

const musicBtn = document.getElementById("music-toggle");
const musicLabel = document.getElementById("music-label");

musicBtn.addEventListener("click", () => {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();

  isPlaying = !isPlaying;
  musicBtn.classList.toggle("playing", isPlaying);

  if (isPlaying) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 1.5);
    musicLabel.textContent = "Our song is playing";
    scheduleMelody();
  } else {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    musicLabel.textContent = "Play our song";
    clearTimeout(pluckTimer);
  }
});
