// ==============================================
// TEMPLATE DocFormaterListe
// ==============================================
Template.DocFormaterListe.helpers({
	// Booleans -----------------------------------
	//Attributes ----------------------------------
	nombre : function() {
		return this.count();
	},
	"pluriel" : function() {
		return this.count() > 1;
	}
});