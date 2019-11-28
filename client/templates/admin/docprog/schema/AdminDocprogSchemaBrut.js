// ==============================================
// TEMPLATE AdminDocprogSchemaBrut
// ==============================================
Template.AdminDocprogSchemaBrut.helpers({
	schema() {
		// On renvoie le schéma stringifié
		return JSON.stringify(SCHEMA[this.name],null,4);
	}
});