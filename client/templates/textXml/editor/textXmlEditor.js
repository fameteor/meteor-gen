// ==============================================
// General functions
// ==============================================
var rmMultipleSpaces = function(text) {
	text = text.replace(/\s\s+/g, ' ');
	return text;
}

var exitTagEditMode = function(tpl) {
	// On reset les variables d'état
	tpl.tagEditMode.set(null);
	tpl.range.set(null);
	tpl.selectedText.set(null);
	tpl.tagEditErrors.set({});
}

var selectionIsCheckedAndStored = function(tpl) {
	var selections = window.getSelection();
	var zoneEdition = tpl.find("#editionZone");
	var selectionIsInEditionZone = selections.containsNode(zoneEdition,true);
	// Test if selection in editable zone
	if (selectionIsInEditionZone) {
		// Test if multiple selections
		if (selections.rangeCount >=2)	{
			toastr.warning("1 seule sélection doit-être effectuée !");
			return false;
		}
		else {
			// Test if just one selection
			if (selections.rangeCount ==1) {
				range = selections.getRangeAt(0);
				// Test if not empty selection
				if (range.endOffset != range.startOffset) {
					//On traite le texte de la sélection en enlevant les blancs multiples
					var selectedText = rmMultipleSpaces(range.toString());
					tpl.range.set(range);
					tpl.selectedText.set(selectedText);
					return true;
				}
				else {
					toastr.warning("La sélection doit comporter au moins une lettre !");
					return false;
				}
			}
			else {
				toastr.warning("Au moins 1 sélection doit-être effectuée !");
				return false;
			}
		}
	}
	else {
		toastr.warning("Sélectionner le ou les mots à taguer dans la zone éditable !");
		return false;
	}
}

var addTag = function(tpl,startTag,stopTag) {
	// On récupère le contexte de range
	var selectedText = tpl.selectedText.get();
	var range = tpl.range.get();
	// On supprime le contenu de la range
	range.deleteContents();
	// Si il y a un blanc initial, on le met avant le tag
	if (selectedText.indexOf(" ") == 0) {
		selectedText = selectedText.substr(1);;
		var newText = " " + startTag;
	}
	else var newText = startTag;
	// Si il y a un blanc final, on le met après le tag
	newText = newText + selectedText.replace(/\s+$/, '') + stopTag;
	// Si le texte sélectionné se termine par un blanc, on ajoute un blanc à la range vide
	if(/\s+$/.test(selectedText)) {
		newText = newText + " ";
	}
	// On ajoute le nouveau texte dans la range			
	var textNode = document.createTextNode(newText);
	range.insertNode(textNode);
	// On affiche le résultat dans le préview
	displayPreview(tpl);
	// On ferme et resette la fenêtre d'édition des tags
	exitTagEditMode(tpl);
}

var wrapSelectionIn = function(tpl,startTag,stopTag,emptySelectionAllowed) {
	var selections = window.getSelection();
	var zoneEdition = tpl.find("#editionZone");
	var selectionIsInEditionZone = selections.containsNode(zoneEdition,true);
	// Test if selection in editable zone
	if (selectionIsInEditionZone) {
		// Test if multiple selections
		if (selections.rangeCount >=2)	toastr.warning("1 seule sélection doit-être effectuée !");
		else {
			// Test if just one selection
			if (selections.rangeCount ==1) {
				range = selections.getRangeAt(0);
				// Test if not empty selection
				if ((range.endOffset != range.startOffset) || emptySelectionAllowed) {
					//On traite le texte de la sélection en enlevant les blancs multiples
					var selectedText = rmMultipleSpaces(range.toString());
					// On supprime le contenu de la range
					range.deleteContents();
					// Si il y a un blanc initial, on le met avant le tag
					if (selectedText.indexOf(" ") == 0) {
						selectedText = selectedText.substr(1);;
						var newText = " " + startTag;
					}
					else var newText = startTag;
					// Si il y a un blanc final, on le met après le tag
					newText = newText + selectedText.replace(/\s+$/, '') + stopTag;
					// Si le texte sélectionné se termine par un blanc, on ajoute un blanc à la range vide
					if(/\s+$/.test(selectedText)) {
						newText = newText + " ";
					}
					// On ajoute le nouveau texte dans la range			
					var textNode = document.createTextNode(newText);
					range.insertNode(textNode);
				}
				else toastr.warning("La sélection doit comporter au moins une lettre !");
			}
			else toastr.warning("Au moins 1 sélection doit-être effectuée !");
		}
	}
	else toastr.warning("Sélectionner le ou les mots à taguer dans la zone éditable !");
}

