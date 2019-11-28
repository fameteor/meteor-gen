// ==============================================
// TEMPLATE AdminDocprogPaginationListe
// ==============================================
Template.AdminDocprogPaginationListe.helpers({
	"listeLieuxDitLePerrier" : function() {
		return Lieux.find({nature:"LIEUDIT",inclusDans:"LkFjhEhaMpNmA9Xvw"});
	},
	"listeHistVide" : function() {
		return Hists.find({bidon:"bidon"});
	},
	"anything" : function() {
		return "toto";
	},
	"listeTousLesArtus" : function() {
		return Pers.find({nom:"ARTUS"});
	},
	"listePointsHistoire" : function() {
		return Hists.find();
	},
	"listeActes" : function() {
		return Docs.find({codage:"ACTE"});
	},
});