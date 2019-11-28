// ==============================================
// Paramètres globaux
// ==============================================
LANG = "FR";

// Impression de la variable d'environnement ----
console.log("ROOT_URL : " + Meteor.absoluteUrl());

// ==============================================
// Initialisation peppelg:bootstrap-3-modal 
// ==============================================
Modal.allowMultiple = true

// ==============================================
// Login lang initialisation
// ==============================================
// Package fameteor:lang
lang.init('STATIC','fr');
lang.setDictionnary('fr',lang_fr);
// Package accounts-ui-bootstrap-3
accountsUIBootstrap3.setLanguage('fr');

// ==============================================
// Souscriptions
// ==============================================
// Cf Iron Router : /client/routes.js

// ==============================================
// Fonctions globales
// ==============================================

// Gestion des intitulés pour les champs id cachés
gf_persSetIntituleFromId = function(tpl,intituleSelector,idSelector) {
	var inputPers = tpl.find(idSelector);
	if (inputPers) {
		var idPers = inputPers.value;
		var pers = Pers.findOne(idPers);
		var inputIntitule = tpl.find(intituleSelector);
		if (inputIntitule && pers) 	inputIntitule.value = pers.prenoms + " "+ pers.nom;
	}
}

gf_lieuSetIntituleFromId = function(tpl,intituleSelector,idSelector) {
	var inputLieu = tpl.find(idSelector);
	if (inputLieu) {
		var idLieu = inputLieu.value;
		var lieu = Lieux.findOne(idLieu);
		var inputIntitule = tpl.find(intituleSelector);
		if (inputIntitule && lieu) 	inputIntitule.value = parametresClient.genreLieu[lieu.genre] + lieu.nom;
	}
}

// ???????????????????????????????????????????????
// A supprimer

// GESTION de la popup modale de SAISIE d'un REGISTRE
// ----------------------------------------------
// Paramètres de fonctionnement
registreChercherModal_idObject	 		= null;
registreChercherModal_intituleObject 	= null;
registreChercherModal_idCommune			= null;


gf_openRegistreChercherModal = function(idObject,intituleObject,idCommune) {
	// On passe les paramètres par les variables globales
	registreChercherModal_idObject	 	= idObject;
	if (intituleObject)		registreChercherModal_intituleObject 	= intituleObject;
	if (idCommune)			registreChercherModal_idCommune 		= idCommune;
	// On affiche la modale
	Modal.show('RegistreChercherModal');
}

gf_saveAndCloseRegistreChercherModal = function(id) {
	// On enregistre l'id dans le champs demandé
	registreChercherModal_idObject.value = id;
	// On met le nom du registre dans le champ intitule s'il existe et si le registre existe
	var registre = Registres.findOne(id);
	// Si le registre existe et si on a un objet pour mettre l'intitule
	if (registre && registreChercherModal_intituleObject) {
		registreChercherModal_intituleObject.value = registre.contenu + " " + registre.periode;
	}
	// On ferme la modale
	Modal.hide('RegistreChercherModal');
	// On réinitialise les variables globales
	registreChercherModal_idObject	 		= null;
	registreChercherModal_intituleObject 	= null;
	registreChercherModal_idCommune			= null;
}


// ???????????????????????????????????????????????

// Renvoie un array à partir d'un array parametres contenant des objets ayant une propriété "valeur"
gf_arrayValeurs = function(arrayParametre) {
	return _.map(arrayParametre, function(obj) {return obj.valeur});
}

// Ajoute l'id d'un objet visité (cf /client/route.js)
gf_addVisitedObject = function(type,id) {
	var visitedObjects = Meteor.user() && Meteor.user().profile && Meteor.user().profile.visitedObjects;
	if (visitedObjects) {
		switch (type) {
			case "PERS":
			case "LIEU":
			case "HIST":
			case "DOC":
				// On vérifie si l'id est déjà dans l'array du type concerné
				var indexObjet = visitedObjects[type].indexOf(id);
				if (indexObjet > -1) {
					// l'objet est déjà dans la liste
					if (indexObjet != 0) {
						// L'objet n'est pas au début de la liste, on l'enlève
						visitedObjects[type].splice(indexObjet, 1);
						// On le rajoute au début
						visitedObjects[type].unshift(id);
						// On met à jour le profile.visitedObjects
						Meteor.users.update(
							{_id: Meteor.userId()}, 
							{$set: {'profile.visitedObjects':visitedObjects}}
						);
					}
				}
				else {
					// L'objet n'est pas dans la liste, on le rajoute au début
					visitedObjects[type].unshift(id);
					// On limite la liste selon le paramètre défini
					visitedObjects[type] = visitedObjects[type].slice(0, parametreCommuns.visitedObjectsListMaxLength);
					// On met à jour le profile.visitedObjects
					Meteor.users.update(
							{_id: Meteor.userId()}, 
							{$set: {'profile.visitedObjects':visitedObjects}}
						);
				}
				break;
			default:
				console.log("Erreur gf_addVisitedObject : le type n'est pas connu : " + type);
				break;
		};
	}
	else console.log("Erreur gf_addVisitedObject : cet utilisateur n'a pas de profile.visitedObjects ou n'est pas loggué.");
}

