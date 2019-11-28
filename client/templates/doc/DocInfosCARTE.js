// ==============================================
// TEMPLATE DocInfosCARTE
// ==============================================
Template.DocInfosCARTE.helpers({
	"images" : function() {
		// On génère la matrice des images
		var X =	[parseInt(this.specif.CARTE_xMin), parseInt(this.specif.CARTE_xMin) + 1, parseInt(this.specif.CARTE_xMin) + 2];
		var Y = 	[parseInt(this.specif.CARTE_yMin), parseInt(this.specif.CARTE_yMin) + 1,  parseInt(this.specif.CARTE_yMin) + 2];
		var resultat = [];
		for (var posX in X) {
			for (var posY in Y) {
				// On crée la liste des images
				var nouvelleImage = {};
				nouvelleImage.url = Meteor.absoluteUrl() + "marais" + this.urlDocument + "3/x" + numberToXx(X[posX]) +"y" + numberToXx(Y[posY]) + ".jpg";
				nouvelleImage.x = (posX * this.specif.CARTE_defX);
				nouvelleImage.y = (posY * this.specif.CARTE_defY);
				resultat.push(nouvelleImage);
			}
		}
		return resultat;
	},
	"largeur" : function() {
		return Template.parentData(1).specif.CARTE_defX + "px";
	},
	"hauteur" : function() {
		return Template.parentData(1).specif.CARTE_defY + "px";
	},
	"viewBox" : function() {
		return "0 0 " + (parseInt(this.specif.CARTE_defX)*3) + " " + parseInt(this.specif.CARTE_defY)*3;
	},
	"widthSvg" : function() {
		return parseInt(this.specif.CARTE_defX)*3;
	},
	"heightSvg" : function() {
		return parseInt(this.specif.CARTE_defY)*3;
	}
});