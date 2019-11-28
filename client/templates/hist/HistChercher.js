// ==============================================
// TEMPLATE HistChercher 
// ==============================================

Template.HistChercher.helpers({
	// Booleans -----------------------------------
	//Attributes ----------------------------------
	"histsSelectionnes" : function() {
		// Extraction de la base des points d'histoire sélectionnés
		
		if (Session.get('choix_hist_impact')) {
			return Hists.find(
				{
					titre:		{$regex : ".*" + Session.get("choix_hist_titre") + ".*", $options: 'i'},
					"date.a1": { $gte :  Session.get("choix_hist_anneeDebut"), $lte : Session.get("choix_hist_anneeFin")},
					zones: 	{$in: Session.get('choix_hist_zones')},
					themes: 	{$in: Session.get('choix_hist_themes')},
					impacteAncetres: true
				},
				{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]}
			);
		}
		else {
			if (Session.get('choix_hist_pasImpact')) {
				return Hists.find(
					{
						titre:		{$regex : ".*" + Session.get("choix_hist_titre") + ".*", $options: 'i'},
						"date.a1": { $gte :  Session.get("choix_hist_anneeDebut"), $lte : Session.get("choix_hist_anneeFin")},
						zones: 	{$in: Session.get('choix_hist_zones')},
						themes: 	{$in: Session.get('choix_hist_themes')},
						impacteAncetres: false
					},
					{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]}
				);			
			}
			else {
				return Hists.find(
					{
						titre:		{$regex : ".*" + Session.get("choix_hist_titre") + ".*", $options: 'i'},
						"date.a1": { $gte :  Session.get("choix_hist_anneeDebut"), $lte : Session.get("choix_hist_anneeFin")},
						zones: 	{$in: Session.get('choix_hist_zones')},
						themes: 	{$in: Session.get('choix_hist_themes')}
					},
					{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]}
				);
			}
		}
	},
	"saisieValide" : function() {
		// La saisie est valide dans tous les cas pour ce formulaire (pour l'instant).
		return true;
	},
	"choix_hist_titre" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_hist_titre');
	},
	"choix_hist_anneeDebut" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_hist_anneeDebut');
	},
	"choix_hist_anneeFin" : function() {
		// Affiche la valeur de la variable de session
		return Session.get('choix_hist_anneeFin');
	},
	"impactChecked": function() {
		// Affiche la valeur de la variable de session
		if (Session.get('choix_hist_impact')) return {checked:true};
	},
	"pasImpactChecked": function() {
		// Affiche la valeur de la variable de session
		if (Session.get('choix_hist_pasImpact')) return {checked:true};
	},
	"zones" : function() {
		// Renvoie la liste des zones
		return parametreCommuns.zonesHist;
	},
	"nomZone" : function() {
		return this.intitule[LANG];
	},
	"zoneChecked" : function () {
		// Regarde si la case de zone considérée est checked
		if (_.contains(Session.get('choix_hist_zones'), this.valeur.toString())) {
			return {checked:true};
		}
	},
	"premiersThemes" : function() {
		// Extraction de la première moitié des thèmes pour présentation première colonne
		var nbThemes = parametreCommuns.themesHist.length;
		var resultat = [];
		for (var i = 0; i < Math.round(nbThemes/2); i++) { 
			resultat.push(parametreCommuns.themesHist[i]);
		}
		return resultat;
	},
	"derniersThemes" : function() {
		// Extraction de la seconde moitié des thèmes pour présentation seconde colonne
		var nbThemes = parametreCommuns.themesHist.length;
		var resultat = [];
		for (var i = Math.round(nbThemes/2); i < nbThemes; i++) { 
			resultat.push(parametreCommuns.themesHist[i]);
		}
		return resultat;
	},
	"nomTheme" : function() {
		return this.intitule[LANG];
	},
	"themeChecked" : function () {
		// Regarde si la case de thème considérée est checked
		if (_.contains(Session.get('choix_hist_themes'), this.valeur.toString())) {
			return {checked:true};
		}
	},
	"debug" : function() {
		// On vide les variables de session pour débug
		return JSON.stringify({
			"choix_hist_titre" : Session.get('choix_hist_titre'),
			"choix_hist_anneeDebut" : Session.get('choix_hist_anneeDebut'),
			"choix_hist_anneeFin" : Session.get('choix_hist_anneeFin'),
			"choix_hist_zones" : Session.get('choix_hist_zones'),
			"choix_hist_themes" : Session.get('choix_hist_themes')				
		});
	},
});

