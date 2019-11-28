// ==============================================
// Id de l'administrateur de l'application
// ==============================================
idAdministrateurAppli = "a24Ac3s3sZEAedQmP";


// ==============================================
// Paramètres Client non paramétrable par l'utilisateur
// ==============================================
clientParms = {
	// ==========================================
	// Timer for text input triggering data searches
	'inputTimerValue' : 500,
	
	// ==========================================
	// Liste des icones
	'iconsList': {
		// Icone "Modifier"
		"iconeModifier" : {"name":"glyphicon glyphicon-pencil","type":"BOOTSTRAP",},
		// Icone "Supprimer"
		"iconeSupprimer" : {"name":"glyphicon glyphicon-remove","type":"BOOTSTRAP",},
		// Icone "Préférences"
		"iconePreferences" : {"name":"glyphicon glyphicon-cog","type":"BOOTSTRAP",},
		// Icone "Ajouter"
		"iconeAjouter" : {"name":"glyphicon glyphicon-plus","type":"BOOTSTRAP",},
		// Icone "Chercher"
		"iconeChercher" : {"name":"glyphicon glyphicon-search","type":"BOOTSTRAP",},
		// Icone "Outils"
		"iconeOutils" : {"name":"glyphicon glyphicon-wrench","type":"BOOTSTRAP",},
		// Icone "Admin"
		"iconeAdmin" : {"name":"glyphicon glyphicon-star","type":"BOOTSTRAP",},
		// Icone "Pers"
		"iconePers" : {"name":"glyphicon glyphicon-user","type":"BOOTSTRAP",},
		// Icone "Lieu"
		"iconeLieu" : {"name":"glyphicon glyphicon-globe","type":"BOOTSTRAP",},
		// Icone "Hist"
		"iconeHist" : {"name":"glyphicon glyphicon-bookmark","type":"BOOTSTRAP",},
		// Icone "Doc"
		"iconeDoc" : {"name":"glyphicon glyphicon-file","type":"BOOTSTRAP",},
		// Icone "Lien"
		"iconeLien" : {"name":"fa fa-paperclip","type":"FONTAWESOME",},
		// Icone "Registre"
		"iconeRegistre" : {"name":"fa fa-book","type":"FONTAWESOME",},
		// Icone "Sosa"
		"iconeSosa" : {"name":"glyphicon glyphicon-leaf","type":"BOOTSTRAP",},
		// Icone "Précédant" (navigation)
		"iconePrecedent" : {"name":"glyphicon glyphicon-chevron-left","type":"BOOTSTRAP",},
		// Icone "Suivant" (navigation)
		"iconeSuivant" : {"name":"glyphicon glyphicon-chevron-right","type":"BOOTSTRAP",},
		// Icone "copie ID"
		"iconeCopierId" : {"name":"fa fa-paperclip","type":"FONTAWESOME",},
		// Icone "sexeM"
		"iconeSexeM" : {"name":"fa fa-mars","type":"FONTAWESOME",},
		// Icone "sexeF"
		"iconeSexeF" : {"name":"fa fa-venus","type":"FONTAWESOME",},
		// Icone "sexeInconnu"
		"sexeInconnu" : {"name":"fa fa-venus-mars","type":"FONTAWESOME",},
		// Icone "previous"
		"previous" : {"name":"fa fa-backward","type":"FONTAWESOME",},
		// Icone "next"
		"next" : {"name":"fa fa-forward","type":"FONTAWESOME",},
		// Icone "first"
		"first" : {"name":"fa fa-fast-backward","type":"FONTAWESOME",},
		// Icone "last"
		"last" : {"name":"fa fa-fast-forward","type":"FONTAWESOME",},
		// Icone "info"
		"info" : {"name":"fa fa-info-circle","type":"FONTAWESOME",},
		// Icone "warning"
		"warning" : {"name":"fa fa-warning","type":"FONTAWESOME",},
		// Icone "right"
		"right" : {"name":"fa fa-hand-o-right","type":"FONTAWESOME",},
		// Icone "left"
		"left" : {"name":"fa fa-hand-o-left","type":"FONTAWESOME",},
		// Icone "up"
		"up" : {"name":"fa fa-hand-o-up","type":"FONTAWESOME",},
		// Icone "down"
		"down" : {"name":"fa fa-hand-o-down","type":"FONTAWESOME",},
		// Pour la reconaissance vocale
		"audioTranscript": {"name":"fa fa-microphone","type":"FONTAWESOME",},
		"stopAudioTranscript": {"name":"fa fa-microphone-slash","type":"FONTAWESOME",},
		// Icone "com"
		"com" : {"name":"glyphicon glyphicon-flash","type":"BOOTSTRAP"},
		// Icone "chat"
		"chat" : {"name":"fa fa-comments","type":"FONTAWESOME",},
		// Icone "phone"
		"phone" : {"name":"fa fa-phone","type":"FONTAWESOME",},
		// Icone "visio"
		"visio" : {"name":"fa fa-video-camera","type":"FONTAWESOME",},
		// Icone "hangup"
		"hangup" : {"name":"glyphicon glyphicon-phone-alt","type":"BOOTSTRAP",},
		// Icone "flag"
		"flag" : {"name":"glyphicon glyphicon glyphicon-flag","type":"BOOTSTRAP",},
		// Icone "geoLocalised"
		"geoLocalised" : {"name":"glyphicon glyphicon glyphicon-star-empty","type":"BOOTSTRAP",},
		// Icone "Tag"
		"iconeTag" : {"name":"glyphicon glyphicon-star","type":"BOOTSTRAP",},
	}
}


