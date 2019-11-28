// ==============================================
// TEMPLATE DateformatCourt
// ==============================================
Template.DateformatCourt.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'formatCourt'  :  function () {
		var resultat = "";
		switch (this.type) {
			case "LE":
				if (this.a1 == null) resultat += "?";
				else resultat += this.a1;
				break;
			case "VERS":
				if (this.a1 == null) resultat += "?";
				else resultat += "vers " + this.a1;
				break;
			case "AVANT":
				if (this.a1 == null) resultat += "?";
				else resultat += "avant " + this.a1;
				break;
			case "APRES":
				if (this.a1 == null) resultat += "?";
				else resultat += "après " + this.a1;
				break;
			case "ENTRE":
				if (this.a1 == null) resultat += "entre ?";
				else resultat += "entre " + this.a1;
				if (this.a2 == null) resultat += " et ?";
				else resultat += " et " + this.a2;
				break;
			default:
				resultat += "?";
				break;
		}
		return resultat;
	}
});
