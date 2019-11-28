// ==============================================
// TEMPLATE LieuFormulaire
// ==============================================
Template.LieuFormulaire.events({
	// Quand on clique sur le champ "intitulé du lieu parent"
	'focus input[name="inclusDans_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On définit les paramètres de la fenêtre modale
		var parms = {
			idField:		tpl.find('input[name="inclusDans"]'),
			labelField: 	e.target,
			clearButton:	true,
			addButton:		true
		}
		// Si une nature est choisie, on l'envoie le surlieu habituel comme paramètre de filtrage
		var natureField = tpl.find('select[name="nature"]');
		if (natureField && natureField.value) {
			// S'il y a un sulieu normal, on l'ajoute aux paramètres
			var natureSurLieu = parametreCommuns.surlieuNormal[natureField.value];
			if (natureSurLieu) 	parms.filter = {'nature':natureSurLieu};
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
});

Template.LieuFormulaire.onRendered (function () {
	// On charge l'intitulé de la commune
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="inclusDans_intitule"]','input[name="inclusDans"]');
});