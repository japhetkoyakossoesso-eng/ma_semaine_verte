const CLE_API_MSV = "e76a93b6-7a74-4d2e-a3ef-2b768dfbe0de";
const MOYENNE_NATIONALE = 39;
let nomUtilisateur = localStorage.getItem("msv_nom") || "";

function lireBilan() {
  return {
    trajet: parseFloat(localStorage.getItem("msv_trajet")) || 0,
    repas: parseFloat(localStorage.getItem("msv_repas")) || 0,
    numerique: parseFloat(localStorage.getItem("msv_numerique")) || 0,
    electromenager: parseFloat(localStorage.getItem("msv_electromenager")) || 0,
    achats: parseFloat(localStorage.getItem("msv_achats")) || 0
  };
}
function sauvegarderCritere(nom, valeur) { localStorage.setItem("msv_" + nom, String(Math.max(0, valeur || 0))); }
function getTotalBilan() { const b=lireBilan(); return b.trajet+b.repas+b.numerique+b.electromenager+b.achats; }
function getCarboneTwin() { return (getTotalBilan() / MOYENNE_NATIONALE).toFixed(1); }
function majNomPartout(nom){ document.querySelectorAll('.nom-utilisateur').forEach(el=>el.textContent=nom || '—'); }

function afficherPage(page, lienClique) {
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  if (lienClique) lienClique.classList.add('active');
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
  const cible=document.getElementById('page-'+page); if(cible) cible.style.display='block';
}
function allerAccueil(){ window.location.href = location.pathname.endsWith('index.html') ? '#accueil' : '../index.html'; }
function allerCritere5(){ window.location.href = location.pathname.includes('/pages/') ? 'critere5.html' : 'pages/critere5.html'; }
function validerNom(){ const input=document.getElementById('input-nom'); if(!input) return; const nom=input.value.trim(); if(!nom){input.style.borderColor='#ef4444'; return;} nomUtilisateur=nom; localStorage.setItem('msv_nom',nom); majNomPartout(nom); const f=document.getElementById('form-nom'), a=document.getElementById('affichage-nom'); if(f)f.style.display='none'; if(a)a.style.display='block'; if(typeof chargerPromo==='function') chargerPromo(); }
function modifierNom(){ const f=document.getElementById('form-nom'), a=document.getElementById('affichage-nom'), i=document.getElementById('input-nom'); if(f)f.style.display='block'; if(a)a.style.display='none'; if(i){i.value=nomUtilisateur;i.focus();} }

function initIndex(){
  if(!document.querySelector('.layout')) return;
  majNomPartout(nomUtilisateur);
  const inputNomStocke = document.getElementById('input-nom');
  if (inputNomStocke && nomUtilisateur) { inputNomStocke.value = nomUtilisateur; }
  if(nomUtilisateur && document.getElementById('affichage-nom')){document.getElementById('form-nom').style.display='none';document.getElementById('affichage-nom').style.display='block';}
  const input=document.getElementById('input-nom'); if(input) input.addEventListener('keydown',e=>{if(e.key==='Enter') validerNom();});
  const hash=location.hash.replace('#',''); if(hash==='fonctions') afficherPage('fonctions', document.querySelector('a[href="#fonctions"]')); if(hash==='promo'){afficherPage('promo', document.querySelector('a[href="#promo"]')); chargerPromo();}
  document.querySelectorAll('a[href="#fonctions"],a[href="#promo"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); const h=a.getAttribute('href').replace('#',''); afficherPage(h,a); if(h==='promo') chargerPromo();}));

  document.querySelectorAll('.carte-critere[role="button"]').forEach(function(carte){
    carte.addEventListener('keydown', function(e){ if(e.key === 'Enter') { carte.click(); } });
  });
  const b=lireBilan();
  const map={trajet:'14.5 kg',repas:'12.8 kg',numerique:'2.7 kg',electromenager:'4.2 kg'};
  const achats=document.getElementById('valeur-achats'); if(achats) achats.textContent=b.achats.toFixed(1)+' kg';
}

let instancePromo = null;
let donneesPromo = [];

function normaliserNom(nom) {
  return (nom || '').trim().toLowerCase();
}

function chargerPromo() {
  const liste = document.getElementById('liste-classement');
  if (!liste) { return; }

  liste.innerHTML = '<div style="padding:1rem;text-align:center;color:#888;font-size:0.85rem;">Chargement du classement...</div>';

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/promo.json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      try {
        const reponse = JSON.parse(xhr.responseText);
        donneesPromo = reponse.etudiants || [];
      } catch (e) {
        donneesPromo = [];
      }
      afficherClassementPromo();
      creerGraphiquePromo();
    }
  };
  xhr.addEventListener('error', function() {
    donneesPromo = [];
    afficherClassementPromo();
    creerGraphiquePromo();
  });
  xhr.send();
}

