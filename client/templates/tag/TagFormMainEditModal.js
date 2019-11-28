// ==============================================
// TEMPLATE TagFormMainEditModal 
// ==============================================
Template.TagFormMainEditModal.events = {
	"click #supprimer" :  function(e,tpl) {
		e.preventDefault();
		Tags.remove(
			Template.parentData(0).tag._id,
			function(error,nb) {
				// On affiche la popup erreur
				if (error) 	toastr.warning("Impossible de supprimer le tag : " + error.reason);
				else {
					if (nb == 0) toastr.warning("Aucun tag effacé ");
					else {
						toastr.success(nb + " tag effacé ");
					}
				}
			}
		);
	}
};