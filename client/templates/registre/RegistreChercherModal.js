// ==============================================
// TEMPLATE RegistreChercherModal 
// ==============================================
Template.RegistreChercherModal.helpers({
	'registresSelectionnes' : function() {
		var query = {'commune':registreChercherModal_idCommune};
		return Registres.find(query,{sort: {ordreParCommune: 1}});
	}
});

Template.RegistreChercherModal.events = {
	'click a': function (e,tpl) {
		e.preventDefault();
		// On enregistre l'ID et ferme la modale
		gf_saveAndCloseRegistreChercherModal(this._id);
	},
};

