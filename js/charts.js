/* charts.js — graphiques Chart.js communs */

let graphiqueBilanInstance = null;
let graphiqueCritere4Instance = null;

function creerGraphiqueBilan() {
  const canvas = document.getElementById("graphique-bilan");
  if (!canvas || !window.Chart || typeof lireBilan !== "function") { return; }
  const b = lireBilan();
  if (graphiqueBilanInstance) { graphiqueBilanInstance.destroy(); }
  graphiqueBilanInstance = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Trajet", "Repas", "Numérique", "Électroménager", "Achats"],
      datasets: [{
        label: "kgCO2e / semaine",
        data: [b.trajet, b.repas, b.numerique, b.electromenager, b.achats],
        backgroundColor: ["#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e", "#f97316"],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, title: { display: true, text: "kgCO2e" } }, x: { grid: { display: false } } }
    }
  });
}

function creerGraphiqueCritere4(doucheG, electroG, chauffageG) {
  const canvas = document.getElementById("graphique-electromenager");
  if (!canvas || !window.Chart) { return; }
  const valeurs = [douceurKg(doucheG), douceurKg(electroG), douceurKg(chauffageG)];
  if (graphiqueCritere4Instance) { graphiqueCritere4Instance.destroy(); }
  graphiqueCritere4Instance = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Douche", "Électroménager", "Chauffage"],
      datasets: [{
        data: valeurs,
        backgroundColor: ["#60a5fa", "#22c55e", "#f97316"],
        borderColor: "#ffffff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { callbacks: { label: function(c) { return " " + c.parsed.toFixed(2) + " kgCO2e"; } } }
      }
    }
  });
}

function douceurKg(valeurEnGrammes) {
  return parseFloat((valeurEnGrammes / 1000).toFixed(2));
}
