function afficherPage(page, lienClique) {

  const liens = document.querySelectorAll('nav a');
  for (const lien of liens) {
    lien.className = '';
  }

  if (lienClique !== null) {
    lienClique.className = 'active';
  }

  const pages = document.querySelectorAll('.page');
  for (const p of pages) {
    p.style.display = 'none';
  }

  const cible = document.getElementById('page-' + page);
  if (cible !== null) {
    cible.style.display = 'block';
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
  if (el === null) { return; }
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

function mettreAJourNom(nom) {
  const elements = document.querySelectorAll('.nom-utilisateur');
  for (const el of elements) {
    el.textContent = nom;
  }
}

function validerNom() {
  const input = document.getElementById('input-nom');
  const nom   = input.value.trim();

  if (nom === '') {
    input.style.borderColor = '#ef4444';
    input.placeholder       = 'Entrez votre prénom !';
    return;
  }

  nomUtilisateur = nom;

  mettreAJourNom(nom);

  mettreAJourAvatar(nom);

  mettreAJourGraphiquePromo();

  document.getElementById('form-nom').style.display      = 'none';
  document.getElementById('affichage-nom').style.display = 'block';
}

function modifierNom() {
  document.getElementById('form-nom').style.display      = 'block';
  document.getElementById('affichage-nom').style.display = 'none';
  document.getElementById('input-nom').value             = nomUtilisateur;
  document.getElementById('input-nom').focus();
}
