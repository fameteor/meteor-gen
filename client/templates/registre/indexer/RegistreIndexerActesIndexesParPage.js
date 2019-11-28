// ==============================================
// TEMPLATE RegistreIndexerActesIndexesParPage 
// ==============================================

// ??????????????????????????????????????????????
// Améliorations à faire

// ??????????????????????????????????????????????


Template.RegistreIndexerActesIndexesParPage.helpers({
	"listeActesIndexesPourCettePage": function() {
		result = ActesArchives.find({
			"registre":	Session.get('registreChoisi_registreIndexer'),
			"page":		parseInt(Session.get('pageChoisie_registreIndexer'))
		});
		return result;
	},
	"pageChoisie_registreIndexer": function() {
		return Session.get('pageChoisie_registreIndexer');
	},
	
});

Template.RegistreIndexerActesIndexesParPage.events = {
	"submit" :  function(e,tpl) {
		e.preventDefault();
		// On charge la variable de session
		Session.set('pageChoisie_registreIndexer', String(tpl.find('input[name="page"]').value));
	},

	
};