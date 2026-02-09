const menuGrid = document.getElementById("menuGrid");
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

function renderMenu() {
  menuGrid.innerHTML = "";
  games.forEach((game) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-button";
    button.setAttribute("role", "listitem");
    button.dataset.key = game.key;

    button.innerHTML = `
      <div>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
      </div>
      <div class="card-footer" style="color: ${game.accent};">
        <span>Instellen</span>
        <span>•</span>
        <span>Start</span>
      </div>
    `;

    button.addEventListener("click", () => {
      state.selectedKey = game.key;
      updatePanel(game);
      updateSelection();
      syncConfigDefaults();
      showScreen("config");
    });

    menuGrid.appendChild(button);
  });
}

function updateSelection() {
  document.querySelectorAll(".menu-button").forEach((button) => {
    const isSelected = button.dataset.key === state.selectedKey;
    button.classList.toggle("selected", isSelected);
  });

  navConfig.disabled = !state.selectedKey;
  navPlay.disabled = !state.selectedKey;
}

function updatePanel(game) {
  if (!game) {
    panelTitle.textContent = "Selecteer een spel";
    panelContent.innerHTML =
      "<p>Kies een spel om de instellingen, modes en scoreflow te zien.</p>";
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

  const flowHtml = `
    <div>
      <span class="tag">Scoreherkenning</span>
      <ol>
        <li>Camera herkent darts of score-input.</li>
        <li>Speler bevestigt of past de score aan.</li>
        <li>Score wordt verwerkt in het spel.</li>
      </ol>
    </div>
  `;

  panelContent.innerHTML = `
    <p>${game.description}</p>
    ${settingsHtml}
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

renderMenu();
updatePanel(null);
updateSelection();
showScreen("start");
updateBotVisibility();
renderScores();
