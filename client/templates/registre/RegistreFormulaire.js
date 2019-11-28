// ==============================================
// TEMPLATE RegistreFormulaire
// ==============================================
Template.RegistreFormulaire.events({
	// Quand on clique sur le champ "intitulé de la commune"
	'focus input[name="commune_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On définit les paramètres de la fenêtre modale
		var parms = {
			idField:		tpl.find('input[name="commune"]'),
			labelField: 	e.target,
			filter:			{'nature':"COMMUNE"},
			lockedFields:	["nature"],
			clearButton:	true,
			addButton:		true
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
});

Template.RegistreFormulaire.onRendered (function () {
	// On charge l'intitulé de la commune
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="commune_intitule"]','input[name="commune"]');
});