const DONNEES_PROMO = [
  { label: 'Etudiant A', valeur: 18.3, couleur: '#a78bfa', estMoi: false },
  { label: 'Etudiant B', valeur: 21.7, couleur: '#fb923c', estMoi: false },
  { label: 'Toi',        valeur: 34.7, couleur: '#4ade80', estMoi: true  },
  { label: 'Etudiant C', valeur: 27.5, couleur: '#fca5a5', estMoi: false },
  { label: 'Etudiant D', valeur: 31.2, couleur: '#d1d5db', estMoi: false }
];

let instanceChart = null;

function construireLabels() {
  let labels = [];
  for (const etudiant of DONNEES_PROMO) {
    if (etudiant.estMoi && nomUtilisateur !== '') {
      labels.push('Toi (' + nomUtilisateur + ')');
    } else {
      labels.push(etudiant.label);
    }
  }
  return labels;
}

function construireValeurs() {
  let valeurs = [];
  for (const etudiant of DONNEES_PROMO) {
    valeurs.push(etudiant.valeur);
  }
  return valeurs;
}

function construireCouleurs() {
  let couleurs = [];
  for (const etudiant of DONNEES_PROMO) {
    couleurs.push(etudiant.couleur);
  }
  return couleurs;
}

function creerGraphiquePromo() {
  const canvas = document.getElementById('graphique-promo');
  if (canvas === null) { return; }

  const ctx = canvas.getContext('2d');

  if (instanceChart !== null) {
    instanceChart.destroy();
  }

  const labels   = construireLabels();
  const valeurs  = construireValeurs();
  const couleurs = construireCouleurs();

  const moyenneNationale = 39;

  instanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Empreinte (kgCO2e)',
          data: valeurs,
          backgroundColor: couleurs,
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'Moyenne nationale (39 kg)',
          data: [moyenneNationale, moyenneNationale, moyenneNationale, moyenneNationale, moyenneNationale],
          type: 'line',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ' ' + ctx.parsed.y + ' kgCO2e';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          title: {
            display: true,
            text: 'kgCO2e / semaine'
          },
          grid: { color: '#e5e7eb' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function mettreAJourGraphiquePromo() {
  if (instanceChart === null) { return; }

  const labels = construireLabels();
  instanceChart.data.labels = labels;
  instanceChart.update();
}
