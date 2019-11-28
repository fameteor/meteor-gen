// ==============================================
// TEMPLATE HistFormaterListe
// ==============================================
Template.HistFormaterListe.helpers({
	zoneFormatee() {
		for (index in parametreCommuns.zonesHist) {
			if (parametreCommuns.zonesHist[index].valeur ===  this.toString())
			return parametreCommuns.zonesHist[index].intitule[LANG];
		}
	},
	themeFormate() {
		for (index in parametreCommuns.themesHist) {
			if (parametreCommuns.themesHist[index].valeur ===  this.toString())
			return parametreCommuns.themesHist[index].intitule[LANG];
		}
	},
	liens() {
		return Liens.find({"pour.id":this._id,"pour.type":"HIST"});
	},
	impactAncetre() {
		if (this.impacteAncetres) return "OUI";
	}
});