function donneesPromoAvecUtilisateur() {
  const nomSaisi = (localStorage.getItem('msv_nom') || nomUtilisateur || '').trim();
  const nomSaisiNormalise = normaliserNom(nomSaisi);

  const liste = [];
  for (let i = 0; i < donneesPromo.length; i++) {
    liste.push({
      prenom: donneesPromo[i].prenom,
      total: parseFloat(donneesPromo[i].total) || 0
    });
  }

  if (nomSaisiNormalise !== '') {
    let existe = false;
    for (let i = 0; i < liste.length; i++) {
      if (normaliserNom(liste[i].prenom) === nomSaisiNormalise) {
        existe = true;
        
        const totalUtilisateur = getTotalBilan();
        if (totalUtilisateur > 0) {
          liste[i].total = parseFloat(totalUtilisateur.toFixed(1));
        }
      }
    }

    if (existe === false) {
      liste.push({
        prenom: nomSaisi,
        total: parseFloat(getTotalBilan().toFixed(1)) || 0
      });
    }
  }

  liste.sort(function(a, b) { return a.total - b.total; });
  return liste;
}

function afficherClassementPromo() {
  const listeHTML = document.getElementById('liste-classement');
  if (!listeHTML) { return; }

  const liste = donneesPromoAvecUtilisateur();
  const nomSaisi = normaliserNom(localStorage.getItem('msv_nom') || nomUtilisateur);

  if (liste.length === 0) {
    listeHTML.innerHTML = '<div style="padding:1rem;text-align:center;color:#888;font-size:0.85rem;">Aucune donnée promo disponible.</div>';
    return;
  }

  let html = '';
  let rangMoi = 0;

  for (let i = 0; i < liste.length; i++) {
    const etudiant = liste[i];
    const rang = i + 1;
    const estMoi = nomSaisi !== '' && normaliserNom(etudiant.prenom) === nomSaisi;
    const lettre = String.fromCharCode(64 + rang); // A, B, C...
    const avatar = estMoi ? etudiant.prenom.charAt(0).toUpperCase() : lettre;
    const nomAffiche = estMoi ? 'Toi (' + etudiant.prenom + ')' : 'Étudiant ' + lettre;

    if (estMoi) { rangMoi = rang; }

    html += '<div class="ligne-classement ' + (estMoi ? 'moi' : '') + '">';
    html += '  <div class="rang ' + (estMoi ? 'moi' : '') + '">' + rang + '</div>';
    html += '  <div class="avatar">' + avatar + '</div>';
    html += '  <div class="nom-etudiant ' + (estMoi ? 'moi' : '') + '">' + nomAffiche + '</div>';
    html += '  <div class="kg-etudiant ' + (estMoi ? 'moi' : '') + '">' + etudiant.total.toFixed(1) + ' kg</div>';
    html += '</div>';
  }

  listeHTML.innerHTML = html;

  const med = document.getElementById('mediane-val');
  if (med) {
    med.textContent = liste[Math.floor(liste.length / 2)].total.toFixed(1) + ' kg';
  }

  const dessous = document.getElementById('dessous-val');
  if (dessous) {
    if (rangMoi > 0) {
      const nbMoinsBien = liste.length - rangMoi;
      dessous.textContent = Math.round((nbMoinsBien / liste.length) * 100) + '%';
    } else {
      dessous.textContent = '—%';
    }
  }
}

