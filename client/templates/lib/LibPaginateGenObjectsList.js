// ==============================================
// TEMPLATE LibPaginateGenObjectsList 
// ==============================================

// ??????????????????????????????????????????????
// Améliorations
// - Afficher comme title  quand bouton next/previous page disabled : "c'est la dernière page" et "c'est la première page"
// - Mieux gérer le centrage de la page courante au delà du premier bloc de pages
// - Gérer tous les types d'objet liens et actes de registres dépouillés
// ??????????????????????????????????????????????

Template.LibPaginateGenObjectsList.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	this.currentPage	= new ReactiveVar(1);
});

Template.LibPaginateGenObjectsList.helpers({
	// Pour valider les paramètres --------------
	'parmsOk' : function() {
		var result = true;
		result = result && (this.list && ((this.list instanceof Mongo.Collection.Cursor) || _.isArray(this.list)));
		result = result && (this.objectType && (	this.objectType == ["PERS"] 
													|| this.objectType == ["LIEU"] 
													|| this.objectType == ["HIST"] 
													|| this.objectType == ["DOC"]
													|| this.objectType == ["LIEN"]
													|| this.objectType == ["REGISTRE"]
													|| this.objectType == ["ACTE_ARCHIVES"]));
		result = result && (Number.isInteger(this.nbElemPerPage));
		result = result && (Number.isInteger(this.nbPagesMax));
		// Propriétés facultatives
		result = result && (!this.class || (_.isString(this.class)));
		result = result && (!this.title || (_.isString(this.title)));
		result = result && (!this.href || (_.isString(this.href)));
		return result;
	},	
	'parmsValidationError' : function() {
		var errMsg = "<p class='bg-danger'>";
		if (this.list) {
			if (!((this.list instanceof Mongo.Collection.Cursor) || _.isArray(this.list))) errMsg += "- la propriété <code>list</code> doit contenir une list Meteor ou un array.<br/>";
		}
		else errMsg += "- la propriété <code>list</code> du context doit être précisée.<br/>";
		if (this.objectType) {
			if (!(this.objectType == ["PERS"] 
				|| this.objectType == ["LIEU"] 
				|| this.objectType == ["HIST"] 
				|| this.objectType == ["DOC"]
				|| this.objectType == ["LIEN"]
				|| this.objectType == ["REGISTRE"]
				|| this.objectType == ["ACTE_ARCHIVES"])) errMsg += "- la propriété <code>objectType</code> doit contenir \"PERS\", \"LIEU\", \"HIST\", \"DOC\", \"LIEN\", \"REGISTRE\" ou \"ACTE_ARCHIVES\".<br/>";
		}
		else errMsg += "- la propriété <code>objectType</code> du context doit être précisée.<br/>";
		if (this.nbElemPerPage) {
			if (!(Number.isInteger(this.nbElemPerPage))) errMsg += "- la propriété <code>nbElemPerPage</code> doit être un entier.<br/>";
		}
		else errMsg += "- la propriété <code>nbElemPerPage</code> du context doit être précisée.<br/>";
		if (this.nbPagesMax) {
			if (!(Number.isInteger(this.nbPagesMax))) errMsg += "- la propriété <code>nbPagesMax</code> doit être un entier.<br/>";
		}
		else errMsg += "- la propriété <code>nbPagesMax</code> du context doit être précisée.<br/>";
		// Propriétés facultatives
		if (this.class && (!_.isString(this.class)))	errMsg += "- la propriété <code>class</code> doit être une chaine de caractères.<br/>";
		if (this.title && (!_.isString(this.title)))	errMsg += "- la propriété <code>title</code> doit être une chaine de caractères.<br/>";
		if (this.href && (!_.isString(this.href)))		errMsg += "- la propriété <code>href</code> doit être une chaine de caractères.<br/>";
		errMsg += "</p>";
		return errMsg;
	},	
	// Pour cacher la barre de pagination -------
	'nbPages' : function() {
		return Math.ceil(hlp_count(this.list) / this.nbElemPerPage);
	},
	// Pour générer la barre de pagination ------
	'resetCurrentPageOnCursorChanges' : function(page) {
		// On reset la page courante
		Template.instance().currentPage.set(1);
	},
	'listePages'  : function() {
		var nbPages = Math.ceil(hlp_count(this.list) / this.nbElemPerPage);
		var listePages = [];
		if (Template.instance().currentPage.get() <= this.nbPagesMax) {
			// On génère un array contenant la liste des pages
			for (var i = 1;i <= Math.min(nbPages,this.nbPagesMax);i++)	listePages.push(i);			
		}
		else {
			// On fixe la page courante à la fin
			var fin = Template.instance().currentPage.get();
			var debut = fin - (this.nbPagesMax - 1);
			for (var i = debut ;i <= fin;i++)	listePages.push(i);
		}
		return listePages;
	},
	'isPageActive' : function(page) {
		if (page == Template.instance().currentPage.get()) return "active";
	},
	'boutonPreviousDisabled' : function() {
		if (Template.instance().currentPage.get() <= 1) return "disabled";
	},	
	'boutonNextDisabled' : function() {
		var nbPages = Math.ceil(hlp_count(this.list) / this.nbElemPerPage);
		if (Template.instance().currentPage.get() >= nbPages) return "disabled";
	},
	// Données de la page actuelle
	'currentPageObjectsList' : function() {
		var nbElemPerPage = this.nbElemPerPage;
		// Si c'est pas un array mais un cursor
		var liste = this.list;
		if (liste instanceof Mongo.Collection.Cursor) liste = liste.fetch();
		// On revoie l'extraction de la page courante
		return liste.slice((Template.instance().currentPage.get() - 1) * nbElemPerPage, Template.instance().currentPage.get() * nbElemPerPage);
	},
});

