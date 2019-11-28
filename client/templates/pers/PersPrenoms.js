// ==============================================
// TEMPLATE PersPrenoms
// ==============================================
Template.PersPrenoms.helpers({
	// Booléens ------------------------------------------------------------
	
	// Attributs ------------------------------------------------------------
	prenomsFormates : function() {
		var prenomsMisEnForme = [];
		for (var index in this.prenoms) {
			// On met en gras le prénom usuel
			if (index == this.prenomUsuel) {
				if (this.prenomUsuelEstNonOfficiel) 	prenomsMisEnForme.push('"' + this.prenoms[index] + '"');
				else 							prenomsMisEnForme.push(this.prenoms[index]);
			}
			else {
				prenomsMisEnForme.push("<small>" + this.prenoms[index] + "</small>" );
			}
		}
		// On met en italique le prénom non officiel
		return prenomsMisEnForme.join("<small>,</small> ");
	},
});