// ==============================================
// TEMPLATE TagInfos
// ==============================================
Template.TagInfos.helpers({
	"persTagged"(id) {
		return Pers.find({"tags":id}).fetch();
	},
	"lieuxTagged"(id) {
		return Lieux.find({"tags":id}).fetch();
	},
	"histsTagged"(id) {
		return Hists.find({"tags":id}).fetch();
	},
	"docsTagged"(id) {
		return Docs.find({"tags":id}).fetch();
	},
	"surlieu"() {
		return Lieux.findOne({_id:this.inclusDans});
	}
});