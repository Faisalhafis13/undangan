const weddingDate = new Date("2030-01-11T09:00:00+07:00").getTime();

const opening = document.getElementById("opening");
const main = document.getElementById("mainContent");
const openBtn = document.getElementById("openInvitation");
const musicToggle = document.getElementById("musicToggle");

openBtn.addEventListener("click", () => {
  opening.classList.add("hidden");
  main.classList.remove("hidden");
  document.body.style.overflow = "auto";
  startMusic();
});

function tick() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => document.getElementById(id).textContent = "0");
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
tick();
setInterval(tick, 1000);

document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  document.getElementById("rsvpResult").textContent =
    `Terima kasih, ${name}. Konfirmasi “${attendance}” sudah dicatat di halaman ini.`;
  e.target.reset();
});

/* Romantic ambient background generated in-browser.
   No copyrighted audio file is bundled. */
let audioCtx, master, timer, playing = false;
const notes = [261.63,329.63,392.00,523.25,392.00,329.63,293.66,349.23];
let step = 0;

function startMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.035;
    master.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  playing = true;
  musicToggle.innerHTML = "♫ <span>Musik ON</span>";
  playNote();
}

function playNote() {
  if (!playing) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[step % notes.length];
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.3);
  osc.connect(gain); gain.connect(master);
  osc.start(); osc.stop(audioCtx.currentTime + 1.35);
  step++;
  timer = setTimeout(playNote, 650);
}

musicToggle.addEventListener("click", () => {
  if (!audioCtx) { startMusic(); return; }
  playing = !playing;
  if (playing) {
    if (audioCtx.state === "suspended") audioCtx.resume();
    musicToggle.innerHTML = "♫ <span>Musik ON</span>";
    playNote();
  } else {
    clearTimeout(timer);
    audioCtx.suspend();
    musicToggle.innerHTML = "♫ <span>Musik OFF</span>";
  }
});
