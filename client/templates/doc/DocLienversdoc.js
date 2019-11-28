// ==============================================
// TEMPLATE DocLienversdoc
// ==============================================
Template.DocLienversdoc.helpers({
	doc() {
		return Docs.findOne({"_id":this.toString()});
	},
	urlDoc() {
		return ("/doc/infos/" + this._id);
	},
	title() {
		if (LANG) {
			var dict = {
				"FR": {
					"ACTE" : "Voir cet acte",
					"NOTAIRE" : "Voir cet acte notarié",
					"PHOTO" : "Voir cette photo",
					"VIDEO" : "Voir cette vidéo",
					"CARTE_POSTALE" : "Voir cette carte postale",
					"CARTE" : "Voir cette carte",
					"COURRIER" : "Voir ce courrier",
					"JOURNAL" : "Voir ce journal",
					"LIVRE" : "Voir ce livre",
					"PAPIER" : "Voir ce papier",
					"OBJET" : "Voir cet objet",
					"AUTRE" : "Voir ce document"
				}
			};
			dictActes = {
				"FR": {
					"NAISSANCE" : "Voir cet acte de naissance",
					"NAIS-DEC" : "Voir cet acte de naissance/décès",
					"BAPTEME" : "Voir cet acte de baptême",
					"BAPT-SEP" : "Voir cet acte de baptême/sépulture",
					"MARIAGE" : "Voir cet acte de mariage",
					"PROMESSE" : "Voir cette promesse de mariage",
					"DECES" : "Voir cet acte de décès",
					"DEC-NAIS" : "Voir cet acte de décès/naissance",
					"SEPULTURE" : "Voir cet acte de sépulture",
					"SEP-BAPT" : "Voir cet acte sépulture/baptême",
					"DIVORCE" : "Voir cet acte de divorce",
					"PACS" : "Voir cet acte de PACS",
					"AUTRE" : "Voir cet acte"
				}
			}
			if (LANG in dict && LANG in dictActes) {
				if ((this.type in dict[LANG])) 	{
					if (this.type === "ACTE") {
						// Le document est un acte
						if (this.specif.ACTE_type in dictActes[LANG])	{
							return dictActes[LANG][this.specif.ACTE_type];
						}
						else	{
							console.log("Erreur module \"DocLienversdoc\" : \"specif.ACTE_type\" non supporté par ce module : " + this.specif.ACTE_type);
							return "Voir cet acte";
						}										
					}
					else 	{
						// Le document n'est pas un acte mais le type est dan le dictionnaire
						return dict[LANG][this.type];
					}
				}
				else 	{
					console.log("Erreur module \"DocLienversdoc\" : \"type\" non supporté par ce module : " + this.type);
					return "Voir ce document";
				}												
			}
			else {
				console.log("Erreur module \"DocLienversdoc\" : LANG non supportée par ce module : " + LANG );
				return "Voir ce document";
			}
		}
		else {
			console.log("Erreur module \"DocLienversdoc\" : variable globale LANG inexistante.");
			return "Voir ce document";
		}
	}
});