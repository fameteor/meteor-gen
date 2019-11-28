// ==============================================
// TEMPLATE OutilsAnniversaires
// ==============================================

// ??????????????????????????????????????????????
// A améliorer :
// - 
// ??????????????????????????????????????????????

Template.OutilsAnniversaires.helpers({
	// Liste des TS de 7 prochains jours
	"listeAnniversairesProchainsJours" : function() {
		// Structure renvoyée :
		// [
		//		{
		//			TS : valeur TS du jour,
		//			pers : [
		//				{::PERS},
		//				..
		//			]
		//		},
		//		...
		// }
		var liste = [];
		var currentDay = new Date().getTime();	// Aujourdhui
		var unJour = 24 * 60 * 60 * 1000;		// Nb de ms par jour
		for (var i=0; i < 7; i++) {
			// On traite le jour courant
			var jourCourant = {};
			jourCourant.TS = currentDay;
			// On cherche les personnes nées ce jour
			var date = new Date(currentDay);
			var jour = date.getDate();
			var mois = date.getMonth() + 1;
			jourCourant.pers = Pers.find({'estVivant':true,'naissance.date.j1':jour,'naissance.date.m1':mois}).fetch();
			// On ajoute ce jour à l'array
			liste.push(jourCourant);
			// On passe au jour suivant
			currentDay = currentDay + unJour;
		}
		return liste;		
	},
	//Affichage de la date à partir du TS
	"dateFromTs" : function(TS) {
		var date = new Date(TS);
		return lang.lang("jour." + date.getDay()) + " " + date.getDate() + " " + lang.lang("mois." + (date.getMonth() + 1)) + " " + date.getFullYear();
	},
	// Nombre d'anniversaires à venir
	"nbTotalAnniversaires" : function() {
		var nbTotalAnniversaires = 0;
		// On balaye la liste "listeAnniversairesProchainsJours"
		for (index in this) {
			var listePersonnesAyantUnAnnivCeJour = this[index].pers;
			nbTotalAnniversaires = nbTotalAnniversaires + listePersonnesAyantUnAnnivCeJour.length;
		}
		return nbTotalAnniversaires;
	},
	// Age de la personnes
	"age" : function() {
		var anneeCourante = new Date(Template.parentData(1).TS).getFullYear();
		var anneeNaissance = this.naissance.date.a1;
		var age = anneeCourante - anneeNaissance;
		if (age == 1)	return age + " an";
		else			return age + " ans";
	}
});

Template.OutilsAnniversaires.rendered = function(){
	// On calcule le TS de aujourd'hui 00h00mn00s
	var now = new Date();
	var startOfTodayTS = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	// On met à jour le champ de la dernière date d'affichage de la liste des anniversaires pour cet utilisateur 
	if (Meteor.user() && Meteor.user().profile) 	Meteor.users.update(Meteor.userId(), {$set: {"profile.birthdaysDisplayLastDate" : startOfTodayTS}});
}


