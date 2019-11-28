// ==============================================
// TEMPLATE LibTitreInfos
// ==============================================
Template.LibTitreInfos.helpers({
	'listeThemes'() {
		if (this.themes) 	return this.themes.join("<br/>");
	},
	'ancetresConcernes'() {
		if (this.impacteAncetres)	return "Ancêtres concernés";
		else 						return "Ancêtres non concernés";
	},
});