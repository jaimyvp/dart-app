const menuButtons = document.querySelectorAll(".menu-button");
const gameGrid = document.getElementById("gameGrid");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const navHome = document.getElementById("navHome");
const navConfig = document.getElementById("navConfig");
const navPlay = document.getElementById("navPlay");
const screenStart = document.getElementById("screenStart");
const screenConfig = document.getElementById("screenConfig");
const screenPlay = document.getElementById("screenPlay");
const configTitle = document.getElementById("configTitle");
const configGameMode = document.getElementById("configGameMode");
const configForm = document.getElementById("configForm");
const configBotLevel = document.getElementById("configBotLevel");
const configCameraFlow = document.getElementById("configCameraFlow");
const configStartGame = document.getElementById("configStartGame");
const configBack = document.getElementById("configBack");
const playerScore = document.getElementById("playerScore");
const playerLegs = document.getElementById("playerLegs");
const botScore = document.getElementById("botScore");
const botLegs = document.getElementById("botLegs");
const botCard = document.getElementById("botCard");
const suggestedScore = document.getElementById("suggestedScore");
const confirmedScore = document.getElementById("confirmedScore");
const confirmScore = document.getElementById("confirmScore");
const undoScore = document.getElementById("undoScore");
const scoreStatus = document.getElementById("scoreStatus");
const cameraFeed = document.getElementById("cameraFeed");
const cameraStart = document.getElementById("cameraStart");
const cameraStop = document.getElementById("cameraStop");
const captureScore = document.getElementById("captureScore");
const openCalibration = document.getElementById("openCalibration");
const closeCalibration = document.getElementById("closeCalibration");
const calibrationModal = document.getElementById("calibrationModal");
const boardCenterX = document.getElementById("boardCenterX");
const boardCenterY = document.getElementById("boardCenterY");
const boardRadius = document.getElementById("boardRadius");
const saveCalibration = document.getElementById("saveCalibration");
const resetViewButton = document.getElementById("resetView");
const startGameButton = document.getElementById("startGame");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const resetViewButton = document.getElementById("resetView");

const games = [
  {
    key: "around-the-clock",
    title: "Around the Clock",
    description: "Werk van 1 naar 20 of speel vrijuit, met optionele bull finish.",
    accent: "#f4b740",
    settings: [
      "Volgorde: sequentieel (1→20) of vrijuit",
      "Startwaarde: 1 of 5",
      "Bull finish: aan/uit",
      "Aantal rondes: 1-3",
      "Turn limit per nummer: optioneel",
    ],
  },
  {
    key: "501",
    title: "501",
    description: "Klassieke leg-based 501 met instelbare in/out en bots.",
    accent: "#4ac7f5",
    settings: [
      "Straight in / double in",
      "Double out (standaard) of master out",
      "Win met 2 legs verschil",
      "Sets & legs instelbaar",
      "Bust rule: standaard dartcounter",
    ],
    botLevels: [
      "1: gemiddeld 20–25",
      "2: gemiddeld 26–30",
      "3: gemiddeld 31–35",
      "4: gemiddeld 36–40",
      "5-10: doorlopend per +5 punten",
      "11-17: +5 punten per level",
      "18: gemiddeld 110+",
    ],
  },
  {
    key: "singles-training",
    title: "Singles Training",
    description: "Focus op enkelvoudige segmenten met tempo en accuracy.",
    accent: "#8b6dff",
    settings: [
      "Doel: enkelvoudige nummers 1-20",
      "Rotatie na x beurten",
      "Score target per training",
      "Streak bonus optioneel",
    ],
  },
  {
    key: "doubles-training",
    title: "Doubles Training",
    description: "Gericht oefenen op dubbels met spelmodi.",
    accent: "#58d68d",
    settings: [
      "Doubles only (1-20 + bull)",
      "Volgorde: sequentieel of vrij",
      "Penalty voor miss: aan/uit",
      "Aantal beurten per double",
    ],
  },
];

const botAverages = [
  { level: 1, min: 20, max: 25 },
  { level: 2, min: 26, max: 30 },
  { level: 3, min: 31, max: 35 },
  { level: 4, min: 36, max: 40 },
  { level: 5, min: 41, max: 45 },
  { level: 6, min: 46, max: 50 },
  { level: 7, min: 51, max: 55 },
  { level: 8, min: 56, max: 60 },
  { level: 9, min: 61, max: 65 },
  { level: 10, min: 66, max: 70 },
  { level: 11, min: 71, max: 75 },
  { level: 12, min: 76, max: 80 },
  { level: 13, min: 81, max: 85 },
  { level: 14, min: 86, max: 90 },
  { level: 15, min: 91, max: 95 },
  { level: 16, min: 96, max: 100 },
  { level: 17, min: 101, max: 105 },
  { level: 18, min: 110, max: 120 },
];

