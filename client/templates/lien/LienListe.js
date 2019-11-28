// ==============================================
// TEMPLATE LienListe
// ==============================================
Template.LienListe.onCreated (function () {
	this.isDevelopped = new ReactiveVar(false);
});

Template.LienListe.helpers({
	listeLiensSurCeDoc() {
		// Extraction de la base des liens sélectionnés
		return Liens.find({"pour.id":this._id});
	},
	listeLiensVersCeDoc() {
		// Extraction de la base des liens sélectionnés
		return Liens.find({"vers.id":this._id});
	},
	intituleObjet() {
		// Selon l'objet :
		switch(this.type) {
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
	isDevelopped() {
		return Template.instance().isDevelopped.get();
	},
});

Template.LienListe.events({
	'click img': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On inverse l'état du développement
		tpl.isDevelopped.set(!tpl.isDevelopped.get());
	}
});

// ==============================================
// TEMPLATE LienListe_DOCAUTO
// ==============================================
Template.LienListe_DOCAUTO.helpers({
	souvenirBanquet() {
		return gf_docById("is35dxH7j3f3tDZPM");
	}
});