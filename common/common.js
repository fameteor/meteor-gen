// ==============================================
// Fonctions globales communes
// ==============================================

gf_thereIsNoPointingObject = function(pointingObjectList) {
	// Si tt est vide, on revoie true
	return ( 	(pointingObjectList.PERS.length === 			0)  
			&& 	(pointingObjectList.COUPLE_EVENT.length === 	0)
			&& 	(pointingObjectList.LIEU.length === 			0)
			&& 	(pointingObjectList.HIST.length === 			0)
			&& 	(pointingObjectList.DOC.length === 				0)
			&& 	(pointingObjectList.LIEN.length === 			0)
			&& 	(pointingObjectList.REGISTRE.length === 		0)
			&& 	(pointingObjectList.ACTE_ARCHIVES.length === 	0) )
}
	
// Obtenir la liste de tous les objets pointant vers un objet donné
gf_getPointingObjects = function(obj,type) {
	// On vérifie les paramètres --------------------------
	if (	type	== "PERS" 
			|| type == "COUPLE_EVENT"
			|| type == "LIEU"
			|| type == "HIST"
			|| type == "DOC"
			|| type == "LIEN"
			|| type == "REGISTRE"
			|| type == "ACTE_ARCHIVES"
			|| type == "TAG") {
		// Ici les paramètres sont OK ---------------------
		// On prépare le résultat -------------------------
		var result = {
			PERS: 			[],
			COUPLE_EVENT:	[],
			LIEU: 			[],
			HIST: 			[],
			DOC: 			[],
			LIEN: 			[],
			REGISTRE: 		[],
			ACTE_ARCHIVES: 	[]
		};
		
		for (typeObjetsRecherches in parms_liens) {
			for (propriete in parms_liens[typeObjetsRecherches]) {
				// Si le type de l'objet correspond à la propriete
				if (type === propriete) {
					// On balaye les champs possibles
					var listeChampsCourants = parms_liens[typeObjetsRecherches][propriete];
					for (index in listeChampsCourants) {
						var lienCourant = listeChampsCourants[index];
						var request = {};
						// Construction de la requête selon le matchType
						var matchTypeCorrect = true;
						switch(lienCourant.matchType) {
							case "id":
								request[lienCourant.prop] = obj._id;
								break;
							case "containId":
								request[lienCourant.prop] = {};
								request[lienCourant.prop].$regex = ".*" + obj._id + ".*";
								request[lienCourant.prop].$options = 'i';
								break;
							case "containOldId":
								request[lienCourant.prop] = {};
								request[lienCourant.prop].$regex = ".*" + obj.id + ".*";
								request[lienCourant.prop].$options = 'i';
								break;
							case "lienPour":
								request[lienCourant.prop] = obj._id;
								request["pour.type"] = type;
								break;
							case "lienVers":
								request[lienCourant.prop] = obj._id;
								request["vers.type"] = type;
								break;
							default:
								console.log("Erreur module\"gf_getPointingObjects\" : matchType non supporté (seuls \"id\", \"containId\" et \"containOldId\" autorisés) : " + lienCourant.matchType);
								// Pour éviter de faire la recherche
								matchTypeCorrect = false;
								break;
						}
						// Application de la requête à la bonne collection
						if (matchTypeCorrect) {
							switch(typeObjetsRecherches) {
								case "PERS":
									var list = Pers.find(request).fetch();
									break;
								case "COUPLE_EVENT":
									var list = CoupleEvents.find(request).fetch();
									break;
								case "LIEU":
									var list = Lieux.find(request).fetch();
									break;
								case "HIST":
									var list = Hists.find(request).fetch();
									break;
								case "DOC":
									var list = Docs.find(request).fetch();
									break;
								case "LIEN":
									var list = Liens.find(request).fetch();
									break;
								case "REGISTRE":
									var list = Registres.find(request).fetch();
									break;
								case "ACTE_ARCHIVES":
									var list = ActesArchives.find(request).fetch();
									break;
								default :
									console.log("Erreur module\"gf_getPointingObjects\" : type d'objet non supporté : " + typeObjetsRecherches);
									break;
							}
							var resultat = {
								"prop":				lienCourant.prop,
								"matchType":		lienCourant.matchType,
								"afficherInfos" : 	lienCourant.afficherInfos,
								"intitule": 		lienCourant.intitule[LANG],
								"list" : 			list
							}
							if (list.length != 0) result[typeObjetsRecherches].push(resultat);
						}
					}
				}
			}
		}
		return result;
	}
	else return false;
}

// ==============================================
// Extensions String
// ==============================================

String.prototype.diacriticFilter = function() {
    return this.replace(/[èéêë]/g,"e").replace(/[àâ]/g,"a").replace(/[ç]/g,"c").replace(/[ùû]/g,"u").replace(/[ïî]/g,"i").replace(/[ôö]/g,"o");
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).diacriticFilter().toUpperCase() + this.slice(1);
}

// ==============================================
// Collections
// ==============================================
Lieux			= new Meteor.Collection("lieux");
Docs			= new Meteor.Collection("docs");
Pers			= new Meteor.Collection("pers");
Registres		= new Meteor.Collection("registres");
Bugs			= new Meteor.Collection("bugs");
Hists			= new Meteor.Collection("hists");
Profs			= new Meteor.Collection("profs");
Liens			= new Meteor.Collection("liens");
ActesArchives	= new Meteor.Collection("actesArchives");
CoupleEvents	= new Meteor.Collection("coupleEvents");
Tags			= new Meteor.Collection("tags");

// ==============================================
// Forbit Account creation from client
// ==============================================
Accounts.config({
  forbidClientAccountCreation : true
});