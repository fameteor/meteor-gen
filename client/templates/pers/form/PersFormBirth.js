// ==============================================
// TEMPLATE PersFormBirth
// ==============================================
Template.PersFormBirth.events({
	// Gestion du père
	'focus input[name="pere_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir le père",
			idField:		idField,
			labelField: 	e.target,
			filter:			{'sexe':"M"},
			lockedFields:	["sexe"],
			clearButton:	true,
			addButton:		true
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	// Gestion de la mère
	'focus input[name="mere_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir la mère",
			idField:		idField,
			labelField: 	e.target,
			filter:			{'sexe':"F"},
			lockedFields:	["sexe"],
			clearButton:	true,
			addButton:		true
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	
	
	// Pour la saisie des communes (naissance, mariages, décès)
	'focus input[name$=".commune_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('_intitule'));
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
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('_intitule'));
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
	'focus input[name*=".docs."]': function(e,tpl){
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

Template.PersFormBirth.onRendered (function () {
	// On charge les valeurs dans les intitulés
	// Père
	gf_persSetIntituleFromId(Template.instance(),'input[name="pere_intitule"]','input[name="pere"]');
	// Mère
	gf_persSetIntituleFromId(Template.instance(),'input[name="mere_intitule"]','input[name="mere"]');
	// Commune de naissance
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="naissance.commune_intitule"]','input[name="naissance.commune"]');
	// Lieudit de naissance
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="naissance.lieudit_intitule"]','input[name="naissance.lieudit"]');
});