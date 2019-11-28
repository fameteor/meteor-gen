// ==============================================
// TEMPLATE DocInfosIMAGE
// ==============================================
Template.DocInfosIMAGE.onCreated (function () {
	// A l'initialisation du template, on crée des variables locales réactive
	// On initialise la page courante à 1;
	this.pageActuelle = new ReactiveVar(1);
	// Les zones ne sont pas visibles initialement
	this.zonesVisible = new ReactiveVar(false);
	// On n'est pas en mode édition
	this.editMode = new ReactiveVar(false);
	
	// Zoom initial à 100% : index 9 de parametreCommuns.NiveauxDeZoom :
	this.indexZoomActuel = new ReactiveVar(9);
	var viewbox = "0 0 " + this.data.specif.IMAGE_px + " " + this.data.specif.IMAGE_py;
	this.viewbox = new ReactiveVar(viewbox.split(" "));
	this.viewboxInitialWidth = new ReactiveVar(this.data.specif.IMAGE_px);
	this.viewboxInitialHeight = new ReactiveVar(this.data.specif.IMAGE_py);
	this.xMouseInitial = new ReactiveVar(0);
	this.yMouseInitial = new ReactiveVar(0);
	this.xViewboxInitial = new ReactiveVar(0);
	this.yViewboxInitial = new ReactiveVar(0);
	
	this.spanMode = new ReactiveVar(false);
});



Template.DocInfosIMAGE.helpers({
	// Booleans -----------------------------------
	"plusieursPages" : function() {
		return (this.specif.IMAGE_nbPages > 1);
	},
	//Attributes ----------------------------------
	"npPages" : function() {
		return this.specif.IMAGE_nbPages;
	},
	"viewBox" : function() {
		return "0 0 " + this.specif.IMAGE_px + " " + this.specif.IMAGE_py;
	},
	"pageActuelle" : function () {
		return Template.instance().pageActuelle.get();
	},
	"url" : function () {
		var url = Meteor.absoluteUrl() + "marais" + this.urlDocument;
		url = url.replace("1.jpg",Template.instance().pageActuelle.get() + ".jpg");
		return url;
	},
	"disableFirst" : function () {
		if (Template.instance().pageActuelle.get() == 1) return "disabled";
	},
	"disableLast" : function () {
		if (Template.instance().pageActuelle.get() == this.specif.IMAGE_nbPages) return "disabled";
	},
	"listeLiensSurCeDoc" : function() {
		// Extraction de la base des liens sélectionnés
		return Liens.find({"pour.id":this._id});
	},
	"zoneClass" : function() {
		if (Template.instance().editMode.get()) 			return "zoneEditable";
		else {
			if (Template.instance().zonesVisible.get()) 	return "zoneVisible";
			else 									return "zoneHidden";
		}
	},
	'editMode' : function() {
		return Template.instance().editMode.get();
	},
	"zoomLevel" : function () {
		return Svg.niveauxDeZoom[Template.instance().indexZoomActuel.get()];
	},
	"viewboxCalculee" : function () {
		return Template.instance().viewbox.get().join(" ");
	},
	"spanMode" : function () {
		return Template.instance().spanMode.get();
	},
	"xMouseInitial" : function () {
		return Template.instance().xMouseInitial.get();
	},
	"yMouseInitial" : function () {
		return Template.instance().yMouseInitial.get();
	}
});

