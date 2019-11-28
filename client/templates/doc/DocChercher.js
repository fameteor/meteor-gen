// ==============================================
// TEMPLATE DocChercher
// ==============================================
Template.DocChercher.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"docsSelectionnes" : function() {
		// Extraction de la base des documents sélectionnés
		return Docs.find(
			{
				$and : [
					{
						$or: [
							{titre:{$exists : false}},
							{titre:{$regex : ".*" + Session.get("choix_doc_titre") + ".*", $options: 'i'}}
						]
					},
					{
						"date.a1": { 
							$gte :  Session.get("choix_doc_anneeDebut"), 
							$lte : Session.get("choix_doc_anneeFin")
						}
					},
					{type: 	{$in: Session.get('choix_doc_types')}}
				]			
			},

			{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]}
		).fetch();
	},
	"saisieValide" : function() {
		// La saisie est valide dans tous les cas pour ce formulaire (pour l'instant).
		return true;
	},
	"types" : function() {
		// Renvoie la liste des types
		return parametreCommuns.typesDocs;
	},
	"premiersTypes" : function() {
		// Extraction de la première moitié des thèmes pour présentation première colonne
		var nbTypes = parametreCommuns.typesDocs.length;
		var resultat = [];
		for (var i = 0; i < Math.round(nbTypes/2); i++) { 
			resultat.push(parametreCommuns.typesDocs[i]);
		}
		return resultat;
	},
	"derniersTypes" : function() {
		// Extraction de la seconde moitié des thèmes pour présentation seconde colonne
		var nbTypes = parametreCommuns.typesDocs.length;
		var resultat = [];
		for (var i = Math.round(nbTypes/2); i < nbTypes; i++) { 
			resultat.push(parametreCommuns.typesDocs[i]);
		}
		return resultat;
	},
	"nomType" : function() {
		return this.intitule[LANG];
	},
	"typeChecked" : function () {
		// Regarde si la case de zone considérée est checked
		if (_.contains(Session.get('choix_doc_types'), this.valeur.toString())) {
			return {checked:true};
		}
	},
	"choix_doc_titre" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_doc_titre');
	},
	"choix_doc_anneeDebut" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_doc_anneeDebut');
	},
	"choix_doc_anneeFin" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_doc_anneeFin');
	},
	"debug" : function() {
		// On vide les variables de session pour débug
		return JSON.stringify({
			"choix_doc_titre" : Session.get('choix_doc_titre'),
			"choix_doc_types" : Session.get('choix_doc_types'),
			"choix_doc_anneeDebut" : Session.get('choix_doc_anneeDebut'),
			"choix_doc_anneeFin" : Session.get('choix_doc_anneeFin')		
		});
	},
});

Template.DocChercher.events = {
	'keyup #choix_doc_titre': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour le titre
		Session.set('choix_doc_titre', tpl.find("#choix_doc_titre").value);
	},
	'keyup #choix_doc_anneeDebut': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour l'année de début
		var anneeDebut = parseInt(tpl.find("#choix_doc_anneeDebut").value);
		if (anneeDebut) 	Session.set('choix_doc_anneeDebut', parseInt(anneeDebut));
		// Si aucune année n'est précisée, on indique l'année 0
		else				Session.set('choix_doc_anneeDebut', 0);
	},
	'keyup #choix_doc_anneeFin': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour l'année de fin
		var anneeFin = parseInt(tpl.find("#choix_doc_anneeFin").value);
		if (anneeFin) 		Session.set('choix_doc_anneeFin', parseInt(anneeFin));
		// Si aucune année n'est précisée, on indique l'année actuelle
		else				Session.set('choix_doc_anneeFin', new Date().getFullYear());
	},
	'click input[type=checkbox].type': function (e, tpl) {
		e.preventDefault();
		// Si on a cliqué sur une case à cocher de type, on regénère la liste des types checked
		var types = tpl.$('input[type=checkbox].type:checked').map(function () {
				return $(this).val();
		});
		Session.set('choix_doc_types', $.makeArray(types));
	},
	'click #boutonAucunType': function (e, tpl) {
		e.preventDefault();
		// Pour désélectionner toutes les zones
		Session.set('choix_doc_types', []);
	},
	'click #boutonTousTypes': function (e, tpl) {
		e.preventDefault();
		// Pour sélectionner toutes les zones
		Session.set('choix_doc_types', gf_arrayValeurs(parametreCommuns.typesDocs));
	},
};

Template.DocChercher.rendered = function() {
	// On met le focus sur le champ input du titre
	mettreFocusFinTexte('#choix_doc_titre');
}