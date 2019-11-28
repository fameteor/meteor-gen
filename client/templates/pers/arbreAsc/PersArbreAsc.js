// ===============================================================
// Fonction d'adaptation du viewport initial selon le zoom et span courant
// ===============================================================

adapterViewportSpanZoom = function(tpl) {
	// On récupère le taux de zoom
	var tauxDeZoom = parametreCommuns.NiveauxDeZoom[tpl.indexZoomActuel.get()]/100;
	// On récupère le  viewbox actuel
	var x 		= tpl.viewbox.get()[0];
	var y 		= tpl.viewbox.get()[1];
	var width		= tpl.viewbox.get()[2];
	var height		= tpl.viewbox.get()[3];
	// On calcule le centre de l'image
	var xCentre = x + width/2;
	var yCentre = y + height/2;
	// On récupère les largeurs et hauteur du viewbox initial
	var widthInitial = 	tpl.viewboxInitialWidth.get();
	var heightInitial =	tpl.viewboxInitialHeight.get();
	// On calcule le nouveau viewport
	var nouvelleWidth = widthInitial / tauxDeZoom;
	var nouvelleHeight = heightInitial / tauxDeZoom;
	var nouveauX = xCentre - nouvelleWidth/2;
	var nouveauY = yCentre - nouvelleHeight/2;
	// On enregistre le nouveau viewbox
	var nouveauViewbox = [nouveauX, nouveauY, nouvelleWidth, nouvelleHeight];
	tpl.viewbox.set(nouveauViewbox);
	
}

// ===============================================================
// Fonction de gestion de la roulette pour le zomm
// ===============================================================
gestionRoulette = function(event,tpl) {
	// Si la touche CTRL est enfoncée en même temps que la molette bouge
	//if (that.ctrlKey) {
		// Selon Chrome ou Firefox, on récupère la mesure du scroll			
		if (window.event) {
			// Chrome ou IE (IE à Tester !!)
			var e = window.event || e; // old IE support  
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); 
		}
		else {
			// Firefox
			var delta = -event.originalEvent.detail/3;
		}
		// Selon sens de la molette -------------------------------
		if (delta != 0) {
			// Le zoom se fait par rapport à la position actuelle de la souris
			/*
			// On calcule la postion par rapport au repère svg
			var X_sourisZoneSVG = Xcourant - $("#svg").offset().left;
			var Y_sourisZoneSVG = Ycourant - $("#svg").offset().top;
			// alert(X_sourisZoneSVG + " / " + Y_sourisZoneSVG);
			*/
		
			// Selon que c'est un zoom plus ou un zoom moins			
			if (delta > 0) {
				// Zoom moins
				// Si on peut encore dézoomer, on dézoome
				if (tpl.indexZoomActuel.get() > 0) 		tpl.indexZoomActuel.set(tpl.indexZoomActuel.get() - 1);
				// On affiche le viewport résultant -------------------------------
				adapterViewportSpanZoom(tpl);
			}
			else {
				// Zoom plus
				// Si on peut encore zoomer, on zoome
				if (tpl.indexZoomActuel.get() < parametreCommuns.NiveauxDeZoom.length -1) 	tpl.indexZoomActuel.set(tpl.indexZoomActuel.get() + 1);
				// On affiche le viewport résultant -------------------------------
				adapterViewportSpanZoom(tpl);
			}
		}
	//}
	// On évite la propagation au document -----------------------
	return false;
}

// ==============================================
// TEMPLATE PersArbreAsc
// ==============================================
Template.PersArbreAsc.onCreated (function () {
	// A l'initialisation du template, on crée des variables locales réactive
	// Nombre max de générations
	this.nbGenerationsMax = new ReactiveVar(parametreCommuns.arbreAscNbGenerationMax);
	// Numéro du sosa à afficher pour la personne racine
	this.sosa = new ReactiveVar(1);
	// Couleurs des cases
	this.couleurs = new ReactiveVar("COMMUNE_NAISSANCE");
	// Zoom initial à 100% : index 9 de parametreCommuns.NiveauxDeZoom :
	var nbPixels = parametreCommuns.arbreAscNbPixelsParGeneration[this.nbGenerationsMax.get()];
	this.indexZoomActuel = new ReactiveVar(9);	
	this.viewbox = new ReactiveVar([- nbPixels - 10, - nbPixels - 5, 2*(nbPixels+10), nbPixels+10]);
	this.viewboxInitialWidth = new ReactiveVar(2*(nbPixels+10));
	this.viewboxInitialHeight = new ReactiveVar(nbPixels+10);
	this.xMouseInitial = new ReactiveVar(0);
	this.yMouseInitial = new ReactiveVar(0);
	this.xViewboxInitial = new ReactiveVar(0);
	this.yViewboxInitial = new ReactiveVar(0);
	this.dragDrop = new ReactiveVar(false);
});

