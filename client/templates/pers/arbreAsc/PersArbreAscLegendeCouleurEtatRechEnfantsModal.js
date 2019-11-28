// ==============================================
// TEMPLATE PersArbreAscLegendeCouleurEtatRechEnfantsModal
// ==============================================
Template.PersArbreAscLegendeCouleurEtatRechEnfantsModal.helpers({
	'etats' : function() {
		return parametreCommuns.typeEtatRechEnfants;
	},
	'couleur' : function() {
		return parametreCommuns.couleurEtatRechEnfants[this.valeur];
	}
});