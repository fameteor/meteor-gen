// ==============================================
// TEMPLATE PersChoisirModal 
// ==============================================

// ??????????????????????????????????????????????
// A ajouter :
// - Rajouter un tri sur les résultats de recherche de la BD
// - Mettre une recherche dans la base indépendante des caractères diacritiques
// - Activer le bouton ajouter que lorsque la saisie est valide

// Bugs :
// - 
// ??????????????????????????????????????????????

Template.PersChoisirModal.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactives
	// On initialise les critères de filtre selon le contexte s'il existe
	if (Template.parentData(0) && Template.parentData(0).filter) {
		// Pour le sexe
		if (Template.parentData(0).filter.sexe) {
				this.sexe = new ReactiveVar(Template.parentData(0).filter.sexe);
		}
		else 	this.sexe = new ReactiveVar("");
		// Pour le nom
		if (Template.parentData(0).filter.nom) {
				this.nom = new ReactiveVar(Template.parentData(0).filter.nom);
		}
		else	this.nom = new ReactiveVar("");
		// Pour le prénom
		if (Template.parentData(0).filter.prenom) {
				this.prenom = new ReactiveVar(Template.parentData(0).filter.prenom);
		}
		else	this.prenom = new ReactiveVar("");
	}
	else {
		this.sexe = new ReactiveVar("");
		this.nom = new ReactiveVar("");
		this.prenom = new ReactiveVar("");		
	}
	this.inputTimerHandler_nom = new ReactiveVar(null);
	this.inputTimerHandler_prenom = new ReactiveVar(null);		
});

Template.PersChoisirModal.helpers({
	// Pour le débug des variables réactives locales
	'debugReactiveVars': function() {
		var html = "";
		html += "sexe : ";
		html += Template.instance().sexe.get();
		html += "<br/>";
		html += "nom : ";
		html += Template.instance().nom.get();
		html += "<br/>";
		html += "prenom : ";
		html += Template.instance().prenom.get();
		html += "<br/>";
		return html;
	},
	// Pour la génération du formulaire
	'listeSexes' : function() {
		var listeSexes = _.map(parametreCommuns.sexes,function(value) {return value.valeur;});
		return lang.valueLabelList(listeSexes);
	},
	'selectedSexe' : function() {
		// S'il y a un filtre de nature
		return (this.value == Template.instance().sexe.get()) ? "selected" : "";			
	},
	'selectedNom' : function() {
		return Template.instance().nom.get();			
	},
	'selectedGenre' : function() {
		// S'il y a un filtre de nature
		return (this.value == Template.instance().genre.get()) ? "selected" : "";			
	},
	'selectedPrenom' : function() {
		return Template.instance().prenom.get();			
	},
	'saisieValide' : function() {
		return (	Template.instance().nom.get().trim().length > 1 
				|| Template.instance().prenom.get().trim().length > 1 
				|| (Template.instance().nom.get().trim().length == 1 && Template.instance().prenom.get().trim().length == 1)) 	
	},
	'isLocked' : function(property) {
		// On vérifie si la propriété correspondante au champs est dans la liste lockedFields
		if (Template.parentData(1) && Template.parentData(1).lockedFields) {
			// On balaye l'array
			var isLocked = false;
			for (index in Template.parentData(1).lockedFields) {
				var valeur = Template.parentData(1).lockedFields[index];
				if (valeur == property)	isLocked =  true;
			}
			if (isLocked)	return "disabled";
			else			return "";
		}
		else return "";
	},
	'title' : function() {
		if (Template.parentData(1) && Template.parentData(1).title) {
				return Template.parentData(1).title;
		}			
		else	return "Choisir une personne";
	},
	// Pour les lieux sélectionnés par les critères de filtre
	'persSelectionnees' : function() {
		// S'il y a plus de 2 lettres saisies entre le nom et le prénom
		if (	Template.instance().nom.get().trim().length > 1 
				|| Template.instance().prenom.get().trim().length > 1 
				|| (Template.instance().nom.get().trim().length == 1 && Template.instance().prenom.get().trim().length == 1)) {
			var query = {
				nom:		{$regex : ".*" + Template.instance().nom.get() + ".*", $options: 'i'},
				prenoms:	{$regex : ".*" + Template.instance().prenom.get() + ".*", $options: 'i'},
			};
			// Si un sexe est précisé, on le rajoute dans le query
			if (Template.instance().sexe.get())		query.sexe = Template.instance().sexe.get();
		}
		else {
			// On lance une requête qui ne ramène rien
			var query = {nom: "xxx",};
		}		
		// On lance le query
		return Pers.find(query,{sort: {nom: 1}});
	},
	// Filtrage des lieux selon le filtre
	'persFiltrees' : function() {
		var persFiltrees = _.filter(this.PERS,function(value) {
			var isFiltered = true;
			var persCourante = Pers.findOne(value);
			// Si on trouver le lieux
			if (persCourante) {
				if (Template.instance().sexe.get()) {
					isFiltered =  isFiltered && (persCourante.sexe == Template.instance().sexe.get());
				}
				if (Template.instance().nom.get()) {
					// True si le nom contient le texte, une fois tt ca mis en majuscules sans caractères diacritiques
					isFiltered =  isFiltered && (persCourante.nom.diacriticFilter().toUpperCase().indexOf(Template.instance().nom.get().diacriticFilter().toUpperCase()) != -1);
				}
				if (Template.instance().prenom.get()) {
					var prenomMatches = false;
					// On balaye les prénoms
					for (index in persCourante.prenoms) {
						var prenom = persCourante.prenoms[index];
						prenomMatches =  prenomMatches || (prenom.diacriticFilter().toUpperCase().indexOf(Template.instance().prenom.get().diacriticFilter().toUpperCase()) != -1);
					}
					isFiltered =  isFiltered && prenomMatches;
				}
				return isFiltered;
			}
			// Sinon on renvoie false
			else return false;
		});
		// On renvoie un objet pour ne pas avoir un array vide quand rien ne reste après filtrage
		return {pers:persFiltrees,count:persFiltrees.length};
	},

});

