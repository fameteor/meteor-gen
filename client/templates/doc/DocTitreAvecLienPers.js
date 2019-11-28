// ==============================================
// TEMPLATE DocTitreAvecLienPers
// ==============================================
Template.DocTitreAvecLienPers.helpers({
	"getActeTypeFormate"(acte) {
		return _.findWhere(parametreCommuns.typeActe, {valeur: acte.specif.ACTE_type}).intitule[LANG];
	},
	"personnesConcernees"() {
		if (this.specif) {
			switch (this.specif.ACTE_type) {
				case "NAISSANCE":
				case "NAIS-DEC":
				case "BAPTEME":
				case "BAPT-SEP":
					return Pers.find({"naissance.docs":this._id}).fetch();
					break;
				case "DECES":
				case "DEC-NAIS":
				case "SEPULTURE":
				case "SEP-BAPT":
					return Pers.find({"deces.docs":this._id}).fetch();
					break;
				default :
					console.log("Error \"DocTitreAvecLienPers\" unsupported ACTE_type : " + this.specif.ACTE_type)
					break;
			}
		}
	},
	"acteIsCoupleEvent"() {
		return (	this.specif.ACTE_type === "MARIAGE"
				||	this.specif.ACTE_type === "PROMESSE"
				||	this.specif.ACTE_type === "PACS"
				||	this.specif.ACTE_type === "DIVORCE"
		)
	}
});
