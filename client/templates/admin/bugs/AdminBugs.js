// ==============================================
// TEMPLATE AdminBugs
// ==============================================
Template.AdminBugs.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"criticiteEnTexteHtml" : function() {
		return "<p class='" + parametreCommuns.criticiteBugs[this.criticite].bootstrapClass + "'>" + parametreCommuns.criticiteBugs[this.criticite].intitule[LANG] + "</p>";
	}
});

Template.AdminBugs.events = {
	"click .boutonSupprimer" : function(e,tpl){
		e.preventDefault();
		// On supprime le bug
		Bugs.remove(
			this._id,
			function(error) {
				// On affiche la popup erreur/ok
				if (error)  toastr.warning("Impossible de supprimer ce bug : " + error.reason);
				else		toastr.success("Bug supprimé");
			}
		);
	},
	"change .checkboxResolu" : function(e,tpl){
		e.preventDefault();
		// On met à jour la date et le champ "estResolu"
		Bugs.update(
			this._id, 
			{$set: {estResolu:true}},
			function(error) {
				// On affiche la popup erreur/ok
				if (error) 	toastr.warning("Impossible de modifier ce bug : " + error.reason);
				else		toastr.success("Bug archivé");
			}
		);		
	}
};