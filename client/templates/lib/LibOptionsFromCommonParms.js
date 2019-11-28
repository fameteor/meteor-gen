Template.LibOptionsFromCommonParms.helpers({
	liste() {
		return parametreCommuns[this.parm];
	},
	label() {
		return this.intitule[LANG];
	},
});