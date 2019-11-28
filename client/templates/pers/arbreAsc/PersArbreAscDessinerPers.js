// ==============================================
// TEMPLATE PersArbreAscDessinerPers
// ==============================================
Template.PersArbreAscDessinerPers.helpers({
	// Booleans -----------------------------------
	"estPremiereGeneration" : function () {
		return (parseInt(Template.parentData(1).gen + 1) === 1);
	},
	"limiteGenerationAtteinte" : function () {
		return (this.gen > (this.nbGenMax - 1));
	},
	//Attributes ----------------------------------
	"sosaPere" : function () {
		return parseInt(Template.parentData(2).sosa) * 2;
	},
	"sosaMere" : function () {
		return (parseInt(Template.parentData(2).sosa) * 2 )+ 1;
	},
	"generationSuivante" : function () {
		return parseInt(Template.parentData(2).gen) + 1;
	},
	"calculerRotation" : function () {
		var generation = Template.parentData(2).gen
		return Template.parentData(2).rotation + parametreCommuns.rotationArbreCirc[generation];
	},
	"couleur" : function () {
		switch (Template.parentData(1).couleurs) {
			case "COMMUNE_NAISSANCE":
				if (this.naissance && this.naissance.commune) {
					if (this.naissance.commune in parametreCommuns.couleurCommune) {
						return parametreCommuns.couleurCommune[this.naissance.commune];
					}
					else return	parametreCommuns.couleurCommune["AUTRE"];
				}
				else return	parametreCommuns.couleurCommune["NONCONNUE"];
				break;
			case "COMMUNE_DECES":
				if (this.deces && this.deces.commune) {
					if (this.deces.commune in parametreCommuns.couleurCommune) {
						return parametreCommuns.couleurCommune[this.deces.commune];
					}
					else return	parametreCommuns.couleurCommune["AUTRE"];
				}
				else return	parametreCommuns.couleurCommune["NONCONNUE"];
				break;
			case "ETAT_RECH_ACTES":
				return	parametreCommuns.couleurEtatRechActes[this.etatRechActes]
				break;
			case "ETAT_RECH_ENFANTS":
				// On balaye tous les coupleEvents de la personne donnée (hors divorce)
				// Si il y a a au moins un coupleEvent.etatRechEnfants == INCOMPLET_A_COMPLETER => status global = INCOMPLET_A_COMPLETER
				// Si tous coupleEvent.etatRechEnfants == COMPLET_VERIFIE => status global = COMPLET_VERIFIE
				// Si tous coupleEvent.etatRechEnfants == COMPLET_VERIFIE ou INCOMPLET_RECH_FINIE => status global = INCOMPLET_RECH_FINIE
				var statusTrouveINCOMPLET_A_COMPLETER 	= false;
				var statusTrouveINCOMPLET_RECH_FINIE 	= false;
				var statusTrouveCOMPLET_VERIFIE 		= false;
				var listeMariagesDeCettePersonne = gf_coupleEventsByPersId(this._id,null,true);
				for (index in listeMariagesDeCettePersonne) {
					var mariageCourant = listeMariagesDeCettePersonne[index];
					if (mariageCourant.etatRechEnfants === "INCOMPLET_A_COMPLETER")	statusTrouveINCOMPLET_A_COMPLETER = true;
					if (mariageCourant.etatRechEnfants === "INCOMPLET_RECH_FINIE")	statusTrouveINCOMPLET_RECH_FINIE = true;
					if (mariageCourant.etatRechEnfants === "COMPLET_VERIFIE")		statusTrouveCOMPLET_VERIFIE = true;
				}
				// Si les status ne sont pas tous à false
				if (statusTrouveINCOMPLET_A_COMPLETER || statusTrouveINCOMPLET_RECH_FINIE || statusTrouveCOMPLET_VERIFIE) {
					if (statusTrouveINCOMPLET_A_COMPLETER) 		return parametreCommuns.couleurEtatRechEnfants["INCOMPLET_A_COMPLETER"];
					else {
						if (statusTrouveINCOMPLET_RECH_FINIE)	return parametreCommuns.couleurEtatRechEnfants["INCOMPLET_RECH_FINIE"];
						else									return parametreCommuns.couleurEtatRechEnfants["COMPLET_VERIFIE"];
					}
				}
				break;
			default :
				console.log("Erreur module \"PersArbreAscDessinerPers\" : paramètre \"couleurs\" non autorisé : " + Template.parentData(1).couleurs);
				break;
		}
	},
	"ecritureInversee" : function () {
		// Si l'angle de rotation est supérieur à 90, on écrit sur le path de sens inverse
		if (Template.parentData(1).rotation + parametreCommuns.rotationArbreCirc[Template.parentData(1).gen] > 90) return "neg";
	},
	"rangMariage" : function () {
		// S'il y a plusieurs mariages de la personne
		var listeCoupleEvents = gf_coupleEventsByPersId(this._id,null,true);
		if(listeCoupleEvents.length > 1) {
			// On recherche le conjoint
			var fils = Template.parentData(1).fils;
			if (this.sexe == "F" || this.sexe == "M") {
				if (this.sexe == "F")	var idConjoint = fils.pere;
				else					var idConjoint = fils.mere;
				// On balaye les mariages et on renvoie le premier qui corresponf au conjoint
				for (index in listeCoupleEvents) {
					var coupleEventCourant = listeCoupleEvents[index];
					if (coupleEventCourant.persA === this._id) {
						if (coupleEventCourant.persB === idConjoint) return (parseInt(index)+1);
					}
					if (coupleEventCourant.persB === this._id) {
						if (coupleEventCourant.persA === idConjoint) return (parseInt(index)+1);
					}
				}
			}
			else console.log("Erreur données : le sexe d'une personne dans un coupleEvent n'est ni M ni F pour la personne don l'id est : " + this._id);
		}
	},
	"dateMariage" : function () {
		// On recherche le premier mariage du couple qui a donné cet enfant
		var fils = Template.parentData(1).fils;
		var listeCoupleEvents = gf_coupleEventsByPersId(fils.pere,fils.mere);
		return listeCoupleEvents[0] && listeCoupleEvents[0].date;
	},
	"classIncertainForMariage" : function () {
		// On recherche le premier mariage du couple qui a donné cet enfant (s'il existe)
		var fils = Template.parentData(1).fils;
		var listeCoupleEvents = gf_coupleEventsByPersId(fils.pere,fils.mere,true);
		if (listeCoupleEvents[0]) {
			// On regarde si la personne courante est persA ou persB
			if (listeCoupleEvents[0].persA === this._id) {
				if (listeCoupleEvents[0].incertainA) return "incertain";
			}
			if (listeCoupleEvents[0].persB === this._id) {
				if (listeCoupleEvents[0].incertainB) return "incertain";
			}
		}
	},
});

Template.PersArbreAscDessinerPers.events = {
	"click g.nom" : function (e,tpl) {
		e.preventDefault();
		Router.go('/pers/infos/' + this._id);
	}
}