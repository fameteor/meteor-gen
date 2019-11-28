// ==============================================
// TEMPLATE DocViewerCarte
// ==============================================
Template.DocViewerCarte.onCreated (function () {
	var dataContext = Template.currentData();
	// A l'initialisation du template, on crée les variables locales réactives
	// Objet CARTE sélectionnées
	this.carte = new ReactiveVar(null);
	// Coordonnées de l'image en haut à gauche
	this.current = new ReactiveVar(null);
	// Coordonnées de la cibleX
	this.cible = new ReactiveVar(null);
});

Template.DocViewerCarte.helpers({
	"carte" : function() {
		// On réactualise les variables réactives pour corriger le bug
		// en cas d'affichage successifs de deux lieux différents
		// par exemple : le Perrier puis Bois Fort
		var reactVar = Template.instance();
		// Objet CARTE sélectionnées
		reactVar.carte.set(Docs.findOne({_id:this.id}));
		// Coordonnées courantes de la case en haut à gauche de la carte (current.x et current.y)
		var current = {};
		// ???????????????????????????????????????
		// Vérifier que la cible est bien xyMin <cible < xyMax
		// ???????????????????????????????????????
		if (this.x) 	current.x = this.x -2;
		else			current.x = reactVar.carte.get().specif.CARTE_xMin;
		if (this.y) 	current.y = this.y -1;
		else			current.y = reactVar.carte.get().specif.CARTE_yMin;
		reactVar.current.set(current);
		// Coordonnées de la cibleX
		if (this.x && this.y && this.px && this.py) {
			var cible = {};
			// ???????????????????????????????????????
			// Vérifier que la cible est bien pxpyMin <cible < pxpyMax
			// ???????????????????????????????????????
			cible.x = 	this.x;
			cible.y = 	this.y;
			cible.px = 	this.px;
			cible.py = 	this.py;
			reactVar.cible.set(cible);
		}
		else	reactVar.cible.set(null);
		// On renvoie si la carte existe
		return Template.instance().carte.get();
	},
	"limiteHautePasAtteinte" : function() {
		var carte = Template.instance().carte.get();
		var current = Template.instance().current.get();
		return current.y > carte.specif.CARTE_yMin;
	},
	"limiteBassePasAtteinte" : function() {
		var carte = Template.instance().carte.get();
		var current = Template.instance().current.get();
		return parseInt(current.y) + 3 <= carte.specif.CARTE_yMax;
	},
	"limiteGauchePasAtteinte" : function() {
		var carte = Template.instance().carte.get();
		var current = Template.instance().current.get();
		return parseInt(current.x) > carte.specif.CARTE_xMin;
	},
	"limiteDroitePasAtteinte" : function() {
		var carte = Template.instance().carte.get();
		var current = Template.instance().current.get();
		return parseInt(current.x) + 5 <= carte.specif.CARTE_xMax;
	},
	"images" : function() {
		// On recherche la carte sélectionnées
		var carte = Template.instance().carte.get();
		var current = Template.instance().current.get();
		// On génére les coordonnées
		var X =		[parseInt(current.x), parseInt(current.x) + 1, parseInt(current.x) + 2, parseInt(current.x) + 3, parseInt(current.x) + 4];
		var Y = 	[parseInt(current.y), parseInt(current.y) + 1, parseInt(current.y) + 2];
		var resultat = [];
		for (var posX in X) {
			for (var posY in Y) {
				// On crée la liste des images
				var nouvelleImage = {};
				nouvelleImage.url = Meteor.absoluteUrl() + "marais"  + carte.urlDocument + "3/x" + numberToXx(X[posX]) +"y" + numberToXx(Y[posY]) + ".jpg";
				nouvelleImage.x = (posX * carte.specif.CARTE_defX);
				nouvelleImage.y = (posY * carte.specif.CARTE_defY);
				resultat.push(nouvelleImage);
			}
		}
		return resultat;
	},
	"cibleVisible" : function() {
		// La cible est visible si le delta entre cible et current est de maximum de 2
		var current = 	Template.instance().current.get();
		var cible = 	Template.instance().cible.get();
		if ( cible && ((cible.x - current.x) >= 0) && ((cible.x - current.x) < 5) && ((cible.y - current.y) >= 0) && ((cible.y - current.y) < 3)) 	return true;
		else 	return false;
	},
	"cibleX" : function() {
		var carte = Template.instance().carte.get();
		var current = 	Template.instance().current.get();
		var cible = 	Template.instance().cible.get();
		return parseInt(this.px) + carte.specif.CARTE_defX * (cible.x - current.x);
	},
	"cibleY" : function() {
		var carte = Template.instance().carte.get();
		var current = 	Template.instance().current.get();
		var cible = 	Template.instance().cible.get();
		return parseInt(this.py) + carte.specif.CARTE_defY * (cible.y - current.y);
	},
	"largeur" : function() {
		var carte = Template.instance().carte.get();
		return carte.specif.CARTE_defX + "px";
	},
	"hauteur" : function() {
		var carte = Template.instance().carte.get();
		return carte.specif.CARTE_defY + "px";
	},
	"titre" : function() {
		var carte = Template.instance().carte.get();
		return carte.titreLong;
	},
	"viewBox" : function() {
		var carte = Template.instance().carte.get();
		return "0 0 " + (parseInt(carte.specif.CARTE_defX)*5) + " " + parseInt(carte.specif.CARTE_defY)*3;
	},
	"widthSvg" : function() {
		var carte = Template.instance().carte.get();
		return parseInt(carte.specif.CARTE_defX)*5;
	},
	"heightSvg" : function() {
		var carte = Template.instance().carte.get();
		return parseInt(carte.specif.CARTE_defY)*3;
	}	
});

Template.DocViewerCarte.events({
	'click #right': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		var current = tpl.current.get();
		current.x += 1;
		tpl.current.set(current);
	},
	'click #left': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		var current = tpl.current.get();
		current.x -= 1;
		tpl.current.set(current);
	},
	'click #up': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		var current = tpl.current.get();
		current.y -= 1;
		tpl.current.set(current);
	},
	'click #down': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		var current = tpl.current.get();
		current.y += 1;
		tpl.current.set(current);
	},
});