// ==============================================
// TEMPLATE HistFormulaire
// ==============================================
Template.HistFormulaire.onCreated(function () {
	// On initialise une variable locale réactive donnant
	this.nouveauTypeModifié = new ReactiveVar(false);
	this.nouveauTypeDateEstEntre = new ReactiveVar(false);

});

Template.HistFormulaire.helpers({
	// Booleans -----------------------------------
	"typeDateEstEntre" : function() {
		// Si le type a été modifié, on renvoie le nouveau type
		if (Template.instance().nouveauTypeModifié.get())	return Template.instance().nouveauTypeDateEstEntre.get();
		// Sinon, on renvoie la valeur de la base
		else 										return (this.date && this.date.type === "ENTRE");
	}
	//Attributes ----------------------------------
	
});

Template.HistFormulaire.events = {
	// En cas de changement du type de date :
	"change select[name='date.type']" :  function(e,tpl) {
		e.preventDefault();
		// Si on change le type date pour entre, alors "nouveauTypeDateEstEntre"
		if (tpl.find("select[name='date.type']").value === "ENTRE") {
			// Le type de la date a été modifié
			tpl.nouveauTypeModifié.set(true);
			tpl.nouveauTypeDateEstEntre.set(true);
		}
		else {
			// Le type de la date a été modifié
			tpl.nouveauTypeModifié.set(true);
			tpl.nouveauTypeDateEstEntre.set(false);
			// On efface les données date2					// ???????????? A modifier ????????????
			tpl.find("input[name='date.j2']").value = "";		// ne marche pas sur input type number
			tpl.find("input[name='date.m2']").value = "";		// ne marche pas sur input type number
			tpl.find("input[name='date.a2']").value = "";		// ne marche pas sur input type number
			tpl.find("input[name='date.rep2']").value = "";
		}
	},
};