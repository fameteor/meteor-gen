// ==============================================
// TEMPLATE HistListeFormatCourt
// ==============================================
Template.HistListeFormatCourt.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"zoneFormatee" : function() {
		for (index in parametreCommuns.zonesHist) {
			if (parametreCommuns.zonesHist[index].valeur ===  this.toString())
			return parametreCommuns.zonesHist[index].intitule[LANG];
		}
	},
	"themeFormate" : function() {
		for (index in parametreCommuns.themesHist) {
			if (parametreCommuns.themesHist[index].valeur ===  this.toString())
			return parametreCommuns.themesHist[index].intitule[LANG];
		}
	},
});