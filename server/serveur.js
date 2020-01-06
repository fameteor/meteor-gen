// ==============================================
//  MODULES
// ==============================================
os = Npm.require("os")		// Pour obtenir des infos sur l'OS, CPU...
fs = Npm.require('fs');
var exec = Npm.require('child_process').exec;


// ==============================================
// GESTION ENVIRONNEMENT PROD ou DEV
// ==============================================
// Variable pour gérer les environnements :
// - TEST (Windows)
// - PROD (Linux)
// La sélection se fait automatiquement par détection de l'OS
// en utilisant : Npm.require("os")	

var env = {
	// ------------------------------------------
	// Environnement de test
	// ------------------------------------------
	'Windows_NT': {
		// Pour la gestion des DUMP/RESTORE MongoDb
		'dumpDir':				'c:\\data\\mongo\\dumps\\',
		'dumpCommand':			'c:\\mongodb\\bin\\mongodump -h 127.0.0.1:3001 -d meteor --out ', 	// + dumpDir
		'restoreCommand': 		'c:\\mongodb\\bin\\mongorestore -h 127.0.0.1:3001 -d meteor ',		// + dumpDir
		'deleteDumpCommand': 	'rmdir /S /Q ',														// + dumpDir
		// Pour la conversion SVG -> PNG
		'tmpDir' : 				'c:\\gen_tmp\\',
		'pathToBatik': 			'c:\\batik\\batik-rasterizer-1.8.jar',
		'UriPathToCssFile':		'http://localhost:3000/',
	},
	// ------------------------------------------
	// Environnement de prod
	// ------------------------------------------
	'Linux': {
		// Pour la gestion des DUMP/RESTORE MongoDb
		'dumpDir':				'/data/mongo/dumps',
		'dumpCommand':			'',		// + dumpDir
		'restoreCommand': 		'',		// + dumpDir
		'deleteDumpCommand': 	'',		// + dumpDir
		// Pour la conversion SVG -> PNG
		'tmpDir' : 				'',
		'pathToBatik': 			'',
		'UriPathToCssFile':		'',		
	}	
}

// ==============================================
// DETECTION ENVIRONNEMENT PROD ou DEV
// ==============================================
console.log('---------------------------------------------');
console.log('Démarrage serveur');
switch(os.type()) {
	case 'Windows_NT' :
	case 'Linux' :
		// Détection OK, on initialise la variable ENV selon l'OS
		console.log('OS serveur détecté : ' + os.type());
		var ENV = env[os.type()];
		break;
	default :
		console.error('Erreur "server.js" : OS non supporté : ' + os.type());
		break;	
}

// ==============================================
//  GESTION des ADMIN
// ==============================================
// On a 4 niveau de droit d'accès incrémentaux  définis dans la collection user (profile.role) :
// - SUPERADMIN
// - ADMIN
// - USER

idAdministrateurAppli = "a24Ac3s3sZEAedQmP";


/*
// Initialisation du SUPERADMIN (qui ensuite peut donner des droits au autres)
Meteor.users.update(
	{_id: idAdministrateurAppli}, 
	{$set: {
			'profile.role':"SUPERADMIN",
			'profile.lang':"fr",
			'profile.history':[],
			'profile._id':"pZXq8wXxGMFHuARd8",
			'profile.accountJustCreated':false,
			'profile.visitedObjects':{"PERS":[],"LIEU":[],"HIST":[],"DOC":[]}
		}
	}
);
*/
	

// ?????????????????????????????????
// Temporaire pendant les devs
// Il faudra aussi préoir un mécanisme de vérification des paramètres perso de l'utilisateur
// On initialise aussi les préférences à la valeur par défaut
Meteor.users.update({_id: idAdministrateurAppli}, {$set: {'profile.prefs':usersDefaultPrefs}});
// ?????????????????????????????????

// Fonction pour vérifier si l'utilisateur est un super-administrateur
// (si Meteor.user().profile.role n'est pas accessible directement comme dans les ALLOW)
isSuperAdmin = function(userId) {
	var user = Meteor.users.findOne({_id:userId});
	return user && user.profile && (user.profile.role === "SUPERADMIN");
}