Template.PersChoisirModal.events = {

	// Si on change de sexe
	'change #choix_sexe': function (e,tpl) {
		e.preventDefault();
		tpl.sexe.set(e.target.value);
	},

	// Si on modifie le nom
	'keyup #choix_nom': function (e,tpl) {
		e.preventDefault();
		// If the timer is already set, we clear it
		if (tpl.inputTimerHandler_nom.get()) 	Meteor.clearTimeout(tpl.inputTimerHandler_nom.get());
		// We set-it (again)
		tpl.inputTimerHandler_nom.set(Meteor.setTimeout(
			function() {
				tpl.nom.set(e.target.value.trim());
				tpl.inputTimerHandler_nom.set(null);
			},
			clientParms.inputTimerValue
		));
	},

	// Si on modifie le prénom
	'keyup #choix_prenom': function (e,tpl) {
		e.preventDefault();
		// If the timer is already set, we clear it
		if (tpl.inputTimerHandler_prenom.get()) 	Meteor.clearTimeout(tpl.inputTimerHandler_prenom.get());
		// We set-it (again)
		tpl.inputTimerHandler_prenom.set(Meteor.setTimeout(
			function() {
				tpl.prenom.set(e.target.value.trim());
				tpl.inputTimerHandler_prenom.set(null);
			},
			clientParms.inputTimerValue
		));
	},
	
	// Si on clique sur un document à choisir
	'click a.choixModal': function (e,tpl) {
		e.preventDefault();
		// Si une action a été demandée :
		if (tpl.data && (tpl.data.callback || tpl.data.idField || tpl.data.labelField)) {
			// S'il y a un champ ou mettre l'ID
			if (tpl.data.idField) {
				$(tpl.data.idField).val(this._id);
				// On déclenche une évènement change sur cet input
				$(tpl.data.idField).trigger("change");
			}			
			// S'il y a un champ ou mettre l'intitulé
			var pers = Pers.findOne(this._id);
			if (pers && tpl.data.labelField) {
				$(tpl.data.labelField).val(pers.prenoms + " " + pers.nom);
				// On déclenche une évènement change sur cet input
				$(tpl.data.labelField).trigger("change");				
			}		
			// S'il y a un callback, on exécute le callback
			if (tpl.data.callback) 					tpl.data.callback(this._id);
		}
		// S'il n'y aucune action spécifiée, on affiche l'objet
		else Router.go('/pers/infos/' + this._id);
		// On enregistre dans la liste des objets visités
		gf_addVisitedObject("PERS",this._id);
		// On ferme la popup (si plusieurs modales)
		Modal.hide(Template.instance());
	},

	// Si on submit
	'submit': function (e,tpl) {
		e.preventDefault();
		// On récupère et on nettoie les informations
		var nom = tpl.find("#choix_nom").value.trim().diacriticFilter().toUpperCase();
		var prenoms = tpl.find("#choix_prenom").value.split(",");
		// On enlève les blancs et passe en uppercase la première lettre du prénom
		for (index in prenoms) {
			prenoms[index] = prenoms[index].trim().capitalizeFirstLetter();
		}
		var pers = {
			sexe:						tpl.find("#choix_sexe").value,
			nom:						nom,
			prenoms: 					prenoms,
			prenomUsuel:				0,
			prenomUsuelEstNonOfficiel:	false,
			etatRechActes:				"INCOMPLET_A_COMPLETER",
			etatRechEnfants:			"INCOMPLET_A_COMPLETER"
		}
		
		// ?????????????????????????????????????
		// On vérifie la formation correcte
		// ?????????????????????????????????????

		// On enregistre la personne en vérifiant et filtrant les valeurs (collection2)
		Pers.insert(
			pers,
			function(error, result) {
				if (error)	alert("Bien compléter sexe, nom et prénoms");
				else {
					// On enregistre dans la liste des objets visités
					gf_addVisitedObject("PERS",result);
					// On affiche le nom formaté et le premier prénom formaté
					// pour que la personne s'ffiche dans la liste, même pour les noms composés.
					tpl.find("#choix_nom").value = nom;
					tpl.find("#choix_prenom").value = prenoms[0];
					// On modifie les variables locales pour 
					// que la recherche se mette à jour dans tous les cas
					tpl.nom.set(nom);
					tpl.prenom.set(prenoms[0]);
					// On affiche la popup success
					toastr.success("Personne ajoutée dans la base");
				}
			}
		);
	},

	// Si on clique sur le bouton effacer
	'click #boutonEffacer': function (e,tpl) {
		e.preventDefault();
		// Si il y a des champs, on les efface
		if (tpl.data && (tpl.data.idField || tpl.data.labelField)) {
			// S'il y a un champ ou mettre l'ID
			if (tpl.data.idField) 			$(tpl.data.idField).val("");
			// S'il y a un champ ou mettre l'intitulé
			if (tpl.data.labelField) 		$(tpl.data.labelField).val("");
		}
		// On ferme la popup (si plusieurs modales)
		Modal.hide(Template.instance());
	},
};

Template.PersChoisirModal.rendered = function() {
	// Avec 1s de tempo (ouverture de la fenêtre), on met le focus sur le champ nom
	Meteor.setTimeout(function() {mettreFocusFinTexte("#choix_nom");}, 800);
};