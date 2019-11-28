// ==============================================
// TEMPLATE OutilsCalendrierRepublicain
// ==============================================

// ??????????????????????????????????????????????
// A améliorer :
// - BUG si autre sélection : La sélection automatique du pseudo-mois des sans-culottides au changement du jouré républicain et lors de la conversion greg -> rep
// ??????????????????????????????????????????????

Template.OutilsCalendrierRepublicain.helpers({
	// Booléens ------------------------------------------------------------
	
	// Attributs ------------------------------------------------------------
	"url" : function() {
		
	},
});

Template.OutilsCalendrierRepublicain.events = {
	// Si on change le jour républicain
	'change #choix_jourRep': function (e,tpl) {
		e.preventDefault();
		// Si on choisit un jour complémentaire républicain, on force le pseudo mois des sans-culottides
		if($("#choix_jourRep").val() > 30)	{
			// On déselectionne l'option sélectionnée
			$("#choix_moisRep>option").attr("selected",false); // ne marche pas quand déjà une option sélectionnée
			// On sélectionne la dernière option 
			$("#choix_moisRep>option:last").attr("selected",true);
		}
	},
	// Si on convertit de Républicain en Grégorien
	'click #bouton_repToGreg': function (e,tpl) {
		e.preventDefault();
		// On récupère les données
		var jourR = $("#choix_jourRep").val();
		var moisR = $("#choix_moisRep").val();
		var anneeR = $("#choix_anneeRep").val();
		// On obtient le résultat :
		var resultatGreg = CalendrierRepublicain.repToGreg(jourR,moisR,anneeR);
		// On affiche le résultat
		$("#choix_jourGreg").val(resultatGreg.jour);
		$("#choix_moisGreg").val(resultatGreg.mois);
		$("#choix_anneeGreg").val(resultatGreg.annee);
	},
	// Si on convertit de Républicain en Grégorien
	'click #bouton_gregToRep': function (e,tpl) {
		e.preventDefault();
		// On récupère les données
		var jourGreg = $("#choix_jourGreg").val();
		var moisGreg = $("#choix_moisGreg").val();
		var anneeGreg = $("#choix_anneeGreg").val();
		// On obtient le résultat
		var resultatRep = CalendrierRepublicain.gregToRep(jourGreg,moisGreg,anneeGreg);
		// On affiche le résultat
		$("#choix_jourRep").val(resultatRep.jour);
		// Si ce n'est pas un jour complémentaire
		if (resultatRep.jour <= 30)		$("#choix_moisRep").val(resultatRep.mois);
		// Sinon on sélectionne le pseudo mois des jours complémentaires
		else 							$("#choix_moisRep>option:last").attr("selected",true);
		$("#choix_anneeRep").val(resultatRep.annee);
	},
};