function creerGraphiquePromo() {
  const canvas = document.getElementById('graphique-promo');
  if (!canvas || !window.Chart) { return; }

  const liste = donneesPromoAvecUtilisateur();
  const nomSaisi = normaliserNom(localStorage.getItem('msv_nom') || nomUtilisateur);

  if (instancePromo) { instancePromo.destroy(); }
  if (liste.length === 0) { return; }

  const labels = [];
  const valeurs = [];
  const couleurs = [];
  const moyenne = [];

  for (let i = 0; i < liste.length; i++) {
    const etudiant = liste[i];
    const rang = i + 1;
    const estMoi = nomSaisi !== '' && normaliserNom(etudiant.prenom) === nomSaisi;
    labels.push(estMoi ? 'Toi (' + etudiant.prenom + ')' : 'Étudiant ' + String.fromCharCode(64 + rang));
    valeurs.push(etudiant.total);
    couleurs.push(estMoi ? '#4ade80' : '#93c5fd');
    moyenne.push(MOYENNE_NATIONALE);
  }

  instancePromo = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Empreinte (kgCO2e)',
          data: valeurs,
          backgroundColor: couleurs,
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'Moyenne nationale (39 kg)',
          data: moyenne,
          type: 'line',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true, position: 'top' } },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'kgCO2e / semaine' } } }
    }
  });
}

/* CRITERE 1 */
function initCritere1(){
 if(!document.getElementById('co2-chart')) return;
 let facteurActuel=0, nbPassagers=1, chart=null; const fallback=[{name:'Voiture essence',value:.193},{name:'Voiture diesel',value:.168},{name:'Voiture électrique',value:.019},{name:'Bus urbain',value:.113},{name:'Train intercités',value:.006},{name:'Métro / tramway',value:.004},{name:'Vélo / marche',value:0}];
 function initChart(){chart=new Chart(document.getElementById('co2-chart').getContext('2d'),{type:'bar',data:{labels:[],datasets:[{data:[],backgroundColor:[],borderRadius:6}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true}}}})}
 function remplir(liste){const wrap=document.getElementById('select-wrap'), sel=document.createElement('select'); sel.id='transport-select'; liste.forEach(t=>{const o=document.createElement('option'); o.value=t.value??t.ecv; o.textContent=t.name??t.nom; sel.appendChild(o);}); wrap.innerHTML=''; wrap.appendChild(sel); sel.addEventListener('change',mettreAJour); mettreAJour(); graph(liste);}
 window.mettreAJour=function(){const sel=document.getElementById('transport-select'); if(!sel)return; const dist=parseInt(document.getElementById('distance').value)||0, jours=parseInt(document.getElementById('jours').value)||0; facteurActuel=parseFloat(sel.value)||0; ['dist-val','dist-ex'].forEach(id=>{const e=document.getElementById(id); if(e)e.textContent=dist}); ['jours-val','jours-ex'].forEach(id=>{const e=document.getElementById(id); if(e)e.textContent=jours}); const fe=document.getElementById('facteur-ex'); if(fe)fe.textContent=Math.round(facteurActuel*1000); const total=(facteurActuel*dist*jours)/nbPassagers; document.getElementById('result-val').textContent=total.toFixed(2); document.getElementById('exemple-val').textContent=total.toFixed(2)+' kgCO2e'; document.getElementById('equiv-badge').textContent='= '+Math.round(total/.193)+' km voiture'; document.getElementById('val-covoit').textContent=((facteurActuel*dist*jours)/Math.max(2,nbPassagers)).toFixed(2)+' kgCO2e'; document.getElementById('suggestion-covoit').style.display='block'; sauvegarderCritere('trajet',total); };
 window.modifierPassagers=function(delta){nbPassagers=Math.min(5,Math.max(1,nbPassagers+delta));document.getElementById('nb-passagers').textContent=nbPassagers;mettreAJour();};
 function graph(liste){ if(!chart)return; const dist=parseInt(document.getElementById('distance').value)||15, jours=parseInt(document.getElementById('jours').value)||5; chart.data.labels=liste.map(t=>(t.name??t.nom).split('(')[0]); chart.data.datasets[0].data=liste.map(t=>parseFloat(((t.value??t.ecv)*dist*jours).toFixed(2))); chart.data.datasets[0].backgroundColor=chart.data.datasets[0].data.map(v=>v<1?'#4ade80':v<10?'#fbbf24':'#f87171'); chart.update();}
 initChart(); const xhr=new XMLHttpRequest(); xhr.open('GET','../data/facteurs_transport.json'); xhr.onreadystatechange=function(){if(xhr.readyState===4){try{remplir(JSON.parse(xhr.responseText).transports.map(t=>({name:t.nom,value:t.ecv})))}catch(e){remplir(fallback)}}}; xhr.send();
}