const state = {
  selectedKey: null,
  screen: "start",
  config: {
    legs: 3,
    winByTwo: true,
    inRule: "straight",
    outRule: "double",
    botLevel: "off",
    clockOrder: "sequential",
    clockBull: false,
    cameraFlow: "semi",
  },
  calibration: {
    centerX: 320,
    centerY: 180,
    radius: 160,
  },
  game: {
    playerScore: 501,
    botScore: 501,
    playerLegs: 0,
    botLegs: 0,
    history: [],
  },
  cameraStream: null,
};

function bindMenuButtons() {
  menuButtons.forEach((button) => {
    const gameKey = button.dataset.key;
    button.addEventListener("click", () => {
      const game = games.find((item) => item.key === gameKey);
      if (!game) {
        return;
      }
let selectedKey = null;

function renderCards() {
  gameGrid.innerHTML = "";
  games.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.setAttribute("role", "listitem");
    card.dataset.key = game.key;

    card.innerHTML = `
      <div>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
      </div>
      <div class="card-footer" style="color: ${game.accent};">
        <span>Instellingen</span>
        <span>•</span>
        <span>Startscherm</span>
      </div>
    `;

    card.addEventListener("click", () => {
      state.selectedKey = game.key;
      updatePanel(game);
      updateSelection();
      syncConfigDefaults();
      showScreen("config");
    });
      selectedKey = game.key;
      updatePanel(game);
      updateSelection();
    });

    gameGrid.appendChild(card);
  });
}

function updateSelection() {
  document.querySelectorAll(".menu-button").forEach((button) => {
    const isSelected = button.dataset.key === state.selectedKey;
    button.classList.toggle("selected", isSelected);
  document.querySelectorAll(".game-card").forEach((card) => {
    const isSelected = card.dataset.key === state.selectedKey;
    card.classList.toggle("selected", isSelected);
  });

  navConfig.disabled = !state.selectedKey;
  navPlay.disabled = !state.selectedKey;
    const isSelected = card.dataset.key === selectedKey;
    card.classList.toggle("selected", isSelected);
  });

  startGameButton.disabled = !selectedKey;
const layout = {
  padding: 48,
  cardWidth: 280,
  cardHeight: 150,
  gap: 32,
};

let selectedKey = null;

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const title = "Kies je spelmodus";
  ctx.fillStyle = "#f4f7ff";
  ctx.font = "700 34px Inter, sans-serif";
  ctx.fillText(title, layout.padding, 64);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText(
    "Instellingen geïnspireerd op dartcounter + semi-automatische scoreherkenning",
    layout.padding,
    96
  );

  const startX = layout.padding;
  const startY = 140;
  games.forEach((game, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (layout.cardWidth + layout.gap);
    const y = startY + row * (layout.cardHeight + layout.gap);

    game.hitBox = { x, y, width: layout.cardWidth, height: layout.cardHeight };

    const isSelected = game.key === selectedKey;
    ctx.fillStyle = isSelected ? "rgba(74, 199, 245, 0.15)" : "#111827";
    ctx.strokeStyle = isSelected ? game.accent : "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 2;

    roundRect(ctx, x, y, layout.cardWidth, layout.cardHeight, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = game.accent;
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillText(game.title, x + 20, y + 40);

    ctx.fillStyle = "#d1d9e6";
    ctx.font = "14px Inter, sans-serif";
    wrapText(ctx, game.description, x + 20, y + 70, layout.cardWidth - 40, 18);

    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(x + 20, y + layout.cardHeight - 42, 80, 24);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("Instellingen", x + 30, y + layout.cardHeight - 25);
  });

  ctx.fillStyle = "#0ea5e9";
  ctx.font = "600 16px Inter, sans-serif";
  ctx.fillText("Semi-automatische scoreherkenning", layout.padding, 520);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px Inter, sans-serif";
  wrapText(
    ctx,
    "De app stelt scores voor op basis van camera-analyse, gebruiker bevestigt of past aan.",
    layout.padding,
    545,
    520,
    18
  );
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  words.forEach((word) => {
    const testLine = `${line}${word} `;
    const { width } = context.measureText(testLine);
    if (width > maxWidth && line) {
      context.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  context.fillText(line, x, y);
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function updatePanel(game) {
  if (!game) {
    panelTitle.textContent = "Selecteer een spel";
    panelContent.innerHTML =
      "<p>Kies een spel om de instellingen, modes en scoreflow te zien.</p>";
      "<p>Kies een spel op het canvas om de instellingen en opties te zien.</p>";
    return;
  }

  panelTitle.textContent = game.title;

  const settingsHtml = game.settings
    ? `
      <div>
        <span class="tag">Instellingen</span>
        <ul>
          ${game.settings.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `
    : "";

  const botHtml = game.botLevels
    ? `
      <div>
        <span class="tag">Dartbot levels</span>
        <ul>
          ${game.botLevels.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `
    : "";

  const flowHtml = `
    <div>
      <span class="tag">Scoreherkenning</span>
      <ol>
        <li>Camera herkent darts of score-input.</li>
        <li>Speler bevestigt of past de score aan.</li>
        <li>Score wordt verwerkt in het spel.</li>
      </ol>
  const scoringHtml = `
    <div>
      <span class="tag">Scoreherkenning</span>
      <p>Camera herkent darts, gebruiker bevestigt of past de score aan.</p>
    </div>
  `;

  panelContent.innerHTML = `
    <p>${game.description}</p>
    ${settingsHtml}
    ${botHtml}
    ${flowHtml}
  `;
}

function showScreen(nextScreen) {
  state.screen = nextScreen;
  screenStart.classList.toggle("hidden", nextScreen !== "start");
  screenConfig.classList.toggle("hidden", nextScreen !== "config");
  screenPlay.classList.toggle("hidden", nextScreen !== "play");
}

function syncConfigDefaults() {
  const game = games.find((item) => item.key === state.selectedKey);
  configTitle.textContent = game ? `${game.title} configuratie` : "Spelconfiguratie";
  configGameMode.value = game ? game.title : "";
  configForm.reset();
  configGameMode.value = game ? game.title : "";
  updateConfigFromForm();
}

function updateConfigFromForm() {
  state.config.legs = Number(document.getElementById("configLegs").value);
  state.config.winByTwo = document.getElementById("configWinByTwo").value === "true";
  state.config.inRule = document.getElementById("configInRule").value;
  state.config.outRule = document.getElementById("configOutRule").value;
  state.config.botLevel = document.getElementById("configBotLevel").value;
  state.config.clockOrder = document.getElementById("configClockOrder").value;
  state.config.clockBull = document.getElementById("configClockBull").value === "true";
  state.config.cameraFlow = document.getElementById("configCameraFlow").value;
  updateBotVisibility();
}

function updateBotVisibility() {
  const isBotEnabled = state.selectedKey === "501" && state.config.botLevel !== "off";
  botCard.classList.toggle("hidden", !isBotEnabled);
}

function resetGame() {
  state.game.playerScore = 501;
  state.game.botScore = 501;
  state.game.playerLegs = 0;
  state.game.botLegs = 0;
  state.game.history = [];
  renderScores();
}

function renderScores() {
  playerScore.textContent = state.game.playerScore;
  botScore.textContent = state.game.botScore;
  playerLegs.textContent = state.game.playerLegs;
  botLegs.textContent = state.game.botLegs;
}

function getBotAverage(level) {
  const bot = botAverages.find((entry) => entry.level === Number(level));
  if (!bot) {
    return 0;
  }
  return Math.round((bot.min + bot.max) / 2);
}

function applyScore(scoreValue) {
  const startingScore = state.game.playerScore;
  const nextScore = Math.max(startingScore - scoreValue, 0);
  state.game.playerScore = nextScore;
  state.game.history.push({ type: "player", score: scoreValue });

  if (state.config.botLevel !== "off" && state.selectedKey === "501") {
    const botAverage = getBotAverage(state.config.botLevel);
    const botScoreValue = Math.max(0, Math.min(180, botAverage + randomBetween(-10, 10)));
    state.game.botScore = Math.max(state.game.botScore - botScoreValue, 0);
    state.game.history.push({ type: "bot", score: botScoreValue });
  }

  renderScores();
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function suggestScore() {
  const base = randomBetween(20, 100);
  suggestedScore.value = base;
  confirmedScore.value = base;
  scoreStatus.textContent = "Scorevoorstel klaar, bevestig of pas aan.";
}

function confirmScoreEntry() {
  const scoreValue = Number(confirmedScore.value);
  if (Number.isNaN(scoreValue) || scoreValue < 0) {
    scoreStatus.textContent = "Ongeldige score.";
    return;
  }

  applyScore(scoreValue);
  scoreStatus.textContent = `Score ${scoreValue} verwerkt.`;
}

function undoLastScore() {
  const last = state.game.history.pop();
  if (!last) {
    scoreStatus.textContent = "Geen score om terug te draaien.";
    return;
  }

  if (last.type === "player") {
    state.game.playerScore += last.score;
  } else {
    state.game.botScore += last.score;
  }

  renderScores();
  scoreStatus.textContent = "Laatste score ongedaan gemaakt.";
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    scoreStatus.textContent = "Camera niet beschikbaar in deze browser.";
    return;
  }

  state.cameraStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false,
  });
  cameraFeed.srcObject = state.cameraStream;
  cameraStart.disabled = true;
  cameraStop.disabled = false;
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((track) => track.stop());
    state.cameraStream = null;
  }
  cameraFeed.srcObject = null;
  cameraStart.disabled = false;
  cameraStop.disabled = true;
}

function openCalibrationModal() {
  calibrationModal.classList.remove("hidden");
  boardCenterX.value = state.calibration.centerX;
  boardCenterY.value = state.calibration.centerY;
  boardRadius.value = state.calibration.radius;
}

function closeCalibrationModal() {
  calibrationModal.classList.add("hidden");
}

function saveCalibrationValues() {
  state.calibration.centerX = Number(boardCenterX.value);
  state.calibration.centerY = Number(boardCenterY.value);
  state.calibration.radius = Number(boardRadius.value);
  closeCalibrationModal();
  scoreStatus.textContent = "Calibratie opgeslagen.";
}

navHome.addEventListener("click", () => showScreen("start"));
navConfig.addEventListener("click", () => showScreen("config"));
navPlay.addEventListener("click", () => {
  showScreen("play");
  resetGame();
});
configBack.addEventListener("click", () => showScreen("start"));
configStartGame.addEventListener("click", () => {
  showScreen("play");
  resetGame();
});

configForm.addEventListener("change", updateConfigFromForm);
configForm.addEventListener("input", updateConfigFromForm);

captureScore.addEventListener("click", suggestScore);
confirmScore.addEventListener("click", confirmScoreEntry);
undoScore.addEventListener("click", undoLastScore);

cameraStart.addEventListener("click", () => {
  startCamera().catch(() => {
    scoreStatus.textContent = "Camera toegang geweigerd.";
  });
});

cameraStop.addEventListener("click", stopCamera);

openCalibration.addEventListener("click", openCalibrationModal);
closeCalibration.addEventListener("click", closeCalibrationModal);
saveCalibration.addEventListener("click", saveCalibrationValues);

bindMenuButtons();
renderCards();
updatePanel(null);
updateSelection();
showScreen("start");
updateBotVisibility();
renderScores();
resetViewButton.addEventListener("click", () => {
  selectedKey = null;
  updatePanel(null);
  updateSelection();
});

startGameButton.addEventListener("click", () => {
  if (!selectedKey) {
    return;
  }

  panelContent.insertAdjacentHTML(
    "beforeend",
    "<p><strong>Volgende stap:</strong> configuratieformulier en score-invoer bouwen.</p>"
  );
});

renderCards();
updatePanel(null);
updateSelection();
    ${scoringHtml}
  `;
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  const selectedGame = games.find((game) => {
    const hit = game.hitBox;
    return (
      hit &&
      x >= hit.x &&
      x <= hit.x + hit.width &&
      y >= hit.y &&
      y <= hit.y + hit.height
    );
  });

  if (selectedGame) {
    selectedKey = selectedGame.key;
    updatePanel(selectedGame);
    drawCanvas();
  }
}

resetViewButton.addEventListener("click", () => {
  selectedKey = null;
  updatePanel(null);
  drawCanvas();
});

canvas.addEventListener("click", handleCanvasClick);

window.addEventListener("resize", () => {
  drawCanvas();
});

updatePanel(null);

function adjustCanvasForHiDpi() {
  const { width, height } = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function init() {
  adjustCanvasForHiDpi();
  drawCanvas();
}

init();
