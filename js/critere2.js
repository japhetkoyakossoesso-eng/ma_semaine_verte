const API_KEY = 'e76a93b6-7a74-4d2e-a3ef-2b768dfbe0de';
const API_URL = 'https://impactco2.fr/api/v1/alimentation';

const FALLBACK_MEALS = [
  { id:'vegan',      name:'Vegan',      icon:'🌱', co2:0.30, color:'#1D9E75' },
  { id:'vegetarien', name:'Végétarien', icon:'🥗', co2:0.50, color:'#1D9E75' },
  { id:'poisson',    name:'Poisson',    icon:'🐟', co2:0.80, color:'#378ADD' },
  { id:'volaille',   name:'Volaille',   icon:'🍗', co2:1.10, color:'#BA7517' },
  { id:'boeuf',      name:'Bœuf',       icon:'🥩', co2:5.00, color:'#D85A30' }
];

const MEALS = [...FALLBACK_MEALS];

const counts = {
  vegan:0,
  vegetarien:0,
  poisson:0,
  volaille:0,
  boeuf:0
};
const CAFE_CO2 = 0.06;

let cafes = 0;

function changeCafe(delta) {

  const next = cafes + delta;

  if(next < 0) return;

  cafes = next;

  document.getElementById('cafe-val')
    .textContent = cafes;

  refresh();
}

function setApiStatus(state, text) {

  const badge = document.getElementById('api-status-badge');
  const dot = document.getElementById('api-dot');
  const label = document.getElementById('api-status-text');

  badge.className = 'api-status ' + state;

  if(state === 'ok')
    dot.className = 'dot dot-ok';

  else if(state === 'fallback')
    dot.className = 'dot dot-err';

  else
    dot.className = 'dot dot-loading';

  label.textContent = text;
}

function initAPI() {

  setApiStatus('loading', "Connexion à l'API Impact CO2…");

  fetch(API_URL, {
    headers: {
      'Authorization': 'Bearer ' + API_KEY
    }
  })

  .then(r => r.json())

  .then(() => {
    setApiStatus('ok', 'API connectée');
  })

  .catch(() => {
    setApiStatus('fallback', 'Mode hors ligne — valeurs locales utilisées');
  });

  buildGrid();
  refresh();
}

function buildGrid() {

  const grid = document.getElementById('meal-grid');

  grid.innerHTML = '';

  MEALS.forEach(m => {

    const div = document.createElement('div');

    div.className =
      'meal-card' + (counts[m.id] > 0 ? ' active' : '');

    div.id = 'card-' + m.id;

    div.innerHTML = `
      <div class="meal-icon">${m.icon}</div>

      <div class="meal-name">${m.name}</div>

      <div class="meal-co2">
        ${m.co2.toFixed(2)} kgCO₂e
      </div>

      <div class="counter">

        <button class="cnt-btn"
          onclick="change('${m.id}', -1)">
          −
        </button>

        <span class="cnt-val"
          id="val-${m.id}">
          ${counts[m.id]}
        </span>

        <button class="cnt-btn"
          onclick="change('${m.id}', 1)">
          +
        </button>

      </div>
    `;

    grid.appendChild(div);
  });
}

function totalRepas() {

  return Object.values(counts)
    .reduce((a,b) => a+b, 0);
}

function change(id, delta) {

  const next = counts[id] + delta;

  if(next < 0) return;

  if(delta > 0 && totalRepas() >= 21) {

    document
      .getElementById('alert-21')
      .classList.add('show');

    return;
  }

  document
    .getElementById('alert-21')
    .classList.remove('show');

  counts[id] = next;

  document.getElementById('val-' + id)
    .textContent = next;

  document.getElementById('card-' + id)
    .className =
    'meal-card' + (next > 0 ? ' active' : '');

  refresh();
}

function calcTotal() {

  let total = 0;

  MEALS.forEach(m => {
    total += counts[m.id] * m.co2;
  });

  total += cafes * 7 * CAFE_CO2;

  return total;
}

function refresh() {

  const total = calcTotal();

  document.getElementById('total-num')
    .textContent = total.toFixed(2);

  const badge = document.getElementById('result-badge');

  if(total === 0) {

    badge.className =
      'result-badge badge-green';

    badge.textContent =
      'Saisissez vos repas pour voir votre bilan';

  }

  else if(total < 15) {

    badge.className =
      'result-badge badge-green';

    badge.textContent =
      '✅ Très bon profil alimentaire';

  }

  else if(total < 30) {

    badge.className =
      'result-badge badge-orange';

    badge.textContent =
      '⚠️ Profil modéré';

  }

  else {

    badge.className =
      'result-badge badge-red';

    badge.textContent =
      '🔴 Empreinte élevée';

  }

  const bars = document.getElementById('bars-container');
  const divider = document.getElementById('bars-divider');

  const data = MEALS
    .filter(m => counts[m.id] > 0)
    .map(m => ({
      name: m.name,
      icon: m.icon,
      impact: counts[m.id] * m.co2,
      color: m.color
    }))
    .sort((a,b) => b.impact - a.impact);

  if(data.length === 0) {

    divider.style.display = 'none';
    bars.innerHTML = '';

    return;
  }

  divider.style.display = 'block';

  const max = data[0].impact;

  bars.innerHTML = data.map(m => {

    const width = (m.impact / max) * 100;

    return `
      <div class="bar-row">

        <div class="bar-label"
          style="color:rgba(255,255,255,.8)">

          <span>${m.icon} ${m.name}</span>

          <span>${m.impact.toFixed(2)} kg</span>

        </div>

        <div class="bar-track">

          <div class="bar-fill"
            style="
              width:${width}%;
              background:${m.color};
            ">

            ${m.impact.toFixed(2)} kg

          </div>

        </div>

      </div>
    `;

  }).join('');
}

initAPI();