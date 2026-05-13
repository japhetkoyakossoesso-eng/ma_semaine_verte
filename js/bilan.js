/* js/bilan.js — Total hebdomadaire + comparaisons */

function afficherBilanTotal() {
  var total = getTotalBilan();
  var el = document.getElementById("total-bilan-val");
  if (el) { el.textContent = total.toFixed(1); }

  var twin = document.getElementById("twin-chiffre");
  if (twin) { twin.textContent = getCarboneTwin(); }

  var pct = Math.round((total / 39) * 100);
  var mention = document.getElementById("mention-nationale");
  if (mention) { mention.textContent = pct + "% de la moyenne nationale (39 kgCO2e/sem.)"; }

  var barre = document.getElementById("barre-nationale-bilan");
  if (barre) { barre.style.width = Math.min(pct, 100) + "%"; }
}

function mettreAJourBarre(idCritere, valeur, max) {
  var barre = document.getElementById("barre-" + idCritere);
  var label = document.getElementById("val-barre-" + idCritere);
  var largeur = max > 0 ? Math.min((valeur / max) * 100, 100) : 4;
  if (barre) { barre.style.width = largeur + "%"; }
  if (label) { label.textContent = valeur.toFixed(1) + " kg"; }
}

function afficherJours() {
  var total = getTotalBilan();
  var jours = [0.18, 0.22, 0.16, 0.27, 0.17].map(function(p){ return total * p; });
  var noms = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
  var cont = document.getElementById("grille-jours-bilan");
  if (!cont) { return; }
  var html = "";
  for (var i = 0; i < noms.length; i++) {
    var classe = jours[i] < 4 ? "jour-vert" : (jours[i] < 7 ? "jour-orange" : "jour-rouge");
    var valClasse = jours[i] < 4 ? "val-vert" : (jours[i] < 7 ? "val-orange" : "val-rouge");
    html += '<div class="carte-jour '+classe+'"><div class="nom-jour">'+noms[i]+'</div><div class="val-jour '+valClasse+'">'+jours[i].toFixed(1)+'</div></div>';
  }
  cont.innerHTML = html;
}

function rafraichirBilan() {
  var b = lireBilan();
  afficherBilanTotal();
  var max = Math.max(b.trajet, b.repas, b.numerique, b.electromenager, b.achats, 1);
  mettreAJourBarre("trajet", b.trajet, max);
  mettreAJourBarre("repas", b.repas, max);
  mettreAJourBarre("numerique", b.numerique, max);
  mettreAJourBarre("electromenager", b.electromenager, max);
  mettreAJourBarre("achats", b.achats, max);
  afficherJours();
  if (typeof creerGraphiqueBilan === "function") { creerGraphiqueBilan(); }
}

document.addEventListener("DOMContentLoaded", rafraichirBilan);
