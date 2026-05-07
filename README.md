# Ma Semaine Verte — Calculateur d'empreinte carbone étudiant

> Projet universitaire — Département Mathématiques et Informatique  
> Licence MIASHS · Année 2025-2026 · Défi 4

---
## Dépôt GitLab

```
https://mi-git.univ-tlse2.fr/japhet.koyakosso-ess/ma_semaine_verte.git
```
---

## Membres du groupe

| Nom | Rôle principal |
|-----|---------------|
| Koyakosso Esso Japhet | Chef de projet · Critère 5 (Achats & vêtements) |
| Kape Amani Parfait | Critère 1 (Transport) |
| Kaba Ismaël N'Fallah | Critère 2 (Alimentation) |
| Cherigui Boussad | Critère 3 (Numérique) |
| El Abi Abdellah | Critère 4 (Douche & électroménager) |

---

## Description du projet

**Ma Semaine Verte** est une application web qui permet à chaque étudiant d'estimer et de visualiser l'empreinte carbone générée par ses activités universitaires et quotidiennes sur une semaine complète.

L'application couvre 5 critères :

| # | Critère | Source de données |
|---|---------|-------------------|
| 1 | Trajet domicile–université | API Impact CO2 — `/transport` |
| 2 | Repas et alimentation | API Impact CO2 — `/alimentation` + Agribalyse |
| 3 | Numérique | API Impact CO2 — `/numerique` + `/usagenumerique` |
| 4 | Douche et électroménager | Base Empreinte ADEME (JSON statique) |
| 5 | Achats en ligne et vêtements | API Impact CO2 — `/thematiques/ecv/5` + JSON statique |

---

## Structure du projet

```
ma_semaine_verte/
│
├── index.html                  # Page d'accueil — navigation entre les critères
├── bilan.html                  # Bilan hebdomadaire total (Chart.js)
├── README.md
│
├── styles/
│   ├── style.css               # Mise en forme globale
│   └── variables.css           # Variables CSS (couleurs, polices)
│
├── pages/
│   ├── critere1.html           # Transport
│   ├── critere2.html           # Alimentation
│   ├── critere3.html           # Numérique
│   ├── critere4.html           # Douche & électroménager
│   └── critere5.html           # Achats & vêtements 
│
├── js/
│   ├── api.js                  # Requêtes XMLHttpRequest vers l'API ADEME
│   ├── calcul.js               # Formule : empreinte = quantité × ecv
│   ├── bilan.js                # Total hebdomadaire sur les 5 critères
│   ├── charts.js               # Graphiques Chart.js
│   ├── dom.js                  # Manipulation du DOM
│   └── main.js                 # Point d'entrée — addEventListener
│
└── data/
    ├── facteurs_transport.json
    ├── facteurs_alimentation.json
    ├── facteurs_numerique.json
    ├── facteurs_electromenager.json
    └── facteurs_livraison.json  # Fallback livraison (API non exposée)
```

---

##  API utilisée

**API Impact CO2 — ADEME**  
Documentation : [impactco2.fr/doc/api](https://impactco2.fr/doc/api)  
Référence annuaire : [api.gouv.fr/producteurs/ademe](https://api.gouv.fr/producteurs/ademe)

La clé API a été obtenue gratuitement auprès de l'équipe ADEME (impactco2@ademe.fr).

### Exemple d'appel (critère 5 — vêtements)

```javascript
// Requête AJAX avec XMLHttpRequest (cours Nassima DJEMA — CM1)
const xhr = new XMLHttpRequest();
const CLE = "VOTRE_CLE_API";
const url = `https://impactco2.fr/api/v1/thematiques/ecv/5?language=fr&apikey=${CLE}`;

xhr.open("GET", url);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const reponse  = JSON.parse(xhr.responseText);
    const vetements = reponse.data; // tableau des 19 vêtements
    // chaque objet : { name, slug, ecv }  → ecv = kgCO₂e
  }
};

xhr.send();
```

### Formule de calcul

```
Empreinte (kgCO₂e) = Quantité × ecv
```

---

## Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://mi-git.univ-tlse2.fr/japhet.koyakosso-ess/ma_semaine_verte.git
cd ma_semaine_verte
```

### 2. Ouvrir dans un navigateur

Ouvrir directement `index.html` dans votre navigateur, **ou** lancer un petit serveur local pour éviter les erreurs CORS lors des appels API :

```bash
# Avec Python (recommandé)
python -m http.server 8000
# puis ouvrir http://localhost:8000

# Avec Node.js (si installé)
npx serve .
```

> Les appels API nécessitent un serveur HTTP local. Ouvrir le fichier directement avec `file://` peut bloquer les requêtes AJAX.

---


### Critères développés

| Critère | Fichier | Statut |
|---------|---------|--------|
| 5 — Achats & vêtements | `pages/critere5.html` | 
| 1 — Transport | `pages/critere1.html` | 
| 2 — Alimentation | `pages/critere2.html` | 
| 3 — Numérique | `pages/critere3.html` | 
| 4 — Électroménager | `pages/critere4.html` | 
| Bilan | `bilan.html` | 
---

##  Technologies utilisées

- HTML5 / CSS3 / JavaScript ES6 
- AJAX — `XMLHttpRequest` (CM1 — Requêtes asynchrones)
- `JSON.parse()` pour traiter les réponses de l'API
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- API Impact CO2 — ADEME (données carbone officielles)
- Base Empreinte® ADEME pour les données sans endpoint API

---

##  Workflow Git pour le groupe

```bash
# Avant de commencer à travailler
git pull origin main

# Après avoir modifié vos fichiers
git add .
git commit -m "critere5 : ajout du formulaire vêtements"
git push origin main
```

---

##  Sources des données

| Source | Organisme | Utilisation |
|--------|-----------|-------------|
| [Base Empreinte](https://base-empreinte.ademe.fr) | ADEME | Référence officielle des facteurs d'émission |
| [API Impact CO2](https://impactco2.fr/doc/api) | ADEME | Données en temps réel (transport, alimentation, numérique, habillement) |
| [Agribalyse](https://agribalyse.ademe.fr) | ADEME / INRAE | Données nutritionnelles et empreinte alimentaire |
| [Open Food Facts](https://world.openfoodfacts.org) | Communauté | Données produits alimentaires emballés |

---

*Département Mathématiques et Informatique — Université Toulouse Jean Jaurès*