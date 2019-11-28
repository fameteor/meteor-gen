// ==============================================
// TEMPLATE AdminDocprogSchemaDetail
// ==============================================
Template.AdminDocprogSchemaDetail.helpers({
	schema() {
		// On renvoie le schéma
		return SCHEMA[this.name];
	},
	properties() {
		// On renvoie l'array des propriétés
		var resultat = [];
		for (property in this._schema) {
			var objet = {};
			objet.nom = property;
			objet.valeur = this._schema[property];
			resultat.push(objet);
		}
		// On ordonne par ordre alphabétique ascending
		resultat = _.sortBy(resultat, 'nom');
		return resultat;
	},
	obligatoire() {
		// On renvoie l'array des propriétés
		if (!this.valeur.optional)  return "<span class='text-danger'>OBLIGATOIRE</span>";
		else						return "<span class='text-success'>FACULTATIF</span>";
	},
	valeursAutorisees() {
		var result = "";
		if (this.valeur.type && this.valeur.type.definitions && this.valeur.type.definitions[0]) {
			var defs = this.valeur.type.definitions[0];
			// S'il y a un min
			if (defs.min) result += "valeur minimum : " + defs.min + "<br/>";
			// S'il y a un max
			if (defs.max) result += "valeur maximum : " + defs.max + "<br/>";
			// S'il y a une liste de valeurs
			if (defs.allowedValues) result += "<pre>::" + JSON.stringify(defs.allowedValues,null,4) + "</pre>";
			// S'il y a une regEx
			if (defs.regEx) result += "regex : <code>" + defs.regEx.toString() + "</code>";
			return result;
		}
	},
	type() {
		if (this.valeur.type && this.valeur.type.definitions && this.valeur.type.definitions[0]) {
			var defs = this.valeur.type.definitions[0];
			// Si c'est une fonction
			if (defs.type && (typeof(defs.type) === 'function')) {
				return "::" + this.valeur.type.definitions[0].type.name;
			}
			else {
				// Si c'est un objet
				if (typeof(defs.type) == "object") {
					if (this.valeur.doc)	return '::SCHEMA <a href="/admin/docprog/schema/detail/' + this.valeur.doc + '"><code>' + this.valeur.doc + '</code></a>';
					else					return '::AUTRE SCHEMA';
				}
				// Sinon on retourne le string
				else return defs.type;
			}
		}
	},
	autovalue() {
		// S'il y a une liste de valeurs
		if (this.valeur.autoValue) return '<i class="fa fa-cog fa-spin"></i>';
	},
});