Template.PersArbreAsc.helpers({
	// Booleans -----------------------------------
	//Attributes ----------------------------------
	"choixNbGenerations" : function () {
		return parametreCommuns.arbreAscChoixNbGenerations;
	},
	"zoomLevel" : function () {
		return parametreCommuns.NiveauxDeZoom[Template.instance().indexZoomActuel.get()];
	},
	"viewbox" : function () {
		return Template.instance().viewbox.get().join(" ");
	},
	"dragDrop" : function () {
		return Template.instance().dragDrop.get();
	},
	"xMouseInitial" : function () {
		return Template.instance().xMouseInitial.get();
	},
	"yMouseInitial" : function () {
		return Template.instance().yMouseInitial.get();
	},
	"generationSuivante" : function () {
		return Template.parentData(1).gen + 1;
	},
	"isSelected" : function() {
		return this == Template.instance().nbGenerationsMax.get();
	},
	"couleurIsSelected" : function(text) {
		return text == Template.instance().couleurs.get();
	},
	"nbGenMax" : function() {
		return Template.instance().nbGenerationsMax.get();
	},
	"couleurs" : function() {
		return Template.instance().couleurs.get();
	},
	"sosa" : function() {
		return Template.instance().sosa.get();
	},
	'fileName'() {
		var nomFichier = "arbre-" + this.nom + "-" + this.prenoms[this.prenomUsuel];
		if (Session.get('sosas')[this._id]) 	nomFichier = nomFichier + "-SOSA" + Session.get('sosas')[this._id][0];
		return nomFichier;
	},
	'svgTemplate'() {
		return Template.instance();
	}
});

Template.PersArbreAsc.events({
	//Zoom for Firefox
	'DOMMouseScroll .zoomable': function(e,tpl){
		e.preventDefault();
		gestionRoulette(e,tpl);
	},
	//Zoom for Chrome
	'mousewheel .zoomable': function(e,tpl){
		e.preventDefault();
		gestionRoulette(e,tpl);
	},
	// Suivi des déplacements de la souris
	'mousemove svg' : function(e,tpl) {
		e.preventDefault();
		// Si on est en mode drag and drop, on modifie le viwepoint
		if ( tpl.dragDrop.get()) {
			// On calcule le taux  de zoom
			var tauxDeZoom = parametreCommuns.NiveauxDeZoom[tpl.indexZoomActuel.get()]/100;
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
		tpl.dragDrop.set(true);
	},	
	'mouseup svg' : function(e,tpl) {
		e.preventDefault();
		tpl.dragDrop.set(false);
	},
	"change #choix_nbGenArbre" : function(e,tpl){
		e.preventDefault();
		// On modifie la variable réactive de nb de générations max
		Template.instance().nbGenerationsMax.set(parseInt(tpl.find("#choix_nbGenArbre").value));
		// On réinitialise les variables réactives de zoom
		var nbPixels = parametreCommuns.arbreAscNbPixelsParGeneration[Template.instance().nbGenerationsMax.get()];
		Template.instance().indexZoomActuel.set(9);	
		Template.instance().viewbox.set([- nbPixels - 10, - nbPixels - 10, 2*(nbPixels+10), nbPixels+10]);
		Template.instance().viewboxInitialWidth.set(2*(nbPixels+10));
		Template.instance().viewboxInitialHeight.set(nbPixels+10);
		Template.instance().xMouseInitial.set(0);
		Template.instance().yMouseInitial.set(0);
		Template.instance().xViewboxInitial.set(0);
		Template.instance().yViewboxInitial.set(0);
		Template.instance().dragDrop.set(false);
	},
	"change #choix_couleurs" : function(e,tpl){
		e.preventDefault();
		// On modifie la variable réactive de nb de générations max
		Template.instance().couleurs.set(tpl.find("#choix_couleurs").value);
	},
	"keyup #choix_sosa" : function(e,tpl){
		e.preventDefault();
		// On modifie la variable réactive de nb de générations max
		Template.instance().sosa.set(tpl.find("#choix_sosa").value);
	},
	'click #legendeCouleursCommunes' : function(e,tpl) {
		e.preventDefault();
		switch (Template.instance().couleurs.get()) {
			case "COMMUNE_NAISSANCE":
			case "COMMUNE_DECES":
				Modal.show('PersArbreAscLegendeCouleurCommunesModal');
				break;
			case "ETAT_RECH_ACTES":
				Modal.show('PersArbreAscLegendeCouleurEtatRechActesModal');
				break;
			case "ETAT_RECH_ENFANTS":
				Modal.show('PersArbreAscLegendeCouleurEtatRechEnfantsModal');
				break;
			default :
				console.log("Erreur module \"PersArbreAsc\" : la valeur de la variable réactive \"couleurs\" est non autorisé : " + Template.instance().couleurs.get());
				break;
		}
	},
});









