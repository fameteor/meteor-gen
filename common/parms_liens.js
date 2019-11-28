// ================================================
// PARAMETRAGE
// ================================================
parms_liens = {
	
	/*
	Ce fichier décrit les liens existants dans les différents objets vers les autres objets.
	
	Les "matchType" disponibles sont :
	- "id" : on recherche "_id" comme valeur du champ ou comme valeur dans un champ Array,
	- "containId" : on recherche "_id" comme texte contenu dans le champ,
	- "containOldId" : on recherche l'ancien ID ("id") comme texte contenu dans le champ,
	- "lienPour" : (UNIQUEMENT pour les LIENS et UNIQUEMENT avec "prop":"pour.id") on recherche un lien pour cet objet,
	- "lienVers" : (UNIQUEMENT pour les LIENS et UNIQUEMENT avec "prop":"vers.id") on recherche un lien vers cet objet.
	*/
	
	// Liste des propriétés des objets PERS (COMPLET)
	"PERS" : {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "pere", 						"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour père cette personne"}, "afficherInfos":false},
			{"prop" : "mere",  						"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour mère cette personne"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "naissance.commune", 			"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour commune de naissance ce lieu"}, "afficherInfos":true},
			{"prop" : "deces.commune", 				"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour commune de décès ce lieu"}, "afficherInfos":true},
			{"prop" : "naissance.lieudit", 			"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour lieu-dit de naissance ce lieu"}, "afficherInfos":true},
			{"prop" : "deces.lieudit", 				"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour lieu-dit de décès ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "photo.docId", 				"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour photo ce document"}, "afficherInfos":true},
			{"prop" : "naissance.docs", 			"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour acte de naissance ce document"}, "afficherInfos":true},
			{"prop" : "deces.docs",  				"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant pour acte de décès ce document"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Personne(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce document"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets TAG
		"TAG" : [
			{"prop" : "tags", 						"matchType":"id",			"intitule" : {"FR":"Personne(s) ayant cette étiquette"}, "afficherInfos":false}
		],
	},
	// Liste des propriétés des objets COUPLE_EVENT (COMPLET)
	"COUPLE_EVENT" : {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "persA", 						"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) lié(s) à cette personne"}, "afficherInfos":false},
			{"prop" : "persB", 						"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) lié(s) à cette personne"}, "afficherInfos":false}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "communeA", 			"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) ayant ce lieu pour commune d'habitation d'au moins un des conjoints"}, "afficherInfos":true},
			{"prop" : "communeB", 			"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) ayant ce lieu pour commune d'habitation d'au moins un des conjoints"}, "afficherInfos":true},
			{"prop" : "lieuditA", 			"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) ayant ce lieu pour lieu-dit d'habitation d'au moins un des conjoints"}, "afficherInfos":true},
			{"prop" : "lieuditB", 			"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) ayant ce lieu pour lieu-dit d'habitation d'au moins un des conjoints"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "docs", 			"matchType":"id",			"intitule" : {"FR":"Evènement(s) conjugal(aux) lié(s) à ce ce document"}, "afficherInfos":true}
		]
	},
	// Liste des propriétés des objets LIEU (Gestion des familles toponymiques à rajouter)
	"LIEU": {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "inclusDans", 				"matchType":"id",			"intitule" : {"FR":"Lieu(x) inclus dans ce lieu"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce lieu"}},
			{"prop" : "topoComment",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "topoComment",  				"matchType":"containOldId",	"intitule" : {"FR":"Lieu(x) ayant dans ses commentaires de toponymie un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "positionSurCartes.id", 		"matchType":"id",			"intitule" : {"FR":"Lieu(x) visible sur cette carte"}, "afficherInfos":true},
		],
		// Pouvant pointer vers des objets TAG
		"TAG" : [
			{"prop" : "tags", 						"matchType":"id",			"intitule" : {"FR":"Lieu(x) ayant cette étiquette"}, "afficherInfos":false}
		],
	},
	// Liste des propriétés des objets HIST (Supprimer les liens PERS, LIEU, HIST, DOC après transformation en liens)
	"HIST": {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses commentaires un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Point(s) d'histoire ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce document"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets TAG
		"TAG" : [
			{"prop" : "tags", 						"matchType":"id",			"intitule" : {"FR":"Point(s) d'histoire ayant cette étiquette"}, "afficherInfos":false}
		],
	},
	// Liste des propriétés des objets DOC (COMPLET°)
	"DOC": {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur vers cette personne"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription", 	"matchType":"containOldId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur (ancien Id) vers cette personne"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "specif.ACTE_commune", 		"matchType":"id",			"intitule" : {"FR":"Document(s) acte ayant pour commune ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur vers ce lieu"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containOldId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription", 	"matchType":"containId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur vers ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containOldId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "recherche",  				"matchType":"containOldId",	"intitule" : {"FR":"Document(s) ayant dans ses remarques de recherche un pointeur (ancien Id) vers ce document"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur vers ce document"}, "afficherInfos":true},
			{"prop" : "specif.ACTE_transcription",  "matchType":"containOldId",	"intitule" : {"FR":"Document(s) acte ayant dans sa transcription un pointeur (ancien Id) vers ce document"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets REGISTRE
		"REGISTRE" : [
			{"prop" : "specif.ACTE_registre", 		"matchType":"id",			"intitule" : {"FR":"Document(s) acte ayant pour registre ce registre"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets TAG
		"TAG" : [
			{"prop" : "tags", 						"matchType":"id",			"intitule" : {"FR":"Document(s) ayant cette étiquette"}, "afficherInfos":false}
		],
	},
	// Liste des propriétés des objets LIEN (COMPLET)
	
	// ============================================================
	// ATENTION	la propriété "afficherInfos" est toujours FALSE !!!
	// ============================================================
		
	"LIEN": {
		// Pouvant pointer vers des objets PERS
		"PERS" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur vers cette personne"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur (ancien Id) vers cette personne"}, "afficherInfos":false},
			{"prop" : "pour.id",  					"matchType":"lienPour",		"intitule" : {"FR":"Lien(s) existant pour cette personne"}, "afficherInfos":true},
			{"prop" : "vers.id", 					"matchType":"lienVers",		"intitule" : {"FR":"Lien(s) existant vers cette personne"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur vers ce lieu"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce lieu"}, "afficherInfos":false},
			{"prop" : "pour.id",  					"matchType":"lienPour",		"intitule" : {"FR":"Lien(s) existant pour ce lieu"}, "afficherInfos":true},
			{"prop" : "vers.id", 					"matchType":"lienVers",		"intitule" : {"FR":"Lien(s) existant vers ce lieu"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets HIST
		"HIST" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur vers ce point d'histoire"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce point d'histoire"}, "afficherInfos":false},
			{"prop" : "pour.id",  					"matchType":"lienPour",		"intitule" : {"FR":"Lien(s) existant pour ce point d'histoire"}, "afficherInfos":true},
			{"prop" : "vers.id", 					"matchType":"lienVers",		"intitule" : {"FR":"Lien(s) existant vers ce point d'histoire"}, "afficherInfos":true}
		],
		// Pouvant pointer vers des objets DOC
		"DOC" : [
			{"prop" : "comment",  					"matchType":"containId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur vers ce document"}, "afficherInfos":false},
			{"prop" : "comment",  					"matchType":"containOldId",	"intitule" : {"FR":"Lien(s) ayant dans ses commentaires un pointeur (ancien Id) vers ce document"}, "afficherInfos":false},
			{"prop" : "pour.id",  					"matchType":"lienPour",		"intitule" : {"FR":"Lien(s) existant pour ce document"}, "afficherInfos":true},
			{"prop" : "vers.id", 					"matchType":"lienVers",		"intitule" : {"FR":"Lien(s) existant vers ce document"}, "afficherInfos":true}
		],
	},
	// Liste des propriétés des objets REGISTRE (COMPLET),
	
	// ============================================================
	// ATENTION	la propriété "afficherInfos" est toujours FALSE !!!
	// ============================================================
	
	"REGISTRE": {
		// Pouvant pointer vers des objets LIEU
		"LIEU" : [
			{"prop" : "commune", 				"matchType":"id",	"intitule" : {"FR":"Registre(s) ayant pour commune ce lieu"}, "afficherInfos":false}
		]
	},
	// Liste des propriétés des objets REGISTRE (A FAIRE)
	
	// ============================================================
	// ATENTION	la propriété "afficherInfos" est toujours FALSE !!!
	// ============================================================
	
	"ACTE_ARCHIVES": {
		
	},
}