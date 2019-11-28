// ==============================================
// TEMPLATE LibListeOptions
// ==============================================
Template.LibListeOptions.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"options" : function() {
		return parametreCommuns[this.de];
	},
	"intitule" : function() {
		return this.intitule[LANG];
	},
	"isSelected" : function() {
		return Template.parentData(1).selected === this.valeur;
	},
});