// Transformation d'un fragment de texte XML sous forme de string, 
// Renvoie le code HTML correspondant
gf_transformTextXml = function(texteXML) {
		// Spécifique firefox ?????
		// A vérifier et adapter
		var parser = new DOMParser();
		// On charge le fragment xml de la transcription en ajoutant un noeud Root
		var XMLdata = '<transcript>' + texteXML + '</transcript>';
		var doc = parser.parseFromString(XMLdata, "text/xml");
		// On crée la transformation xslt
		var xsltProcessor = new XSLTProcessor();
		// On parse le fichier XSL
		var xsl = parser.parseFromString(xsltForTexteXml, "text/xml");
		// Importation du xsl dans le processor
		xsltProcessor.importStylesheet(xsl);
		// On effectue la transformation
		var fragment = xsltProcessor.transformToFragment(doc, document);
		// On crée un serialiser
		var serializer = new XMLSerializer();
		var result = serializer.serializeToString(fragment);
		// On exporte le résultat
		return result;
		// ??????????????????????????????????
}

/* VERSION dans la collection personne

// ???????????????????????????????????????????????
// Problème de droits d'accès en écriture ?
// ???????????????????????????????????????????????

gf_addVisitedObject = function(type,id) {
	if (Meteor.userId) {
		switch (type) {
			case "PERS":
			case "LIEU":
			case "HIST":
			case "DOC":
				var nouvelleHist = {type:type,id:id};
				// On ajoute à l'historique du profile utilisateur
				Meteor.users.update(Meteor.userId,{$push:{"profile.history":"A"}});
				break;
			default:
				console.log("Erreur gf_addVisitedObject : le type n'est pas connu : " + type);
				break;
		};
	}
}
*/

// ==============================================
// Global helpers
// ==============================================
// Pour retourner les objets visités récemment pour cet utilisateur
UI.registerHelper('gh_visitedObjects', function (nomVar) {
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.visitedObjects;
});

// ??????????????????????????????????????????????????????????????
// A remplacer par la librairie useful helpers

// Pour retourner une variable de session
// Pour retourner une variable de session
UI.registerHelper('gh_sessionVar', function (nomVar) {
	return Session.get(nomVar);
});

// ==============================================
// Pour vérifier si "isSuperAdmin"
UI.registerHelper('gh_isSuperAdmin', function () {
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role === "SUPERADMIN";
});
// Pour vérifier si "isAdmin"
UI.registerHelper('gh_isAdmin', function () {
	return Meteor.user() && Meteor.user().profile && (Meteor.user().profile.role === "SUPERADMIN" || Meteor.user().profile.role === "ADMIN");
});
// Pour vérifier si "isOwner"
UI.registerHelper('gh_isOwner', function () {
	return Meteor.user() && (Meteor.user()._id === this.createdBy);
});
// Pour vérifier si "gh_isAdminOrOwner"
UI.registerHelper('gh_isAdminOrOwner', function () {
	return 	(Meteor.user() && Meteor.user().profile && (Meteor.user().profile.role === "SUPERADMIN" || Meteor.user().profile.role === "ADMIN")) 
			|| (Meteor.user() && (Meteor.user()._id === this.createdBy));
});
// Pour vérifier si "accountJustCreated"
UI.registerHelper('gh_accountJustCreated', function () {
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.accountJustCreated;
});
// ==============================================
// Pour compter le nombre de docs d'un curseur
UI.registerHelper('gh_cursorCount', function (curseur) {
	return curseur.count();
});
// Pour  savoir s'il y a plusieurs docs dans un curseur
UI.registerHelper('gh_moreThanOneInCursor', function (curseur) {
	return curseur.count() > 1;
});
// Pour  savoir s'il un curseur n'est pas vide
UI.registerHelper('gh_cursorIsNotEmpty', function (curseur) {
	return curseur.count() != 0;
});

// ==============================================
// Pour obtenir un objet par son ID
gf_userById =  function(id) {return Meteor.users.findOne({_id:id});}
UI.registerHelper('gh_userById', gf_userById);

gf_persById =  function(id) {return Pers.findOne({_id:id});}
UI.registerHelper('gh_persById', gf_persById);

gf_lieuById =  function(id) {return Lieux.findOne({_id:id});}
UI.registerHelper('gh_lieuById', gf_lieuById);

gf_histById =  function(id) {return Hists.findOne({_id:id});}
UI.registerHelper('gh_histById', gf_histById);

gf_docById =  function(id) {return Docs.findOne({_id:id});}
UI.registerHelper('gh_docById', gf_docById);

gf_profById =  function(id) {return Profs.findOne({_id:id});}
UI.registerHelper('gh_profById', gf_profById);

gf_lienById =  function(id) {return Liens.findOne({_id:id});}
UI.registerHelper('gh_lienById', gf_lienById);

gf_registreById =  function(id) {return Registres.findOne({_id:id});}
UI.registerHelper('gh_registreById', gf_registreById);

