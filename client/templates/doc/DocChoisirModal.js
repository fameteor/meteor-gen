// ==============================================
// TEMPLATE DocChoisirModal 
// ==============================================
Template.DocChoisirModal.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	/*
	// initialisée à "xxx" pour ne pas trouver de commune si aucune lettre n'est tapée
	this.choix_pers_nom 	= new ReactiveVar("");
	this.choix_pers_prenom 	= new ReactiveVar("");
	this.choix_pers_sexe 	= new ReactiveVar("");
	*/
});

Template.DocChoisirModal.helpers({
	// Pour le filtrage des documents de la base
	'docSelectionnees' : function() {
		return Docs.find(
			{
				codage: "IMAGE"
			},
			{sort: {nom: 1}}
		);
	},
	// Pour le filtrage des éléments vus récemment
	'filterCriteriasOk' : function() {
		return true;
	},
	// Titre par défault sin non fournit dans l'appel de l'ouverture de la popup
	'title' : function() {
		if (Template.parentData(1) && Template.parentData(1).title) {
				return Template.parentData(1).title;
		}			
		else	return "Choisir un document";
	},
});

Template.DocChoisirModal.events = {
	// Si on clique sur un document à choisir
	'click a.choixDocChoisirModal': function (e,tpl) {
		e.preventDefault();
		// Si une action a été demandée :
		if (tpl.data && (tpl.data.callback || tpl.data.idField || tpl.data.labelField)) {
			// S'il y a un champ ou mettre l'ID
			if (tpl.data.idField) 			$(tpl.data.idField).val(this._id);
			// S'il y a un champ ou mettre l'intitulé
			if (tpl.data.labelField) 		$(tpl.data.labelField).val("Mettre l'intitulé du doc, à faire !!!!");
			// S'il y a un callback, on exécute le callback
			if (tpl.data.callback) 					tpl.data.callback(this._id);
		}
		// S'il n'y aucune action spécifiée, on affiche l'objet
		else Router.go('/doc/infos/' + this._id);
		// On ferme la popup
		Modal.hide('DocChoisirModal');
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

Template.DocChoisirModal.rendered = function() {
	/*
	// Avec 1s de tempo (ouverture de la fenêtre), on met le focus sur le champ nom
	Meteor.setTimeout(function() {mettreFocusFinTexte("#choix_pers_nom");}, 800);
	*/
};