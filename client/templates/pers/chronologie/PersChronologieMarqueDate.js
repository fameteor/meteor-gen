// ==============================================
// TEMPLATE PersChronologieMarqueDate
// ==============================================
Template.PersChronologieMarqueDate.helpers({
	'x' : function() {
		if (this.date && this.date.a1) 	return this.date.a1 * parametreCommuns.nbPixelsParAn;
		else							return null;
	},
	'dureeEntre' : function() {
		if (this.date && this.date.a1 && this.date.a2) 	return (this.date.a2 - this.date.a1) * parametreCommuns.nbPixelsParAn;
		else											return null;
	},
});