Template.HistChercher.events = {
	'keyup #choix_hist_titre': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour le titre
		Session.set('choix_hist_titre', tpl.find("#choix_hist_titre").value);
	},
	'keyup #choix_hist_anneeDebut': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour l'année de début
		var anneeDebut = parseInt(tpl.find("#choix_hist_anneeDebut").value);
		if (anneeDebut) 	Session.set('choix_hist_anneeDebut', parseInt(anneeDebut));
		// Si aucune année n'est précisée, on indique l'année 0
		else				Session.set('choix_hist_anneeDebut', 0);
	},
	'keyup #choix_hist_anneeFin': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour l'année de fin
		var anneeFin = parseInt(tpl.find("#choix_hist_anneeFin").value);
		if (anneeFin) 		Session.set('choix_hist_anneeFin', parseInt(anneeFin));
		// Si aucune année n'est précisée, on indique l'année actuelle
		else				Session.set('choix_hist_anneeFin', new Date().getFullYear());
	},
	'click input[type=checkbox].zone': function (e, tpl) {
		e.preventDefault();
		// Si on a cliqué sur une case à cocher de zone, on regénère la liste des zones checked
		var zones = tpl.$('input[type=checkbox].zone:checked').map(function () {
				return $(this).val();
		});
		Session.set('choix_hist_zones', $.makeArray(zones));
	},
	'click input[type=checkbox].theme': function (e, tpl) {
		e.preventDefault();
		// Si on a cliqué sur une case à cocher de thème, on regénère la liste des thèmes checked
		var themes = tpl.$('input[type=checkbox].theme:checked').map(function () {
				return $(this).val();
		});
		Session.set('choix_hist_themes', $.makeArray(themes));
	},
	'click #boutonAucuneZone': function (e, tpl) {
		e.preventDefault();
		// Pour désélectionner toutes les zones
		Session.set('choix_hist_zones', []);
	},
	'click #boutonToutesZones': function (e, tpl) {
		e.preventDefault();
		// Pour sélectionner toutes les zones
		Session.set('choix_hist_zones', gf_arrayValeurs(parametreCommuns.zonesHist));
	},
	'click #boutonAucunTheme': function (e, tpl) {
		e.preventDefault();
		// Pour désélectionner tous les thèmes
		Session.set('choix_hist_themes', []);
	},
	'click #boutonTousThemes': function (e, tpl) {
		e.preventDefault();
		// Pour sélectionner tous les thèmes
		Session.set('choix_hist_themes',  gf_arrayValeurs(parametreCommuns.themesHist));
	},
	'click #impact': function (e, tpl) {
		e.preventDefault();
		if (tpl.find("#impact").checked) {
			Session.set('choix_hist_impact', true);
			// Si la case pasImpact est checked, on la dé-check
			if (Session.get('choix_hist_pasImpact'))	Session.set('choix_hist_pasImpact', false);
		}
		else {
			Session.set('choix_hist_impact', false);
		}
	},
	'click #pasImpact': function (e, tpl) {
		e.preventDefault();
		if (tpl.find("#pasImpact").checked) {
			Session.set('choix_hist_pasImpact', true);
			// Si la case pasImpact est checked, on la dé-check
			if (Session.get('choix_hist_impact'))	Session.set('choix_hist_impact', false);
		}
		else {
			Session.set('choix_hist_pasImpact', false);
		}
	},
};

Template.HistChercher.rendered = function() {
	// Une fois le DOM chargé, on met le focus sur le champ nom
	mettreFocusFinTexte("#choix_hist_titre");
};