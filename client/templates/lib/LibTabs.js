// ==============================================
// TEMPLATE LibTabs
// ==============================================
Template.LibTabs.onCreated (function () {
	// On initialise le tab actif
	if (Template.currentData() && Template.currentData().selectedTab)	this.activeTab = new ReactiveVar(Template.currentData().selectedTab);
	else 																this.activeTab = new ReactiveVar(0);
});

Template.LibTabs.helpers({
	indexedList() {
		return _.map(this.tabsList, function(item,index){ 
			item.tabIndex = index;
			if (!item.label) 		console.log("Erreur module \"LibTabs\" : \"label\" non précisé dans le paramètre \"tabsList\".");
			if (!item.templateName)	console.log("Erreur module \"LibTabs\" : \"templateName\" non précisé dans le paramètre \"tabsList\".");
			return item; 
		});
	},
	isActiveTab(num) {
		if (Template.instance().activeTab.get() == num) return "active";
	},
	activeTab() {
		return Template.instance().activeTab.get();
	},
	cols() {
		if (Template.parentData(1) && Template.parentData(1).cols) {
			var cols = Template.parentData(1).cols;
			if (	(Math.round(cols) === cols) 
				&& 	(cols > 0) 
				&& 	(cols < 12))	return cols;
			else 					return 2;
		}
		else 					return 2;
	},
	colsComplement() {
		if (Template.parentData(1) && Template.parentData(1).cols) {
			var cols = Template.parentData(1).cols;
			if (	(Math.round(cols) === cols) 
				&& 	(cols > 0) 
				&& 	(cols < 12))	return 12 - cols;
			else 					return 10;
		}
		else 					return 10;
	}
});

Template.LibTabs.events({
	// Gestion des tabs
	'click a.tab': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On affiche l'index du tab actif de 0 à N
		tpl.activeTab.set(this.tabIndex);
		// On enlève le focus sur l'élément
		e.target.blur();
		// Pour éviter la propagation au templates récursifs supérieurs
		e.stopPropagation();
	}
});

// ==============================================
// TEMPLATE LibTabs_DOCAUTO
// ==============================================
Template.LibTabs_DOCAUTO.helpers({
	tabsList() {
		var tabsList = [
			{label:"Accueil",							templateName:"RouterHome"},
			{label:"Documentation des templates",		templateName:"AdminDocprogTemplatesAuto"},
		];
		return tabsList;
	}
});