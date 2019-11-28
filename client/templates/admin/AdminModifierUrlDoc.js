// ==============================================
// TEMPLATE AdminModifierUrlDoc
// ==============================================
var DocsDontUrlContientLeTexte = function() {
	if (Template.instance().choix_searchPath.get() != "") {
		return Docs.find({'urlDocument':{$regex : ".*" + Template.instance().choix_searchPath.get() + ".*", $options: 'i'}}).fetch();
	}
	else return [];	
}

Template.AdminModifierUrlDoc.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	this.choix_searchPath 	= new ReactiveVar("");
	this.log 	= new ReactiveVar("");
});


Template.AdminModifierUrlDoc.helpers({
	"nbDocsContenantCePath" : function() {
		return DocsDontUrlContientLeTexte().length;
	},
	"debug" : function() {
		return JSON.stringify({
			"choix_searchPath" : Template.instance().choix_searchPath.get(),
		});
	},
	'disabled' : function() {
		if (DocsDontUrlContientLeTexte().length > 0)	return ""
		else 											return "disabled";
	},
	'log' : function() {
		return Template.instance().log.get();
	}
});

Template.AdminModifierUrlDoc.events = {
	'keyup #choix_searchPath': function (e,tpl) {
		e.preventDefault();
		// On modifie des données sessions en cas de frappe pour le titre
		tpl.choix_searchPath.set(tpl.find("#choix_searchPath").value);
	},
	'submit': function (e, tpl) {
		e.preventDefault();
		// On remplace dans les documents le texte de l'url si'il y quelquechose à remplacer
		var listeDocs = DocsDontUrlContientLeTexte();
		var nbTotalDocs = listeDocs.length;
		// On initialise le log
		tpl.log.set("<hr/>");
		if (nbTotalDocs > 0) {
			var searchText		= tpl.choix_searchPath.get();
			var replacementText	= tpl.find("#choix_replaceByPath").value;
			var nbDocsModifies = 0;
			var nbDocsErreurs = 0;
			for (index in listeDocs) {
				var docCourant = listeDocs[index];
				var urlDocument = docCourant.urlDocument;
				var newUrl = urlDocument.replace(searchText,replacementText);
				if (Docs.update(docCourant._id, {"$set" : {"urlDocument": newUrl}}) == 1) 	{
					// S'il y a une icone, on modifie aussi l'icone
					if (docCourant.urlIcone) {
						if (Docs.update(docCourant._id, {"$set" : {"urlIcone": docCourant.urlIcone.replace(searchText,replacementText)}}) == 1) 	{
							nbDocsModifies++;
							tpl.log.set(tpl.log.get() + "Doc avec icône " + docCourant._id + " modifié : " + urlDocument + " => " + newUrl + "<br/>");
						}
						else {
							nbDocsErreurs++;
							tpl.log.set(tpl.log.get() + "<span class='bg_danger'>Erreur lors de la modification de l'icône du doc " + docCourant._id + "</span><br/>");
						}
					}
					else {
						nbDocsModifies++;
						tpl.log.set(tpl.log.get() + "Doc sans icône " + docCourant._id + " modifié : " + urlDocument + " => " + newUrl + "<br/>");
					}
				}
				else {
					nbDocsErreurs++;
					tpl.log.set(tpl.log.get() + "<span class='bg_danger'>Erreur lors de la modification du doc " + docCourant._id + "</span><br/>");
				}																	
			}
			toastr.success(nbDocsModifies + "/" + nbTotalDocs + " documents modifiés, " + nbDocsErreurs + " erreurs");
		}
		else toastr.warning("Aucun document à modfier");
	},
};

Template.AdminModifierUrlDoc.rendered = function() {
	// On met le focus sur le champ input du titre
	mettreFocusFinTexte('#choix_searchPath');
}