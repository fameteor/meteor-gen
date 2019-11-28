// ==============================================
// TEMPLATE LienBoutonAjouterVers
// ==============================================
Template.LienBoutonAjouterVers.events = {
	"click .ajouter" :  function(e) {
		e.preventDefault();
		// On définit les paramètres de la fenêtre modale
		var parms = {
			id:				this.obj._id,
			type:			this.type,
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LienAjouterModal',parms,{backdrop:'static',keyboard:false});
	}
};

// ==============================================
// TEMPLATE LienBoutonAjouterVers_DOCAUTO
// ==============================================
Template.LienBoutonAjouterVers_DOCAUTO.helpers({
	souvenirBanquet() {
		return gf_docById("is35dxH7j3f3tDZPM");
	}
});