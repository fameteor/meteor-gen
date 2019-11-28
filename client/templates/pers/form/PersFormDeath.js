// ==============================================
// TEMPLATE PersFormDeath
// ==============================================
Template.PersFormDeath.events({
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

Template.PersFormDeath.onRendered (function () {
	// On charge les valeurs dans les intitulés
	// Commune de deces
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="deces.commune_intitule"]','input[name="deces.commune"]');
	// Lieudit de deces
	gf_lieuSetIntituleFromId(Template.instance(),'input[name="deces.lieudit_intitule"]','input[name="deces.lieudit"]');
});