/* CRITERE 2 */
function initCritere2(){
 if(!document.getElementById('meal-grid')) return; let REPAS=[], counts={}, cafes=0, chart=null; const fallback=[{id:'vegan',name:'Vegan',icon:'🌱',co2:.3,couleur:'#1a5c38'},{id:'vegetarien',name:'Végétarien',icon:'🥗',co2:.5,couleur:'#2d9d6e'},{id:'poisson',name:'Poisson',icon:'🐟',co2:.8,couleur:'#378add'},{id:'volaille',name:'Volaille',icon:'🍗',co2:1.1,couleur:'#ba7517'},{id:'boeuf',name:'Bœuf',icon:'🥩',co2:5,couleur:'#d85a30'}];
 function init(){REPAS=fallback; counts={}; REPAS.forEach(r=>counts[r.id]=0); build(); refresh();}
 function build(){const grid=document.getElementById('meal-grid'); grid.innerHTML=''; REPAS.forEach(m=>{const d=document.createElement('div'); d.className='meal-card'; d.id='card-'+m.id; d.innerHTML=`<div class="meal-icon">${m.icon}</div><div class="meal-nom">${m.name}</div><div class="meal-co2">${m.co2.toFixed(2)} kgCO2e</div><div class="counter"><button class="cnt-btn" onclick="change('${m.id}',-1)">−</button><span class="cnt-val" id="val-${m.id}">0</span><button class="cnt-btn" onclick="change('${m.id}',1)">+</button></div>`; grid.appendChild(d);});}
 function totalRepas(){return Object.values(counts).reduce((a,b)=>a+b,0)} function calc(){return REPAS.reduce((s,m)=>s+counts[m.id]*m.co2,0)+cafes*7*.06;}
 window.change=function(id,delta){const next=counts[id]+delta; if(next<0)return; if(delta>0&&totalRepas()>=21){document.getElementById('alerte-21').classList.add('show');return;} document.getElementById('alerte-21').classList.remove('show'); counts[id]=next; document.getElementById('val-'+id).textContent=next; document.getElementById('card-'+id).className='meal-card'+(next>0?' actif':''); refresh();};
 window.changeCafe=function(delta){cafes=Math.max(0,cafes+delta);document.getElementById('cafe-val').textContent=cafes; refresh();};
 function refresh(){const total=calc(); document.getElementById('total-num').textContent=total.toFixed(2); const badge=document.getElementById('result-badge'); badge.textContent=total===0?'Saisissez vos repas pour voir votre bilan': total<15?'✅ Très bon profil alimentaire': total<30?'⚠️ Profil modéré':'🔴 Empreinte élevée'; sauvegarderCritere('repas',total); majChart();}
 function majChart(){const canvas=document.getElementById('graphique-repas'); if(!canvas||!window.Chart)return; const labs=[], vals=[], cols=[]; REPAS.forEach(m=>{const v=counts[m.id]*m.co2; if(v>0){labs.push(m.name); vals.push(v); cols.push(m.couleur)}}); if(chart)chart.destroy(); if(!labs.length)return; chart=new Chart(canvas.getContext('2d'),{type:'doughnut',data:{labels:labs,datasets:[{data:vals,backgroundColor:cols}]},options:{plugins:{legend:{position:'bottom'}}}});}
 init();
}