Template.DocInfosIMAGE.events({
	'click .boutonFirst': function(e,tpl){
		e.preventDefault();
		tpl.pageActuelle.set(1);
	},
	'click .boutonPrevious': function(e,tpl){
		e.preventDefault();
		if (tpl.pageActuelle.get() > 1) 	tpl.pageActuelle.set(tpl.pageActuelle.get() - 1);
	},
	'click .boutonNext': function(e,tpl){
		e.preventDefault();
		var nouvellePage = parseInt(tpl.pageActuelle.get()) + 1;
		if (tpl.pageActuelle.get() < this.specif.IMAGE_nbPages) 	tpl.pageActuelle.set(tpl.pageActuelle.get() + 1);
	},
	'click .boutonLast': function(e,tpl){
		e.preventDefault();
		tpl.pageActuelle.set(this.specif.IMAGE_nbPages);
	},
	'change #page': function(e,tpl){
		e.preventDefault();
		if (isNaN(parseInt(tpl.find("#page").value))) {
			tpl.find("#page").value = tpl.pageActuelle.get();
		}			
		else {
			tpl.pageActuelle.set(tpl.find("#page").value);
		}
	},
	'click .boutonZoneVisibility': function(e,tpl){
		e.preventDefault();
		// Toggle the visibility of the zones
		tpl.zonesVisible.set(!(tpl.zonesVisible.get()))
		return false;
	},
	'click .boutonEdit': function(e,tpl){
		e.preventDefault();
		// Toggle the edit mode
		tpl.editMode.set(!(tpl.editMode.get()))
		console.log(tpl.editMode.get());
		return false;
	},
	
	'click .zone': function(e,tpl){
		e.preventDefault();
		// If not in edit mode, we follow the link
		if (!tpl.editMode.get()) {
			switch(this.vers.type) {
				case "PERS":
					Router.go('/pers/infos/' + this.vers.id);
					break;
				case "LIEU":
					Router.go('/lieu/infos/' + this.vers.id);
					break;
				case "HIST":
					Router.go('/hist/infos/' + this.vers.id);
					break;
				case "DOC":
					Router.go('/doc/infos/' + this.vers.id);
					break;
				default:
					alert("DocInfosIMAGE, click sur une classe zone non implémentée : " + this.vers.type);
					break;
			}
		}
	},
	
	//Zoom for Firefox and for Chrome
	'DOMMouseScroll .zoomable, mousewheel .zoomable': function(e,tpl){
		e.preventDefault();
		Svg.gestionRoulette(e,tpl);
	},
	// Suivi des déplacements de la souris
	'mousemove svg' : function(e,tpl) {
		e.preventDefault();
		// Si on est en mode drag and drop, on modifie le viewpoint
		if ( tpl.spanMode.get()) {
			// On calcule le taux  de zoom
			var tauxDeZoom = Svg.niveauxDeZoom[tpl.indexZoomActuel.get()]/100;
			// On calcule le déplacement
			var deplacementX = e.clientX - tpl.xMouseInitial.get(); 
			var deplacementY = e.clientY - tpl.yMouseInitial.get();
			// On modifie le viewport
			// On récupère les information viewbox
			var x 		= tpl.xViewboxInitial.get();
			var y 		= tpl.yViewboxInitial.get();
			var widthInitial	= tpl.viewboxInitialWidth.get();
			var width		= tpl.viewbox.get()[2];
			var height		= tpl.viewbox.get()[3];
			// On récupère la largeur en pixel du rendu SVG
			var widthSvgPixels  = $(tpl.find("svg")).width();
			// On calcule le nb de points SVG par pixel
			var nbPointsParPixel = widthInitial/widthSvgPixels;
			// On calcule le nouveau viewport
			var nouveauX = x - deplacementX * nbPointsParPixel / tauxDeZoom;
			var nouveauY = y - deplacementY * nbPointsParPixel / tauxDeZoom;
			// On enregistre le nouveau viewbox
			var nouveauViewbox = [nouveauX, nouveauY, width, height];
			tpl.viewbox.set(nouveauViewbox);
		}
	},
	'mousedown svg' :  function(e,tpl) {
		e.preventDefault();
		// On calcule la position initiale de la souris
		tpl.xMouseInitial.set(e.clientX);
		tpl.yMouseInitial.set(e.clientY);
		tpl.xViewboxInitial.set( tpl.viewbox.get()[0]);
		tpl.yViewboxInitial.set( tpl.viewbox.get()[1]);
		tpl.spanMode.set(true);
	},	
	'mouseup' : function(e,tpl) {
		e.preventDefault();
		tpl.spanMode.set(false);
	},

	
	
	
});
