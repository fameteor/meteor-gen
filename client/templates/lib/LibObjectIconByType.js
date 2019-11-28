// ==============================================
// TEMPLATE LibObjectIconByType
// ==============================================
Template.LibObjectIconByType.helpers({
	iconName() {
		switch (this.type) {
			case "PERS":
					return "iconePers";
				break;
			case "LIEU":
					return "iconeLieu";
				break;
			case "HIST":
					return "iconeHist";
				break;
			case "DOC":
					return "iconeDoc";
				break;
			default:
				console.log("Erreur module \"LibObjectIconByType\", type non supporté : " + this.type);
				return false;
				break;
		}
	},
});