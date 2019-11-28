// ==============================================
// TEMPLATE LienAjouterModal
// ==============================================
Template.LienAjouterModal.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactives
	this.objType = new ReactiveVar("");
});


Template.LienAjouterModal.helpers({
	'listeObjetsGen' : function() {
		var listeObjetsGen = _.map(parametreCommuns.typesObjetsGen,function(value) {return value.valeur;});
		return lang.valueLabelList(listeObjetsGen);
	},
});

Template.LienAjouterModal.events = {
	// Si on change de type d'objet GEN
	'change #objType': function (e,tpl) {
		e.preventDefault();
		tpl.objType.set(e.target.value);
		// On crée l'objet paramètre de la popup
		var parms = {
					idField:		tpl.find('input#idVers'),
					labelField: 	tpl.find('input#idVers_intitule'),
					clearButton:	true,
					addButton:		true
				}
		switch(tpl.objType.get()) {
			case "PERS" :
				// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
				parms.title = "Choisir la personne cible du lien",
				Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
				break;
			case "LIEU" :
				// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
				parms.title = "Choisir le lieu cible du lien",
				Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});		
				break;
			case "HIST" :
				alert("A faire HIST : \"LienAjouterModal\"");
				break;
			case "DOC" :
				alert("A faire DOC : \"LienAjouterModal\"");
				break;
		}
	},
	'focus input#idVers_intitule': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("id");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('_intitule'));
		var idField = tpl.find('input#' + nameChampId)
		// On définit les paramètres de la fenêtre modale
		var parms = {
			idField:		idField,
			labelField: 	e.target,
			clearButton:	true,
			addButton:		true
		}
		switch(tpl.objType.get()) {
			case "PERS" :
				// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
				parms.title = "Choisir la personne cible du lien",
				Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
				break;
			case "LIEU" :
				// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
				parms.title = "Choisir le lieu cible du lien",
				Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});			
				break;
			case "HIST" :
				alert("A faire HIST : \"LienAjouterModal\"");
				break;
			case "DOC" :
				alert("A faire DOC : \"LienAjouterModal\"");
				break;
			case "":
				toastr.warning("Choisir le type de cible d'abord");
				break;
		}
	},
	// Si on submit
	'submit': function (e,tpl) {
		e.preventDefault();
		// On récupère et on nettoie les informations
		var type 	= tpl.find("#objType").value;
		var id 		= tpl.find("#idVers").value;
		var comment = tpl.find("#comment").value;
		var lien = {
			pour : {
				id: 			this.id,
				type:			this.type
			},
			vers : 	{
						id:		id,
						type:	type
			},
			comment:	comment,
			zone:		"ALL"
		}
		
		// ?????????????????????????????????????
		// On vérifie la formation correcte
		// ?????????????????????????????????????

		// On enregistre la personne en vérifiant et filtrant les valeurs (collection2)
		Liens.insert(
			lien,
			function(error, result) {
				if (error)	alert("Bien compléter la cible");
				else {
					// On affiche la popup success
					toastr.success("Lien ajouté dans la base");
					// On ferme la popup
					Modal.hide(Template.instance());
				}
			}
		);
	},
};