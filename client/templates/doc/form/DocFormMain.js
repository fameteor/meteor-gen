// ==============================================
// TEMPLATE DocFormMain
// ==============================================
Template.DocFormMain.onCreated (function () {
	this.codage = new ReactiveVar((Template.currentData() && Template.currentData().codage) || "");
});

Template.DocFormMain.helpers({
	'codage' : function() {
		return Template.instance().codage.get();
	},
	'typeIsChoosen' : function() {
		return (Template.instance().codage.get() != "");
	}
});

Template.DocFormMain.events = {
	'change select[name="type"]':   function(e,tpl) {
		e.preventDefault();
		// On sélectionne le codage standard correspondant au type de document
		var typeChoisi = e.target.value;
		if (typeChoisi != "") {
			var codageStandard = parametresClient.codageSelonTypeDoc[typeChoisi];
		}
		else {
			// Ici le type = "choisir un type", on affiche le message de choix du codage
			var codageStandard = "" ;
		}
		Template.instance().codage.set(codageStandard);
	},
	'focus input[name="specif.ACTE_commune_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		var idField = tpl.find('input[name="specif.ACTE_commune"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir une commune",
			idField:		idField,
			labelField: 	e.target,
			filter:			{'nature':"COMMUNE"},
			lockedFields:	["nature"],
			clearButton:	true,
			addButton:		true
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	'focus input[name="specif.ACTE_registre_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On recherche la commune
		var idCommune = tpl.find('input[name="specif.ACTE_commune"]').value;
		// S'il n'y a pas de surlieu, on demande de le préciser
		if (idCommune == "")	toastr.warning("Remplir la commune avant de préciser le registre.")
		else {
			// On appelle la fenêtre modale avec ses paramètres
			gf_openRegistreChercherModal(tpl.find('input[name="specif.ACTE_registre"]'),e.target,idCommune);
		}
	}
};

Template.DocFormMain.onRendered (function () {
	// On charge les valeurs dans les intitulés ACTES
	// Commune
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="specif.ACTE_commune_intitule"]','input[name="specif.ACTE_commune"]');
	// Registre
	var inputRegistre = Template.instance().find('input[name="specif.ACTE_registre"]');
	if (inputRegistre) {
		var idRegistre = inputRegistre.value;
		var registre = Registres.findOne(idRegistre);
		var inputIntitule = Template.instance().find('input[name="specif.ACTE_registre_intitule"]');
		if (inputIntitule && registre) 	inputIntitule.value = registre.contenu + " " + registre.periode;
	}
});