/* CRITERE 3 */
function initCritere3(){ if(!document.getElementById('equipment-list')) return; let equipmentData=[{nom:'Ordinateur portable',ecv:192.62,dureeVie:5},{nom:'Smartphone',ecv:79.56,dureeVie:3},{nom:'Tablette',ecv:65.52,dureeVie:3},{nom:'Box internet',ecv:48.36,dureeVie:3}], quantities={}, chart=null; const usage={streaming:.064,visio:.057,recherches:.00123,emails:.004}; function impact(i){return i.ecv/(i.dureeVie*52)} function form(){const c=document.getElementById('equipment-list'); c.innerHTML=''; equipmentData.forEach(i=>{quantities[i.nom]=i.nom==='Ordinateur portable'||i.nom==='Smartphone'?1:0; const id=i.nom.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase(); const r=document.createElement('div'); r.className='equip-row'; r.innerHTML=`<div><div class="equip-label">${i.nom}</div><div class="ecv-hint">${impact(i).toFixed(3)} kgCO2e / semaine / appareil</div></div><input type="number" class="equip-input" id="input-${id}" min="0" max="10" value="${quantities[i.nom]}">`; c.appendChild(r);}); const l=document.getElementById('co2-legend'); if(l)l.innerHTML='Streaming 1h : <strong>0.064 kg</strong> | Visio 1h : <strong>0.057 kg</strong>'; document.getElementById('loading').style.display='none'; document.getElementById('main-content').style.display='block'; document.getElementById('total-footer').style.display='flex'; document.getElementById('nav-buttons').style.display='flex'; updateUsage();}
 function total(){let t=0; equipmentData.forEach(i=>t+=(quantities[i.nom]||0)*impact(i)); for(const k in usage){const el=document.getElementById(k); t+=(parseFloat(el?.value)||0)*usage[k];} return t;}
 window.calculerDepuisFormulaire=function(){equipmentData.forEach(i=>{const id=i.nom.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase(); quantities[i.nom]=parseInt(document.getElementById('input-'+id).value)||0}); maj();}; window.updateUsage=function(){['streaming','visio','recherches','emails'].forEach(id=>{const e=document.getElementById(id+'-val'), inp=document.getElementById(id); if(e&&inp)e.textContent=inp.value+(id==='streaming'||id==='visio'?' h':'')}); maj();}; function maj(){const t=total(); document.getElementById('total-co2').textContent=t.toFixed(1); document.getElementById('total-equiv').textContent='≈ '+Math.round(t/.193)+' km voiture'; sauvegarderCritere('numerique',t); graph();} function graph(){const c=document.getElementById('graphique-numerique'); if(!c||!window.Chart)return; if(chart)chart.destroy(); chart=new Chart(c.getContext('2d'),{type:'doughnut',data:{labels:['Équipements','Usages en ligne'],datasets:[{data:[Math.max(0,total()-.5),.5],backgroundColor:['#8b5cf6','#60a5fa']}]},options:{plugins:{legend:{position:'bottom'}}}});} form(); }

