// ==============================================
// Pour générer les listes d'options (avec un intitulé générique en option)
// ==============================================
parametreCommuns = {
	// Types d'objets possibles pour les liens
	"typesObjetsGen":[
		{valeur : "PERS", 	intitule : {"FR":"personne"}},
		{valeur : "LIEU",	intitule : {"FR":"lieu"}},
		{valeur : "HIST",	intitule : {"FR":"pt d'histoire"}},
		{valeur : "DOC", 	intitule : {"FR":"document"}}
	],
	// Types de zones possibles pour les liens
	"typesZonesLien":[
		{valeur : "ALL", 	intitule : {"FR":"pas de zone spécifiée, tout"}},
		{valeur : "CIRCLE",	intitule : {"FR":"cercle"}},
		{valeur : "RECT",	intitule : {"FR":"rectangle"}},
		{valeur : "POINT",	intitule : {"FR":"point"}},
		{valeur : "LAT_LNG",	intitule : {"FR":"lattitude-longitude"}},
		{valeur : "RECORDING", 	intitule : {"FR":"extrait audio ou vidéo"}},
		{valeur : "PDF", 	intitule : {"FR":"zone sur un PDF"}}
	],
	// Types de lieux ------------------------------------------------------
	"typesLieux":[
		{valeur : "LIEUDIT", 			intitule : {"FR":"un lieu-dit"}},
		{valeur : "COMMUNE",		intitule : {"FR":"une commune"}},
		{valeur : "DEPARTEMENT",		intitule : {"FR":"un département"}},
		{valeur : "PAYS",			intitule : {"FR":"un pays"}},
		{valeur : "CONTINENT",		intitule : {"FR":"un continent"}},
		{valeur : "MAISON", 			intitule : {"FR":"un maison"}},
		{valeur : "MOULIN", 			intitule : {"FR":"un moulin"}},
		{valeur : "PONT", 			intitule : {"FR":"un pont"}},
		{valeur : "CHATEAU", 		intitule : {"FR":"un château"}},
		{valeur : "ABBAYE", 			intitule : {"FR":"un abbaye"}},
		{valeur : "ECUEIL",			intitule : {"FR":"un écueil"}},
		{valeur : "ILE", 				intitule : {"FR":"une île"}},
		{valeur : "ZONEMARITIME", 	intitule : {"FR":"une zone maritime"}},
		{valeur : "MER", 			intitule : {"FR":"une mer"}},
		{valeur : "OCEAN",			intitule : {"FR":"un océan"}},
		{valeur : "TERRE",			intitule : {"FR":"la Terre"}},
		{valeur : "REGIONE_IT",		intitule : {"FR":"une région (it.)"}},
		{valeur : "PROVINCIA_IT",		intitule : {"FR":"une province (it.)"}}
	],
	
	// Sur-lieu normal d'un lieu -------------------------------------------
	"surlieuNormal": {
		"LIEUDIT":			"COMMUNE",
		"COMMUNE":			"DEPARTEMENT",
		"DEPARTEMENT":		"PAYS",
		"PAYS":				"CONTINENT",
		"CONTINENT":		"TERRE",
		"MAISON":			"LIEUDIT",
		"MOULIN":			"LIEUDIT",
		"PONT":				"LIEUDIT",
		"CHATEAU":			"LIEUDIT",
		"ABBAYE":			"LIEUDIT",
		"ECUEIL":			"ZONEMARITIME",
		"ILE":				"ZONEMARITIME",
		"ZONEMARITIME":		"TERRE",
		"MER":				"TERRE",
		"OCEAN":			"TERRE",
		"TERRE":			null,
	},		
	// Types de dates ------------------------------------------------------
	"typesDates":[
		{valeur : "LE",				intitule : {"FR":"Le"}},
		{valeur : "VERS",			intitule : {"FR":"Vers"}},
		{valeur : "AVANT",			intitule : {"FR":"Avant"}},
		{valeur : "APRES",			intitule : {"FR":"Après"}},
		{valeur : "ENTRE",			intitule : {"FR":"Entre"}}
	],
		
	// Types de registres --------------------------------------------------
	"typesRegistres":[
		{valeur : "Registres Paroissiaux, collection communale",		intitule : {"FR":"Registres Paroissiaux, collection communale"}},
		{valeur : "Registres Paroissiaux, collection départementale",		intitule : {"FR":"Registres Paroissiaux, collection départementale"}},
		{valeur : "Registres Paroissiaux",						intitule : {"FR":"Registres Paroissiaux"}},
		{valeur : "Actes de catholicité",							intitule : {"FR":"Actes de catholicité"}},
		{valeur : "Etat civil",									intitule : {"FR":"Etat civil"}},
		{valeur : "Tables",									intitule : {"FR":"Tables"}}
	],
		
	// Types de docs -------------------------------------------------------
	"typesDocs":[
		{valeur : "ACTE",			intitule : {"FR":"un acte d'état civil ou religieux"}},
		{valeur : "NOTAIRE",		intitule : {"FR":"un acte notarial"}},
		{valeur : "MILITAIRE",		intitule : {"FR":"un document militaire"}},
		{valeur : "COMMUNAL",		intitule : {"FR":"un document communal"}},
		{valeur : "JUSTICE",		intitule : {"FR":"un acte de justice"}},
		{valeur : "PHOTO",			intitule : {"FR":"une photo"}},
		{valeur : "VIDEO",			intitule : {"FR":"une vidéo"}},
		{valeur : "CARTE_POSTALE",	intitule : {"FR":"une carte postale"}},
		{valeur : "CARTE",			intitule : {"FR":"une carte géographique"}},
		{valeur : "CADASTRE",		intitule : {"FR":"une carte cadastrale"}},
		{valeur : "COURRIER",		intitule : {"FR":"un courrier"}},
		{valeur : "JOURNAL",		intitule : {"FR":"un journal"}},
		{valeur : "LIVRE",			intitule : {"FR":"un livre"}},
		{valeur : "PAPIER",			intitule : {"FR":"un papier autre"}},
		{valeur : "OBJET",			intitule : {"FR":"un objet"}},
		{valeur : "AUTRE",			intitule : {"FR":"autre chose"}}
	],
		
	// Codages de docs ----------------------------------------------------
	// Le codage correspond au viewer utilisé
	"codagesDocs":[
		{valeur : "IMAGE",			intitule : {"FR":"codage image"}},
		{valeur : "CARTE",			intitule : {"FR":"codage carte"}},
		{valeur : "GEO_REF",		intitule : {"FR":"codage image géo-référencée"}},
		{valeur : "ACTE",			intitule : {"FR":"codage acte"}},
		{valeur : "VIDEO",			intitule : {"FR":"codage vidéo"}},
		{valeur : "GROUPE",			intitule : {"FR":"codage groupe"}},
		{valeur : "TEXTE_XML",		intitule : {"FR":"codage texte XML"}},
		{valeur : "PDF",				intitule : {"FR":"codage pdf"}},
		{valeur : "DOC",			intitule : {"FR":"codage Word"}}
	],
		
	// Affichage de la nature de l'acte
	"typeActe" : [
		{valeur : "NAISSANCE", 		intitule : {"FR":"Acte de naissance"}},
		{valeur : "NAIS-DEC", 		intitule : {"FR":"Acte de naissance et décès"}},
		{valeur : "BAPTEME",		intitule : {"FR":"Acte de baptême"}},
		{valeur : "BAPT-SEP",		intitule : {"FR":"Acte de baptême et de sépulture"}},
		{valeur : "MARIAGE", 		intitule : {"FR":"Acte de mariage"}},
		{valeur : "PROMESSE", 		intitule : {"FR":"Acte de promesse de mariage"}},
		{valeur : "DECES",			intitule : {"FR":"Acte de décès"}},
		{valeur : "DEC-NAIS",		intitule : {"FR":"Acte de décès et de naissance"}},
		{valeur : "SEPULTURE", 		intitule : {"FR":"Acte de sépulture"}},
		{valeur : "SEP-BAPT", 		intitule : {"FR":"Acte de sépulture et de baptême"}},
		{valeur : "DIVORCE", 		intitule : {"FR":"Acte de divorce"}},
		{valeur : "PACS", 			intitule : {"FR":"Acte de PACS"}},
		{valeur : "AUTRE",			intitule : {"FR":"Autre acte"}}
	],
	
	// Affichage de la nature de l'évènement conugal
	"coupleEventType" : [
		{valeur : "MARIAGE", 		intitule : {"FR":"mariage"}},
		{valeur : "DIVORCE", 		intitule : {"FR":"divorce"}},
		{valeur : "UNION-LIBRE", 	intitule : {"FR":"union libre"}},
		{valeur : "PACS", 			intitule : {"FR":"PACS"}},
	],
		
	// Mode de l'image
	"modeIMAGE" : [
		{valeur : "IMAGE", 		intitule : {"FR":"image par image"}},
		{valeur : "LIVRE", 		intitule : {"FR":"livre"}}
	],
		
	// Genre du lieu -------------------------------------------------------
	"genresLieux":[
		{valeur : "MS",				intitule : {"FR":"le"}},
		{valeur : "FS",				intitule : {"FR":"la"}},
		{valeur : "PL",				intitule : {"FR":"les"}},
		{valeur : "ES",				intitule : {"FR":"l'"}},
		{valeur : "SS",				intitule : {"FR":"-"}}
	],
		
	// Zones de points d'histoire ----------------------------------------
	"zonesHist":[
		{valeur : "HIST_MONDE",	intitule : {"FR":"monde"}},
		{valeur : "HIST_EUROPE",	intitule : {"FR":"Europe"}},
		{valeur : "HIST_FRANCE",	intitule : {"FR":"France"}},
		{valeur : "HIST_POITOU",	intitule : {"FR":"Poitou"}},
		{valeur : "HIST_VENDEE",	intitule : {"FR":"Vendée"}},
		{valeur : "HIST_MARAIS",	intitule : {"FR":"marais"}},
		{valeur : "HIST_COMMUNE",	intitule : {"FR":"paroisse, commune"}}
	],
	
	// Types d'objets concernés par les tags -----------------------------
	"objTypesForTags":[
		{valeur : "PERS",	intitule : {"FR":"personnes"}},
		{valeur : "LIEU",	intitule : {"FR":"lieux"}},
		{valeur : "DOC",	intitule : {"FR":"documents"}},
		{valeur : "HIST",	intitule : {"FR":"points d'histoire"}}
	],
	
	// Scopes de points d'histoire ----------------------------------------
	"scopesHist":[
		{valeur : "NATIONAL",	intitule : {"FR":"national"}},
		{valeur : "REGIONAL",	intitule : {"FR":"régional"}},
		{valeur : "LOCAL",		intitule : {"FR":"local"}}
	],

	// Thèmes de points d'histoire --------------------------------------
	"themesHist":[
		{valeur : "HIST_GUERRES",			intitule : {"FR":"guerres"}},
		{valeur : "HIST_EPIDEMIES",			intitule : {"FR":"épidémies"}},
		{valeur : "HIST_NATURE",			intitule : {"FR":"phénomènes naturels"}},
		{valeur : "HIST_ADMINISTRATIF",		intitule : {"FR":"administration"}},
		{valeur : "HIST_ECONOMIE",			intitule : {"FR":"économie, artisanat"}},
		{valeur : "HIST_INDUSTRIE",			intitule : {"FR":"industrie"}},
		{valeur : "HIST_TRANSPORTS",		intitule : {"FR":"transports"}},
		{valeur : "HIST_ELEVAGE",			intitule : {"FR":"élevage"}},
		{valeur : "HIST_POLITIQUE",			intitule : {"FR":"politique"}},
		{valeur : "HIST_CULTURE",			intitule : {"FR":"culture"}},
		{valeur : "HIST_RELIGION",			intitule : {"FR":"religion"}},
		{valeur : "HIST_TECHNIQUE",			intitule : {"FR":"découvertes, techniques"}},
		{valeur : "HIST_NOTABLES",			intitule : {"FR":"notables, personnes célèbres"}},
		{valeur : "HIST_AUTRES",			intitule : {"FR":"autre thème, à classer"}}
	],
		
	// Sexes ----------------------------------------------------------------
	"sexes":[
		{valeur : "M",				intitule : {"FR":"homme"}},
		{valeur : "F",				intitule : {"FR":"femme"}},
		{valeur : "NONCONNU",		intitule : {"FR":"inconnu"}}
	],
	
	// TexteXml -------------------------------------------------------------
	"texteXmlStatus":[
		{valeur : "VIVANT",		intitule : {"FR":"vivant(e)"}},
		{valeur : "DECEDE",		intitule : {"FR":"décédé(e)"}},
		{valeur : "INCONNU",	intitule : {"FR":"status inconnu"}},
	],
	
	"texteXmlRole":[
		{valeur : "ENFANT",		intitule : {"FR":"enfant"}},
		{valeur : "PERE",		intitule : {"FR":"père"}},
		{valeur : "MERE",		intitule : {"FR":"mère"}},
		{valeur : "PARRAIN",	intitule : {"FR":"parrain"}},
		{valeur : "MARRAINE",	intitule : {"FR":"marraine"}},
		{valeur : "TEMOIN",		intitule : {"FR":"témoin"}},
		{valeur : "PEREMARI",	intitule : {"FR":"père du marié"}},
		{valeur : "MEREMARI",	intitule : {"FR":"mère du marié"}},
		{valeur : "PEREFEMME",	intitule : {"FR":"père de la mariée"}},
		{valeur : "MEREFEMME",	intitule : {"FR":"mère de la mariée"}},
		{valeur : "OFFICIANT",	intitule : {"FR":"officiant"}},
		{valeur : "MORT",		intitule : {"FR":"mort"}},
		{valeur : "CONJOINT",	intitule : {"FR":"conjoint"}},
		{valeur : "AUTRE",		intitule : {"FR":"autre"}},
	],
	
	"texteXmlSigne":[
		{valeur : "BIEN",		intitule : {"FR":"signe bien"}},
		{valeur : "MAL",		intitule : {"FR":"signe mal"}},
		{valeur : "NON",		intitule : {"FR":"ne sait pas signer"}},
		{valeur : "NONPRECISE",	intitule : {"FR":"non précisé"}},
		{valeur : "N/A",		intitule : {"FR":"non applicable"}},
	],
	

	// Criticité des bugs --------------------------------------------------
	// Traduction en texte et en couleurs Bootstrap
	"criticiteBugs":[
		{valeur : 0,				intitule : {"FR":"faible"},	bootstrapClass:"text-success"},
		{valeur : 1,				intitule : {"FR":"moyen"},	bootstrapClass:"text-info"},
		{valeur : 2,				intitule : {"FR":"fort"},	bootstrapClass:"text-warning"},
		{valeur : 3,				intitule : {"FR":"critique"},	bootstrapClass:"text-danger"}
	],
	
	// Type Etat de la recherche des actes
	"typeEtatRechActes":[
		{valeur : "INCOMPLET_A_COMPLETER",	intitule : {"FR":"incomplets, recherche à effectuer"}},
		{valeur : "INCOMPLET_RECH_FINIE",	intitule : {"FR":"incomplets, mais recherche finie"}},
		{valeur : "COMPLET_A_VERIFIER",		intitule : {"FR":"complets mais à vérifier"}},
		{valeur : "COMPLET_VERIFIE",		intitule : {"FR":"complets et vérifiés"}},
	],
	
	// Type Etat de la recherche des actes
	"typeEtatRechEnfants":[
		{valeur : "INCOMPLET_A_COMPLETER",	intitule : {"FR":"prob. incomplets, recherche à effectuer"}},
		{valeur : "INCOMPLET_RECH_FINIE",	intitule : {"FR":"prob. incomplets, recherche finie"}},
		{valeur : "COMPLET_VERIFIE",		intitule : {"FR":"prob. complets"}},
	],
	
	// Type bugs et améliorations
	
	"typeBugs":[
		{valeur : "BUG",			intitule : {"FR":"Bug"}},
		{valeur : "AMELIORATION",	intitule : {"FR":"Amélioration"}}
	],
		
	// Rotation de l'arbre circulaire en fonction du sexe et de la génération
	"rotationArbreCirc":[
		90,
		45,
		22.5,
		11.25,
		5.625,
		2.8125,
		1.40625,
		0.703125,
		0.3515625,
		0.17578125,
		0.087890625,
		0.043945313
	],
	// Nombre de générations maximum
	"arbreAscNbGenerationMax": 4,									// Valeur par défaut
	"arbreAscChoixNbGenerations": [3,4,5,6,7,8],						// Liste de choix
	"arbreAscNbPixelsParGeneration": [0,0,0,160,290,420,550,680,830],		// Nb de pixels selon le nb de générations
	// Couleur attribuée par commune
	"couleurCommune":{
		"WHsLJAu6oyM2ZrEb9" :"#FCFF79",	// Beauvoir sur mer
		"qGoTQufvMrHyirj7t" :"#BBFFFF",	// Challans
		"wwuBLnfkk7pLPZ52D" :"#FFD779",	// Notre dame de Monts
		"BrQE7YG2Rxi8Dhf4T" :"#7EFA91",	// Sallertaine
		"Y8xw3Ea68Jwv6Txdb" :"#DEFCBE",	// Saint Gervais
		"cQuv6u45kZNuuBK5d" :"#FDA67B",	// Saint Jean de Monts
		"Swjzw7uTvSXcSn644" :"#F98080",	// Saint Hilaire de Riez
		"g2wDwJoEwk5teQZzt" :"#C9FA7E",	// Saint Urbain
		"yRCXwQWkSbpN8qRLW" :"#FF93DD",	// Soullans
		"LkFjhEhaMpNmA9Xvw" :"#8FC0D1",	// Le Perrier
		"PYiZAFkeQEuqRToZo" :"#E1E82C",	// Bouin
		"Aqi58qEeXxrPneeeC" :"#DBA0FF",	// Fenouiller
		"PgQuQw5LomfWE5Hhu" :"#BD4E76",	// Croix de Vie
		"AUTRE" 	   :"#FFFFFF",
		"NONCONNUE" :"#B8C0C0"
	}, 
	
	// Couleurs pour l'état recherche des actes
	"couleurEtatRechActes":{
		"INCOMPLET_A_COMPLETER" :	"#FF5F00",
		"INCOMPLET_RECH_FINIE" :	"#0332FF",
		"COMPLET_A_VERIFIER" :		"#E8CE00",
		"COMPLET_VERIFIE" :			"#00FF22",
	}, 
	
	// Couleurs pour l'état recherche des enfants 
	"couleurEtatRechEnfants":{
		"INCOMPLET_A_COMPLETER" :	"#FF5F00",
		"INCOMPLET_RECH_FINIE" :	"#0332FF",
		"COMPLET_VERIFIE" :			"#00FF22",
	}, 
	// ==========================================	
	// Intitulés génériques pour les différentes listes ci-dessus ------
	// ==========================================	
	"intitulesGeneriques":{
		"typesLieux":  				{"FR":" un type quelconque de lieu"},
		"typesDocs":  				{"FR":" un type quelconque de document"},
		"typeActe":  				{"FR":" un type quelconque d'acte"},
		"codagesDocs":				{"FR":" un codage quelconque"},
		"genresLieux":				{"FR":" un genre quelconque"},
		"sexes":					{"FR":" un sexe quelconque"},
	},
	
	// ==========================================	
	// Gestion du zoom svg
	// ==========================================
	// Niveau de zoom autorisés en %
	"NiveauxDeZoom" : [10,20,30,40,50,60,70,80,90,100,120,130,150,200,250,300,400,600,800],
	
	// ==========================================	
	// Divers
	// ==========================================
	"googleMapDefaultPosition" : 		{"lat": 46.820182,"lng": -1.994046},	// Le Perrier par défaut
	// Longuer maximum des listes des objets déjà visités
	"visitedObjectsListMaxLength":15,
	
	
	// ==========================================	
	// Représentation chronologique de la famille proche
	// ==========================================
	"nbPixelsParLigne" : 				35,		// En pixels (delta entre 2 lignes de vies successives)
	"nbPixelsParAn" : 					5,		// En pixels
	"margeGaucheSvg":					60,		// En années (inscription du nom de la personne)
	"nbAnneesViewbox":					240,	// En années
	"margeDroiteSvg":					10,		// En années
	"margeHauteSvg":					28,		// En pixels par rapport au y=0
	"margeBasseSvg":					67,		// En pixels
	"offsetLabelNomAvantDateMin":		55,		// En année
	"offsetLabelNomParGeneration":		10,		// En année
	"offsetDebutLignesPers":			50,		// En pixel Y
	
	
	// ==========================================	
	// ==========================================
	//			 VALEURS PAR DEFAUT
	// 		DES PREFERENCES UTILISATEUR
	// ==========================================
	// ==========================================
	
	// Couleur de fond, par génération, de l'arbre descendant développable
	"arbreDescCouleursGenerations":[
		"#D9EDF7",		// Bleu clair Bootstrap
		"#FFFFFF",		// Blanc
		"#FCF8E3"		// Jaune clair Bootstrap
	],
	

	
};