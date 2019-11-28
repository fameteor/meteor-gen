// ==============================================
// TEMPLATE CoupleEventEditModal
// ==============================================
Template.CoupleEventEditModal.helpers({
	modalPopupHeaderClass() {
		switch (this.action) {
			case "INSERT":
				return "modal-insert";
				break;
			case "UPDATE":
				return "modal-update";
				break;
			case "DELETE":
				return "modal-delete";
				break;
			default:
				console.log("Erreur module\"PersCoupleEventEditModal\" : action \"" + this.action + "\" non supportée (INSERT, UPDATE, DELETE seuls supportés)");
				break;
		}
	},
	prefiledDoc() {
		return {"persA" : this._id}
	},
});

Template.CoupleEventEditModal.events = {
	"click .boutonSupprimer" :  function(e,tpl) {
		e.preventDefault();
		// On supprime le coupleEvent correspondant
		CoupleEvents.remove(
			Template.parentData(0).coupleEvent._id,
			function(error,nb) {
				// On affiche la popup erreur
				if (error) 	toastr.warning("Impossible de supprimer l'évènement conjugal : " + error.reason);
				else {
					if (nb == 0) toastr.warning("Aucun évènement conjugal effacé ");
					else {
						// On ferme la popup (si plusieurs modales)
						Modal.hide(Template.instance());
						toastr.success(nb + " évènement(s) conjugal effacé(s) ");
					}
				}
			}
		);
	},
};