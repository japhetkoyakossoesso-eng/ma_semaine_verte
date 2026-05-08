function afficherPage(page, lienClique) {

  const liens = document.querySelectorAll('nav a');
  for (const lien of liens) {
    lien.className = '';
  }

  if (lienClique !== null) {
    lienClique.className = 'active';
  }

  if (page === 'critere5') {
    document.getElementById('page-accueil').style.display  = 'none';
    document.getElementById('page-critere5').style.display = 'block';
  } else {
    document.getElementById('page-accueil').style.display  = 'block';
    document.getElementById('page-critere5').style.display = 'none';
  }
}

function allerCritere5() {
  const liens = document.querySelectorAll('nav a');
  for (const lien of liens) {
    if (lien.textContent === 'C5 Achats') {
      afficherPage('critere5', lien);
    }
  }
}

function allerAccueil() {
  const lienAccueil = document.querySelector('nav a');
  afficherPage('accueil', lienAccueil);
}

function afficherQuantite(idArticle, valeur) {
  document.getElementById('qte-' + idArticle).textContent = valeur;
}

function afficherTotalCritere5(valeur) {
  document.getElementById('total-critere5').textContent = valeur.toFixed(1);
}

function afficherTotalAccueil(valeur) {
  document.getElementById('valeur-achats').textContent = valeur.toFixed(1) + ' kg';
}

function afficherStatutAPI(statut) {
  const el = document.getElementById('statut-api');
  if (el === null) {
    return;
  }
  if (statut === 'connectee') {
    el.textContent = '✅ API ADEME connectée — données en direct';
    el.style.color = '#1a5c38';
  } else {
    el.textContent = '⚠️ API inaccessible — données statiques utilisées';
    el.style.color = '#b45309';
  }
}
function afficherToggleEco(actif) {
  document.getElementById('btn-off').className = actif ? ''      : 'actif';
  document.getElementById('btn-on').className  = actif ? 'actif' : '';
}
