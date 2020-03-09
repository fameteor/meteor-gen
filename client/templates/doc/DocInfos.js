// ==============================================
// TEMPLATE DocInfos
// ==============================================
Template.DocInfos.helpers({
	listeTabs() {
		if (	this.codage === "GEO_REF"
				&& this.specif
				&& this.specif.GEO_REF_coordPoint1
				&& this.specif.GEO_REF_coordPoint1.lat
				&& this.specif.GEO_REF_coordPoint1.lng
				&& this.specif.GEO_REF_coordPoint2
				&& this.specif.GEO_REF_coordPoint2.lat
				&& this.specif.GEO_REF_coordPoint2.lng
				&& this.specif.GEO_REF_tilesUrl) {
			var listeTabs = [
				{label:"Carte géo-référencée (Leaflet)",		templateName:"wmtsViewerTabsAdaptor", 		doc:{targetObj:this,type:"DOC"}},
				{label:"Carte géo-référencée (V0)",		templateName:"wmtsViewerTabsAdaptor_old", 		doc:{targetObj:this,type:"DOC"}},
				{label:"Fiche",		templateName:"DocInfosFiche", 		doc:this},
				{label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",		templateName:"DocInfosObjetsLies", 	doc:this}
			];
		}
		else {
			var listeTabs = [
				{label:"Fiche",		templateName:"DocInfosFiche", 		doc:this},
				{label:"<i class=\"" + clientParms.iconsList.iconePers.name + "\" title=\"Personnes\"></i> <i class=\"" + clientParms.iconsList.iconeLieu.name + "\" title=\"Lieux\"></i> <i class=\"" + clientParms.iconsList.iconeHist.name + "\" title=\"Points d'histoire\"></i> <i class=\"" + clientParms.iconsList.iconeDoc.name + "\" title=\"Documents\"></i> liés",		templateName:"DocInfosObjetsLies", 	doc:this}
			];
		}
		return listeTabs;
	}
});
