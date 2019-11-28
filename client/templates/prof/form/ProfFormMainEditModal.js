// ==============================================
// TEMPLATE ProfFormMainEditModal 
// ==============================================
Template.ProfFormMainEditModal.events = {
	"click #supprimer" :  function(e,tpl) {
		e.preventDefault();
		Docs.remove(
			Template.parentData(0).doc._id,
			function(error,nb) {
				// On affiche la popup erreur
				if (error) 	toastr.warning("Impossible de supprimer le document : " + error.reason);
				else {
					if (nb == 0) toastr.warning("Aucun document effacé ");
					else {
						// On revient à la page précédente
						window.history.back();
						toastr.success(nb + " document effacé ");
					}
				}
			}
		);
	},
};