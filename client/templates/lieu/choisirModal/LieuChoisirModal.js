// ==============================================
// TEMPLATE LieuChoisirModal 
// ==============================================

// ??????????????????????????????????????????????
// A ajouter :
// - Fonction pour écrire dans la base (faut-il rajouter un champ sur-lieu ?)
// - Rajouter un tri sur les résultats de recherche de la BD
// - Mettre une recherche dans la base indépendante des caractères diacritiques
// - Filtrer les articles du nom du lieu saisi
// - Activer le bouton ajouter  que lorsque la saisie est valide
// - Vérifier que l'élémént n'extiste pas avant de l'enregistrer 

// Bugs :
// - Quand on a jouté un surlieu et qu'on l'efface, il n'est pas effacé de la varibale locale du 1er formulaire servant au filtrage
// ??????????????????????????????????????????????

Template.LieuChoisirModal.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactives
	
	// On initialise les critères de filtre selon le contexte s'il existe
	if (Template.parentData(0) && Template.parentData(0).filter) {
		// Pour le genre
		if (Template.parentData(0).filter.genre) {
				this.genre = new ReactiveVar(Template.parentData(0).filter.genre);
		}
		else 	this.genre = new ReactiveVar("");
		// Pour le nom
		if (Template.parentData(0).filter.nom) {
				this.nom = new ReactiveVar(Template.parentData(0).filter.nom);
		}
		else	this.nom = new ReactiveVar("");
		// Pour la nature
		if (Template.parentData(0).filter.nature) {
				this.nature = new ReactiveVar(Template.parentData(0).filter.nature);
		}
		else	this.nature = new ReactiveVar("");
		// Pour inclusDans
		if (Template.parentData(0).filter.inclusDans) {
				this.inclusDans = new ReactiveVar(Template.parentData(0).filter.inclusDans);
		}
		else	this.inclusDans = new ReactiveVar("");
	}
	else {
		this.genre = new ReactiveVar("");
		this.nom = new ReactiveVar("");
		this.nature = new ReactiveVar("");		
		this.inclusDans = new ReactiveVar("");	
	}
	this.inputTimerHandler = new ReactiveVar(null);		
});

Template.LieuChoisirModal.helpers({
	// Pour le débug des variables réactives locales
	'debugReactiveVars': function() {
		var html = "";
		html += "genre : ";
		html += Template.instance().genre.get();
		html += "<br/>";
		html += "nom : ";
		html += Template.instance().nom.get();
		html += "<br/>";
		html += "nature : ";
		html += Template.instance().nature.get();
		html += "<br/>";
		return html;
	},
	
	// Pour la génération du formulaire
	'listeGenres' : function() {
		var listeGenres = _.map(parametreCommuns.genresLieux,function(value) {return value.valeur;});
		return lang.valueLabelList(listeGenres);
	},
	'selectedGenre' : function() {
		// S'il y a un filtre de nature
		return (this.value == Template.instance().genre.get()) ? "selected" : "";			
	},
	'listeNatures' : function() {
		var listeNatures = _.map(parametreCommuns.typesLieux,function(value) {return value.valeur;});
		return lang.valueLabelList(listeNatures);
	},
	'selectedNature' : function() {
		// S'il y a un filtre de nature
		return (this.value == Template.instance().nature.get()) ? "selected" : "";			
	},
	'selectedNom' : function() {
		return Template.instance().nom.get();			
	},
	'selectedInclusDans' : function() {
		return Template.instance().inclusDans.get();			
	},
	'saisieValide' : function() {
		return (Template.instance().nom.get().trim().length > 1 ); 	
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
		else	return "Choisir un lieu";
	},
	
	
	// Pour les lieux sélectionnés par les critères de filtre
	'lieuxSelectionnes' : function() {
		// S'il y a plus de 2 lettres saisies dans le nom
		if (Template.instance().nom.get().trim().length > 1 ) {
			var query = {
				nom:	{$regex : ".*" + Template.instance().nom.get() + ".*", $options: 'i'},
			};
			// Si un genre est précisé, on le rajoute dans le query
			if (Template.instance().genre.get())	query.genre = Template.instance().genre.get();
			// Si une nature est précisée, on le rajoute dans le query
			if (Template.instance().nature.get())	query.nature = Template.instance().nature.get();
			// Si un sulieu est précisé, on le rajoute dans le query
			if (Template.instance().inclusDans.get())	query.inclusDans = Template.instance().inclusDans.get();
		}
		else {
			// On lance une requête qui ne ramène rien
			var query = {nom: "xxx",};
		}
		// On lance le query
		return Lieux.find(query,{sort: {nom: 1}});
	},

	// Filtrage des lieux selon le filtre
	'lieuxFiltres' : function() {
		var lieuxFiltres = _.filter(this.LIEU,function(value) {
			var isFiltered = true;
			var lieuCourant = Lieux.findOne(value);
			// Si on trouver le lieux
			if (lieuCourant) {
				if (Template.instance().genre.get()) {
					isFiltered =  isFiltered && (lieuCourant.genre == Template.instance().genre.get());
				}
				if (Template.instance().nom.get()) {
					// True si le nom contient le texte, une fois tt ca mis en majuscules sans caractères diacritiques
					isFiltered =  isFiltered && (lieuCourant.nom.diacriticFilter().toUpperCase().indexOf(Template.instance().nom.get().diacriticFilter().toUpperCase()) != -1);
				}
				if (Template.instance().nature.get()) {
					isFiltered =  isFiltered && (lieuCourant.nature == Template.instance().nature.get());
				}
				if (Template.instance().inclusDans.get()) {
					isFiltered =  isFiltered && (lieuCourant.inclusDans == Template.instance().inclusDans.get());
				}
				return isFiltered;
			}
			// Sinon on renvoie false
			else return false;
		});
		// On renvoie un objet pour ne pas avoir un array vide quand rien ne reste après filtrage
		return {lieux:lieuxFiltres,count:lieuxFiltres.length};
	},

});

