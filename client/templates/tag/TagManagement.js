// ==============================================
// TEMPLATE TagManagement
// ==============================================
Template.TagManagement.helpers({
	"tagsCount"() {
		return Tags.find({}).count();
	},
	"persTags"() {
		return Tags.find({objTypes:"PERS"},{sort:{label:1}}).fetch();
	},
	"lieuxTags"() {
		return Tags.find({objTypes:"LIEU"},{sort:{label:1}}).fetch();
	},
	"histsTags"() {
		return Tags.find({objTypes:"HIST"},{sort:{label:1}}).fetch();
	},
	"docsTags"() {
		return Tags.find({objTypes:"DOC"},{sort:{label:1}}).fetch();
	},
	"taggedPersCount"(id) {
		return Pers.find({tags:id}).count();
	},
	"taggedLieuCount"(id) {
		return Lieux.find({tags:id}).count();
	},
	"taggedDocCount"(id) {
		return Docs.find({tags:id}).count();
	},
	"taggedHistCount"(id) {
		return Hists.find({tags:id}).count();
	},
	"imgTitle"() {
		return "Voir les " + this.objTypes.map(function(value,index) {
			switch (value) {
				case "PERS":
					return "personnes";
					break;
				case "LIEU":
					return "lieux";
					break;
				case "HIST":
					return "points d'histoire";
					break;
				case "DOC":
					return "documents";
					break;
				default:
					console.log("Erreur template \"TagAvecLien\" : le type d'objet " + value + " n'est pas autorisé.")
			}
		}).join(", ");
	}
});