/* CRITERE 4 */
function initCritere4(){
  if(!document.getElementById('bilan-total')) return;
  let typeChauffe='electrique', nbDouches=7, dureeDouche=7, ecvAppareil=37.8, nbUtilisations=3, facteurChauffage=150, surfaceLogement=25, tempConsigne=19;
  function d(){return nbDouches*dureeDouche*(typeChauffe==='gaz'?70:30);}
  function e(){return nbUtilisations*((ecvAppareil*1000)/520);}
  function c(){return Math.max(0,((facteurChauffage*surfaceLogement)/52)*(1-(20-tempConsigne)*.07));}
  function fmt(v){return v>=1000?(v/1000).toFixed(2)+' kg CO2e':Math.round(v)+' g CO2e';}
  function maj(){
    const douche=d(), electro=e(), chauffage=c();
    const total=douche+electro+chauffage;
    const ids = [
      ['co2-douche-val', douche], ['co2-electro-val', electro], ['co2-chauffage-val', chauffage],
      ['co2-douche-pilule', douche], ['co2-electro-pilule', electro], ['co2-chauffage-pilule', chauffage],
      ['bilan-douche', douche], ['bilan-electro', electro], ['bilan-chauffage', chauffage], ['bilan-total', total]
    ];
    ids.forEach(pair=>{const el=document.getElementById(pair[0]); if(el) el.textContent=fmt(pair[1]);});
    sauvegarderCritere('electromenager', total/1000);
    if (typeof creerGraphiqueCritere4 === 'function') { creerGraphiqueCritere4(douche, electro, chauffage); }
  }
  window.toggleBloc=function(n){const corps=document.getElementById('corps-'+n), ch=document.getElementById('chevron-'+n); if(corps)corps.classList.toggle('cache'); if(ch)ch.classList.toggle('ouvert');};
  window.selectionnerToggle=function(n,v,b){
    if(n==='chauffe'){
      typeChauffe=v;
      const info=document.getElementById('info-chauffe');
      if(info) info.textContent=v==='gaz'?'70 gCO2e/min — gaz naturel':'30 gCO2e/min — électricité nucléaire';
    }
    b.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('actif'));
    b.classList.add('actif');
    maj();
  };
  window.modifierStepper=function(n,delta){
    const el=document.getElementById(n); if(!el) return;
    let val=parseInt(el.textContent)+delta; val=Math.min(21,Math.max(0,val)); el.textContent=val;
    if(n==='nb-douches') nbDouches=val;
    if(n==='nb-electro') nbUtilisations=val;
    maj();
  };
  window.mettreAJourSlider=function(n,val){
    val=parseInt(val);
    if(n==='duree'){dureeDouche=val; const el=document.getElementById('val-duree'); if(el)el.textContent=val+' min';}
    if(n==='surface'){surfaceLogement=val; const el=document.getElementById('val-surface'); if(el)el.textContent=val+' m²';}
    if(n==='temp-chauf'){
      tempConsigne=val;
      const el=document.getElementById('val-temp-chauf'); if(el)el.textContent=val+' °C';
      const info=document.getElementById('info-temp-chauf'); if(info)info.textContent=val<=19?'✅ '+val+' °C — recommandation ADEME':val+' °C — chaque degré de plus = +7% d’émissions';
    }
    maj();
  };
  window.calculerChauffage_select=function(){facteurChauffage=parseFloat(document.getElementById('select-chauffage').value); maj();};
  window.changerAppareil=function(){
    const s=document.getElementById('select-electro'); if(!s)return;
    ecvAppareil=parseFloat(s.value);
    const info=document.getElementById('info-electro'); if(info) info.textContent=s.options[s.selectedIndex].textContent+' — ECV : '+ecvAppareil.toFixed(2)+' kgCO2e';
    maj();
  };
  maj();
}

/* CRITERE 5 */
function initCritere5(){ if(!document.getElementById('graphique-c5')) return; let A={tshirt:{ecv:5},jean:{ecv:25},robe:{ecv:8},secondemain:{ecv:.5},colis:{ecv:.3},express:{ecv:2.5}}, q={tshirt:0,jean:0,robe:0,secondemain:0,colis:0,express:0}, eco=false, chart=null; function total(){let t=q.tshirt*A.tshirt.ecv+q.jean*A.jean.ecv+q.robe*A.robe.ecv+q.secondemain*A.secondemain.ecv; const f=eco?.7:1; return t+q.colis*A.colis.ecv*f+q.express*A.express.ecv*f;} window.changer=function(id,delta){q[id]=Math.max(0,q[id]+delta); document.getElementById('qte-'+id).textContent=q[id]; maj();}; window.setEco=function(a){eco=a; document.getElementById('btn-off').className=a?'':'actif'; document.getElementById('btn-on').className=a?'actif':''; maj();}; function maj(){const t=total(); document.getElementById('total-critere5').textContent=t.toFixed(1); sauvegarderCritere('achats',t); graph();} function graph(){const c=document.getElementById('graphique-c5'); if(!c||!window.Chart)return; const labels=[],data=[]; [['T-shirt',q.tshirt*A.tshirt.ecv],['Jean',q.jean*A.jean.ecv],['Robe',q.robe*A.robe.ecv],['Seconde main',q.secondemain*A.secondemain.ecv],['Colis',q.colis*A.colis.ecv*(eco?.7:1)],['Express',q.express*A.express.ecv*(eco?.7:1)]].forEach(x=>{if(x[1]>0){labels.push(x[0]);data.push(x[1]);}}); if(chart)chart.destroy(); if(!labels.length)return; chart=new Chart(c.getContext('2d'),{type:'bar',data:{labels:labels,datasets:[{data:data,backgroundColor:'#f97316',borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});} const st=document.getElementById('statut-api'); if(st){st.textContent='✅ Données prêtes (API ou JSON statique)';st.style.color='#1a5c38';} maj(); }

document.addEventListener('DOMContentLoaded',function(){ initIndex(); initCritere1(); initCritere2(); initCritere3(); initCritere4(); initCritere5(); });
