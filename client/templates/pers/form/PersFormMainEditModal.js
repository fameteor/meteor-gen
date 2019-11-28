// ==============================================
// TEMPLATE PersFormMainEditModal 
// ==============================================
Template.PersFormMainEditModal.events = {
	"click #supprimer" :  function(e,tpl) {
		e.preventDefault();
		Pers.remove(
			Template.parentData(0).pers._id,
			function(error,nb) {
				// On affiche la popup erreur
				if (error) 	toastr.warning("Impossible de supprimer la personne : " + error.reason);
				else {
					if (nb == 0) toastr.warning("Aucune personne effacée ");
					else {
						// On revient à la page précédente
						window.history.back();
						toastr.success(nb + " personne effacée ");
					}
				}
			}
		);
	}
};