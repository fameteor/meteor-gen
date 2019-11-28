// ==============================================
// CONFIGURATION GENERALE
// ==============================================
Router.configure({
	"loadingTemplate":   		'RouterLoading',
	"notFoundTemplate":  	'RouterNotfound',
	"layoutTemplate":    		'RouterLayoutApplication',
	"onBeforeAction": 		function() {
		// ======================================
		// AVANT APPLICATION DES REGLES DE ROUTAGE
		// ======================================
		// Si on n'est pas logué
		if (!Meteor.userId()) {
			this.render('RouterLogin');
		}
		else {
			// On vérifie les droits selon la route demandée
			var routeDemandee = this.route._path;
			// ==================================
			// COMPTE JUSTE CREE
			// ==================================
			if (Meteor.user().profile && Meteor.user().profile.accountJustCreated) {
				this.render('RouterHomeFirstLogin');
			}
			else {
				// ==============================
				// COMPTE EXISTANT : VERIFICATION DES DROITS D'ACCES
				// ==============================
				// On vérifie les droits d'accès
				// En dehors du path "/" et de ceux commencant par : "/pers/", "/lieu/", "/hist/", "/doc/", "/outils/", /"prefs/"
				// l'accès est interdit sauf à un ADMIN ou SUPERADMIN
				if ( 	routeDemandee === "/"
					|| routeDemandee.indexOf( "/pers/") === 0
					|| routeDemandee.indexOf( "/lieu/") === 0
					|| routeDemandee.indexOf( "/hist/") === 0
					|| routeDemandee.indexOf( "/doc/") === 0
					|| routeDemandee.indexOf( "/outils/") === 0
					|| routeDemandee.indexOf( "/prefs/") === 0
					|| routeDemandee.indexOf( "/aide/") === 0
				) {
					// ==========================
					// ACCES LIBRE A TOUS
					// ==========================
					
					// ======================
					// Popup affichage anniversaires
					// ======================
					// Si le dernier affichage des anniversaires ne date pas d'aujourd'hui, on affiche les anniversaires
					var now = new Date();
					var startOfTodayTS = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
					// On récupère la date du dernier affichage
					if (Meteor.user().profile && Meteor.user().profile.birthdaysDisplayLastDate) 	var birthdaysDisplayLastDate = Meteor.user().profile.birthdaysDisplayLastDate;
					else																			var birthdaysDisplayLastDate = 0;
					if ( birthdaysDisplayLastDate < startOfTodayTS ) {
						// On affiche la popup;
						Modal.show('OutilsAnniversairesModal',{backdrop: 'static',keyboard: false})
						// On modifie la donnée perso
					}
					
					// ======================
					// Affichage de la route
					// ======================
					// Si c'est une route concernant une personne, on calcule les sosas
					if (routeDemandee.indexOf( "/pers/") === 0) 	gf_calculerSosas();
					this.next();	
				}
				else {
					// ==========================
					// ACCES ADMIN UNIQUEMENT
					// ==========================
					if (Meteor.user().profile && (Meteor.user().profile.role === "SUPERADMIN" || Meteor.user().profile.role === "ADMIN")) {
						// Si c'est une route concernant une personne, on calcule les sosas
						if (routeDemandee.indexOf( "/pers/") === 0) 	gf_calculerSosas();
						this.next();
					}
					// ==========================
					// ACCES INTERDIT
					// ==========================
					else {
						this.render('RouterAccesInterdit');
					}
				}
			}
		}
	},
	"waitOn": function () {
		return [
			Meteor.subscribe("tousLesUtilisateurs"),
			Meteor.subscribe("tousLesLieux"),
			Meteor.subscribe("tousLesDocs"),
			Meteor.subscribe("toutesLesPers"),
			Meteor.subscribe("tousLesRegistres"),
			Meteor.subscribe("tousLesBugs"),
			Meteor.subscribe("tousLesHists"),
			Meteor.subscribe("toutesLesProfs"),
			Meteor.subscribe("tousLesLiens"),
			Meteor.subscribe("tousLesActesArchives"),
			Meteor.subscribe("tousLesCoupleEvents"),
			Meteor.subscribe("tousLesTags"),
		]
	}
});



