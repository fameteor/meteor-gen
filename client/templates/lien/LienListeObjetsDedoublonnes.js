// ==============================================
// TEMPLATE LienListeObjetsDedoublonnes
// ==============================================
Template.LienListeObjetsDedoublonnes.helpers({
	listeObjetsDedoublonneeOrdonnee() {
		// On récupère la liste de tous les liens
		var listeTousLesLiens = this.pointingObjects;
		// On transforme la liste pour l'objet cible en liste des objets concernés
		var listeObjetsCibleBrute = listeTousLesLiens[this.typeCible];
		var resultat = [];
		for (index in listeObjetsCibleBrute) {
			var groupeCourant = listeObjetsCibleBrute[index];
			if (groupeCourant.afficherInfos) 	resultat = resultat.concat(groupeCourant.list);
		}
		// On y ajoute la liste des liens valables pour l'objet cible.
		var listeGroupesLiens = listeTousLesLiens["LIEN"];
		for (index in listeGroupesLiens) {
			var groupeLiensCourant = listeGroupesLiens[index];
			if (groupeLiensCourant.afficherInfos) {
				// On regarde si c'est un lien POUR l'objet donné
				if (groupeLiensCourant.matchType === "lienPour") {
					// On balaye la liste des liens
					for (index2 in groupeLiensCourant.list) {
						var lienCourant = groupeLiensCourant.list[index2];
						// Si le lien est pour un objet ciblé, on ajoute l'objet
						if (lienCourant.vers.type === this.typeCible) {
							resultat.push(gf_objectById(lienCourant.vers.id,this.typeCible));
						}
					}
				}
				// Ou si c'est un lien VERS l'objet donné
				if (groupeLiensCourant.matchType === "lienVers") {
					// On balaye la liste des liens
					for (index2 in groupeLiensCourant.list) {
						var lienCourant = groupeLiensCourant.list[index2];
						// Si le lien est pour un objet ciblé, on ajoute l'objet
						if (lienCourant.pour.type === this.typeCible) {
							resultat.push(gf_objectById(lienCourant.pour.id,this.typeCible));
						}
					}
				}
				// On ne fait rien pour les autres matchType de liens
			}
		}
		// On dédoublonne et ordonne selon le type de doc
		var resultat = _.uniq(resultat, function(item) { 
			return item._id;
		});
		// On trie le résultat
		switch (this.typeCible) {
			case "PERS":
				resultat = _.sortBy(resultat, function(item) {
					if (item.naissance && item.naissance.date && item.naissance.date.a1)	return item.naissance.date.a1;
					else return null;
				}); 
				break;
			case "LIEU":
				resultat = _.sortBy(resultat, function(item) {
					if (item.nom)	return item.nom;
					else return null;
				}); 
				break;
			case "HIST":
				resultat = _.sortBy(resultat, function(item) {
					if (item.date && item.date.a1)	return item.date.a1;
					else return null;
				}); 
				break;
			case "DOC":
				var ordreTri = {
					"VIDEO":0,
					"CARTE_POSTALE":1,
					"PHOTO":2,
					"NOTAIRE":3,
					"JOURNAL":4,
					"LIVRE":5,
					"COURRIER":6,
					"PAPIER":7,
					"OBJET":8,
					"AUTRE":9,
					"ACTE":10,
					"CARTE":11,
				}
				// On fait une fonction de comparaison des différents critères
				var cmp = (a, b) => {
					var codeType_a = (a.type && (a.type in ordreTri)) ? ordreTri[a.type] : 1000;
					var codeType_b = (b.type && (b.type in ordreTri)) ? ordreTri[b.type] : 1000;
					var date_a = (a.date && a.date.a1) ?	a.date.a1 : 10000;
					var date_b = (b.date && b.date.a1) ?	b.date.a1 : 10000;
					// On compare avec les deux critères
					if (codeType_a < codeType_b)		return -1;
					else {
						if (codeType_a === codeType_b) {
							// On applique le second critère de tri
							if (date_a < date_b)		return -1;
							else {
								if (date_a === date_b) 	return 0;
								else 					return 1;
							}					
						}
						else 							return 1;
					}
				}
				// On trie
				resultat.sort(cmp); 
				break;								
		}
		// On retourne le résulat
		return resultat;
	},
	objectSingular(typeCible) {
		return lang.lang("genLinkedObjectsSingular")[typeCible];
	},
	objectPlural(typeCible) {
		return lang.lang("genLinkedObjectsPlural")[typeCible];
	}
});

// ==============================================
// TEMPLATE LienListeObjetsDedoublonnes_DOCAUTO
// ==============================================
Template.LienListeObjetsDedoublonnes_DOCAUTO.helpers({
	souvenirBanquet() {
		return gf_docById("is35dxH7j3f3tDZPM");
	}
});