// ---- VARIABLES ----

// Douche
var typeChauffe  = "electrique";
var nbDouches    = 7;
var dureeDouche  = 7;

// Électroménager
var ecvAppareil    = 37.80; // kgCO2e (durée de vie), mis à jour par l'API
var nbUtilisations = 3;

// Chauffage
var facteurChauffage = 150; // gCO2e/m2/an, mis à jour par l'API
var surfaceLogement  = 25;
var tempConsigne     = 19;


// ---- CALCULS ----

function calculerDouche() {
  var facteur = (typeChauffe === "gaz") ? 70 : 30; // gCO2e/min
  return nbDouches * dureeDouche * facteur;
}

function calculerElectro() {
  // ECV réparti sur 10 ans (520 semaines), converti en grammes
  var parUtilisation = (ecvAppareil * 1000) / 520;
  return nbUtilisations * parUtilisation;
}

function calculerChauffage() {
  var baseHebdo  = (facteurChauffage * surfaceLogement) / 52;
  var ajustement = 1 - (20 - tempConsigne) * 0.07; // -7% par degré sous 20°C
  var resultat   = baseHebdo * ajustement;
  return resultat < 0 ? 0 : resultat;
}

// Affiche en g ou kg selon la valeur
function afficherCO2(valeur) {
  return valeur >= 1000
    ? (valeur / 1000).toFixed(2) + " kg CO2e"
    : Math.round(valeur) + " g CO2e";
}


// ---- MISE À JOUR DE L'AFFICHAGE ----

function mettreAJour() {
  var d = calculerDouche();
  var e = calculerElectro();
  var c = calculerChauffage();
  var total = d + e + c;

  document.getElementById("co2-douche-val").textContent    = afficherCO2(d);
  document.getElementById("co2-electro-val").textContent   = afficherCO2(e);
  document.getElementById("co2-chauffage-val").textContent = afficherCO2(c);

  document.getElementById("co2-douche-pilule").textContent    = afficherCO2(d);
  document.getElementById("co2-electro-pilule").textContent   = afficherCO2(e);
  document.getElementById("co2-chauffage-pilule").textContent = afficherCO2(c);

  document.getElementById("bilan-douche").textContent    = afficherCO2(d);
  document.getElementById("bilan-electro").textContent   = afficherCO2(e);
  document.getElementById("bilan-chauffage").textContent = afficherCO2(c);
  document.getElementById("bilan-total").textContent     = afficherCO2(total);
}


// ---- INTERACTIONS ----

// Ouvre ou ferme un bloc
function toggleBloc(nomBloc) {
  var corps   = document.getElementById("corps-" + nomBloc);
  var chevron = document.getElementById("chevron-" + nomBloc);

  if (corps.classList.contains("cache")) {
    corps.classList.remove("cache");
    chevron.classList.add("ouvert");
  } else {
    corps.classList.add("cache");
    chevron.classList.remove("ouvert");
  }
}

// Gère les boutons toggle (chauffe-eau)
function selectionnerToggle(nomChamp, valeur, boutonClique) {
  if (nomChamp === "chauffe") {
    typeChauffe = valeur;
    document.getElementById("info-chauffe").textContent = valeur === "gaz"
      ? "70 gCO2e/min — gaz naturel"
      : "30 gCO2e/min — électricité nucléaire";
  }

  var boutons = document.getElementById("groupe-" + nomChamp).getElementsByClassName("btn-toggle");
  for (var i = 0; i < boutons.length; i++) {
    boutons[i].classList.remove("actif");
  }
  boutonClique.classList.add("actif");

  mettreAJour();
}

// Stepper +/-
function modifierStepper(nomChamp, delta) {
  var element = document.getElementById(nomChamp);
  var valeur  = parseInt(element.textContent) + delta;

  if (nomChamp === "nb-douches") {
    if (valeur < 0)  valeur = 0;
    if (valeur > 21) valeur = 21;
    nbDouches = valeur;
  }

  if (nomChamp === "nb-electro") {
    if (valeur < 0)  valeur = 0;
    if (valeur > 21) valeur = 21;
    nbUtilisations = valeur;
  }

  element.textContent = valeur;
  mettreAJour();
}

