// ==============================================
// TEMPLATE LienListePour
// ==============================================
Template.LienListePour.helpers({
	"intitule" : function(type) {
		// Selon l'objet :
		switch(type) {
			case "PERS":
				return "cette personne";
				break;
			case "LIEU":
				return "ce lieu";
				break;
			case "HIST":
				return "ce point d'histoire";
				break;
			case "DOC":
				return "ce document";
				break;
			default:
				return "Type inconnu (" + this.type + ")";
				break;
		}
	},
	"listeLiensPourCetObjet" : function() {
		// Extraction de la base des liens sélectionnés
		return Liens.find({"pour.id":this.obj._id,'pour.type':this.type});
	},
});

// ==============================================
// TEMPLATE LienListePour_DOCAUTO
// ==============================================
Template.LienListePour_DOCAUTO.helpers({
	souvenirBanquet() {
		return gf_docById("is35dxH7j3f3tDZPM");
	}
});