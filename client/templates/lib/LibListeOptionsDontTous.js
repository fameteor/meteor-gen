// ==============================================
// TEMPLATE LibListeOptionsDontTous
// ==============================================
Template.LibListeOptionsDontTous.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"options" : function() {
		return parametreCommuns[this.de];
	},
	"intitule" : function() {
		return this.intitule[LANG];
	},
	"intituleGenerique" : function() {
		return parametreCommuns["intitulesGeneriques"][this.de][LANG];
	},
	"isSelected" : function() {
		return Template.parentData(1).selected === this.valeur;
	},
});