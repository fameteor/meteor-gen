// ==============================================
// TEMPLATE AdminDocprogSchemaMain
// ==============================================
Template.AdminDocprogSchemaMain.helpers({
	listeSchemas() {
		// On liste toutes les propriétés des schémas
		var resultat = [];
		for (var nomSchema in SCHEMA) {
			var objet = {};
			objet.nomSchema = nomSchema;
			resultat.push(objet);
		}
		// On ordonne par ordre alphabétique descending
		resultat = _.sortBy(resultat, 'nomSchema');
		resultat.reverse();
		// On génère les index à partir de 1 pour la numérotation de la doc
		for (index in resultat) {
			resultat[index].index = parseInt(index) + 1;
		}
		return resultat;
	}
});