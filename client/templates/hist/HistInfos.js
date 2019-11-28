// ==============================================
// TEMPLATE HistInfos
// ==============================================
Template.HistInfos.helpers({
	listeTabs() {
		var listeTabs = [
			{label:"Fiche",				templateName:"HistInfosFiche", 			hist:this},
			{label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",				templateName:"HistInfosObjetsLies", 	hist:this}
		];
		return listeTabs;
	}
});