// Sliders
function mettreAJourSlider(nomSlider, valeur) {
  valeur = parseInt(valeur);

  if (nomSlider === "duree") {
    dureeDouche = valeur;
    document.getElementById("val-duree").textContent = valeur + " min";
  }

  if (nomSlider === "surface") {
    surfaceLogement = valeur;
    document.getElementById("val-surface").textContent = valeur + " m²";
  }

  if (nomSlider === "temp-chauf") {
    tempConsigne = valeur;
    document.getElementById("val-temp-chauf").textContent = valeur + " °C";
    document.getElementById("info-temp-chauf").textContent = valeur <= 19
      ? valeur + " °C — recommandation ADEME"
      : valeur + " °C — chaque degré de plus = +7% d'émissions";
  }

  mettreAJour();
}

// Select chauffage
function calculerChauffage_select() {
  facteurChauffage = parseFloat(document.getElementById("select-chauffage").value);
  mettreAJour();
}

// Select électroménager
function changerAppareil() {
  var select      = document.getElementById("select-electro");
  ecvAppareil     = parseFloat(select.value);
  var nom         = select.options[select.selectedIndex].textContent;
  document.getElementById("info-electro").textContent = nom + " — ECV : " + ecvAppareil.toFixed(2) + " kgCO2e";
  mettreAJour();
}


// ---- API ADEME ----

// Chauffage : /api/v1/chauffage
function chargerDonneesAPI() {
  document.getElementById("statut-api").textContent = "Chargement...";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://impactco2.fr/api/v1/chauffage?language=fr", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      remplirSelectChauffage(JSON.parse(xhr.responseText).data);
      document.getElementById("statut-api").textContent = "✓ ADEME";
    } else {
      document.getElementById("statut-api").textContent = "Données par défaut";
    }
  };
  xhr.onerror = function() {
    document.getElementById("statut-api").textContent = "Données par défaut";
  };
  xhr.send();
}

function remplirSelectChauffage(liste) {
  var select = document.getElementById("select-chauffage");
  select.innerHTML = "";
  for (var i = 0; i < liste.length; i++) {
    var option = document.createElement("option");
    option.value       = liste[i].ecv;
    option.textContent = liste[i].name;
    select.appendChild(option);
  }
  facteurChauffage = parseFloat(select.value);
  mettreAJour();
}

// Électroménager : /api/v1/thematiques/ecv/6
function chargerDonneesElectro() {
  document.getElementById("statut-api-electro").textContent = "Chargement...";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://impactco2.fr/api/v1/thematiques/ecv/6?detail=1&language=fr", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      remplirSelectElectro(JSON.parse(xhr.responseText).data);
      document.getElementById("statut-api-electro").textContent = "✓ ADEME";
    } else {
      document.getElementById("statut-api-electro").textContent = "Données par défaut";
    }
  };
  xhr.onerror = function() {
    document.getElementById("statut-api-electro").textContent = "Données par défaut";
  };
  xhr.send();
}

function remplirSelectElectro(liste) {
  var select = document.getElementById("select-electro");
  select.innerHTML = "";
  for (var i = 0; i < liste.length; i++) {
    var option = document.createElement("option");
    option.value       = liste[i].ecv; // kgCO2e durée de vie
    option.textContent = liste[i].name;
    select.appendChild(option);
  }
  ecvAppareil = parseFloat(select.value);
  document.getElementById("info-electro").textContent = select.options[0].textContent + " — ECV : " + ecvAppareil.toFixed(2) + " kgCO2e";
  mettreAJour();
}


// ---- INITIALISATION ----

mettreAJour();
chargerDonneesAPI();
chargerDonneesElectro();