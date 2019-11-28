// ==============================================
// TEMPLATE TagAvecLien
// ==============================================
Template.TagAvecLien.helpers({
	"title"() {
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