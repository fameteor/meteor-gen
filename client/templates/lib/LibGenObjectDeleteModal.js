// ==============================================
// TEMPLATE LibGenObjectDeleteModal 
// ==============================================
Template.LibGenObjectDeleteModal.events = {
	"click .boutonSupprimer" :  function(e,tpl) {
		e.preventDefault();
		// Selon l'objet, on supprime l'objet
		switch(Template.parentData(0).type) {
			case "PERS":
				Pers.remove(
					Template.parentData(0).obj._id,
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
				break;
			case "LIEU":
				Lieux.remove(
					Template.parentData(0).obj._id,
					function(error,nb) {
						// On affiche la popup erreur
						if (error) 	toastr.warning("Impossible de supprimer le lieu : " + error.reason);
						else {
							if (nb == 0) toastr.warning("Aucun lieu effacé ");
							else {
								// On revient à la page précédente
								window.history.back();
								toastr.success(nb + " lieu effacé ");
							}
						}
					}
				);
				break;
			case "HIST":
				Hists.remove(
					Template.parentData(0).obj._id,
					function(error,nb) {
						// On affiche la popup erreur
						if (error) 	toastr.warning("Impossible de supprimer le point d'histoire : " + error.reason);
						else {
							if (nb == 0) toastr.warning("Aucun point d'histoire effacé ");
							else {
								// On revient à la page précédente
								window.history.back();
								toastr.success(nb + " point d'histoire effacé ");
							}
						}
					}
				);
				break;
			case "DOC":
				Docs.remove(
					Template.parentData(0).obj._id,
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
				break;
			case "LIEN":
				Liens.remove(
					Template.parentData(0).obj._id,
					function(error,nb) {
						// On affiche la popup erreur
						if (error) 	toastr.warning("Impossible de supprimer le lien : " + error.reason);
						else {
							if (nb == 0) toastr.warning("Aucun lien effacé ");
							else {
								toastr.success(nb + " lien effacé ");
							}
						}
					}
				);
				break;
			case "REGISTRE":
				Registres.remove(
					Template.parentData(0).obj._id,
					function(error,nb) {
						// On affiche la popup erreur
						if (error) 	toastr.warning("Impossible de supprimer le registre : " + error.reason);
						else {
							if (nb == 0) toastr.warning("Aucun registre effacé ");
							else {
								// On revient à la page précédente
								window.history.back();
								toastr.success(nb + " registre effacé ");
							}
						}
					}
				);
				break;
			case "ACTE_ARCHIVES":
				ActesArchives.remove(
					Template.parentData(0).obj._id,
					function(error,nb) {
						// On affiche la popup erreur
						if (error) 	toastr.warning("Impossible de supprimer l'acte des archives : " + error.reason);
						else {
							if (nb == 0) toastr.warning("Aucun acte des archives effacé ");
							else {
								// On revient à la page précédente
								window.history.back();
								toastr.success(nb + " acte des archives effacé ");
							}
						}
					}
				);
				break;
			default:
				console.log("Error \"LibGenObjectDeleteModal\", unsupported genObject type : "  + Template.parentData(0).type);
				break;
		}
	}
};