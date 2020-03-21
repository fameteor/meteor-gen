// ==============================================
// TEMPLATE RouterHome
// ==============================================
Template.RouterHome.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"nbPers" : function() {
		return Pers.find().count();
	},
	"nbPersActesComplets" : function() {
		return Pers.find({"etatRechActes":"COMPLET_VERIFIE"}).count();
	},
	"nbPersActesIncompletsRechFinie" : function() {
		return Pers.find({"etatRechActes":"INCOMPLET_RECH_FINIE"}).count();
	},
	"nbLieux" : function() {
		return Lieux.find().count();
	},
	"nbHist" : function() {
		return Hists.find().count();
	},
	"nbDocs" : function(type) {
		return Docs.find({"type":type}).count();
	},
	"typeDoc" : function() {
		return parametreCommuns.typesDocs;
	},
	"nbRegistres" : function() {
		return Registres.find().count();
	},
	"nbActesArchives" : function() {
		return ActesArchives.find().count();
	},
});