// ??????????????????????????????????????
// A gérer si pas de données
// mais le code ci-dessous ne fonctionne pas :
// Router.plugin('dataNotFound', {notFoundTemplate: 'RouterNotfound'});
Router.plugin('dataNotFound', {
	notFoundTemplate: 'RouterDataNotfound',
	// except: ['home']
	// only: ['pers.infos', 'lieu.infos', 'hist.infos', 'doc.infos']
});
// ??????????????????????????????????????


// ==============================================
// ROUTES
// ==============================================
Router.route('/', function () {
	// Si c'est le premier login, on force vers la page d'identification de l'utilisateur
	if (Meteor.user().profile.accountJustCreated) 	this.render('RouterHomeFirstLogin');
	// Sinon, on affiche la page d'accueil normale
	else 									this.render('RouterHome');
});


// Routes "Chercher"
// ==============================================
Router.route('/hist/chercher',  function () {
	// On appelle le layout
	this.layout('RouterLayoutChercher');
	// On remplit le layout
	this.render('LibIcone', {to: 'icone',data:'iconeHist'});
	this.render('HistVisites', {to: 'visitedObjects'});
	this.render('HistChercher');
});
Router.route('/doc/chercher',  function () {
	// On appelle le layout
	this.layout('RouterLayoutChercher');
	// On remplit le layout
	this.render('LibIcone', {to: 'icone',data:'iconeDoc'});
	this.render('DocVisites', {to: 'visitedObjects'});
	this.render('DocChercher');
});

// Routes "Ajouter"
// ==============================================
Router.route('/lieu/ajouter',  function () {
	// On appelle le layout
	this.layout('RouterLayoutAjouter');
	// On remplit le layout
	this.render('LibIcone', {to: 'icone',data:'iconeLieu'});
	this.render('LieuAjouter');
});
Router.route('/hist/ajouter',  function () {
	// On appelle le layout
	this.layout('RouterLayoutAjouter');
	// On remplit le layout
	this.render('LibIcone', {to: 'icone',data:'iconeHist'});
	this.render('HistAjouter');
});
Router.route('/doc/ajouter',  function () {
	// On appelle le layout
	this.layout('RouterLayoutAjouter');
	// On remplit le layout
	this.render('LibIcone', {to: 'icone',data:'iconeDoc'});
	this.render('DocAjouter');
});

// ???????????????????????????????
// A modifier pour utiliser même layout
// ???????????????????????????????
Router.route('/registre/ajouter'); 	// Route vers template RegistreAjouter
Router.route('/registre/indexer'); 
Router.route('/registre/ordonner'); 
Router.route('/lien/ajouter'); 	// Route vers template LienAjouter

