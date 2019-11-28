// ==============================================
// TEMPLATE DocInfosFiche
// ==============================================
Template.DocInfosFiche.helpers({
	Docs() {
		return Docs;
	},
	templateName() {
		return "DocInfos" + this.codage;
	}
});