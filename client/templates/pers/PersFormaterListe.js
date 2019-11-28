// ==============================================
// TEMPLATE PersFormaterListe
// ==============================================
Template.PersFormaterListe.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"nombre" : function() {
		return this.count();
	},
	"pluriel" : function() {
		return this.count() > 1;
	}
});