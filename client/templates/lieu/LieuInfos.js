// ==============================================
// TEMPLATE LieuInfos
// ==============================================
Template.LieuInfos.helpers({
	listeTabs() {
		if (this.latLng && this.latLng.lat && this.latLng.lng) {
			var listeTabs = [
				{	label:"Carte géo-référencée (Leaflet)",
					templateName:"wmtsViewerTabsAdaptor",
					doc:{targetObj:this,type:"LIEU"}},
					
				{	label:"Carte géo-référencée (V0)",
					templateName:"wmtsViewerTabsAdaptor_old",
					doc:{targetObj:this,type:"LIEU"}},

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
		}
		else {
			var listeTabs = [
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
		}
		return listeTabs;
	}
});