// ==============================================
// TEMPLATE HistInfosFiche
// ==============================================
Template.HistInfosFiche.helpers({
	listeZones() {
		if (this.zones) 		return this.zones.join("<br/>");
	},
	Hists() {
		return Hists;
	}
});