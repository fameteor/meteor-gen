// ==============================================
// TEMPLATE PersPrenomUsuel
// ==============================================
Template.PersPrenomUsuel.helpers({
	// Booléens ------------------------------------------------------------
	// Attributs ------------------------------------------------------------
	prenomUsuel : function() {
		return this.prenoms[this.prenomUsuel];
	}
});