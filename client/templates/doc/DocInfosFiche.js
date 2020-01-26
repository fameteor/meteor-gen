// ==============================================
// TEMPLATE DocInfosFiche
// ==============================================
Template.DocInfosFiche.helpers({
	Docs() {
		return Docs;
	},
	templateName() {
		return "DocInfos" + this.codage;
	},
	urlServerNormal() {
		// We remove the first / of tileUrl
		return Meteor.absoluteUrl()  + this.specif.GEO_REF_tilesUrl.substr(1);
	},
	urlServerCropped() {
		// We remove the first / of tileUrl
		return Meteor.absoluteUrl()  + this.specif.GEO_REF_tilesUrl.replace("/tiled/","/tiledCropped/").substr(1);
	}
});