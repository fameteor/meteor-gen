// ==============================================
// TEMPLATE OutilsGestionDesNoms
// ==============================================
Template.OutilsGestionDesNoms.helpers({
	"listeDesNomsDedoublonnes"() {
		// Projection : {
		// fields: {
			// "title": 1
		// }
		var result = {};
		Pers.find({},{sort:{nom:1}, fields:{nom:1}})
			.fetch()
			.map(
				function(obj) {
					if (obj.nom in result) {
						result[obj.nom] += 1;
					}
					else result[obj.nom] = 1
				}
			);
		var arrayResult = []
		Object.keys(result).forEach(function(e) {
			var obj = {
				"nom": e,
				"nbOccurences": result[e]
			};
			arrayResult.push(obj);
		});
		return arrayResult;
	}
});

Template.OutilsGestionDesNoms.events({
	'click a': function(e,tpl){
		e.preventDefault();
		Modal.show('PersChoisirModal',{'title':'Choisir une personne','filter':{nom:this.nom}});
	},
	'submit': function(e,tpl){
		e.preventDefault();
		var nouveauNom = tpl.find("#" + this.nom).value.trim();
		if (nouveauNom != "") {
			// Faire méthode sur le serveur : multiple update not allowed on client
			alert("Correction des " + this.nom + " en " + nouveauNom + " à implémenter.")
		}
	}
});