// Fonction pour obtenir le texte XML de la base
var textXml = function () {
	var donneesVides = "<i>A compléter.</i>";
	// On recherche l'objet concerné
	var objGen = Template.parentData(0).collection.findOne(Template.parentData(0).id);
	if (objGen) {
		// On recherche le champ concerné
		var fieldName = Template.parentData(0).field;
		var fieldNameList = fieldName.split(".");
		
		// ??????????????????????????????????????????????????
		// généraliser pour tous niveaux en récursif
		switch (fieldNameList.length) {
			case 1:
				if (objGen[fieldNameList[0]]) 	return objGen[fieldNameList[0]];
				else 							return donneesVides;
				break;
			case 2:
				if (objGen[fieldNameList[0]][fieldNameList[1]]) return objGen[fieldNameList[0]][fieldNameList[1]];
				else 							return donneesVides;
				break;
			case 3:
				if (objGen[fieldNameList[0]][fieldNameList[1]][fieldNameList[3]])return objGen[fieldNameList[0]][fieldNameList[1]][fieldNameList[3]];
				else 							return donneesVides;
				break;
			default:
				return "<font style='color:red;'>text-xml-editor erreur : le champ (" + fieldName + ") n'est pas trouvable.</font>"
			
		}
		// ??????????????????????????????????????????????????
	}
}

// Réinitisalisation quand on quitte l'éditeur
var reinitOnEditQuit = function(tpl) {
	// On réinitialise les variables locales
	tpl.isInEdition.set(false);
	tpl.copyOfOriginalText.set("");
	tpl.preview.set("");
}

var getEditedText =  function(tpl) {
	var text = tpl.find('#editionZone').textContent;
	// On supprime les blancs multiples
	// Les blancs initiaux et finaux sont déjà supprimés par FF
	return rmMultipleSpaces(text);
}

var displayPreview = function(tpl){
	// On récupère le texte et on le met dans la variable locale preview
	tpl.preview.set(getEditedText(tpl));
}
		

// ==============================================
// TEMPLATE textXmlEditor 
// ==============================================
Template.textXmlEditor.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	// Cette variable indique l'état de l'exploration des enfants de cette personne
	this.isInEdition 			= new ReactiveVar(false);
	this.copyOfOriginalText 	= new ReactiveVar("");
	this.preview 				= new ReactiveVar("");
	// Pour l'édition des tags
	// Valuers possibles "HIST, "DOC, "INFO_HIST", "INFO_DOC", "PERS_TRANSCRIPT"
	this.tagEditMode			= new ReactiveVar(null);
	this.range 					= new ReactiveVar(null);
	this.selectedText			= new ReactiveVar(null);
	this.tagEditErrors			= new ReactiveVar({});
});

Template.textXmlEditor.helpers({
	"isInEdition" : function () {
		return Template.instance().isInEdition.get();
	},
	"tagEditMode" : function () {
		return Template.instance().tagEditMode.get();
	},
	"tagEditErrors" : function () {
		return Template.instance().tagEditErrors.get();
	},
	"disabledWhenEditTagMode" : function () {
		return Template.instance().tagEditMode.get() ? "disabled" : "";
	},
	"copyOfOriginalText" : function () {
		return Template.instance().copyOfOriginalText.get();
	},
	"preview" : function () {
		return Template.instance().preview.get();
	},
	"textXml" : textXml,
	"callback" : function () {
		var variable = Template.instance().copyOfOriginalText;
		var voiceRecoCallback = function(variable) {
			return function(interim_transcript, final_transcript) {
				variable.set(final_transcript + " " + interim_transcript);
			}
		};
		return voiceRecoCallback(variable);
	},
	profs() {
		return Profs.find({},{sort:{M:1,F:1}});
	}
});