// Routes "Modifier"
// ==============================================
Router.route('/pers/modifier/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Pers.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconePers'});
		this.render('PersModifier', {
			data: function () {
				return Pers.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/lieu/modifier/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Lieux.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconeLieu'});
		this.render('LieuModifier', {
			data: function () {
				return Lieux.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/hist/modifier/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Hists.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconeHist'});
		this.render('HistModifier', {
			data: function () {
				return Hists.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/doc/modifier/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Docs.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconeDoc'});
		this.render('DocModifier', {
			data: function () {
				return Docs.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/lien/modifier/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Liens.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconeDoc'});
		this.render('LienModifier', {
			data: function () {
				return Liens.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});

// ???????????????????????????????
// A modifier pour utiliser même layout
// ???????????????????????????????

Router.route('/registre/modifier/:id', function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Registres.findOne({_id: this.params.id})) {
		this.render('RegistreModifier', {
			data: function () {
				return Registres.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});

// Routes "ModifierLatLng"
// ==============================================
Router.route('/lieu/modifierLatLng/:id', function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Lieux.findOne({_id: this.params.id})) {
		// On appelle le template
		this.render('LieuModifierLatLng', {
			data: function () {
				return Lieux.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}	
});

// Routes "infos"
// ==============================================
Router.route('/pers/infos/:id', function () {
	// ?????????????????????????????????????
	// Utilisation des anciens identifiants comme référence (à supprimer quand les champs textXML seront migrés)
	if ( this.params.id.length == 9) 	var pers = Pers.findOne({id: this.params.id});
	// ?????????????????????????????????????
	else 							var pers = Pers.findOne({_id: this.params.id});
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	// On affiche le template
	if (pers) {
		// On ajoute à la liste des personne visitées
		gf_addVisitedObject("PERS",this.params.id);
		// On affiche le template
		this.render('PersInfos', {
			data: function () {return pers;}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/lieu/infos/:id', function () {
	// ?????????????????????????????????????
	// Utilisation des anciens identifiants comme référence (à supprimer quand les champs textXML seront migrés)
	if ( this.params.id.length == 9) 	var lieu = Lieux.findOne({id: this.params.id});
	// ?????????????????????????????????????
	else 							var lieu = Lieux.findOne({_id: this.params.id});
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (lieu) {
		// On ajoute à la liste des personne visitées
		gf_addVisitedObject("LIEU",this.params.id);
		// On affiche le template
		this.render('LieuInfos', {
			data: function () {return lieu;}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});
Router.route('/hist/infos/:id', function () {
	// ?????????????????????????????????????
	// Utilisation des anciens identifiants comme référence (à supprimer quand les champs textXML seront migrés)
	if ( this.params.id.length == 9) 	var hist = Hists.findOne({id: this.params.id});
	// ?????????????????????????????????????
	else 							var hist = Hists.findOne({_id: this.params.id});
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (hist) {
		// On ajoute à la liste des personne visitées
		gf_addVisitedObject("HIST",this.params.id);
		// On affiche le template
		this.render('HistInfos', {
			data: function () {return hist;}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});


Router.route('/doc/infos/:id', function () {
	// ?????????????????????????????????????
	// Utilisation des anciens identifiants comme référence (à supprimer quand les champs textXML seront migrés)
	if ( this.params.id.length == 9) 	var doc = Docs.findOne({id: this.params.id});
	// ?????????????????????????????????????
	else 							var doc = Docs.findOne({_id: this.params.id});
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	
	
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (doc) {
		// On ajoute à la liste des personne visitées
		gf_addVisitedObject("DOC",this.params.id);
		// On affiche le template
		this.render('DocInfos', {
			data: function () {return doc;}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});

// On routes les infos pour les liens vers modifier
Router.route('/lien/infos/:id',  function () {
	// Si il y a des données            ??? A remplacer par la fonction de Iron Router ???
	if (Liens.findOne({_id: this.params.id})) {
		// On appelle le layout
		this.layout('RouterLayoutModifier');
		// On remplit le layout
		this.render('LibIcone', {to: 'icone',data:'iconeDoc'});
		this.render('LienModifier', {
			data: function () {
				return Liens.findOne({_id: this.params.id});
			}
		});
	}
	else {
		this.render('RouterDataNotfound');
	}
});

// Routes "pers/decouperPhoto"
// ==============================================
Router.route('/pers/decouperPhoto/:id', function () {
	// On recherche les documents sur cette personne
	// 1) On renvoie la liste des docs pointant vers cette personne
	var listeLiens = Liens.find({"pour.type":"DOC","vers.type":"PERS","vers.id": this.params.id}).fetch();
	// 2) On fait un array des ids des docs contenant par ces liens (un doc peut apparaitre plusieurs fois)
	var listeDocsAvecRedondance = 	_.map(
		listeLiens,
		function (value) {
			return value.pour.id;
		}
	);
	// 3) On recherche tous les docs classés par ordre chronologique contenu au moins une fois dans la liste des docs
	var listeDocs = Docs.find({_id:{$in:listeDocsAvecRedondance}},{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]});
	// On crée le contexte
	var contexte = {
		'id' : this.params.id,
		'listeDocs': listeDocs			
	}
	// On affiche le template
	this.render('PersDecouperPhoto', {
		data: function () {return contexte;}
	});
});

// Routes "Outils"
// ==============================================
Router.route('/outils/anniversairesMain');			// Route vers template OutilsAnniversaires
Router.route('/outils/calendrierRepublicain');		// Route vers template OutilsCalendrierRepublicain
Router.route('/outils/faitsMarquants');
Router.route('/outils/gestionDesNoms');

// Routes "Prefs"
// ==============================================
Router.route('/prefs/arbreDescCouleurs');		// Route vers template PrefsArbreDescCouleurs
Router.route('/prefs/changerSosasRef');		// Route vers template PrefsChangerSosasRef


// Routes "Liste"
// ==============================================
Router.route('/lieu/listetout', function () {
	this.render('LieuListetout', {
		data: function () {
			return Lieux.find({},{sort: {nom: 1}});
		}
	});
});

Router.route('/hist/listetout', function () {
	this.render('HistListetout', {
		data: function () {
			return Hists.find({},{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]});
		}
	});
});

Router.route('/doc/listetout', function () {
	this.render('DocListetout', {
		data: function () {
			return Docs.find({},{sort: {type: 1}});
		}
	});
});

Router.route('/registre/listetout', function () {
	this.render('RegistreListetout', {
		data: function () {
			// On classe par commune, puis par ordre dans la commune
			return Registres.find({},{sort: [["commune","asc"],["ordreParCommune","asc"]]});
		}
	});
});

Router.route('/lien/listetout', function () {
	this.render('LienListetout', {
		data: function () {
			// On classe par Objet ayant le lien, puis par type de zones
			return Liens.find({},{sort: [["pour.id","asc"],["zone","asc"]]});
		}
	});
});

Router.route('/prof/listetout', function () {
	this.render('ProfListetout', {
		data: function () {
			return Profs.find({},{sort:{M:1,F:1}})
		}
	});
});

// Route ADMIN
// ==============================================
Router.route('/admin/bugs', function () {
	this.render('AdminBugs', {
		data: function () {
			// Tri par bug non résolus d'abord puis par priorité décroissante des bugs
			return Bugs.find({},{sort: {estResolu : 1, criticite: -1}});
		}
	});
});


// Routes DocModifierDir
// ==============================================


// Routes Tags
// ==============================================
Router.route('/tag/management');
Router.route('/tag/infos/:id', function () {
	var tag = Tags.findOne({_id: this.params.id});
	// On affiche le template
	if (tag) {
		// On affiche le template
		this.render('TagInfos', {data: {tag:tag}});
	}
	else {
		this.render('RouterDataNotfound');
	}
});

// Routes AIDE
// ==============================================

Router.route('/aide/nouvelUtilisateur'); 		

// Routes ADMIN
// ==============================================
Router.route('/admin/docprog/metier');
Router.route('/admin/docprog/routage');
Router.route('/admin/docprog/codage');
Router.route('/admin/docprog/install');
Router.route('/admin/docprog/templates');

Router.route('/admin/docprog/templatesAuto/:templateName', function () {
	// On affiche le template
	this.render('AdminDocprogTemplatesAuto', {
		data: function () {return this.params.templateName;}
	});
});

Router.route('/admin/bugs/ajouter');
Router.route('/admin/docprog/texteXml');
Router.route('/admin/docprog/decoupeDocImage');
Router.route('/admin/docprog/popups');
Router.route('/admin/docprog/paginationListe');
Router.route('/admin/docprog/pointersCheck');
Router.route('/admin/docprog/calRep');
Router.route('/admin/docprog/dates');
Router.route('/admin/docprog/svgToPngDownload');
Router.route('/admin/modifierUrlDoc'); 
Router.route('/admin/dataCheck');
Router.route('/admin/schemaCheck'); 
Router.route('/admin/dump');

Router.route('/admin/users', function () {
	this.render('AdminUsers', {
		data: function () {
			// On renvoie tous les utilisateurs
			return Meteor.users.find({},{sort: {createdAt: 1}});
		}
	});
});

// Pour l'IHM de création de compte utilisateurs
// Appel avec paramètre
Router.route('/admin/usersCreate/:id', function () {
	this.render('AdminUsersCreate', {
		data: function () {
			var pers = Pers.findOne({_id:this.params.id});
			return pers;
		}
	});
});

// ==============================================
// Template d'affichage des schémas
Router.route('/admin/docprog/schema/main');
Router.route('/admin/docprog/schema/brut/:nom', function () {
	this.render('AdminDocprogSchemaBrut', {
		data: function () {
			return {"name":this.params.nom};
		}
	});
});
Router.route('/admin/docprog/schema/detail/:nom', function () {
	this.render('AdminDocprogSchemaDetail', {
		data: function () {
			return {"name":this.params.nom};
		}
	});
});

