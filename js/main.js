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

document.addEventListener('DOMContentLoaded', function() {

  chargerVetements();
  
  const liens = document.querySelectorAll('nav a');
  for (const lien of liens) {
    lien.addEventListener('click', function(e) {
      e.preventDefault();
      if (lien.textContent === 'C5 Achats') {
        afficherPage('critere5', lien);
      } else {
        afficherPage('accueil', lien);
      }
    });
  }

});
