// ==============================================
// TEMPLATE PrefsChangerSosasRef
// ==============================================
Template.PrefsChangerSosasRef.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"valeurActuelleSosa1" : function() {
		return Session.get('refSosa1');
	},
});

Template.PrefsChangerSosasRef.events = {
	"submit #changerRefSosa1" : function(e,tpl){
		e.preventDefault();
		// On vérifie que la personne existe bien
		var refSosa1 = tpl.find("#refSosa1").value;
		if (Pers.findOne({_id:refSosa1})) {
			// On enregistre la modification
			Session.set('refSosa1',refSosa1);
			// On met en vert le champ
			$(tpl.find("#divChangerRefSosa1")).removeClass("has-error");
			// On ouvre une popup
			toastr.success("Référence sosa 1 modifiée");
			// On recalcule la liste des sosas
			gf_calculerSosas();
		}
		else {
			
			// On met en rouge le champ
			$(tpl.find("#divChangerRefSosa1")).addClass("has-error");
			// On remet le focus sur le champ
			mettreFocusFinTexte("#refSosa1");
			// On ouvre une popup
			toastr.warning("Ce n'est pas une référence de personne");
		}
	}
};