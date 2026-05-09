const CLE_API = "e76a93b6-7a74-4d2e-a3ef-2b768dfbe0de";

function chargerVetements() {
  const xhr = new XMLHttpRequest();
  const url = "https://impactco2.fr/api/v1/thematiques/ecv/5?language=fr&apikey=" + CLE_API;
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {

      const reponse   = JSON.parse(xhr.responseText);
      const vetements = reponse.data;

      afficherStatutAPI("connectee");
      mettreAJourEcvVetements(vetements);

    } else if (xhr.readyState === 4) {

      afficherStatutAPI("erreur");
    }
  };

  xhr.addEventListener('error', function() {
    afficherStatutAPI("erreur");
  });

  xhr.send();
}

function mettreAJourEcvVetements(vetements) {
  for (const article of vetements) {
    if (article.slug === "tshirtencoton") {
      ARTICLES.tshirt.ecv = article.ecv;
    }
    if (article.slug === "jeans") {
      ARTICLES.jean.ecv = article.ecv;
    }
    if (article.slug === "robeencoton") {
      ARTICLES.robe.ecv = article.ecv;
    }
  }
}