// ?????????????????????????????????????????????????????????????
// A supprimer et verser dans clientParms
// ?????????????????????????????????????????????????????????????
// ==============================================
// PARAMETRES
// ==============================================
parametresClient = {
	mois : {
		1:"janvier",
		2:"février",			
		3:"mars",
		4:"avril",
		5:"mai",
		6:"juin",
		7:"juillet",
		8:"août",
		9:"septembre",
		10:"octobre",
		11:"novembre",
		12:"décembre"
	},
	moisCourts : {
		1:"janv",
		2:"fév",			
		3:"mars",
		4:"avr",
		5:"mai",
		6:"juin",
		7:"juil",
		8:"août",
		9:"sept",
		10:"oct",
		11:"nov",
		12:"déc"
	},
	// Affichage du genre
	genreLieu : {
		"MS":	"le ",
		"FS":		"la ",
		"PL":		"les ",
		"ES":	"l'",
		"SS":	""
	},
	// Affichage du genre
	de_genreLieu : {
		"MS":	"du ",
		"FS":		"de la ",
		"PL":		"des ",
		"ES":	"de l'",
		"SS":	"de "
	},
	// Affichage du genre
	a_genreLieu : {
		"MS":	"au ",
		"FS":		"à la ",
		"PL":		"aux ",
		"ES":	"à l'",
		"SS":	"à "
	},
	// Affichage de la nature du lieu
	natureLieu : {
		"CONTINENT":		"continent",
		"PAYS":				"pays",
		"DEPARTEMENT":		"département",
		"ARRONDISSEMENT":	"arrondissement",
		"CANTON":			"canton",
		"COMMUNE":			"commune",
		"LIEUDIT":			"lieu-dit",
		"MAISON":			"maison",
		"MOULIN":			"moulin",
		"PONT":				"pont",
		"CHATEAU":			"château",
		"ABBAYE":			"abbaye",
		"OCEAN":			"océan",
		"ZONEMARITIME":		"zone maritime",
		"ILE":				"île",
		"MER":				"mer",
		"ECUEIL":			"écueil",
		"TERRE":			"planète",
		"REGIONE_IT":		"région (it.)",
		"PROVINCIA_IT":		"province (it.)"
	},
	// icones documents par défaut
	iconesDocParDefaut:{
		"ACTE":"acte.png",
		"VIDEO":"video.gif",
		"PDF":"pdf.png"
	},
	// Codage standard par type de documents
	codageSelonTypeDoc: {
		"ACTE": 		"ACTE",
		"NOTAIRE": 		"IMAGE",
		"MILITAIRE": 	"IMAGE",
		"COMMUNAL": 	"IMAGE",
		"JUSTICE": 		"IMAGE",
		"PHOTO": 		"IMAGE",
		"VIDEO": 		"VIDEO",
		"CARTE_POSTALE":"IMAGE",
		"CARTE": 		"CARTE",
		"CADASTRE": 	"GEO_REF",
		"COURRIER": 	"IMAGE",
		"JOURNAL": 		"IMAGE",
		"LIVRE": 		"PDF",
		"PAPIER": 		"IMAGE",
		"OBJET": 		"IMAGE",
		"AUTRE": 		"IMAGE"
	}
};