// Fonction pour vérifier si l'utilisateur est un administrateur
// (si Meteor.user().profile.role n'est pas accessible directement comme dans les ALLOW)
isAdmin = function(userId) {
	var user = Meteor.users.findOne({_id:userId});
	return user && user.profile && (user.profile.role === "SUPERADMIN" || user.profile.role === "ADMIN");
}

// ==============================================
// A la création d'un compte
// ==============================================

// ??????????????????????????????????????????????
// A remettre en place si on souhaite permettre la création d'un login par l'utilisateur
// A tester car on doit activer cette fonction même si c'est l'administrateur qui crée le user
// Il faudrait donc prévoir de tester si on est dans le premier cas ou le second ?
// ??????????????????????????????????????????????

/*
Accounts.onCreateUser(function(options, user) {
	// On rajoute le rôle par défault
	user.profile = {};
	user.profile.role 					= "USER";
	user.profile.lang 					= "fr";
	user.profile.accountJustCreated 	= true; // C'est la première connexion
	user.profile.visitedObjects 		= {"PERS":[],"LIEU":[],"HIST":[],"DOC":[]};
	// On rajoute les préférences paramétrables par défaut de l'utilisateur
	user.profile.prefs = usersDefaultPrefs;	
	return user;
});
*/


// ==============================================
// Publications
// ==============================================
Meteor.publish("tousLesUtilisateurs", function () {
	// Si le demandeur est un admin, on lui renvoie tout
	if (isAdmin(this.userId))	return Meteor.users.find();
	// Sinon il n'aura que la vue sur lui
	else 					this.ready();
});


Meteor.publish("tousLesLieux", function () {
		return Lieux.find();
});
Meteor.publish("tousLesDocs", function () {
		return Docs.find();
});
Meteor.publish("toutesLesPers", function () {
	return Pers.find();
});
Meteor.publish("tousLesRegistres", function () {
		return Registres.find();
});
Meteor.publish("tousLesBugs", function () {
		return Bugs.find();
});
Meteor.publish("tousLesHists", function () {
		return Hists.find();
});
Meteor.publish("toutesLesProfs", function () {
		return Profs.find();
});
Meteor.publish("tousLesLiens", function () {
		return Liens.find();
});
Meteor.publish("tousLesActesArchives", function () {
		return ActesArchives.find();
});
Meteor.publish("tousLesCoupleEvents", function () {
		return CoupleEvents.find();
});
Meteor.publish("tousLesTags", function () {
		return Tags.find();
});



// ==============================================
// Méthodes autorisées au client
// ==============================================
Pers.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

CoupleEvents.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		
		// ?????????????????????????
		// And add (TBD) : have the rights on the people
		// ????????????????????????
		
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		
		// ?????????????????????????
		// And add (TBD) : have the rights on the people
		// ????????????????????????
		
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		
		// ?????????????????????????
		// And add (TBD) : have the rights on the people
		// ????????????????????????
		
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Lieux.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Hists.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
/*
  fetch: ['owner']
  */
});

