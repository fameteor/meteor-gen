// ==============================================
// TEMPLATE LieuInfos
// ==============================================
Template.LieuInfos.helpers({
	listeTabs() {
		var listeTabs = [
			{	label:"Google Map",
				templateName:"GoogleMap",
				lieuFocus:this},
				
			{	label:"Cartes",
				templateName:"LieuInfosCartes",
				lieu:this},
				
			{	label:"Fiche",
				templateName:"LieuInfosFiche",
				lieu:this},
				
			{	label:"Sous-lieux",
				templateName:"LieuInfosSousLieux",
				lieu:this},
				
			{	label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",
				templateName:"LieuInfosObjetsLies",
				lieu:this}
		];
		return listeTabs;
	}
});