Template.LieuChoisirModal.events = {

	// Si on change de genre
	'change #choix_genre': function (e,tpl) {
		e.preventDefault();
		tpl.genre.set(e.target.value);
	},

	// Si on modifie le nom
	'keyup #choix_nom': function (e,tpl) {
		e.preventDefault();
		// If the timer is already set, we clear it
		if (tpl.inputTimerHandler.get()) 	Meteor.clearTimeout(tpl.inputTimerHandler.get());
		// We set-it (again)
		tpl.inputTimerHandler.set(Meteor.setTimeout(
			function() {
				tpl.nom.set(e.target.value.trim());
				tpl.inputTimerHandler.set(null);
			},
			clientParms.inputTimerValue
		));
	},

	// Si on modifie la nature
	'change #choix_nature': function (e,tpl) {
		e.preventDefault();
		tpl.nature.set(e.target.value);
	},
	
	/*
	// Si on modifie le surlieu (soit par saisie, soit par modification par une popup de niveau 2)
	'keyup #choix_inclusDans, input #choix_inclusDans': function (e,tpl) {
		e.preventDefault();
		tpl.inclusDans.set(e.target.value);
	},
	*/
	
	// Si on submit
	'submit': function (e,tpl) {
		e.preventDefault();
		// On récupère les informations
		var lieu = {
			genre:			tpl.find("#choix_genre").value,
			nom:			tpl.find("#choix_nom").value.trim().capitalizeFirstLetter(),
			nature: 		tpl.find("#choix_nature").value,
			inclusDans:		tpl.find("#choix_inclusDans").value
		}
		// ?????????????????????????????????????
		// On vérifie la formation correcte
		// ?????????????????????????????????????
		
		// On enregistre le lieu en vérifiant et filtrant les valeurs (collection2)
		Lieux.insert(
			lieu,
			function(error, result) {
				if (error)	alert("Bien compléter genre, nom, nature et surlieu");
				else {
					// On enregistre dans la liste des objets visités
					gf_addVisitedObject("LIEU",result);
					// On affiche la popup success
					toastr.success("Lieu ajouté dans la base");
				}
			}
		);
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
			var lieu = Lieux.findOne(this._id);
			if (lieu && tpl.data.labelField) {
				$(tpl.data.labelField).val(parametresClient.genreLieu[lieu.genre] + lieu.nom);
				// On déclenche une évènement change sur cet input
				$(tpl.data.labelField).trigger("change");				
			}		
			// S'il y a un callback, on exécute le callback
			if (tpl.data.callback) 					tpl.data.callback(this._id);
		}
		// S'il n'y aucune action spécifiée, on affiche l'objet
		else Router.go('/lieu/infos/' + this._id);
		// On enregistre dans la liste des objets visités
		gf_addVisitedObject("LIEU",this._id);
		// On ferme la popup (si plusieurs modales)
		Modal.hide(Template.instance());
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
	
	// Pour la saisie du surlieu, fenetre modale de niveau 2
	'focus input#choix_inclusDans_intitule': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		// On cherche l'élément DOM du champ contenant l'ID (dont le name est sans "_intitule")
		var idField = tpl.find('input#choix_inclusDans')
		
		//????????????????????????????????????????
		// Eventuellement, fixer comme suggestion le sur lieu naturel, sans locker le champs
		//????????????????????????????????????????
		
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir un sur-lieu",
			idField:		idField,
			labelField: 	e.target,
			clearButton:	true,
			addButton:		true,
			
			// filter:			{'nature':"LIEUDIT",'inclusDans':idCommune},
			// lockedFields:	["nature","inclusDans"]
			
			// On modifie le critère de filtage du surlieu
			callback: function (nouvelId) {
				tpl.inclusDans.set(nouvelId);
			}
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
};

Template.LieuChoisirModal.rendered = function() {
	// Avec 1s de tempo (ouverture de la fenêtre), on met le focus sur le champ nom
	Meteor.setTimeout(function() {mettreFocusFinTexte("#choix_nom");}, 800);
	// On met à jour l'intitulé de inclusDans s'il est fourni
	if (Template.parentData(0) && Template.parentData(0).filter && Template.parentData(0).filter.inclusDans) {
		var lieu = Lieux.findOne(Template.parentData(0).filter.inclusDans);
		if (lieu) Template.instance().find('input#choix_inclusDans_intitule').value = parametresClient.genreLieu[lieu.genre] + lieu.nom;
	}
};