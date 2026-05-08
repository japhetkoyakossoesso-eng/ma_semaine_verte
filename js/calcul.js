const ARTICLES = {
  tshirt:      { ecv: 5.0  },
  jean:        { ecv: 25.0 },
  robe:        { ecv: 8.0  },
  secondemain: { ecv: 0.5  },
  colis:       { ecv: 0.3  },
  express:     { ecv: 2.5  }
};

let quantites = {
  tshirt:      0,
  jean:        0,
  robe:        0,
  secondemain: 0,
  colis:       0,
  express:     0
};

let ecoLivraison = false;

function calculerTotal() {
  let total = 0;

  total = total + quantites.tshirt      * ARTICLES.tshirt.ecv;
  total = total + quantites.jean        * ARTICLES.jean.ecv;
  total = total + quantites.robe        * ARTICLES.robe.ecv;
  total = total + quantites.secondemain * ARTICLES.secondemain.ecv;

  let facteurEco = 1.0;
  if (ecoLivraison === true) {
    facteurEco = 0.7;
  }

  total = total + quantites.colis   * ARTICLES.colis.ecv   * facteurEco;
  total = total + quantites.express * ARTICLES.express.ecv * facteurEco;

  return total;
}
