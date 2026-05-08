let nomUtilisateur = '';

function changer(idArticle, delta) {
  quantites[idArticle] = quantites[idArticle] + delta;

  if (quantites[idArticle] < 0) {
    quantites[idArticle] = 0;
  }

  afficherQuantite(idArticle, quantites[idArticle]);

  const total = calculerTotal();
  afficherTotalCritere5(total);
  afficherTotalAccueil(total);
}

function setEco(actif) {
  ecoLivraison = actif;
  afficherToggleEco(actif);

  const total = calculerTotal();
  afficherTotalCritere5(total);
  afficherTotalAccueil(total);
}

function mettreAJourAvatar(nom) {
  const avatar = document.getElementById('avatar-moi');
  if (avatar !== null) {
    avatar.textContent = nom.charAt(0).toUpperCase();
  }
}

document.addEventListener('DOMContentLoaded', function() {

  chargerVetements();
  const liens = document.querySelectorAll('nav a');
  for (const lien of liens) {
    lien.addEventListener('click', function(e) {
      e.preventDefault();
      const texte = lien.textContent.trim();

      if (texte === 'C5 Achats') {
        afficherPage('critere5', lien);
      } else if (texte === 'Fonctions') {
        afficherPage('fonctions', lien);
      } else if (texte === 'Bilan') {
        afficherPage('bilan', lien);
      } else if (texte === 'Promo') {
        afficherPage('promo', lien);
      } else {
        afficherPage('accueil', lien);
      }
    });
  }
  const inputNom = document.getElementById('input-nom');
  if (inputNom !== null) {
    inputNom.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        validerNom();
      }
    });
  }

});
