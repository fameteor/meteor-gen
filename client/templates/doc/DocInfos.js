// ==============================================
// TEMPLATE DocInfos
// ==============================================
Template.DocInfos.helpers({
	listeTabs() {
		var listeTabs = [
			{label:"Fiche",		templateName:"DocInfosFiche", 		doc:this},
			{label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",		templateName:"DocInfosObjetsLies", 	doc:this}
		];
		return listeTabs;
	}
});