gf_acteRegistresById =  function(id) {return ActesRegistres.findOne({_id:id});}
UI.registerHelper('gh_acteRegistresById', gf_acteRegistresById);

gf_tagById =  function(id) {return Tags.findOne({_id:id});}
UI.registerHelper('gh_tagById', gf_tagById);

gf_objectById =  function(id,type) {
	switch (type) {
		case "PERS":
			return Pers.findOne({_id:id});
			break;
		case "LIEU":
			return Lieux.findOne({_id:id});
			break;
		case "HIST":
			return Hists.findOne({_id:id});
			break;
		case "DOC":
			return Docs.findOne({_id:id});
			break;
		case "LIEN":
			return Liens.findOne({_id:id});
			break;
		case "REGISTRE":
			return Registres.findOne({_id:id});
			break;
		case "ACTE_ARCHIVES":
			return ActesRegistres.findOne({_id:id});
			break;
		default:
			console.log("Erreur \"gf_objectById\" : Type non supporté : " + type);
			break;
	}
}
UI.registerHelper('gh_objectById', gf_objectById);

// ==============================================
// Pour vérifier l'existence d'un objet par son ID
gf_existsPersById =function(id) {
	if (Pers.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsPersById', gf_existsPersById);

gf_existsLieuById =function(id) {
	if (Lieux.findOne(id))  return true;
	else 					return false;
}
UI.registerHelper('gh_existsLieuById', gf_existsLieuById);

gf_existsHistById =function(id) {
	if (Hists.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsHistById', gf_existsHistById);

gf_existsDocById =function(id) {
	if (Docs.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsDocById', gf_existsDocById);

gf_existsLienById =function(id) {
	if (Liens.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsLienById', gf_existsLienById);

gf_existsRegistreById =function(id) {
	if (Registres.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsRegistreById', gf_existsRegistreById);

gf_existsActeArchivesById =function(id) {
	if (ActesArchives.findOne(id)) 	return true;
	else 					return false;
}
UI.registerHelper('gh_existsActeArchivesById', gf_existsActeArchivesById);

// ==============================================
// Pour obtenir la liste des coupleEvents pour une personne, ordonnés par date
gf_coupleEventsByPersId  = function(persIdA,persIdB,notEqualDivorce) {
	var sortDirective = {sort: {"date.a1":1}};
	// NB : dans tous les cas un objet "hash" est passé en second paramètre (d'ou cela vient-il ?)
	// C'est pour cela qu'on teste sur le type Boolean
	if (((typeof notEqualDivorce) == "boolean") && notEqualDivorce) {
		// NB : dans tous les cas un objet "hash" est passé en second paramètre (d'ou cela vient-il ?)
		// C'est pour cela qu'on teste sur le type String
		if (typeof persIdA === "string") {
			if (typeof persIdB === "string") 	return CoupleEvents.find({$or: [{"type":{$ne:"DIVORCE"},"persA":persIdA,"persB":persIdB},{"type":{$ne:"DIVORCE"},"persA":persIdB,"persB":persIdA}]},sortDirective).fetch();
			else								return CoupleEvents.find({$or: [{"type":{$ne:"DIVORCE"},"persA":persIdA},{"type":{$ne:"DIVORCE"},"persB":persIdA}]},sortDirective).fetch();
		}
	}
	else {
		// NB : dans tous les cas un objet "hash" est passé en second paramètre (d'ou cela vient-il ?)
		// C'est pour cela qu'on teste sur le type String
		if (typeof persIdA === "string") {
			if (typeof persIdB === "string") 	return CoupleEvents.find({$or: [{"persA":persIdA,"persB":persIdB},{"persA":persIdB,"persB":persIdA}]},sortDirective).fetch();
			else								return CoupleEvents.find({$or: [{"persA":persIdA},{"persB":persIdA}]},sortDirective).fetch();
		} 
	}	
}
UI.registerHelper('gh_coupleEventsByPersId', gf_coupleEventsByPersId);

// ==============================================
// Pour obtenir la liste des coupleEvents référençant un document, ordre de la base
gf_coupleEventsByDocId  = function(docId) {
	if (docId) {
		return CoupleEvents.find({"docs":docId}).fetch();
	}
	else console.log("Erreur \"gf_coupleEventsByDocId\" aucune docID n'a été passé en paramètre.")
}
UI.registerHelper('gh_coupleEventsByDocId', gf_coupleEventsByDocId);

// ==============================================
// Pour obtenir le conjoint d'une personne pour un coupleEvent données	"conjoint" : function (pers,coupleEvent) {
gf_conjoint  = function(persId,coupleEvent) {
	if (persId === coupleEvent.persA) return gf_persById(coupleEvent.persB);
	if (persId === coupleEvent.persB) return gf_persById(coupleEvent.persA);
}
UI.registerHelper('gh_conjoint', gf_conjoint);

// ==============================================
// Pour obtenir le label d'une valeur d'un paramètre commun
gf_getCommonParmLabel  = function(parm,value) {
	var obj = _.findWhere(parametreCommuns[parm], {"valeur":value});
	if (obj && obj.intitule) return obj.intitule[LANG];
}
UI.registerHelper('gh_getCommonParmLabel', gf_getCommonParmLabel);

// ==============================================
// Pour connaitre les pointeurs ver un objet
UI.registerHelper('gh_getPointingObjects', gf_getPointingObjects);
// Pour voir si le retour de la fonction précédente est vide
UI.registerHelper('gh_thereIsNoPointingObject', gf_thereIsNoPointingObject);

// ==============================================
// Pour savoir si la personne en contexte est sosa
gf_isSosa = function() {return (this._id in Session.get('sosas'));}
UI.registerHelper('gh_isSosa', gf_isSosa);

// Pour savoir si la personne en contexte est 2 sosas ou plus (implexe)
UI.registerHelper('gh_isMultipleSosas', function () {
	return (Session.get('sosas')[this._id] && Session.get('sosas')[this._id].length > 1);
});
// Pour obtenir la liste des n° de sosas de la personne en contexte, séparés par une virgule
UI.registerHelper('gh_sosasList', function () {
	return (Session.get('sosas')[this._id].join(", "));
});

// ==============================================
// Pour obtenir la transcription d'un texte XML en HTML
UI.registerHelper('gh_transformTextXml', gf_transformTextXml);

// ==============================================
// Pour la gestion des données PERS incertaines
// Contexte PERS
UI.registerHelper('gh_classIncertainForNaissance', function (id) {
	if (this.naissance && this.naissance.incertain)	return "incertain"
	else return "";
});

// Contexte PERS
UI.registerHelper('gh_classIncertainForDeces', function (id) {
	if (this.deces && this.deces.incertain)	return "incertain"
	else return "";
});

// ==============================================
// Pour formater une date
gf_formatDate = function(date) {
	if (date instanceof Date) 	return numberToXx(date.getDate()) + "/" + numberToXx(date.getMonth() + 1) + "/" + numberToXx(date.getFullYear()) ;
	else 						return "";
}
UI.registerHelper('gh_formatDate', gf_formatDate);
// Pour formater une heure
gf_formatTime = function(date) {
	if (date instanceof Date) 	return numberToXx(date.getHours()) + ":" + numberToXx(date.getMinutes()) + ":" + numberToXx(date.getSeconds()) ;
	else 						return "";
}
UI.registerHelper('gh_formatTime', gf_formatTime);

// ==============================================
// Pour les DOCs ------------------------------------
UI.registerHelper('gh_urlDocument', function () {
	return Meteor.absoluteUrl() + "marais" + this.urlDocument;
});
UI.registerHelper('gh_urlIconeDocument', function () {
	return Meteor.absoluteUrl() + "marais" + this.urlIcone;
});

// ==============================================
// Pour transformer une date en TimeStamp -------
gf_dateToTimestamp =function(date, d2) {
	// d2 :: boolean (optionel) pour convertir la seconde date (cas "ENTRE d1 ET d2")
	
	if (d2) {
		// On complète les dates
		if (!date.j2)	var jour = 1;
		else 			var jour = date.j2;
		if (!date.m2)	var mois = 1;
		else 			var mois = date.m2;
		if (!date.a2)	console.log("date incomplète : " + date.j2 + "/" + date.m2 + "/" + date.a2);
		return new Date(date.a2,mois-1,jour).getTime();
	}
	else {
		// On complète les dates
		if (!date.j1)	var jour = 1;
		else 			var jour = date.j1;
		if (!date.m1)	var mois = 1;
		else 			var mois = date.m1;
		if (!date.a1)	console.log("date incomplète : " + date.j1 + "/" + date.m1 + "/" + date.a1);
		return new Date(date.a1,mois-1,jour).getTime();
	}	
}
UI.registerHelper('gh_dateToTimestamp', gf_dateToTimestamp);

// ==============================================
// ??????????????????????????????????????????????
// A ajouter dans les usefull helpers !!
UI.registerHelper('hlp_sum', function (...values) {
	return _.reduce(values, function(memo, value){ return memo + value; }, 0);
});

UI.registerHelper('hlp_and', function (...values) {
	return _.reduce(values, function(memo, value){ return memo && value; }, true);
});

// Pour compter le nombre d'éléments d'un array ou d'un curseur
hlp_count = function(element) {
	if (_.isArray(element)) return element.length;
	else if (element instanceof Mongo.Collection.Cursor) return element.count();
};
UI.registerHelper('hlp_count', hlp_count);

// Pour voir si un élément est le dernier d'un Array (pas Cursor !!!!)
hlp_last = function(list, elem)  {
	return _.last(list) === elem;
};
UI.registerHelper('hlp_last', hlp_last);



// ??????????????????????????????????????????????




// ==============================================
// Pour obtenir le liste des enfants d'un couple --
// Classé par ordre de naissance
// Paramètres :
// - parentA ::PERS
// - parentB ::PERS

gf_listeEnfants =  function (parentA,parentB) {
	// Si on a bien les deux paramètres
	if (parentA && parentB) {
		// On renvoie la liste des enfants
		if (parentA.sexe === "M" && parentB.sexe === "F") {
			return Pers.find({ pere: parentA._id,mere:parentB._id }, {sort: {"naissance.date.a1" : 1}}).fetch();
		}
		else {
			if (parentB.sexe === "M" && parentA.sexe === "F") {
				return Pers.find({ pere: parentB._id,mere:parentA._id }, {sort: {"naissance.date.a1" : 1}}).fetch();
			}
			else {
				// Dans les autres cas, émettre une erreur 
				// throw new Meteor.Error(413, "Incohérence de sexe des parents. ");
				return null;
			}
		}
	}
}
UI.registerHelper('gh_listeEnfants', gf_listeEnfants);

// Ajout Google Map --------------------------------

// ???????????????? tests ?????????????????
UI.registerHelper('gh_validateLat_status', function () {
	var ok = false;
	return ok ? "has-success" : "has-error";
});
UI.registerHelper('gh_validateLat_icon', function () {
	var ok = false;
	return ok ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-remove";
});

// ??????????????????????????????????????

// ==============================================
// Attachement des SCHEMAS
// ==============================================
Lieux.attachSchema(SCHEMA.lieu);
Docs.attachSchema(SCHEMA.doc);
Pers.attachSchema(SCHEMA.pers);
Registres.attachSchema(SCHEMA.registre);
Bugs.attachSchema(SCHEMA.bug);
Hists.attachSchema(SCHEMA.hist);
Profs.attachSchema(SCHEMA.prof);
Liens.attachSchema(SCHEMA.lien);
ActesArchives.attachSchema(SCHEMA.acteArchives);
CoupleEvents.attachSchema(SCHEMA.coupleEvent);
Tags.attachSchema(SCHEMA.tag);

// ==============================================
// Variables de sessions
// ==============================================
// Pour le débug
Session.setDefault('debug', true);

// Pour la recherche des points d'histoire
Session.setDefault('choix_hist_titre', "");
Session.setDefault('choix_hist_anneeDebut', 0);
Session.setDefault('choix_hist_anneeFin', new Date().getFullYear());		// Année actuelle
Session.setDefault('choix_hist_zones', []);
Session.setDefault('choix_hist_themes', []);
Session.setDefault('choix_hist_impact', false);
Session.setDefault('choix_hist_pasImpact', false);

// Pour la recherche des documents
Session.setDefault('choix_doc_titre', "");
Session.setDefault('choix_doc_types', []);
Session.setDefault('choix_doc_anneeDebut', 0);
Session.setDefault('choix_doc_anneeFin', new Date().getFullYear());		// Année actuelle

// Pour la gestion des sosas
Session.setDefault('refSosa1', "a24Ac3s3sZEAedQmP");
Session.setDefault('sosas', {});
	
// Pour la gestion de la liste des dumps
Session.setDefault('listeDumps', []);
Session.setDefault('consoleDumps', "");

// Pour l'indexation des actes des registres
Session.setDefault('communeChoisie_registreIndexer', null);
Session.setDefault('registreChoisi_registreIndexer', null);
Session.setDefault('pageChoisie_registreIndexer', 1);

// ==============================================
// Gestion des communications audio/vidéo
// ==============================================
Session.setDefault('callState', "DISCONNECTED");

// ==============================================
// Gestion de l'audio transcription
// ==============================================
Session.set('isAudioTranscriptCapable', (window.webkitSpeechRecognition ? true : false));
Session.set('audioTranscriptIsOn', false);
// Global helpers
gf_isAudioTranscriptCapable = function(id) {return Session.get('isAudioTranscriptCapable');}
UI.registerHelper('gh_isAudioTranscriptCapable', gf_isAudioTranscriptCapable);
gf_audioTranscriptIsOn = function(id) {return Session.get('audioTranscriptIsOn');}
UI.registerHelper('gh_audioTranscriptIsOn', gf_audioTranscriptIsOn);
// Variable globale de l'objet reco (pour info)
recognition = {}
// ----------------- FIN ------------------------

// Fonction pour obtenir la liste des dumps
getDumpList = function() {
	Meteor.call('dumpList', function (err, response) {
		if (err) 	toastr.error(err.reason,"Liste des dumps impossible");
		else 		Session.set('listeDumps',response);
	});
}
// On initialise cette variable de session
getDumpList();

// ==============================================
// Hooks pour les formulaires AUTOFORM
// ==============================================
AutoForm.hooks({
	// Pour les PERS ----------------------------	
	/* A supprimer quand nouvelle IHM validée
	"addPersForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On affiche la popup success
			toastr.success("Personne ajoutée");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter la personne : " + error.reason);
			}
		}
	},
	"updatePersForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On affiche la popup success
			toastr.success("Personne modifiée");	
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier la personne : " + error.reason);
			}
		}
	},*/
	// Pour les PERSFORMMAIN ----------------------------	
	"addPersFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Personne ajoutéé");
			// On route vers la nouvelle personne
			Router.go('/pers/infos/' + this.docId);
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter la personne : " + error.reason);
			}
		}
	},
	"updatePersFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Personne modifiée");	
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier la personne : " + error.reason);
			}
		}
	},
	// Pour les updatePersFormBirth ----------------------------	
	"updatePersFormBirth" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Personne modifiée");	
			// On propose de créer/supprimer un mariage pour les parents
			var ajouterCoupleEvent = function(persA,persB,type) {
				var coupleEvent = {
					persA:persA,
					persB:persB,
					type:type,
					etatRechEnfants:"INCOMPLET_A_COMPLETER"
				};
				CoupleEvents.insert(coupleEvent,function(error,result) { 
					if (error) 	toastr.warning("Impossible d'ajouter l'évènement conjugal : " + error);
					if (result) toastr.success("Evènement conjugal ajouté");
				});
			};
			var thereIsNoCoupleEventOutsideDivorce = function(persA,persB) {
				return gf_coupleEventsByPersId(persA,persB,true).length === 0;				
			};
			var thereIsNoChildWithTheseParents = function(pere,mere) {
				return Pers.find({pere:pere,mere:mere}).fetch().length === 0;				
			};
			var oldFather = gf_persById(this.currentDoc.pere);
			var oldMother = gf_persById(this.currentDoc.mere);
			var newFather = gf_persById(this.updateDoc.$set && this.updateDoc.$set.pere);
			var newMother = gf_persById(this.updateDoc.$set && this.updateDoc.$set.mere);
			// Si les deux parents sont complets
			if (newFather && newMother) {
				// Si ils étaient complets avant
				if (oldFather && oldMother) {
					// Si l'un au moins de deux parents est différent
					if ((newFather._id != oldFather._id) || (newMother._id != oldMother._id)) {
						// Le couple a été modifié, si aucun évènement conjugal n'existe déjà (hors divorce) pour le nouveau couple, on en rajoute un
						if (thereIsNoCoupleEventOutsideDivorce(newFather._id,newMother._id)) ajouterCoupleEvent(newFather._id,newMother._id,"MARIAGE");
						// Voir si d'autres enfants existent avec ces parents, si non, proposer la suppression du ou des entrées de couple event éventuel
						if (thereIsNoChildWithTheseParents(oldFather._id,oldMother._id)) {
							var coupleEventsList = gf_coupleEventsByPersId(oldFather._id,oldMother._id,true);
							if (coupleEventsList.length != 0) {
								// Le couple de parents a été modifié, il n'y a plus d'enfants pour l'ancien couple, ne faut-il pas supprimer un évènement conjugal ?
								Modal.show('CoupleEventListDeleteModal',{pere:oldFather._id,mere:oldMother._id},{backdrop:'static',keyboard:false});
							}
						}
					}
					// Ici les parents n'ont pas été modifiés
				}
				else {
					// Le couple a été créé, si aucun évènement conjugal n'existe déjà (hors divorce), on en rajoute un
					if (thereIsNoCoupleEventOutsideDivorce(newFather._id,newMother._id)) ajouterCoupleEvent(newFather._id,newMother._id,"MARIAGE");
				}				
			}
			else {
				// Si ils étaient complets avant
				if (oldFather && oldMother) {
					// S'il n'y a plus d'autres enfants de l'ancien couple, proposer la suppression du ou des entrées de couple event éventuel
					if (thereIsNoChildWithTheseParents(oldFather._id,oldMother._id)) {
						var coupleEventsList = gf_coupleEventsByPersId(oldFather._id,oldMother._id,true);
						if (coupleEventsList.length != 0) {
							// Le couple de parents a été modifié (suppression d'un ou plusieurs conjoints), il n'y a plus d'enfants pour l'ancien couple, ne faut-il pas supprimer un évènement conjugal ?");
							Modal.show('CoupleEventListDeleteModal',{pere:oldFather._id,mere:oldMother._id},{backdrop:'static',keyboard:false});
						}
					}
				}
				// Ici : couple toujours incomplet
			}
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier la personne : " + error.reason);
			}
		}
	},
		// Pour les updatePersFormDeath ----------------------------	
	"updatePersFormDeath" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("PERS",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Personne modifiée");	
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier la personne : " + error.reason);
			}
		}
	},
	// Pour les COUPLEEVENTS ----------------------------	
	"addCoupleEventForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Evènement conjugal ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter l'évènement conjugal : " + error.reason);
			}
		}
	},
	"updateCoupleEventForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Evènement conjugal modifié");	
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier l'évènement conjugal : " + error.reason);
			}
		}
	},
	// Pour les LIEU ----------------------------
	"addLieuForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("LIEU",this.docId);
			// On affiche la popup success
			toastr.success("Lieu ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter le lieu : " + error.reason);
			}
		}
	},
	"updateLieuForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("LIEU",this.docId);
			// On affiche la popup success
			toastr.success("Lieu modifié");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le lieu : " + error.reason);
			}
		}
	},
	// Pour les HIST ----------------------------
	"addHistForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("HIST",this.docId);
			// On affiche la popup success
			toastr.success("Point d'histoire ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter ce point d'histoire : " + error.reason);
			}
		}
	},
	"updateHistForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("HIST",this.docId);
			// On affiche la popup success
			toastr.success("Point d'histoire modifié");
			// On retourne à la page précédente
			// history.go(-1); // Fonctionne, mais la popup d'avertissement de modif ok n'apparait pas
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le point d'histoire : " + error.reason);
			}
		}
	},
	// Pour les PROF ----------------------------	
	"addProfFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			toastr.success("Profession ajoutée");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			if (error.reason != undefined) {toastr.warning("Impossible d'ajouter la profession : " + error.reason);}
		}
	},
	"updateProfFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			toastr.success("Profession modifiée");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {if (error.reason != undefined) {toastr.warning("Impossible de modifier la profession : " + error.reason);}
		}
	},
	// Pour les DOC -----------------------------
	/* A supprimer quand nouvelle IHM validée
	"addDocForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("DOC",this.docId);
			// On affiche la popup success
			toastr.success("Doc ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter le doc : " + error.reason);
			}
		}
	},
	"updateDocForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("DOC",this.docId);
			// On affiche la popup success
			toastr.success("Doc modifié");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le doc : " + error.reason);
			}
		}
	},*/
	"addDocFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("DOC",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Document ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter le document : " + error.reason);
			}
		}
	},
	"updateDocFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On enregistre dans la liste des objets visités
			gf_addVisitedObject("DOC",this.docId);
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Document modifié");	
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le document : " + error.reason);
			}
		}
	},
	// AUTRES -----------------------------------
	"updateRegistreForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("Registre modifié");
			// On retourne à la page précédente
			// history.go(-1); // Fonctionne, mais la popup d'avertissement de modif ok n'apparait pas
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le registre : " + error.reason);
			}
		}
	},
	"addRegistreForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("Registre ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter le registre : " + error.reason);
			}
		}
	},
	"addActeArchivesForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("Acte dépouillé ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter l'acte dépouillé : " + error.reason);
			}
		}
	},
	"addBugForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("Bug/amélioration ajouté(e)");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter le bug : " + error.reason);
			}
		}
	},
	"addLienForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("Lien ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter ce lien : " + error.reason);
			}
		}
	},
	"updateLienForm" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On affiche la popup success
			toastr.success("lien modifié");
			// On retourne à la page précédente
			// history.go(-1); // Fonctionne, mais la popup d'avertissement de modif ok n'apparait pas
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le lien : " + error.reason);
			}
		}
	},
	// Pour les tags
	"addTagFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Tag ajouté");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible d'ajouter ce tag : " + error.reason);
			}
		}
	},
	"updateTagFormMain" : {
		// Called when any submit operation succeeds
		onSuccess: function(formType, result) {
			// On ferme la popup
			$('.modal').modal('hide');
			// On affiche la popup success
			toastr.success("Tag modifié");
		},
		// Called when any submit operation fails
		onError: function(formType, error) {
			// On affiche la popup erreur
			if (error.reason != undefined) {
				toastr.warning("Impossible de modifier le tag : " + error.reason);
			}
		}
	},
});

