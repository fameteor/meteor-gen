// ==============================================
// TEMPLATE DateformatLongSansCalRep
// ==============================================
Template.DateformatLongSansCalRep.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'formatLong'  :  function () {
		// Traduction des mois ----------------------------------------
		var mois = parametresClient.mois;
		// On formate la date 1 ---------------------------------------
		var dateAff1="";
		// Jour inconnu
		if (this.j1 == null) {
			// Mois inconnu
			if (this.m1 == null) {
				// Année inconnue
				if (this.a1 == null) {
					dateAff1 = "à une date inconnue";
				}
				// Année connue
				else {
					dateAff1 = this.a1;
				}
			}
			// Mois connu
			else {
				dateAff1 += " " + mois[this.m1];
				// Année inconnue
				if (this.a1 == null) {
					dateAff1 += " ?";
				}
				// Année connue
				else {
					dateAff1 += " " + this.a1;
				}
			}
		}
		// Jour connu
		else {
			dateAff1 += this.j1;
			// Mois inconnu
			if (this.m1 == null) {
				dateAff1 += " ?";
				// Année inconnue
				if (this.a1 == null) {
					dateAff1 += " ?";
				}
				// Année connue
				else {
					dateAff1 += " " + this.a1;
				}
			}
			// Mois connu
			else {
				dateAff1 += " " + mois[this.m1];
				// Année inconnue
				if (this.a1 == null) {
					dateAff1 += " ?";
				}
				// Année connue
				else {
					dateAff1 += " " + this.a1;
				}
			}
		}
		// On formate la date 2 ---------------------------------------
		var dateAff2="";
		// Jour inconnu
		if (this.j2 == null) {
			// Mois inconnu
			if (this.m2 == null) {
				// Année inconnue
				if (this.a2 == null) {
					dateAff2 = "à une date inconnue";
				}
				// Année connue
				else {
					dateAff2 = this.a2;
				}
			}
			// Mois connu
			else {
				dateAff2 += " " + mois[this.m2];
				// Année inconnue
				if (this.a2 == null) {
					dateAff2 += " ?";
				}
				// Année connue
				else {
					dateAff2 += " " + this.a2;
				}
			}
		}
		// Jour connu
		else {
			dateAff2 += this.j2;
			// Mois inconnu
			if (this.m2 == null) {
				dateAff2 += " ?";
				// Année inconnue
				if (this.a2 == null) {
					dateAff2 += " ?";
				}
				// Année connue
				else {
					dateAff2 += " " + this.a2;
				}
			}
			// Mois connu
			else {
				dateAff2 += " " + mois[this.m2];
				// Année inconnue
				if (this.a2 == null) {
					dateAff2 += " ?";
				}
				// Année connue
				else {
					dateAff2 += " " + this.a2;
				}
			}
		}
		// Si le jour de la date est inconnu, on met "en" ou rien.
		// Sinon, on met "le", "entre le" "avant le" etc...
		switch (this.type) {
			case "LE":
				if (dateAff1 == "à une date inconnue") {
					var resultat = dateAff1;
				}
				else {
					if (this.j1 == null)		var resultat = "en " + dateAff1;
					else					var resultat = "le " + dateAff1;
				}
				break;
			case "VERS":
				if (dateAff1 == "à une date inconnue") {
					var resultat = dateAff1;
				}
				else {
					if (this.j1 == null)		var resultat = "vers " + dateAff1;
					else					var resultat = "vers le " + dateAff1;
				}
				break;
			case "AVANT":
				if (dateAff1 == "à une date inconnue") {
					var resultat = dateAff1;
				}
				else {
					if (this.j1 == null)		var resultat = "avant " + dateAff1;
					else					var resultat = "avant le " + dateAff1;
				}
				break;
			case "APRES":
				if (dateAff1 == "à une date inconnue") {
					var resultat = dateAff1;
				}
				else {
					if (this.j1 == null)		var resultat = "après " + dateAff1;
					else					var resultat = "après le " + dateAff1;
				}
				break;
			case "ENTRE":
				if (this.j1 == null)		var resultat = "entre " + dateAff1;
				else					var resultat = "entre le " + dateAff1;
				if (this.j2 == null)		resultat += " et " + dateAff2;
				else					resultat += " et le " + dateAff2;
				break;
			default:
				resultat += "?";
				break;
		}
		return resultat;
	}
});