Template.LibPaginateGenObjectsList.events = {
	'click #boutonFirst': function (e,tpl) {
		e.preventDefault();
		// On va à la première page
		Template.instance().currentPage.set(1);
	},
	'click #boutonPrevious': function (e,tpl) {
		e.preventDefault();
		// On décrémente la page courantes si elle est > 1
		if (Template.instance().currentPage.get() > 1) {
			Template.instance().currentPage.set(Template.instance().currentPage.get() - 1);
		}
	},
	'click #boutonNext': function (e,tpl) {
		e.preventDefault();
		var nbPages = Math.ceil(hlp_count(this.list) / this.nbElemPerPage);
		// On incrémente la page courantes si elle est < au max
		if (Template.instance().currentPage.get() < nbPages) {
			Template.instance().currentPage.set(Template.instance().currentPage.get() + 1);
		}
	},
	'click #boutonLast': function (e,tpl) {
		e.preventDefault();
		// On va à la dernière page
		var nbPages = Math.ceil(hlp_count(this.list) / this.nbElemPerPage);
		Template.instance().currentPage.set(nbPages);
	},
	'click .boutonPage': function (e,tpl) {
		e.preventDefault();
		// On met cette page comme page courante;
		Template.instance().currentPage.set(this);
	},
};

Template.LibPaginateGenObjectsList.rendered = function() {
	
};

// ==============================================
// TEMPLATE LibPaginateGenObjectsList_layoutLien 
// ==============================================
Template.LibPaginateGenObjectsList_layoutLien.helpers({
	'title' : function() {
		if (Template.parentData(2) && Template.parentData(2).title)	return Template.parentData(2).title;
		else {
			switch (Template.parentData(2).objectType) {
				case "PERS":
					return "Voir cette personne";
					break;
				case "LIEU":
					return "Voir ce lieu";
					break;
				case "HIST":
					return "Voir ce point d'histoire";
					break;
				case "DOC":
					return "Voir ce document";
					break;
				case "LIEN":
					return "Voir ce lien";
					break;
				case "REGISTRE":
					return "Voir ce registre";
					break;
				case "ACTE_ARCHIVES":
					return "Voir cet acte des archives dépouillé".
					break;
				default:
					console.log("Template \"LibPaginateGenObjectsList_layoutLien\", unsupported objectType : " + Template.parentData(2).objectType)
					break;
			}
		}
			return "coucou";
	},
	'href' : function() {
		if (Template.parentData(2) && Template.parentData(2).href)	return Template.parentData(2).href;
		else {
			switch (Template.parentData(2).objectType) {
				case "PERS":
					return "/pers/infos/" + Template.parentData(0)._id;
					break;
				case "LIEU":
					return "/lieu/infos/" + Template.parentData(0)._id;
					break;
				case "HIST":
					return "/hist/infos/" + Template.parentData(0)._id;
					break;
				case "DOC":
					return "/doc/infos/" + Template.parentData(0)._id;
					break;
				case "LIEN":
					return "/lien/infos/" + Template.parentData(0)._id;
					break;
				case "REGISTRE":
					return "/registre/infos/" + Template.parentData(0)._id;
					break;
				case "ACTE_ARCHIVES":
					return "/acteArchives/infos/" + Template.parentData(0)._id;
					break;
				default:
					console.log("Template \"LibPaginateGenObjectsList_layoutLien\", unsupported objectType : " + Template.parentData(2).objectType)
					break;
			}
		}
	}
});