// ==============================================
//     UTILITAIRES pour les SCHEMAS
// Fonctions de génération des listes d'options
// et des valeurs autorisées pour les SCHEMAS
// "parametre" est la chaine de caractères correspondant
// à une propriété de l'objet "parametreCommuns"
// dont on veut extraire les options
// ==============================================
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);
SimpleSchema.extendOptions(['doc']);


SCHEMA_allowedValues = function(parametre) {
	// allowedValue(genresLieux) renvoie par exemple :
	// ["MS","FS","PL","ES","SS"]
	return _.map(
		parametreCommuns[parametre], 
		function(ligne) { 
			return ligne.valeur;
		}
	);
}

SCHEMA_options = function(parametre) {
	// options(genresLieux) renvoie par exemple :
	// [
	//	{value : "MS", 	label : "le"},
	//	{value : "FS",	label : "la"},
	//	{value : "PL", 	label : "les"},
	//	{value : "ES", 	label : "l'"},
	//	{value : "SS", 	label : "-"},
	// ]
	return _.map(
		parametreCommuns[parametre],
		function(ligne) {
			return {value : ligne.valeur , label : ligne.intitule["FR"]};
		}
	);
}

// ==============================================
// messages de validation multilingues
// ==============================================

var regExpMessages = [
	{exp:/^\?$|^[A-Z\s\\?']*$/, msg:"Lettres majuscules, blanc, ? et ' sont les seuls caractères autorisés"},
	{exp:/[0-9a-zA-Z]{17}$/, 	msg:"Ce champ doit-être un ID valide"}
];

SimpleSchema.setDefaultMessages({
	initialLanguage: 'fr',
	messages: {
		fr: {
			required: 'Ce champ est obligatoire',
			minString: 'Ce champ doit faire au moins {{min}} caractères',
			maxString: 'Ce champ doit faire au plus {{max}} characters',
			minNumber: 'Ce champ doit-être supérieur à {{min}}',
			maxNumber: 'Ce champ doit-être inférieur à {{max}}',
			minNumberExclusive: 'Ce champ doit-être strictement supérieur à {{min}}',
			maxNumberExclusive: 'Ce champ doit-être strictement inférieur à {{max}}',
			minDate: 'Ce champ ne doit pas être antérieur à {{min}}',
			maxDate: 'Ce champ de doit pas être postérieur à {{max}}',
			badDate: 'Ce champ n\'est pas une date valide',
			minCount: 'Vous devez préciser au moins {{minCount}} valeurs',
			maxCount: 'Il ne peut y avoir plus de {{maxCount}} valeurs',
			noDecimal: 'Ce champ doit être un entier',
			notAllowed: 'Valeur non autorisée pour ce champ',
			expectedType: 'Ce champ doit être un type {{dataType}}',
			regEx: function ({label,regExp}) {
				// On recherche dans l'array regExpMessages si un message spécifique existe pour cette regex
				let msgObj;
				if (regExp) msgObj = _.find(regExpMessages, (o) => o.exp && o.exp.toString() === regExp);
				const regExpMessage = msgObj ? msgObj.msg : 'Erreur de validation de reGex';
				return `${regExpMessage}`;
			},
			keyNotInSchema: '{{name}} n\'est pas une valeur autorisée',
		},
	},
});

// ==============================================
// 					SCHEMAS
// ==============================================

SCHEMA = {}

// ==============================================
// googleMap
// ==============================================
SCHEMA._googleMap = new SimpleSchema({
	"lat": {
		type:	 	Number,
		label: 		"Latitude",
		optional: 	true,
		min:		-90,
		max:		90,
		// To allow decimal input with a dot (instead of comma) on french machines
		autoform: {
			afFieldInput:{
				type:"text"
			}
		},
	},
	"lng": {
		type:	 	Number,
		label: 		"Longitude",
		optional: 	true,
		min:		-180,
		max:		180,
		// To allow decimal input with a dot (instead of comma) on french machines
		autoform: {
			afFieldInput:{
				type:"text"
			}
		},
	}
}, { tracker: Tracker });

// ==============================================
// positionCarte
// ==============================================
SCHEMA._positionCarte = new SimpleSchema({
	"id": {
		type:	 	String,
		label: 		"id",
		optional: 	false,
	},
	"x": {
		type:	 	String,
		label: 		"X",
		optional: 	false,
	},
	"y": {
		type:	 	String,
		label: 		"Y",
		optional: 	false,
	},
	"px": {
		type:	 	String,
		label: 		"px",
		optional: 	false,
	},
	"py": {
		type:	 	String,
		label: 		"py",
		optional: 	false,
	}
}, { tracker: Tracker });

// ==============================================
// date
// ==============================================
SCHEMA._date = new SimpleSchema({
	"type": {
		type:	 	String,
		label: 		"Type",
		allowedValues: SCHEMA_allowedValues("typesDates"),
		autoform: {
			options:  SCHEMA_options("typesDates"),
			afFieldInput: {
				firstOption:"- choisir un type"		// Nécessaire sinon, l'objet est toujours créé
			},
			label:false
		},
		optional: 	true,
	},
	"j1": {
		type:	 	SimpleSchema.Integer,
		label: 		"Jour",
		min:		1,
		max:		31,
		autoform: {
			placeholder:"jour",
			label:false
		},
		optional: 	true,
	},
	"m1": {
		type:	 	SimpleSchema.Integer,
		label: 		"Mois",
		min:		1,
		max:		12,
		autoform: {
			placeholder:"mois",
			label:false
		},
		optional: 	true,
	},
	"a1": {
		type:	 	SimpleSchema.Integer,
		label: 		"Année",
		min:		0,
		max:		2500,
		autoform: {
			placeholder:"année",
			label:false
		},
		optional: 	true,
	},
	"j2": {
		type:	 	SimpleSchema.Integer,
		label: 		"Et jour",
		min:		1,
		max:		31,
		autoform: {
			placeholder:"et jour",
			label:false
		},
		optional: 	true,
	},
	"m2": {
		type:	 	SimpleSchema.Integer,
		label: 		"Mois",
		min:		1,
		max:		12,
		autoform: {
			placeholder:"mois",
			label:false
		},
		optional: 	true,
	},
	"a2": {
		type:	 	SimpleSchema.Integer,
		label: 		"Année",
		min:		0,
		max:		2500,
		autoform: {
			placeholder:"annee",
			label:false
		},
		optional: 	true,
	},
}, { tracker: Tracker });

// ==============================================
// acte
// ==============================================
SCHEMA._acte = new SimpleSchema({
	"incertain": {
		type:	 	Boolean,
		label: 		"Acte et/ou date incertains",
		optional: 	true,
	},
	"date": {
		type:	 	SCHEMA._date,
		// Nom du schema visé
		doc:		"_date",
		label: 		"Date de l'évènement",
		optional: 	true,
	},
	"commune": {
		type:	 	String,
		label: 		"Commune d'habitation",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"lieudit": {
		type:	 	String,
		label: 		"Lieu-dit d'habitation",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"docs": {
		type:	 	Array,
		label: 		"Référence des actes",
		optional: 	true,
	},
	"docs.$": {
		type:	 	String,
		regEx:		/[0-9a-zA-Z]{17}$/
	},
}, { tracker: Tracker });

// ==============================================
// decoupe (de document de codage IMAGE)
// ==============================================
SCHEMA._decoupe = new SimpleSchema({
	"docId": {
		type:	 	String,
		label: 		"ID du document à découper",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	false,
	},
	"docPage": {
		type:	 	SimpleSchema.Integer,
		label: 		"Page du document à découper",
		optional: 	false,
	},
	"ratioWidthOverHeight": {
		type:	 	Number,
		label: 		"Ration largeur/hauteur de la découpe",
		optional: 	false,
	},
	"targetWidth": {
		type:	 	Number,
		label: 		"Nombre de pixels de l'image rendue",
		optional: 	false,
	},
	"x": {
		type:	 	Number,
		label: 		"Position x du début de la découpe",
		optional: 	false,
	},
	"y": {
		type:	 	Number,
		label: 		"Position y du début de la découpe",
		optional: 	false,
	},
	"width": {
		type:	 	Number,
		label: 		"Largeur de la découpe",
		optional: 	false,
	},
}, { tracker: Tracker });
	
// ==============================================
// registre
// ==============================================
SCHEMA.registre = new SimpleSchema({
	"id": {
		type:	 	String,
		label: 	"Ancien ID",
		optional: 	true,
	},
	"type": {
		type:	 	String,
		label: 	"Type",
		allowedValues: SCHEMA_allowedValues("typesRegistres"),
		autoform: {
			options:  SCHEMA_options("typesRegistres"),
			afFieldInput: {
				firstOption:"- choisir un type"
			}
		},
		optional: 	false,
	},
	"contenu": {
		type:	 	String,
		label: 	"Types d'actes contenus",
		optional: 	false,
	},
	"periode": {
		type:	 	String,
		label: 	"Années de début-fin",
		optional: 	false,
	},
	"commune": {
		type:	 	String,
		label: 	"Référence de la commune",
		optional: 	false,
	},
	"nbPages": {
		type:	 	SimpleSchema.Integer,
		label: 	"Nombre de pages",
		optional: 	true,
	},
	"ordreParCommune": {
		type:	 	SimpleSchema.Integer,
		label: 	"Ordre du registre dans la commune",
		optional: 	false,
	},
	"createdBy": {
		type: String,
		label: "Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: Date,
		label: "Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: Date,
		label: "Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}	
}, { tracker: Tracker });

// ==============================================
// objetGen
// ==============================================
SCHEMA._objetGen = new SimpleSchema({
	"id": {
		type:	 	String,
		label: 		"ID de l'objet Gen",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	false,
	},
	"type": {
		type:	 	String,
		label: 		"Type de l'objet Gen",
		allowedValues: SCHEMA_allowedValues("typesObjetsGen"),
		autoform: {
			options:  SCHEMA_options("typesObjetsGen"),
			afFieldInput: {
				firstOption:"- choisir un type"
			}
		},
		optional: 	false,
	},
}, { tracker: Tracker });

// ==============================================
// lien
// ==============================================
SCHEMA.lien = new SimpleSchema({
	"pour": {
		type:	 	SCHEMA._objetGen,
		// Nom du schema visé
		doc:		"_objetGen",
		label: 		"Objet depuis lequel il y a un lien",
		optional: 	false,
	},
	"vers": {
		type:	 	SCHEMA._objetGen,
		// Nom du schema visé
		doc:		"_objetGen",
		label: 		"Objets vers lesquels il y a un lien",
		optional: 	true,
	},
	"zone": {
		type:	 	String,
		label: 	"type de zone",
		allowedValues: SCHEMA_allowedValues("typesZonesLien"),
		autoform: {
			options:  SCHEMA_options("typesZonesLien"),
			afFieldInput: {
				firstOption:false
			}
		},
		optional: 	false,
	},
	"comment": {
		type:	 	String,
		label: 	"Commentaire",
		optional: 	true,
	},
	"createdBy": {
		type: String,
		label: "Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: Date,
		label: "Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: Date,
		label: "Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	},
	// Optionnel selon type de zone ---------------------
	// CERCLE
	"CIRCLE_centreX": {
		type:	 	Number,
		label: 	"X centre",
		optional: 	true,
	},
	"CIRCLE_centreY": {
		type:	 	Number,
		label: 	"Y centre",
		optional: 	true,
	},
	"CIRCLE_rayon": {
		type:	 	Number,
		label: 	"rayon",
		optional: 	true,
	},
	"CIRCLE_page": {
		type:	 	SimpleSchema.Integer,
		label: 	"Page",
		optional: 	true,
	},
	// RECT
	"RECT_x": {
		type:	 	Number,
		label: 	"X",
		optional: 	true,
	},
	"RECT_y": {
		type:	 	Number,
		label: 	"Y",
		optional: 	true,
	},
	"RECT_width": {
		type:	 	Number,
		label: 	"Largeur",
		optional: 	true,
	},
	"RECT_height": {
		type:	 	Number,
		label: 	"Hauteur",
		optional: 	true,
	},
	"RECT_page": {
		type:	 	SimpleSchema.Integer,
		label: 	"Page",
		optional: 	true,
	},
	// POINT
	"POINT_x": {
		type:	 	SimpleSchema.Integer,
		label: 	"X",
		optional: 	true,
	},
	"POINT_y": {
		type:	 	SimpleSchema.Integer,
		label: 	"Y",
		optional: 	true,
	},
	"POINT_px": {
		type:	 	Number,
		label: 	"pixels en X",
		optional: 	true,
	},
	"POINT_py": {
		type:	 	Number,
		label: 	"pixels en Y",
		optional: 	true,
	},
	// PDF
	"PDF_page": {
		type:	 	SimpleSchema.Integer,
		label: 	"Page",
		optional: 	true,
	},
	// Extrait
	"RECORDING_startTS": {
		type:	 	SimpleSchema.Integer,
		label: 	"TS de début",
		optional: 	true,
	},
	"RECORDING_endTS": {
		type:	 	SimpleSchema.Integer,
		label: 	"TS de fin",
		optional: 	true,
	},
	// --------------------------------------------------------
	
		/*
	
	// Attributs selon codage (aucun attribut pour "TOUT")
	CERCLE_centreX
	CERCLE_centreY
	CERCLE_rayon
	EXTRAIT_tsDebut
	EXTRAIT_tsFin
	PDF_page
	*/
	
}, { tracker: Tracker });

// ==============================================
// pers
// ==============================================
SCHEMA.pers = new SimpleSchema({
	"id": {
		type:	 	String,
		label: 		"Ancien ID de la personne",
		optional: 	true,
	},
	"tags": {
		type:	 	Array,
		label: 		"Référence des étiquettes",
		optional: 	true,
	},
	"tags.$": {
		type:	 	String,
		label: 		"Etiquettes",
		autoform: {
			options:  function() {
				return Tags.find({objTypes:"PERS"},{sort:{label:1}}).map(function(obj) {
					return {label:obj.label, value:obj._id};
				})
			},
			afFieldInput: {
				firstOption:"- choisir une étiquette"
			}
		},
	},
	"sexe": {
		type:	 	String,
		label: 		"Sexe (*)",
		allowedValues: SCHEMA_allowedValues("sexes"),
		autoform: {
			options:  SCHEMA_options("sexes"),
			afFieldInput: {
				firstOption:"- choisir un sexe"
			}
		},
		optional: 	false,
	},
	"photo": {
		type:	 	SCHEMA._decoupe,
		// Nom du schema visé
		doc:		"_decoupe",
		label: 		"Découpe de la photo",
		optional: 	true,
	},
	"nom": {
		type:	 	String,
		label: 		"Nom (*)",
		regEx: 		/^\?$|^[A-Z\s\\?']*$/, // caractères autorisés : lettre, ?, ', " "
		optional: 	false,
	},
	"prenoms": {
		type:	 	Array,
		label: 		"Prénoms (selon ordre naissance) (*)",
		optional: 	false,
	},
	"prenoms.$": {
		type:	 	String,
	},
	"prenomUsuel": {
		type:	 	SimpleSchema.Integer,
		label: 		"Index du prénom usuel (0=1er, 1=2nd...) (*)",
		optional: 	false,
		autoform: {
			defaultValue:0			
		}
	},
	"prenomUsuelEstNonOfficiel": {
		type:	 	Boolean,
		label: 		"Le prénom usuel est non officiel",
		optional: 	false,
	},
	"estVivant": {
		type:	 	Boolean,
		label: 		"Est vivant",
		optional: 	true,
	},
	"estCelibataire": {
		type:	 	Boolean,
		label: 		"Est célibataire",
		optional: 	true,
	},
	"pere": {
		type:	 	String,
		label: 		"Référence du père",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"pereIncertain": {
		type:	 	Boolean,
		label: 		"Père incertain",
		optional: 	true,
	},
	"mere": {
		type:	 	String,
		label: 		"Référence de la mère",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"mereIncertain": {
		type:	 	Boolean,
		label: 		"Mère incertaine",
		optional: 	true,
	},
	"naissance": {
		type: 		SCHEMA._acte,
		// Nom du schema visé
		doc:		"_acte",
		label: 		"Naissance",
		optional: 	true,
	},
	"deces": {
		type:	 	SCHEMA._acte,
		// Nom du schema visé
		doc:		"_acte",
		label: 		"Décès",
		optional: 	true,
	},
	"comment": {
		type:	 	String,
		label: 		"Commentaires",
		optional: 	true,
	},
	"recherche": {
		type:	 	String,
		label: 		"Commentaires de recherche",
		optional: 	true,
	},
	"etatRechActes" : {
		type:	 	String,
		label: 		"Etat de recherche des actes",
		allowedValues: SCHEMA_allowedValues("typeEtatRechActes"),
		autoform: {
			options:  SCHEMA_options("typeEtatRechActes"),
			afFieldInput: {
				firstOption:false
			}
		},
		optional: 	false,
	},
	"createdBy": {
		type: 		String,
		label: 		"Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: 		Date,
		label: 		"Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: 		Date,
		label: 		"Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
	
	// A rajouter : "probable" !
}, { tracker: Tracker });

// ==============================================
// couple (Mariage, divorce, pacs...)
// ==============================================
SCHEMA.coupleEvent = new SimpleSchema({
	"type": {
		type:	 	String,
		label: 		"Type de l'évènement",
		allowedValues: SCHEMA_allowedValues("coupleEventType"),
		autoform: {
			options:  SCHEMA_options("coupleEventType"),
			afFieldInput: {
				firstOption:false
			}
		},
		optional: 	false,
	},
	"date": {
		type:	 	SCHEMA._date,
		// Nom du schema visé
		doc:		"_date",
		label: 		"Date de l'évènement",
		optional: 	true,
	},
	"persA": {
		type:	 	String,
		label: 		"Entre personne A",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	false,
	},
	"communeA": {
		type:	 	String,
		label: 		"Habitant commune A",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"lieuditA": {
		type:	 	String,
		label: 		"Habitant lieu-dit A",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"incertainA": {
		type:	 	Boolean,
		label: 		"Données incertaines",
		optional: 	true,
	},
	"persB": {
		type:	 	String,
		label: 		"Et personne B",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	false,
	},
	"communeB": {
		type:	 	String,
		label: 		"Habitant commune B",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"lieuditB": {
		type:	 	String,
		label: 		"Habitant lieu-dit B",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"incertainB": {
		type:	 	Boolean,
		label: 		"Données incertaines",
		optional: 	true,
	},
	"docs": {
		type:	 	Array,
		label: 		"Référence des actes",
		optional: 	true,
	},
	"docs.$": {
		type:	 	String,
		regEx:		/[0-9a-zA-Z]{17}$/,
	},
	"comment": {
		type:	 	String,
		label: 		"Commentaires",
		optional: 	true,
	},
	"recherche": {
		type:	 	String,
		label: 		"Commentaires de recherche",
		optional: 	true,
	},
	"etatRechEnfants" : {
		type:	 	String,
		label: 		"Etat de recherche des enfants",
		allowedValues: SCHEMA_allowedValues("typeEtatRechEnfants"),
		autoform: {
			options:  SCHEMA_options("typeEtatRechEnfants"),
			afFieldInput: {
				firstOption:false
			}
		},
		optional: 	false,
	},	
	"createdBy": {
		type: 		String,
		label: 		"Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: 		Date,
		label: 		"Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: 		Date,
		label: 		"Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });

// ==============================================
// lieu
// ==============================================
SCHEMA.lieu = new SimpleSchema({
	"id": {
		type: String,
		label: "Id",
		optional: 	true,  // présent uniquement sur le légacy 
	},
	"tags": {
		type:	 	Array,
		label: 		"Référence des étiquettes",
		optional: 	true,
	},
	"tags.$": {
		type:	 	String,
		label: 		"Etiquettes",
		autoform: {
			options:  function() {
				return Tags.find({objTypes:"LIEU"},{sort:{label:1}}).map(function(obj) {
					return {label:obj.label, value:obj._id};
				})
			},
			afFieldInput: {
				firstOption:"- choisir une étiquette"
			}
		},
	},
	"nature": {
		type: String,
		label: "Nature",
		allowedValues: SCHEMA_allowedValues("typesLieux"),
		autoform: {
			options:  SCHEMA_options("typesLieux"),
			afFieldInput: {
				firstOption:"- choisir un type"
			}
		},
		optional: 	false,
	},
	"genre": {
		type: String,
		label: "Genre",
		allowedValues: SCHEMA_allowedValues("genresLieux"),
		autoform: {
			options:  SCHEMA_options("genresLieux"),
			afFieldInput: {
				firstOption:"- choisir un genre"
			}
		},
		optional: 	false,
	},
	"nom": {
		type: String,
		label: "Nom",
		optional: 	false,
	},
	"complement": {
		type: String,
		label: "Information complémentaire discriminante",
		optional: 	true,
	},
	"code": {
		type: String,
		label: "Code administratif",
		optional: 	true,
	},	
	"topoComment": {
		type: String,
		label: "Commentaire de toponymie",
		optional: 	true,
	},
	"topoFamille": {
		type: String,
		label: "Famille de toponymie",
		optional: 	true,
	},
	"inclusDans": {
		type: 	String,
		label: 	"Lieu parent",
		regEx:	/[0-9a-zA-Z]{17}$/,
		optional: 	false,
		// Pour vérifier la compatibilité lieu/surlieu 
		
		// ?????????????????????????????????????????????
		/* DESACTIVE : poser problème à l'initialisation
		// ?????????????????????????????????????????????
		
		custom: function () {
			//??????????????????????????
			// Condition à compléter
			//??????????????????????????
			var lieuParent = Lieux.findOne({_id:this.value});
			// Erreur si les deux types sont identiques, à tester l'inclusion possible d'un lieu dans un autre
			if (this.field('nature').value === lieuParent.nature) 	return "invalidParentPlace";
		}
		*/
		
	},
	"latLng": {
		type: SCHEMA._googleMap,
		// Nom du schema visé
		doc:		"_googleMap",
		label: 		"Positions Google Map",
		optional: 	true,
	},
	"positionSurCartes" :  {
		type: 		Array,
		label: 		"Positions sur cartes",
		optional: 	true,
	},
	"positionSurCartes.$": {
		type:		SCHEMA._positionCarte,
		// Nom du schema visé
		doc:		"_positionCarte",
	},
	"comment": {
		type:	 	String,
		label: 		"Commentaires",
		optional: 	true,
	},
	"recherche": {
		type:	 	String,
		label: 	"Commentaires de recherche",
		optional: 	true,
	},
	"createdBy": {
		type: String,
		label: "Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: Date,
		label: "Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: Date,
		label: "Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });

// ==============================================
// hist
// ==============================================
SCHEMA.hist = new SimpleSchema({
	"id": {
		type: String,
		label: "Id ancienne version",
		optional: 	true,  // présent uniquement sur le légacy 
	},
	"tags": {
		type:	 	Array,
		label: 		"Référence des étiquettes",
		optional: 	true,
	},
	"tags.$": {
		type:	 	String,
		label: 		"Etiquettes",
		autoform: {
			options:  function() {
				return Tags.find({objTypes:"HIST"},{sort:{label:1}}).map(function(obj) {
					return {label:obj.label, value:obj._id};
				})
			},
			afFieldInput: {
				firstOption:"- choisir une étiquette"
			}
		},
	},
	"source": {
		type: String,
		label: "Source de l'information",
		optional: 	true,
	},
	"titre": {
		type: String,
		label: "Description courte du point d'histoire",
		optional: 	false,
	},
	"date": {
		type:	 	SCHEMA._date,
		// Nom du schema visé
		doc:		"_date",
		label: 	"Date du point d'histoire",
		optional: 	false,
	},
	"impacteAncetres": {
		type:	 	Boolean,
		label: 	"Point d'histoire ayant probablement impacté mes ancêtres",
		optional: 	false,
	},
	"zones": {
		type:	 	Array,
		label: 	"Zones concernées par le point d'histoire",
		allowedValues: SCHEMA_allowedValues("zonesHist"),
		autoform: {
			options:  SCHEMA_options("zonesHist")
		},
		optional: 	true,
	},
	"zones.$": {
		type:		String,
	},
	"scope": {
		type:	 	String,
		label: 	"Impact de ce point d'histoire",
		allowedValues: SCHEMA_allowedValues("scopesHist"),
		autoform: {
			options:  SCHEMA_options("scopesHist"),
			afFieldInput: {
				firstOption:"- choisir l'impact"
			}
		},
		optional: 	false,
	},
	"themes": {
		type:	 	Array,
		label: 	"Thèmes concernés par le point d'histoire",
		allowedValues: SCHEMA_allowedValues("themesHist"),
		autoform: {
			options:  SCHEMA_options("themesHist")
		},
		optional: 	false,
	},
	"themes.$": {
		type:		String,
	},
	"comment": {
		type:	 	String,
		label: 	"Commentaires sur le point d'histoire",
		optional: 	true,
	},
	"recherche": {
		type:	 	String,
		label: 	"Commentaires de recherche",
		optional: 	true,
	},
	"createdBy": {
		type: String,
		label: "Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: Date,
		label: "Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: Date,
		label: "Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });

// ==============================================
// sourceDoc
// ==============================================
SCHEMA._sourceDoc = new SimpleSchema({
	"intitule": {
		type:	 	String,
		label: 	"Intitulé",
		optional: 	true,
		autoform: {
			defaultValue:"Archives départementales 85"		
		}
	},
	"id": {
		type:	 	String,
		label: 	"Id de la source",
		optional: 	true,
	},
	"libreDeDroits": {
		type:	 	Boolean,
		label: 	"Libre de droit",
		optional: 	true,
	},
}, { tracker: Tracker });

// ==============================================
// tag
// ==============================================
SCHEMA.tag = new SimpleSchema({
	"label": {
		type: 			String,
		label: 			"Etiquette",
		optional: 		false,
	},
	"summary": {
		type: 			String,
		label: 			"Signification du tag",
		optional: 		false,
	},
	"imgFileName": {
		type: 			String,
		label: 			"Nom du fichier image associé au tag",
		optional: 		true,
	},
	"objTypes": {
		type:	 	Array,
		label: 		"Objets concernés",
		optional: 	false,
	},
	"objTypes.$": {
		type:	 	String,
		label: 		"Objet concerné",
		allowedValues: 	SCHEMA_allowedValues("objTypesForTags"),
		autoform: {
			options:  	SCHEMA_options("objTypesForTags"),
			afFieldInput: {
				firstOption:"- choisir l'objet concerné"
			}
		},
	},
	"createdBy": {
		type: 			String,
		label: 			"Créé par",
		optional: 		true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: 			Date,
		label: 			"Créé le",
		optional: 		false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: 			Date,
		label: 			"Dernière modif. le",
		optional: 		false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });

// ==============================================
// bug
// ==============================================
SCHEMA.bug = new SimpleSchema({
	"type": {
		type:	 	String,
		label: 	"Type",
		optional: 	false,
		autoform: {
			options:  SCHEMA_options("typeBugs"),
			afFieldInput: {
				firstOption:false 
			}
		},
	},
	"description": {
		type:	 	String,
		label: 	"Description",
		optional: 	false,
	},
	"criticite": {
		type:	 	SimpleSchema.Integer,
		label: 	"Criticité",
		optional: 	false,
		min:		0,
		max:		3,
		autoform: {
			options:  SCHEMA_options("criticiteBugs"),
			afFieldInput: {
				firstOption:false 
			}
		},
	},
	"module": {
		type:	 	String,
		label: 	"Module concerné",
		optional: 	true,
	},
	"estResolu" : {
		type:	 	Boolean,
		label: 	"Est résolu",
		optional: 	false,
		// Force value to be false (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return false;
		}
	},
	"dateCreation" : {
		type: Date,
		label: "Date de création",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"dateModification" : {
		type: Date,
		label: "Date de la dernière modification",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	},
}, { tracker: Tracker });
// ==============================================
// specifiqueCodageDoc
// ==============================================
SCHEMA._specifiqueCodageDoc = new SimpleSchema({
	// Pour les codages ACTE --------------------------------------------
	"ACTE_type": {
		type:	 	String,
		label: 		"ACTE : Type de l'acte",
		allowedValues: SCHEMA_allowedValues("typeActe"),
		autoform: {
			options:  SCHEMA_options("typeActe"),
			afFieldInput: {
				firstOption:"- choisir un type d'acte"
			}
		},
		optional: 	true,
	},
	"ACTE_commune": {
		type:	 	String,
		label: 		"ACTE : Commune de l'acte",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"ACTE_registre": {
		type:	 	String,
		label: 		"ACTE : Registre de l'acte",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
	},
	"ACTE_page": {
		type:	 	SimpleSchema.Integer,
		label: 		"ACTE : Page de l'acte",
		optional: 	true,
	},
	"ACTE_transcription": {
		type:	 	String,
		label: 		"ACTE : Transcription de l'acte",
		optional: 	true,
	},

	// Pour le codage IMAGE --------------------------------------------
	"IMAGE_mode": {
		type:	 	String,
		label: 		"IMAGE : Mode de l'image",
		allowedValues: SCHEMA_allowedValues("modeIMAGE"),
		autoform: {
			options:  SCHEMA_options("modeIMAGE"),
			afFieldInput: {
				firstOption:"- choisir le mode d'affichage"
			}
		},
		optional: 	true,
	},
	"IMAGE_px": {
		type:	 	String,
		label: 		"IMAGE : nb de pixels en X de l'image",
		optional: 	true,
	},
	"IMAGE_py": {
		type:	 	SimpleSchema.Integer,
		label: 		"IMAGE : Nb de pixels en Y de l'image",
		optional: 	true,
	},
	"IMAGE_nbPages": {
		type:	 	String,
		label: 		"IMAGE : Nb de pages de l'image",
		optional: 	true,
	},
	
	// Pour le codage CARTE --------------------------------------------
	"CARTE_defX": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : Nb de pixels en largeur de chaque pavé",
		optional: 	true,
	},
	"CARTE_defY": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : Nb de pixels en hauteur de chaque pavé",
		optional: 	true,
	},
	"CARTE_xMin": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : coordonnée X minimum d'un pavé",
		optional: 	true,
	},
	"CARTE_xMax": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : coordonnée X maximum d'un pavé",
		optional: 	true,
	},
	"CARTE_yMin": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : coordonnée Y minimum d'un pavé",
		optional: 	true,
	},
	"CARTE_yMax": {
		type:	 	SimpleSchema.Integer,
		label: 		"CARTE : coordonnée Y maximum d'un pavé",
		optional: 	true,
	},
	"CARTE_urlLegende": {
		type:	 	String,
		label: 		"CARTE : URL de la légende",
		optional: 	true,
	},
	
	// Pour le codage GEO_REF --------------------------------------------
	"GEO_REF_coordPoint1": {
		type: SCHEMA._googleMap,
		label: 		"Coordonnées géographique point 1",
		optional: 	true,
	},
	"GEO_REF_coordPoint2": {
		type: SCHEMA._googleMap,
		label: 		"Coordonnées géographique point 2",
		optional: 	true,
	},
	"GEO_REF_tilesUrl": {
		type: String,
		label: 		"URL des tuiles",
		autoform: {
			placeholder:"/marais/fondCartes/cartes_IGN/{z}/{x}/{y}.jpg"
		},
		optional: 	true,
	}
}, { tracker: Tracker });





// ==============================================
// doc
// ==============================================
SCHEMA.doc = new SimpleSchema({
	"id": {
		type: 		String,
		label: 		"Id",
		optional: 	true,  // Présent uniquement sur le légacy 
	},
	"tags": {
		type:	 	Array,
		label: 		"Référence des étiquettes",
		optional: 	true,
	},
	"tags.$": {
		type:	 	String,
		label: 		"Etiquettes",
		autoform: {
			options:  function() {
				return Tags.find({objTypes:"DOC"},{sort:{label:1}}).map(function(obj) {
					return {label:obj.label, value:obj._id};
				})
			},
			afFieldInput: {
				firstOption:"- choisir une étiquette"
			}
		},
	},
	"titre": {
		type: 		String,
		label: 		"Titre court du document",
		optional: 	true,	// Absent pour les types ACTE
		autoform: {
			placeholder:"ne rien mettre pour les actes"
		}
	},
	"type": {
		type: 		String,
		label: 		"Type (selon nature du doc) (*)",
		allowedValues: SCHEMA_allowedValues("typesDocs"),
		autoform: {
			options:  SCHEMA_options("typesDocs"),
			afFieldInput: {
				firstOption:"- choisir un type"
			}
		},
		optional: 	false,
	},
	"codage": {
		type: 		String,
		label: 		"Codage (selon viewer) (*)",
		allowedValues: SCHEMA_allowedValues("codagesDocs"),
		autoform: {
			options:  SCHEMA_options("codagesDocs"),
			afFieldInput: {
				firstOption:"- choisir un codage"
			}
		},
		optional: 	false,
	},
	"urlDocument": {
		type: 		String,
		label: 		"URL du document",
		optional: 	true,		// Absent pour les GROUPE
		autoform: {
			defaultValue: function() {
				var codage = AutoForm.getFieldValue("codage");
				switch (codage) {
					case "IMAGE":
						return "/arch/dvd_2013/2048x1536/"	
						break;
					case "CARTE":
						return "/cartes/"	
						break;
					case "GEO_REF":
						return "/geo_refs/"	
						break;
					case "ACTE":
						return "/arch/actes_0002/hd/"	
						break;
					case "VIDEO":
						return "/arch/video_0001/video/"	
						break;
					case "PDF":
						return "/arch/pdf_0001/pdf/"	
						break;
					default :
						return "";
						break;
				}
			}
		}
	},
	"urlIcone": {
		type: 		String,
		label: 		"URL de l'icône",
		optional: 	true,		// Absent pour les ACTE
		autoform: {
			defaultValue: function() {
				var codage = AutoForm.getFieldValue("codage");
				switch (codage) {
					case "IMAGE":
						return "/arch/dvd_2013/100x75/"	
						break;
					case "CARTE":
						return "/cartes/"	
						break;
					case "GEO_REF":
						return "/geo_refs/"	
						break;
					case "VIDEO":
						return "/arch/video_0001/100x75/"	
						break;
					case "PDF":
						return "/arch/pdf_0001/100x75/"	
						break;
					default :
						return "";
						break;
				}
			}
		}
	},
	"date": {
		type: 		SCHEMA._date,
		// Nom du schema visé
		doc:		"_date",
		label: 		"Date du document (*)",
		optional: 	false,
	},
	"source": {
		type: 		SCHEMA._sourceDoc,
		// Nom du schema visé
		doc:		"_sourceDoc",
		label: 		"Source du document",
		optional: 	true,
	},
	"hauteur": {
		type:	 	SimpleSchema.Integer,
		label: 		"Hauteur de l'original (mm)",
		optional: 	true,
	},
	"largeur": {
		type:	 	SimpleSchema.Integer,
		label: 		"Hargeur de l'original (mm)",
		optional: 	true,
	},
	"comment": {
		type:	 	String,
		label: 		"Commentaires sur le document",
		optional: 	true,
	},
	"recherche": {
		type:	 	String,
		label: 		"Commentaires de recherche",
		optional: 	true,
	},
	
	
	
	
	// ??????????????????????????????
	// A supprimer une fois les cartes et docs migrées et nettoyage des données
	// ??????????????????????????????
	"titreLong": {
		type: 		String,
		label: 		"Titre long du document",
		optional: 	true,
	},
	"auteur": {
		type: 		String,
		label: 		"Auteur du document",
		optional: 	true,
	},

	// ??????????????????????????????
	
	
	
	
	
	"specif": {
		type: 		SCHEMA._specifiqueCodageDoc,
		// Nom du schema visé
		doc:		"_specifiqueCodageDoc",
		label: 		"Spécifique selon codage",
		optional: 	true,
	},
	"createdBy": {
		type: 		String,
		label: 		"Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: 		Date,
		label: 		"Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: 		Date,
		label: 		"Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });

// ==============================================
// prof
// ==============================================
SCHEMA.prof = new SimpleSchema({
	"id": {
		type: 		String,
		label: 		"Id légacy",
		optional: 	true,  // présent uniquement sur le légacy 
	},	
	"M": {
		type: 		String,
		label: 		"Intitulé masculin (en minuscule)",
		optional: 	true,
	},
	"F": {
		type: 		String,
		label: 		"Intitulé féminin (en minuscule)",
		optional: 	true,
	}
}, { tracker: Tracker });

// ==============================================
// acteArchive
// ==============================================
SCHEMA.acteArchives = new SimpleSchema({
	"id": {
		type: 			String,
		label: 			"Id",
		optional: 		true,  // Présent uniquement sur le légacy 
	},
	"commune": {
		type: 			String,
		label: 			"Commune",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 		false,
		autoform: {
			placeholder: 	"ID de la commune"		// Placeholder
		}
	},
	"registre": {
		type: 			String,
		label: 			"Registre",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 		false,
		autoform: {
			placeholder:	"ID du registre"		// Placeholder
		}
	},
	"page": {
		type: 			SimpleSchema.Integer,
		label: 			"Page",
		optional: 		false,
		autoform: {
			placeholder: 	"page du registre"		// Placeholder
		}
	},
	"date": {
		type:	 		SCHEMA._date,
		// Nom du schema visé
		doc:		"_date",
		label: 			"Date de l'acte",
		optional: 		false,
	},
	"type": {
		type:	 		String,
		label: 			"Type d'acte",
		optional: 		false,
		allowedValues: SCHEMA_allowedValues("typeActe"),
		autoform: {
			options:  SCHEMA_options("typeActe"),
			afFieldInput: {
				firstOption:"- choisir un type d'acte"
			}
		},
	},
	"pers_nom": {
		type: 			String,
		label: 			"Nom de la personne",
		optional: 		false,
		autoform: {
			placeholder: 	"nom en majuscule (ajouter ? si incertain)"		// Placeholder
		}

	},
	"pers_prenoms": {
		type: 		String,
		label: 		"Prénoms de la personne",
		optional: 	false,
		autoform: {
			placeholder: 	"prénoms séparés par , (ajouter ? si incertain)"		// Placeholder
		}
	},
	"pers_id": {
		type: 		String,
		label: 		"ID de la personne",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
		autoform: {
			placeholder: 	"ID de la personne dans la base"		// Placeholder
		}
	},
	"pers_age": {
		type: 		Number,
		label: 		"Age de la personne (mariage, décès)",
		optional: 	true,
		autoform: {
			placeholder:	"âge de la personne (années décimales)"		// Placeholder
		}
	},
	"pere_nom": {
		type: 		String,
		label: 		"Nom du père",
		optional: 	true,
		autoform: {
			placeholder: 	"nom en majuscule (ajouter ? si incertain)"	// Placeholder
		}
	},
	"pere_prenoms": {
		type: 		String,
		label: 		"Prénoms du père",
		optional: 	true,
		autoform: {
			placeholder:	"prénoms séparés par , (ajouter ? si incertain)"		// Placeholder
		}
	},
	"pere_id": {
		type: 		String,
		label: 		"ID du père dans la base",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
		autoform: {
			placeholder: 	"ID de la personne dans la base"		// Placeholder
		}
	},
	"mere_nom": {
		type: 		String,
		label: 		"Nom de la mère",
		optional: 	true,
		autoform: {
			placeholder: 	"nom en majuscule (ajouter ? si incertain)"	// Placeholder
		}
	},
	"mere_prenoms": {
		type: 		String,
		label: 		"Prénoms de la mère",
		optional: 	true,
		autoform: {
			placeholder: 	"prénoms séparés par , (ajouter ? si incertain)"		// Placeholder
		}
	},
	"mere_id": {
		type: 		String,
		label: 		"ID de la mère dans la base",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
		autoform: {
			placeholder: 	"ID de la personne dans la base"		// Placeholder
		}
	},
	"conjoint_nom": {
		type: 		String,
		label: 		"Nom du conjoint",
		optional: 	true,
		autoform: {
			placeholder: 	"nom en majuscule (ajouter ? si incertain)"	// Placeholder
		}
	},
	"conjoint_prenoms": {
		type: 		String,
		label: 		"Prénoms du conjoint",
		optional: 	true,
		autoform: {
			placeholder:	"prénoms séparés par , (ajouter ? si incertain)"		// Placeholder
		}
	},
	"conjoint_id": {
		type: 		String,
		label: 		"ID du conjoint dans la base",
		regEx:		/[0-9a-zA-Z]{17}$/,
		optional: 	true,
		autoform: {
			placeholder: 	"ID de la personne dans la base"		// Placeholder
		}
	},
	"lieudit_nom": {
		type: 		String,
		label: 		"Lieu-dit de l'acte",
		optional: 	true,
		autoform: {
			placeholder:"lieu-dit de l'acte"
		}
	},
	"lieudit_id": {
		type: 		String,
		label: 		"ID du lieu-dit de l'acte",
		optional: 	true,
		autoform: {
			placeholder:"ID du lieu-dit de l'acte"
		}
	},
	"comment": {
		type: 		String,
		label: 		"Commentaire (témoins, parrain, marraine...)",
		optional: 	true,
		autoform: {
			placeholder:"commentaire (témoins, parrain, marraine...)"
		}
	},
	"createdBy": {
		type: String,
		label: "Créé par",
		optional: 	true,
		// Force value to the creator id at creation, not modified after
		autoValue: function() {
			if (this.isInsert)  	return this.userId || idAdministrateurAppli;
			else 				this.unset();
		}
	},
	"createdAt" : {
		type: Date,
		label: "Créé le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			else 				this.unset();
		}
	},
	"lastUpdateAt" : {
		type: Date,
		label: "Dernière modif. le",
		optional: 	false,
		// Force value to be current date (on server) upon insert
		autoValue: function() {
			if (this.isInsert) 	return new Date;
			if (this.isUpdate)      return new Date;
		}
	}
}, { tracker: Tracker });



