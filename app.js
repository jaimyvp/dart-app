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
