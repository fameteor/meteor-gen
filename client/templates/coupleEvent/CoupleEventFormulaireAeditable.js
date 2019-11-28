// ==============================================
// TEMPLATE CoupleEventFormulaireAeditable
// ==============================================
Template.CoupleEventFormulaireAeditable.events({
	// Gestion des personnes
	
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// Spécificité A editable : "persA.pers_intitule"
	// PersA seule est éditable
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	'focus input[name$="persA.pers_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('.pers_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir une personne",
			idField:		idField,
			labelField: 	e.target,
			filter:			null, // {'sexe':"M"},
			lockedFields:	null, // ["sexe"],
			clearButton:	true,
			addButton:		true
		}
		// S'il y a une personne dans le champ persB, on regarde son sexe et on force la recherche d'une personne de sexe opposée
		var autrePers = gf_persById(tpl.find('input[name=persB]').value);
		if (autrePers && autrePers.sexe === "M") {
			parms.filter = {'sexe':"F"};
			parms.lockedFields = ['sexe'];
		}
		if (autrePers && autrePers.sexe === "F") {
			parms.filter = {'sexe':"M"};
			parms.lockedFields = ['sexe'];
		}
		// Si sexe inconnu, on ne fait rien
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	// Gestion des communes	
	'focus input[name$=".commune_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('.commune_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
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
	
	// Pour la saisie des lieux-dits (naissance, mariages, décès)
	'focus input[name$=".lieudit_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('.lieudit_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
		// On recherche l'id de la commune correspondante
		var nameChampIdCommune = nameChampId.replace("lieudit","commune")
		var idCommune = tpl.find('input[name="' + nameChampIdCommune + '"]').value;
		// S'il n'y a pas d'id de commune, on demande de le préciser d'abord
		if (idCommune == "")	toastr.warning("Remplir la commune avant de préciser le lieudit.")
		else {
			// On définit les paramètres de la fenêtre modale
			var parms = {
				title:			"Choisir un lieu-dit",
				idField:		idField,
				labelField: 	e.target,
				filter:			{'nature':"LIEUDIT",'inclusDans':idCommune},
				lockedFields:	["nature","inclusDans"],
				clearButton:	true,
				addButton:		true
			}
			// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
			Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
		}
	},
	
	// Gestion de la référence de tous les actes (naissance, mariages, décès)
	'focus input[name*="docs."]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir un acte",
			idField:		e.target,
			clearButton:	true
		}
		// On appelle la fenêtre modale avec ses paramètres
		Modal.show('DocChoisirModal',parms,{backdrop:'static',keyboard:false});
	},

});


Template.CoupleEventFormulaireAeditable.onRendered (function () {
	// On charge les valeurs dans les intitulés
	// Pour la personne A
	gf_persSetIntituleFromId(Template.instance(),'input[name="persA.pers_intitule"]','input[name="persA"]');
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="communeA.commune_intitule"]','input[name="communeA"]');
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="lieuditA.lieudit_intitule"]','input[name="lieuditA"]');
	// Pour la personne B
	gf_persSetIntituleFromId(Template.instance(),'input[name="persB.pers_intitule"]','input[name="persB"]');
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="communeB.commune_intitule"]','input[name="communeB"]');
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="lieuditB.lieudit_intitule"]','input[name="lieuditB"]');
});