// ==============================================
// Fonctions générales
// ==============================================

// ========================================
// Met le focus à la fin d'un champ input (vide ou rempli)
// ========================================
mettreFocusFinTexte = function(selector) {
// On met le focus sur le champ input
	var champInput = $(selector);
	// Multiply by 2 to ensure the cursor always ends up at the end;
	// Opera sometimes sees a carriage return as 2 characters.
	var strLength= champInput.val().length * 2;
	champInput.focus();
	champInput[0].setSelectionRange(strLength, strLength);
};

// ========================================
// transforme "3" en "03"
// ========================================
numberToXx = function(number) {
	if (parseInt(number) < 10) return "0" + number;
	else return number;
}

// ========================================
// Vérifie qu'un nombre est bien entre les valeur min et max (comprise)
// ========================================
isInRange = function(min,nombre,max){
	if ( !isNaN(nombre) && (nombre >= min) && (nombre <= max) ) 	return true;
	else 												        return false;
};

// ========================================
// Genère la variable de session de liste des sosas : Session.get('sosas')
// ========================================
gf_calculerSosas = function() {
	// Fonction d'ajout de sosa au resultat
	// ====================================
	sosasAjouter = function (id,sosa) {
		// Si le sosa n'existe pas, on le crée avec un array vide
		if ( ! (id in sosasResultat) ) 	sosasResultat[id] = [];
		// On ajoute le sosa à l'array
		sosasResultat[id].push(sosa);
	}
		
	// Fonction récursive de balayage des parents
	// ====================================
	sosasBalayerParents = function(pers,sosa) {
		// Si il y a un père, on le rajoute dans les sosas et on relance pour ses parents
		if (pers.pere && pers.pere != null) {
			// On recherche la personne
			var pere = Pers.findOne(pers.pere);
			// Si le père existe, on l'ajoute à la liste des sosas
			if (pere) {
				sosasAjouter(pere._id,sosa*2);
				// On remonte l'arbre
				sosasBalayerParents(pere,sosa*2);
			}
		}
		// S'il y a une mère, on la rajoute dans les sosas et on relance pour ses parents
		if (pers.mere  && pers.mere != null) {
			// On recherche la personne
			var mere = Pers.findOne(pers.mere);
			// Si la mère existe, on l'ajoute à la liste des sosas
			if (mere) {
				sosasAjouter(mere._id,sosa*2+1);
				// On remonte l'arbre
				sosasBalayerParents(mere,sosa*2+1);
			}
		}
	}
	
	// MAIN
	// ====================================
	// Variable globale à la fonction
	// ====================================
	sosasResultat = {}
	// On recherche la personne initial : référence sosa 1
	var personneInitiale = Pers.findOne(Session.get('refSosa1'));
	// Si la personne existe
	if (personneInitiale) {
		// On ajoute la personne initale dans le dictionnaireDeMesAncetres avec le SOSA 1
		sosasAjouter(personneInitiale._id,1);
		// On procède de façon récursive
		sosasBalayerParents(personneInitiale,1);
		// On ordonne la liste des références de sosas pour chaque sosa (en cas d'implexe)
		
		// ??????????????????????????
		// A faire
		// ??????????????????????????
		
		// On enregistre la variable de session
		
		Session.set('sosas', JSON.parse(JSON.stringify(sosasResultat)));
		console.log("Liste des sosas générée.");
	}
	else {
		// On met la liste de sosas à vide	
		Session.set('sosas', {});
		console.log("RefSosa1 non trouvé : pas de liste des sosas générée.");
	}

}


