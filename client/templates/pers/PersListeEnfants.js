// ==============================================
// TEMPLATE PersListeEnfants
// ==============================================
Template.PersListeEnfants.helpers({
	// Booléens ------------------------------------------------------------
	estPersonneFocus : function(focusId) {
		return (this._id == focusId);
	},
	// Attributs ------------------------------------------------------------
	listeEnfants : function() {
		// Pour éviter les erreurs au reload
		if (this.parentA && this.parentB) {
			// On renvoie la liste des enfants
			if (this.parentA.sexe === "M" && this.parentB.sexe === "F") {
				return Pers.find({ pere: this.parentA._id,mere:this.parentB._id }, {sort: {"naissance.date.a1" : 1}}).fetch();
			}
			else {
				if (this.parentB.sexe === "M" && this.parentA.sexe === "F") {
					return Pers.find({ pere: this.parentB._id,mere:this.parentA._id }, {sort: {"naissance.date.a1" : 1}}).fetch();
				}
				else {
					// Dans les autres cas, émettre une erreur 
					// throw new Meteor.Error(413, "Incohérence de sexe des parents. ");
					return null;
				}
			}
		}
	}
});