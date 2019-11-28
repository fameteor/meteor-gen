// ==============================================
// TEMPLATE PersArbreAscLegendeCouleurEtatRechActesModal
// ==============================================
Template.PersArbreAscLegendeCouleurEtatRechActesModal.helpers({
	'etats' : function() {
		return parametreCommuns.typeEtatRechActes;
	},
	'couleur' : function() {
		return parametreCommuns.couleurEtatRechActes[this.valeur];
	}
});