// ========================================
// Calcule et formate le temps entre deux dates (calcul de l'âge)
// ========================================

gf_durationNiceFormat = function(dureeEnjours) {
	if (dureeEnjours < 30) {
		// On affiche en jours
		var age = Math.round(dureeEnjours) + " jours";
	}
	else {
		if (dureeEnjours < 90) {
			// On affiche en semaines
			var age = Math.round(dureeEnjours/7) + " semaines";
		}
		else {
			// Moins de 2 ans, on parle en mois
			if (dureeEnjours < 730.5) {
				// On affiche en mois
				var age = Math.round(dureeEnjours/30.5) + " mois";
			}
			else {
				// On affiche en années
				var age = Math.floor(dureeEnjours/365.25) + " ans";
			}
		}
	}
	return age;
}

gf_duree = function(date1,date2, format) {
	
	/*
		si aucune annee à une date, ne renvoie rien
		
			Date 2	LE		VERS		AVANT	APRES		ENTRE
			
		Date 1	
		LE			ok		"environ 3 ans" "moins de 3 ans" "plus de 3 ans" "entre 5 et 10 ans"
				
		VERS			environ	environ	environ	environ	
		AVANT
		APRES
		ENTRE
		
		arrondis à la valeur inférieure

								annees
		4 mois et demi		< 1 ans	mois
		3 semaines			< 3 mois	semaines
		12 jours			<  1 mois	jours

	*/
	
	// Formatage paramétrable : 
	
	/*
	
	[
		{ lmoinsQueEnJ : 30, 		function(dureeEnJ) {}},
		{ lmoinsQueEnJ : 90, 		function(dureeEnJ) {}},
		{ lmoinsQueEnJ : 365, 		function(dureeEnJ) {}},
		{ lmoinsQueEnJ : 1825,	function(dureeEnJ) {}},
		{ lmoinsQueEnJ : 5475,	function(dureeEnJ) {}},
	]
	*/
	
	// ?????????????????????????????????????????????
	// A améliorer
	// ?????????????????????????????????????????????
	
	// Si date1 et date2 existent, de type "LE" et complètes
	if ( 	date1
		&& date1.type === "LE" 
		&& date1.j1 
		&& date1.m1 
		&& date1.a1
		&& date2
		&& date2.type === "LE" 
		&& date2.j1 
		&& date2.m1 
		&& date2.a1) {
			
		var d1 = new Date(date1.a1, date1.m1 , date1.j1);
		var d2 = new Date(date2.a1, date2.m1 , date2.j1);
		var nbMsEcoulees = d2.getTime() - d1.getTime();
		var dureeEnjours = nbMsEcoulees / 1000 / 60 / 60 / 24;
		return gf_durationNiceFormat(dureeEnjours);
	}
	else {
		// Si seules les années existent
		if ( 	date1
			&& date1.a1
			&& date2
			&& date2.a1) {
			var age = "environ " + (date2.a1 - date1.a1) + " ans";
			return age;
		}		
	}
}

// ==============================================
// Au login, traitement éventuel
// ==============================================
Accounts.onLogin(function(user){
	console.log("Login");
	// On charge le sosa1 avec la personne loguée si elle existe
	if (Meteor.user().profile._id)	Session.set('refSosa1',Meteor.user().profile._id);
	else						Session.set('refSosa1',null);
	// On calcule les sosas quand la collection est prête
	// Cf /client/router.js : on calcule les sosas dans router.onBeforeAction
	// On force le routage vers la page d'accueil
	// Router.go('/');
});







