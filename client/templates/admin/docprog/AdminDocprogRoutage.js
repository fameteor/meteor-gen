// ==============================================
// TEMPLATE AdminDocprogRoutage
// ==============================================
Template.AdminDocprogRoutage.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"listeDesRoutes" : function() {
		var resultat =[];
		// On recherche toutes les routes configurées
		_.each(Router.routes, function(route){
			var objet = {};
			objet.name = route.getName();
			objet.path = route._path;
			resultat.push(objet);
		});
		// On trie par nom
		resultat = _.sortBy(resultat, 'name');
		return resultat;
	},
});