const POINTS = [10, 20, 30, 40, 50];
let TOTAL = 0;
Object.values(quizData).forEach((c) => (TOTAL += Object.keys(c.questions).length));
let score = 0, answered = 0, correctCount = 0, activeKey = null, currentOptions = [];

function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function div(cls){const d=document.createElement("div");d.className=cls;return d;}

document.getElementById("quizTitle").textContent = QUIZ_TITLE;
document.getElementById("answeredNum").textContent = `0/${TOTAL}`;

const board = document.getElementById("board");
board.appendChild(div("corner"));
POINTS.forEach((p) => { const h = div("col-head"); h.textContent = p; board.appendChild(h); });

Object.keys(quizData).forEach((cat) => {
  const data = quizData[cat];
  const label = div("cat-label");
  label.style.background = data.color;
  label.innerHTML = `<span class="emo">${data.emoji}</span><span>${cat}</span>`;
  board.appendChild(label);
  POINTS.forEach((p) => {
    if (!data.questions[p]) { board.appendChild(div("tile-spacer")); return; }
    const t = document.createElement("button");
    t.className = "tile";
    t.id = `tile-${cat}-${p}`;
    t.style.background = data.color;
    t.textContent = p;
    t.onclick = () => openQuestion(cat, p);
    board.appendChild(t);
  });
});

function openQuestion(cat, p) {
  const tile = document.getElementById(`tile-${cat}-${p}`);
  if (tile.classList.contains("done")) return;
  activeKey = { cat, p };
  const data = quizData[cat], qd = data.questions[p];
  currentOptions = qd.options.map((text, i) => ({ text, correct: i === qd.answer }));
  shuffle(currentOptions);
  const optHTML = currentOptions.map((o, i) => `<button class="opt" onclick="choose(${i})"><span class="marker">${String.fromCharCode(65+i)}</span><span>${o.text}</span></button>`).join("");
  const imgHTML = qd.image
    ? `<img class="m-img" src="${qd.image}" alt="" onerror="this.outerHTML='<div class=&quot;m-img-fallback&quot; style=&quot;background:${data.color}&quot;>${data.emoji}</div>'">`
    : `<div class="m-img-fallback" style="background:${data.color}">${data.emoji}</div>`;
  document.getElementById("modal").innerHTML = `
    ${imgHTML}
    <div class="m-body">
      <span class="m-tag" style="background:${data.color}">${cat} · ${p}</span>
      <div class="m-q">${qd.q}</div>
      <div class="options">${optHTML}</div>
      <div class="feedback" id="feedback"></div>
      <button class="next-btn" id="nextBtn" onclick="closeModal()">Далее</button>
    </div>`;
  document.getElementById("overlay").classList.add("open");
}

function choose(i) {
  const { cat, p } = activeKey;
  const qd = quizData[cat].questions[p];
  const opts = document.querySelectorAll(".opt");
  opts.forEach((o) => (o.disabled = true));
  const correct = currentOptions.findIndex((o) => o.correct), fb = document.getElementById("feedback");
  opts[correct].classList.add("correct");
  opts[correct].querySelector(".marker").textContent = "✓";
  answered++;
  if (i === correct) {
    score += p; correctCount++;
    fb.textContent = `Правильно! +${p} 🎉 ${qd.comment || ""}`;
    fb.className = "feedback ok";
    confettiBurst();
  } else {
    opts[i].classList.add("wrong");
    opts[i].querySelector(".marker").textContent = "✕";
    fb.textContent = `Не совсем 😔 ${qd.comment || ""}`;
    fb.className = "feedback no";
  }
  document.getElementById(`tile-${cat}-${p}`).classList.add("done");
  updateScore();
  document.getElementById("nextBtn").classList.add("show");
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
  if (answered >= TOTAL) showFinale();
}

function updateScore() {
  document.getElementById("scoreNum").textContent = score;
  document.getElementById("answeredNum").textContent = `${answered}/${TOTAL}`;
  document.getElementById("correctNum").textContent = correctCount;
}

function showFinale() {
  document.getElementById("finaleHeading").textContent = FINALE_TITLE;
  document.getElementById("finalScore").textContent = score;
  let msg;
  if (correctCount === TOTAL) msg = `Perfect score! ${correctCount} of ${TOTAL}! 👑`;
  else if (correctCount >= TOTAL * 0.75) msg = `Amazing! ${correctCount} of ${TOTAL} correct ⭐`;
  else if (correctCount >= TOTAL * 0.5) msg = `Nice job! ${correctCount} of ${TOTAL} correct 👏`;
  else msg = `${correctCount} of ${TOTAL} correct — room to grow 💪`;
  document.getElementById("finalText").textContent = msg;
  document.getElementById("finale").classList.add("open");
  bigConfetti();
}

const COLORS = ["#FFC845","#FF5C8A","#7C5CFC","#14B8A6","#F5A23D","#FF8FB1","#9B8CFF"];

function makeBgConfetti() {
  const c = document.getElementById("bgConfetti");
  for (let k = 0; k < 34; k++) {
    const i = document.createElement("i");
    i.style.left = Math.random() * 100 + "%";
    i.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    i.style.animationDuration = 6 + Math.random() * 7 + "s";
    i.style.animationDelay = -Math.random() * 10 + "s";
    i.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    c.appendChild(i);
  }
}

function confettiBurst() {
  const b = document.getElementById("burst");
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  for (let k = 0; k < 28; k++) {
    const i = document.createElement("i");
    i.style.left = cx + "px"; i.style.top = cy + "px";
    i.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    const ang = Math.random() * Math.PI * 2, dist = 110 + Math.random() * 170;
    i.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    i.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    b.appendChild(i);
    setTimeout(() => i.remove(), 900);
  }
}

function bigConfetti() {
  const b = document.getElementById("burst");
  for (let k = 0; k < 80; k++) {
    const i = document.createElement("i");
    i.style.left = Math.random() * window.innerWidth + "px";
    i.style.top = "-12px";
    i.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    i.style.setProperty("--dx", Math.random() * 200 - 100 + "px");
    i.style.setProperty("--dy", window.innerHeight + 40 + "px");
    i.style.animationDuration = 1.4 + Math.random() * 1.3 + "s";
    b.appendChild(i);
    setTimeout(() => i.remove(), 2800);
  }
}

makeBgConfetti();
