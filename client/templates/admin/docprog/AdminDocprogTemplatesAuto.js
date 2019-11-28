// ==============================================
// TEMPLATE AdminDocprogTemplatesAuto
// ==============================================
Template.AdminDocprogTemplatesAuto.helpers({
	tabsList() {
		// Recherche de la liste des templates documentés (hors Meteor)
		// Cette liste est formatée comme suit :
		// [
		// 		{"label":"AdminDocprogDocTemplatesAuto", 	"templateName":"AdminDocprogTemplatesAutoContent", "contentTemplate":"AdminDocprogDocTemplatesAuto_DOCAUTO"},
		//		{"label":"LienListe", 						"templateName":"AdminDocprogTemplatesAutoContent", "contentTemplate":"LienListe_DOCAUTO"},
		//		...
		// ]
		var tabsList = [];
		for (var key in Template) {
			if (Template.hasOwnProperty(key)) {
				// Meteor internal templates excluded (begin with _)
				if (key.indexOf('_') !== 0) {
					// If there is a template with the same name followed by "_CODE"
					// Then this template is DOCUMENTED
					if ( (key + "_DOCAUTO")  in Template)	{
						tabsList.push({"label":key,"templateName":"AdminDocprogTemplatesAutoContent", "contentTemplate":key + "_DOCAUTO"});
					}	
				} 	
			}
		}
		return tabsList;
	}
});