Template.textXmlEditor.events = {
	// Bouton EDIT, SAVE, CANCEL ----------------
	'click #editButton': function (e,tpl) {
		e.preventDefault();
		// On charge le texte
		Template.instance().copyOfOriginalText.set(textXml());
		Template.instance().preview.set(textXml());
		// On passe la variable en isInEdition:true
		Template.instance().isInEdition.set(true);
	},
	'click #saveButton': function (e,tpl) {
		e.preventDefault();
		// On enregistre le contenu html
		var query = {$set:{}};
		query.$set[this.field] = getEditedText(tpl);
		this.collection.update(Template.parentData(0).id,query);
		// On réinitialise les variables locales
		reinitOnEditQuit(tpl);
	},
	'click #cancelButton': function (e,tpl) {
		e.preventDefault();
		// On réinitialise les variables locales
		reinitOnEditQuit(tpl);
	},
	
	// Boutons d'édition ----------------------------
	'click #persButton': function (e,tpl) {
		// On passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) {
			// On crée une callback fonction de l'instance tpl
			var callback = function(tpl) {
				return function(id) {
					// On crée les start/stop tags
					var startTag = '<x-pers id="' + id + '">';
					var stopTag = '</x-pers>';
					addTag(tpl,startTag,stopTag);			
				};
			};
			// On affiche la popup de recherche de personne
			var parms = {
				title : 			"Choisir une personne",
				callback:			callback(tpl)
			}
			// On appelle la fenêtre modale avec ses paramètres
			Modal.show('PersChoisirModal',parms);	
		}
	},
	'click #lieuButton': function (e,tpl) {
		// On passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) {
			// On crée une callback fonction de l'instance tpl
			var callback = function(tpl) {
				return function(id) {
					// On crée les start/stop tags
					var startTag = '<x-lieu id="' + id + '">';
					var stopTag = '</x-lieu>';
					addTag(tpl,startTag,stopTag);			
				};
			};
			// On affiche la popup de recherche de lieu
			var parms = {
				title : 			"Choisir un lieu",
				filter:				{'nature':"LIEUDIT"},
				callback:			callback(tpl)
			}
			// On appelle la fenêtre modale avec ses paramètres
			Modal.show('LieuChoisirModal',parms);	
		}
	},
	'click #histButton': function (e,tpl) {
		e.preventDefault();
		// Si la sélection est valide et enregistrée, on passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) 	tpl.tagEditMode.set("HIST");
	},
	'click #docButton': function (e,tpl) {
		e.preventDefault();
		// Si la sélection est valide et enregistrée, on passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) 	tpl.tagEditMode.set("DOC");
	},
	// Boutons de tag html --------------------------
	'click #bButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<b>','</b>',true);
		displayPreview(tpl);
	},
	'click #iButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<i>','</i>',true);
		displayPreview(tpl);
	},
	'click #h1Button': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<h1>','</h1>',true);
		displayPreview(tpl);
	},
	'click #h2Button': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<h2>','</h2>',true);
		displayPreview(tpl);
	},
	'click #h3Button': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<h3>','</h3>',true);
		displayPreview(tpl);
	},
	// Boutons de tag html --------------------------
	'click #pButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<p>','</p>',true);
		displayPreview(tpl);
	},
	'click #brButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<br/>','',true);
		displayPreview(tpl);
	},
	'click #hrButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<hr/>','',true);
		displayPreview(tpl);
	},
	'click #ulButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		// ????????????????????????????????
		// Gérer une sélection sur plusieurs ligne
		// ????????????????????????????????
		wrapSelectionIn(tpl,'<ul><li>','</li></ul>',true);
		displayPreview(tpl);
	},
	// Boutons TRANSCRIPT ---------------------------
	'click #enteteButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-entete>','</x-entete>',true);
		displayPreview(tpl);
	},
	'click #enmargeButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-enmarge>','</x-enmarge>',true);
		displayPreview(tpl);
	},
	'click #ensignatureButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-ensignature>','</x-ensignature>',true);
		displayPreview(tpl);
	},
	'click #ennoteButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-ennote>','</x-ennote>',true);
		displayPreview(tpl);
	},
	'click #incertainButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-incertain>','</x-incertain>',true);
		displayPreview(tpl);
	},
	'click #persTranscriptButton': function (e,tpl) {
		e.preventDefault();
		// Si la sélection est valide et enregistrée, on passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) 	tpl.tagEditMode.set("PERS_TRANSCRIPT");
	},
	'click #infoButtonPers': function (e,tpl) {
		e.preventDefault();
		// On passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) {
			// On crée une callback fonction de l'instance tpl
			var callback = function(tpl) {
				return function(id) {
					// On crée les start/stop tags
					var startTag = '<x-info pers="' + id + '">';
					var stopTag = '</x-info>';
					addTag(tpl,startTag,stopTag);			
				};
			};
			// On affiche la popup de recherche de personne
			var parms = {
				title : 			"Choisir une personne",
				callback:			callback(tpl)
			}
			// On appelle la fenêtre modale avec ses paramètres
			Modal.show('PersChoisirModal',parms);	
		}
	},
	'click #infoButtonLieu': function (e,tpl) {
		e.preventDefault();
		// On passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) {
			// On crée une callback fonction de l'instance tpl
			var callback = function(tpl) {
				return function(id) {
					// On crée les start/stop tags
					var startTag = '<x-info lieu="' + id + '">';
					var stopTag = '</x-info>';
					addTag(tpl,startTag,stopTag);			
				};
			};
			// On affiche la popup de recherche de lieu
			var parms = {
				title : 			"Choisir un lieu",
				filter:				{'nature':"LIEUDIT"},
				callback:			callback(tpl)
			}
			// On appelle la fenêtre modale avec ses paramètres
			Modal.show('LieuChoisirModal',parms);	
		}
	},
	'click #infoButtonHist': function (e,tpl) {
		e.preventDefault();
		// Si la sélection est valide et enregistrée, on passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) 	tpl.tagEditMode.set("INFO_HIST");
	},
	'click #infoButtonDoc': function (e,tpl) {
		e.preventDefault();
		// Si la sélection est valide et enregistrée, on passe en mode édition de tag
		if (selectionIsCheckedAndStored(tpl)) 	tpl.tagEditMode.set("INFO_DOC");
	},
	'click #imgButton': function (e,tpl) {
		e.preventDefault();
		// On crée le tag
		wrapSelectionIn(tpl,'<x-img src="/data/photos/" align=""/>','',true);
		displayPreview(tpl);
	},
	
	// En cas de modif au clavier, on raffiche la preview
	'keyup #editionZone': function (e,tpl) {
		e.preventDefault();
		// On affiche la preview en conséquence
		displayPreview(tpl);
	},
	'focus input[name$="pers_intitule"]': function(e,tpl){
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
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('PersChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	'focus input[name$=".lieu_intitule"]': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var nameChampIntitule = e.target.getAttribute("name");
		var nameChampId = nameChampIntitule.substring(0,nameChampIntitule.indexOf('.lieu_intitule'));
		var idField = tpl.find('input[name="' + nameChampId + '"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir un lieu",
			idField:		idField,
			labelField: 	e.target,
			filter:			{'nature':"LIEUDIT"},
			lockedFields:	null,
			clearButton:	true,
			addButton:		true
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	'submit': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();

		switch (Template.instance().tagEditMode.get()) {
			case "PERS_TRANSCRIPT":
				// On récupère, vérifie et formate les tags de start et de stop
				var id = tpl.find("#pers").value;
				var incertain = tpl.find("#unreliableLink").checked;
				var status = tpl.find("#status").value;
				var age = tpl.find("#age").value.trim();
				var uniteAge = tpl.find("#uniteAge").value;
				switch (uniteAge) {
					case "ANNEE":
						// On ne fait rien
						break;
					case "MOIS":
						age = 1/12 * age;
						break;
					case "SEMAINE":
						age = 1/52 * age;
						break;
					case "JOUR":
						age = 1/365 * age;
						break;
					default:
						console.log("Error template textXmlEditor.events : unsupported uniteAge : " + uniteAge);
						break
				}
				prof
				var prof = tpl.find("#prof").value;
				var role = tpl.find("#role").value;
				var signe = tpl.find("#signe").value;
				var habite = tpl.find("#lieu").value;
				// On vérifie
				var errors = {};
				if (!id) errors.pers = "Ce champ est obligatoire";
				if (!status) errors.status = "Ce champ est obligatoire";
				if (!role) errors.role = "Ce champ est obligatoire";
				if (!signe) errors.signe = "Ce champ est obligatoire";
				Template.instance().tagEditErrors.set(errors);
				// Si pas d'erreur, on insère le tag
				if (JSON.stringify(errors) === JSON.stringify({})) {
					// On crée le start tag 
					var startTag = '<x-pers id="' + id + '" status="' + status + '"';
					if (incertain) startTag += ' incertain="incertain"';
					if (age) startTag += ' age="' + age + '"';
					if (prof) startTag += ' prof="' + prof + '"';
					startTag += ' role="' + role + '" signe="' + signe + '"';
					if (habite) startTag += ' habite="' + habite + '">';
					else		startTag += '>';
					// On crée le stop tag 
					var stopTag = '</x-pers>';
					addTag(tpl,startTag,stopTag);
				}
				else toastr.warning("Merci de compléter le formulaire");
				break;
				
			case "INFO_HIST":
				var id = tpl.find("#info_hist").value.trim();
				// On vérifie
				var errors = {};
				if (!id) errors.info_hist = "Ce champ est obligatoire";
				else {
					// On teste si c'est exiactement un ID potentiel
					var match = id.match(/[0-9a-zA-Z]{17}$/);
					if (!(match != null && id == match[0])) errors.info_hist = "Ce champ doit être un ID valide";
				}
				Template.instance().tagEditErrors.set(errors);
				// Si pas d'erreur, on insère le tag
				if (JSON.stringify(errors) === JSON.stringify({})) {
					// On crée le start tag 
					var startTag = '<x-info hist="' + id + '">';
					// On crée le stop tag 
					var stopTag = '</x-info>';
					addTag(tpl,startTag,stopTag);
				}
				else toastr.warning("Merci de compléter le formulaire");
				break;
				
			case "INFO_DOC":
				var id = tpl.find("#info_doc").value.trim();
				// On vérifie
				var errors = {};
				if (!id) errors.info_doc = "Ce champ est obligatoire";
				else {
					// On teste si c'est exiactement un ID potentiel
					var match = id.match(/[0-9a-zA-Z]{17}$/);
					if (!(match != null && id == match[0])) errors.info_doc = "Ce champ doit être un ID valide";
				}
				Template.instance().tagEditErrors.set(errors);
				// Si pas d'erreur, on insère le tag
				if (JSON.stringify(errors) === JSON.stringify({})) {
					// On crée le start tag 
					var startTag = '<x-info doc="' + id + '">';
					// On crée le stop tag 
					var stopTag = '</x-info>';
					addTag(tpl,startTag,stopTag);
				}
				else toastr.warning("Merci de compléter le formulaire");
				break;
				
			case "HIST":
				var id = tpl.find("#hist").value.trim();
				var incertain = tpl.find("#unreliableLink").checked;
				console.log(incertain);
				// On vérifie
				var errors = {};
				if (!id) errors.hist = "Ce champ est obligatoire";
				else {
					// On teste si c'est exiactement un ID potentiel
					var match = id.match(/[0-9a-zA-Z]{17}$/);
					if (!(match != null && id == match[0])) errors.hist = "Ce champ doit être un ID valide";
				}
				Template.instance().tagEditErrors.set(errors);
				// Si pas d'erreur, on insère le tag
				if (JSON.stringify(errors) === JSON.stringify({})) {
					// On crée le start tag 
					if (incertain)	var startTag = '<x-hist id="' + id + '" incertain="incertain">';
					else			var startTag = '<x-hist id="' + id + '">';
					// On crée le stop tag 
					var stopTag = '</x-hist>';
					addTag(tpl,startTag,stopTag);
				}
				else toastr.warning("Merci de compléter le formulaire");
				break;
				
			case "DOC":
				var id = tpl.find("#doc").value.trim();
				var incertain = tpl.find("#unreliableLink").checked;
				// On vérifie
				var errors = {};
				if (!id) errors.doc = "Ce champ est obligatoire";
				else {
					// On teste si c'est exiactement un ID potentiel
					var match = id.match(/[0-9a-zA-Z]{17}$/);
					if (!(match != null && id == match[0])) errors.doc = "Ce champ doit être un ID valide";
				}
				Template.instance().tagEditErrors.set(errors);
				// Si pas d'erreur, on insère le tag
				if (JSON.stringify(errors) === JSON.stringify({})) {
					// On crée le start tag 
					if (incertain)	var startTag = '<x-doc id="' + id + '" incertain="incertain">';
					else 			var startTag = '<x-doc id="' + id + '">';
					// On crée le stop tag 
					var stopTag = '</x-doc>';
					addTag(tpl,startTag,stopTag);
				}
				else toastr.warning("Merci de compléter le formulaire");
				break;
				
			default :
				console.log("Error template textXmlEditor.events : unsupported tagEditMode : " + Template.instance().tagEditMode.get());
				break;
		}
	},
	'click #annulerTag' : function(e,tpl){
		e.preventDefault();
		// On ferme et resette la fenêtre d'édition des tags
		exitTagEditMode(tpl);
	},
	'click #addProf'(e,tpl){
		Modal.show(
			"ProfFormMainEditModal",
			{
				action:"INSERT",
			},
			{backdrop:'static',keyboard:false}
		);
	}
};
