const gameGrid = document.getElementById("gameGrid");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");
const resetViewButton = document.getElementById("resetView");
const startGameButton = document.getElementById("startGame");

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
      selectedKey = game.key;
      updatePanel(game);
      updateSelection();
    });

    gameGrid.appendChild(card);
  });
}

function updateSelection() {
  document.querySelectorAll(".game-card").forEach((card) => {
    const isSelected = card.dataset.key === selectedKey;
    card.classList.toggle("selected", isSelected);
  });

  startGameButton.disabled = !selectedKey;
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
    </div>
  `;

  panelContent.innerHTML = `
    <p>${game.description}</p>
    ${settingsHtml}
    ${botHtml}
    ${flowHtml}
  `;
}

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
