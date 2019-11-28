// ==============================================
// TEMPLATE LibTitreObjetLien
// ==============================================
Template.LibTitreObjetLien.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"objet" : function() {
		// On renvoie un objet contenant id, type et l'obj lui même
		var objet = {id:this.id,type:"",obj:{}};
		// Selon les types d'objets
		switch (this.type) {
			case "PERS":
				objet.type = "PERS";
				objet.obj 	= Pers.findOne({_id:this.id});
				return objet;
				break;
			case "LIEU":
				objet.type = "LIEU";
				objet.obj 	= Lieux.findOne({_id:this.id});
				return objet;
				break;
			case "HIST":
				objet.type = "HIST";
				objet.obj 	= Hists.findOne({_id:this.id});
				return objet;
				break;
			case "DOC":
				objet.type = "DOC";
				objet.obj 	= Docs.findOne({_id:this.id});
				return objet;
				break;
			default:
				console.log("Erreur type d'objet Gen (id=" + this.id + ") non supporté :" + this.type);
				break;
		}
	}
});