Docs.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Profs.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// Seul l'owner ou l'administrateur peut updater
		return (isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Liens.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own links except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

ActesArchives.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own links except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Tags.allow({
	insert: function (userId, doc) {
		// the user must be logged in
		return (userId);
	},
	update: function (userId, doc, fields, modifier) {
		// can only change your own documents except ADMIN
		return (doc.createdBy === userId || isAdmin(userId));
	},
	remove: function (userId, doc) {
		// Seul l'owner ou l'administrateur peut supprimer
		return (doc.createdBy === userId || isAdmin(userId));
	},
  /*
  fetch: ['owner']
  */
});

Meteor.users.deny({
	// Pour interdire de se faire ADMIN si on est USER et SUPERADMIN si on est ADMIN
	update: function(userId, doc, fields, modifier) {
		debugger;
		if 	((JSON.stringify(modifier).indexOf("SUPERADMIN") != -1) 
			&& !isSuperAdmin(userId)) 	return true;
		else {
			if 	((JSON.stringify(modifier).indexOf("ADMIN") != -1) 
				&& !isAdmin(userId)) 	return true;
			else						return false;
		}
	}
})
  
Meteor.users.allow({
	remove: function (userId, doc) {
		// Seul l'administrateur peut supprimer des utilisateurs mais pas lui même
		return isAdmin(userId) && userId != doc._id;
	}	
});

Registres.allow({
	insert: function (userId, doc) {
		// Seul l'administrateur peut ajouter des registres
		return isAdmin(userId);
	},
	update: function (userId, doc, fields, modifier) {
		// Seul l'administrateur peut modifier des registres
		return isAdmin(userId);
	},
	remove: function (userId, doc) {
		// Seul l'administrateur peut supprimer des registres
		return isAdmin(userId);
	},
/*
  fetch: ['owner']
  */
	
});

Bugs.allow({
	insert: function (userId, doc) {
		// Seul l'administrateur peut ajouter des bugs
		return isAdmin(userId);
	},
	update: function (userId, doc, fields, modifier) {
		// Seul l'administrateur peut modifier des bugs
		return isAdmin(userId);
	},
	remove: function (userId, doc) {
		// Seul l'administrateur peut supprimer des bugs
		return isAdmin(userId);
	},
/*
  fetch: ['owner']
  */
});

// ==============================================
// METHODES serveur
// ==============================================
Meteor.methods({
	"svgToPngDownload": function (svgCode,width,height,cssFileName) {
		// Parametres ----------------
		var nbPixelsParPointSVG = 4;
		// Code ----------------------
		try {
			// On enregistre le fichier SVG dans une directory temporaire
			var path = ENV.tmpDir + new Date().getTime();
			var filepath = path + '.svg';
			var resultFilePath = path + '.png';
			var buffer = new Buffer(svgCode);
			fs.writeFileSync(filepath, buffer); // On peut rajouter des options
			// On lance la transformation Batik Rasterizer
			var runCmd = Meteor.wrapAsync(exec);
			// ????????????????????????????????????????????????????????????????????
			// A gérer le chargement du CSS, on est obligé de fournir une URI !!!
			// ????????????????????????????????????????????????????????????????????
			var cmd = 'java -Xmx1024m -jar ' + ENV.pathToBatik + ' ' + filepath + ' -d ' +  ENV.tmpDir + ' -h ' + (height * nbPixelsParPointSVG) + ' -w ' + (width * nbPixelsParPointSVG);
			// S'il y a un fichier CSS de fourni, on l'utilise
			if (cssFileName) cmd = cmd + ' -cssUser ' + ENV.UriPathToCssFile + cssFileName;
			// On lance la conversion
			var result = runCmd(cmd);
			// ????????????????????????????????????????????????????????????????????
			// Optimisation : via DDP ne peut-on pas coder autrement qu'en base64 ??
			// ????????????????????????????????????????????????????????????????????
			// On encode le résultat en base64
			var bitmap = fs.readFileSync(resultFilePath);
			return new Buffer(bitmap).toString('base64');	
		}
		catch(err) {
			throw new Meteor.Error(500, err.message );
		}
	},
	"dump": function () {
		if (isAdmin(Meteor.userId())) {
			runCmd = Meteor.wrapAsync(exec);
			try {
				// On crée un dump dans une sous directory dont le nom est le TS
				var result = runCmd(ENV.dumpCommand + ENV.dumpDir + new Date().getTime());
				return result;
			}
			catch(err) {
				throw new Meteor.Error(500, err.message );
			}
		}
		else throw new Meteor.Error(403, "Vous n'avez pas les droits" );
	},
	"dumpList" : function() {
			try {
				var files = fs.readdirSync(ENV.dumpDir);
				// On renvoie l'array contenant les noms de fichiers
				return files.reverse();
			}
			catch(err) {
				throw new Meteor.Error(500, err.message );
			}
	},
	"deleteDump": function (dumpTimeStamp) {
		if (isAdmin(Meteor.userId())) {
			runCmd = Meteor.wrapAsync(exec);
			try {
				result = runCmd(ENV.deleteDumpCommand + ENV.dumpDir + dumpTimeStamp);
				return result;
			}
			catch(err) {
				throw new Meteor.Error(500, err.message );
			}
			
		}
		else throw new Meteor.Error(403, "Vous n'avez pas les droits" );
	},
	"restoreDump": function (dumpTimeStamp) {
		if (isAdmin(Meteor.userId())) {
			runCmd = Meteor.wrapAsync(exec);
			try {
				console.log(ENV.restoreCommand + ENV.dumpDir + dumpTimeStamp + "\\meteor");
				result = runCmd(ENV.restoreCommand + ENV.dumpDir + dumpTimeStamp + "\\meteor");
				return result;
			}
			catch(err) {
				throw new Meteor.Error(500, err.message );
			}
		}
		else throw new Meteor.Error(403, "Vous n'avez pas les droits" );
	},
	// Création d'un login correspondant éventuellement à la personne dont l'id est passé en paramètre
	"createLogin": function (email, password, id) {		
		// Uniquemment pour l'administrateur !
		if (isAdmin(Meteor.userId())) {
			// Si cela concerne une personne de la base existante
			if (id && Pers.findOne({_id:id})) {
				// ???????????????????????????????????????
				// A faire : Vérifier les paramètres email et password
				// ???????????????????????????????????????
				var profile 				= {};
				profile.role 				= "USER";
				profile.lang 				= "fr";
				profile._id					= id;
				// On court-circuite la phase accountJustCreated dans ce cas
				profile.accountJustCreated 	= false; 	
				profile.visitedObjects		= {"PERS":[],"LIEU":[],"HIST":[],"DOC":[]};
				// On rajoute les préférences paramétrables par défaut de l'utilisateur
				profile.prefs 				= usersDefaultPrefs;
				// On crée l'utilisateur
				console.log("création : " + Accounts.createUser({
					// username: username, à implémenter ?
					email : email,
					password : password,
					profile  : profile
				}));
			}
			else	throw new Meteor.Error(403, "Cette personne n'est pas connue dans la base" );
		}
		else throw new Meteor.Error(403, "Vous n'avez pas les droits" );
	},
	"schemasDataCheck": function () {
		var collectionList = [
			{"label":"Pers",			"collection":Pers,			"schema": SCHEMA.pers},
			{"label":"Lieux",			"collection":Lieux,			"schema": SCHEMA.lieu},
			{"label":"Hists",			"collection":Hists,			"schema": SCHEMA.hist},
			{"label":"Docs",			"collection":Docs,			"schema": SCHEMA.doc},
			{"label":"Liens",			"collection":Liens,			"schema": SCHEMA.lien},
			{"label":"Profs",			"collection":Profs,			"schema": SCHEMA.prof},
			{"label":"CoupleEvents",	"collection":CoupleEvents,	"schema": SCHEMA.coupleEvent},
			{"label":"Registres",		"collection":Registres,		"schema": SCHEMA.registre},
			{"label":"ActesArchives",	"collection":ActesArchives,	"schema": SCHEMA.acteArchives},
			{"label":"Bugs",			"collection":Bugs,			"schema": SCHEMA.bug},
		];
		var resultat = [];
		for (index in collectionList) {
			var objCourant = collectionList[index];
			var validationContext = objCourant.schema.newContext();
			var listeObjets = objCourant.collection.find().fetch();
			var resultatCollection = [];
			// On balaye tous les objets
			for (index in listeObjets) {
				var pers = listeObjets[index];
				validationContext.validate(pers);
				if (!validationContext.isValid()) {
					// On supprime les erreurs {"name":"_id","type":"keyNotInSchema"}
					var errorsArray = validationContext.validationErrors();
					if (errorsArray.length > 1) {
						// On push l'objet dans la liste des erreurs
						resultatCollection.push({"id":pers._id,"errors":validationContext.validationErrors()});
					}
				}
			}
			resultat.push({"label":objCourant.label,"value":resultatCollection});
		}
		return resultat;
	},
	'getVersion'() {
            try {
                return JSON.parse(Assets.getText("version.json"));
            }
            catch(e) {
                throw new Meteor.Error(404,"Pas d'information de version disponible.");
            }
        },
  });



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
// Gestion des connexions utilisateurs
// ==============================================
// A la connection -----------------------------------------------------
Meteor.onConnection(function(connection) {
	console.log("Nouvelle connexion de : " + connection.clientAddress + " (" + connection.id + ").");
	// On ajoute une callback pour gérer la déconnexion
	var connectionId = connection.id;
	connection.onClose(function() {
		console.log("Deconnexion de  : " + connectionId);
	});
});

// Pour faire le lien entre login et connection ----------------------
Accounts.validateLoginAttempt(function(info) {
	// Suivi des connexions des utilisateurs
	console.log("Tentative de login de " + (info.user && info.user._id) + " sur connexion " + info.connection.id);
	// On valide le login
	return true;
});

// Au login successfull ------------------------------------------------
Accounts.onLogin(function(info){
	console.log("Login OK de : " + (info.user && info.user._id) + " sur connexion " + info.connection.id)
});

// En cas d'erreur de loginl ------------------------------------------------
Accounts.onLoginFailure(function(info){
	console.log("Login NOK sur connexion " + info.connection.id);
});


/*
// Import de nouveaux registres
for (var index in addRegistres) {
	var registreEnCours = addRegistres[index];
	console.log("Registre période : " + registreEnCours.periode + ", résultat : " + Registres.insert(registreEnCours));
}
*/

/*
// Import de nouveaux cadastres
for (var index in chargementCadastres) {
	var cadastreEnCours = chargementCadastres[index];
	console.log(cadastreEnCours.titre + ", résultat : " + Docs.insert(cadastreEnCours));
}
*/

/*
// =================================================
// Modification des ref actes en array de docs
// =================================================
// Pour la naissance
var listePers = Pers.find({"naissance.acte":{$exists:true}}).fetch();
console.log("nombre de personne ayant une référence d'acte de naissance: " + listePers.length);
var nb = 0;
for (index in listePers) {
	var pers = listePers[index];
	if (pers.naissance) {
		var docRef = pers.naissance.acte;
		if (docRef) {
			if (Pers.update({ _id: pers._id },{$set: {"naissance.docs":[docRef]}}))	{
				nb += 1;
			}
			else console.log("Pas de mise à jour pour " + pers._id);
		}
		else console.log("Pas de référence d'acte pour " + pers._id);
	}
	else console.log("Pas d'acte de naissance pour " + pers._id);
}
console.log(nb + " références d'actes de naissance modifiés");

// Pour le décès
listePers = Pers.find({"deces.acte":{$exists:true}}).fetch();
console.log("nombre de personne ayant une référence d'acte de décès: " + listePers.length);
var nb = 0;
for (index in listePers) {
	var pers = listePers[index];
	if (pers.deces) {
		var docRef = pers.deces.acte;
		if (docRef) {
			if (Pers.update({ _id: pers._id },{$set: {"deces.docs":[docRef]}}))	{
				nb += 1;
			}
			else console.log("Pas de mise à jour pour " + pers._id);
		}
		else console.log("Pas de référence d'acte pour " + pers._id);
	}
	else console.log("Pas d'acte de deces pour " + pers._id);
}
console.log(nb + " références d'actes de décès modifiés");

// Pour les mariages
listePers = Pers.find({"mariages":{$exists:true}}).fetch();
console.log("nombre de personne ayant une référence d'acte de mariage: " + listePers.length);
var nb = 0;
var nbTotal = 0;
var nbDeleted = 0;
for (index in listePers) {
	var pers = listePers[index];
	if (pers.mariages) {
		var update = false;
		for (indexM in pers.mariages) {
			var mariage = pers.mariages[indexM];
			var docRef = mariage.acte;
			if (docRef) {
				var setIntruction = {$set:{}};
				setIntruction.$set["mariages." + indexM + ".docs"] = [docRef];
				if (Pers.update({ _id: pers._id },setIntruction))	{
					update = true;
					nbTotal +=1;
				}
				else console.log("Pas de mise à jour pour " + pers._id);
			}
			// On supprime l'ancienne référence vers l'acte
			var setIntruction = {$unset:{}};
			setIntruction.$unset["mariages." + indexM + ".acte"] = "";
			if (Pers.update({ _id: pers._id },setIntruction))	nbDeleted +=1;
		}	
		if (update) nb += 1;	
	}
	else console.log("Pas d'acte de mariage pour " + pers._id);
}
console.log(nb + " personnes dont références d'actes de mariages modifiés");
console.log(nbTotal + " références d'actes total de mariages modifiés");
console.log(nbDeleted + " références d'actes total de mariages supprimés");

// Supprimer tous les actes maintenant
console.log(Pers.update({"naissance.acte":{$exists:true}},   { $unset: { "naissance.acte": ""} },{multi:true}) + "ref actes naissance supprimés");
console.log(Pers.update({"deces.acte":{$exists:true}},   { $unset: { "deces.acte": ""} },{multi:true}) + "ref actes décès supprimés");
console.log(Pers.update({"mariages.$.acte":{$exists:true}},   { $unset: { "mariages.$.acte": ""} },{multi:true}) + "ref actes mariage supprimés");
*/


/*
// =================================================
// Suppression des dates républicaines rep1 et rep2
// =================================================
// Pour les personnes
console.log(Pers.update({"naissance.date.rep1":{$exists:true}},   { $unset: { "naissance.date.rep1": ""} },{multi:true}));
console.log(Pers.update({"naissance.date.rep2":{$exists:true}},   { $unset: { "naissance.date.rep2": ""} },{multi:true}));
console.log(Pers.update({"deces.date.rep1":{$exists:true}},   { $unset: { "deces.date.rep1": ""} },{multi:true}));
console.log(Pers.update({"deces.date.rep2":{$exists:true}},   { $unset: { "deces.date.rep2": ""} },{multi:true}));

// Pour les mariages, on supprime de la liste des mariages rep1 et rep2
var listePers = Pers.find({"mariages":{$exists:true}}).fetch();
var nb = 0;
for (index in listePers) {
	var pers = listePers[index];
	var mariages = JSON.parse(JSON.stringify(pers.mariages));
	for (index2 in mariages) {
		var mariageCourant = mariages[index2];
		if ( mariageCourant.date && ("rep1" in mariageCourant.date))		delete mariageCourant.date["rep1"];
		if ( mariageCourant.date && ("rep2" in mariageCourant.date))		delete mariageCourant.date["rep2"];
	}
	Pers.update({_id:pers._id},  { $set: { "mariages": mariages} });
	// On update les mariages pour la personne
	nb += 1;
}
console.log(nb + " mariages modifiés");

// Pour des docs
console.log(Docs.update({"date.rep1":{$exists:true}},   { $unset: { "date.rep1": ""} },{multi:true}));
console.log(Docs.update({"date.rep2":{$exists:true}},   { $unset: { "date.rep2": ""} },{multi:true}));

// Pour les points d'histoire
console.log(Hists.update({"date.rep1":{$exists:true}},   { $unset: { "date.rep1": ""} },{multi:true}));
console.log(Hists.update({"date.rep2":{$exists:true}},   { $unset: { "date.rep2": ""} },{multi:true}));

// =================================================
*/


/*
// Ajout des champs d'état de recherche actes et enfants pour les personnes
var listePers = Pers.find().fetch();
var nb = 0;
for (index in listePers) {
	var persCourant = listePers[index];
	Pers.update(persCourant._id,{$set: {etatRechActes:"INCOMPLET_A_COMPLETER"}});
	nb += 1;
}
console.log(nb + " personnes modifiées");
*/

/*
// Exemple de modification multiple
console.log("Nb de users modifiés : " + Meteor.users.update( {} , {$unset: { "profile.lastLogin" : "" } } , {multi: true}));
*/


// Impression de la variable d'environnement ----
console.log("ROOT_URL : " + Meteor.absoluteUrl());
console.log('Serveur démarré');
console.log('---------------------------------------------');




