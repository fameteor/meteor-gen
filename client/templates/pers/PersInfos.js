// ==============================================
// TEMPLATE PersInfos
// ==============================================
Template.PersInfos.helpers({
	listeTabs() {
		var listeTabs = [
			{label:"Fiche",				templateName:"PersInfosFiche", 			pers:this},
			{label:"Chronologie",		templateName:"PersInfosChronologie", 	pers:this},
			{label:"Chronologie V2",	templateName:"LibChrono", 				pers:this},
			{label:"Arbre ascendant",	templateName:"PersInfosArbreAsc", 		pers:this},
			{label:"Arbre descendant",	templateName:"PersInfosArbreDesc", 		pers:this},
			{label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",				templateName:"PersInfosObjetsLies", 	pers:this}
		];
		return listeTabs;
	}
});