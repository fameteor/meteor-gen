// ==============================================
// TEMPLATE PersChronologieLignePers
// ==============================================
Template.PersChronologieLignePers.helpers({
	'xNaissance' : function() {
		if (this.pers.naissance && this.pers.naissance.date && this.pers.naissance.date.a1) 	return this.pers.naissance.date.a1 * parametreCommuns.nbPixelsParAn;
		else																					return null;
	},
	'xMariage' : function() {
		if (this.date && this.date.a1) 	return this.date.a1 * parametreCommuns.nbPixelsParAn;
		else							return null;
	},
	'xMaintenant' : function() {
		var maintenant = new Date();
		return (maintenant.getFullYear() * parametreCommuns.nbPixelsParAn);
	},
	'width' : function() {
		if (	this.pers.naissance
				&& this.pers.naissance.date 
				&& this.pers.naissance.date.a1 
				&& this.pers.deces 
				&& this.pers.deces.date 
				&& this.pers.deces.date.a1) 	return (this.pers.deces.date.a1 - this.pers.naissance.date.a1) * parametreCommuns.nbPixelsParAn;
		else									return null;
	},
	'widthUntilNow' : function() {
		var maintenant = new Date();
		if (	this.pers.naissance
				&& this.pers.naissance.date 
				&& this.pers.naissance.date.a1) return (maintenant.getFullYear() - this.pers.naissance.date.a1) * parametreCommuns.nbPixelsParAn;
		else									return null;
	},
	'prenoms' : function() {
		return this.pers && this.pers.prenoms.join(", ");
	},
	'estLeConjoint' : function(obj) {
		if (this.persA === obj.pers._id)	var conjoint = this.persB;
		else 								var conjoint = this.persA;
		return (Template.parentData(1).yConjoint && (conjoint == Template.parentData(1).idConjoint));

	},
	'xNom': function() {
		var xNom = (this.datesMinMax.dateMin - parametreCommuns.offsetLabelNomAvantDateMin) * parametreCommuns.nbPixelsParAn;
		switch(this.classe) {
			// On rajoute un offset selon la génération
			case "pers_grandParent":
				// On ne décale pas
				break;
			case "pers_parent":
				// Pn décale d'un offset
				xNom += parametreCommuns.offsetLabelNomParGeneration * parametreCommuns.nbPixelsParAn;
				break;
			case "pers_enfant":
			// On décale de deux offset
				xNom += 2 * parametreCommuns.offsetLabelNomParGeneration * parametreCommuns.nbPixelsParAn;
				break;
			default:
				console.log("Erreur PersChronologieLignePers helper xNom : classe non autorisée : " + this.classe);
				break;
		}
		return xNom;
	},
	'dateNaissanceExiste': function() {
		return this.pers && this.pers.naissance && this.pers.naissance.date && this.pers.naissance.date.a1;
	},
	'dateDecesExiste': function() {
		return this.pers && this.pers.deces && this.pers.deces.date && this.pers.deces.date.a1;
	},
	'dateMariageExiste': function() {
		return this.date && this.date.a1;
	},
	'mariages': function() {
		return gf_coupleEventsByPersId(this.pers._id,null,true);
	},
});

Template.PersChronologieLignePers.events = {
	"click text.nom" : function (e,tpl) {
		e.preventDefault();
		if(this.pers) Router.go('/pers/infos/' + this.pers._id);
	}
}