// ==============================================
// TEMPLATE RegistreIndexerActeArchives 
// ==============================================

Template.RegistreIndexerActeArchives.helpers({
	"communeChoisie_registreIndexer": function() {
		return Session.get('communeChoisie_registreIndexer');
	},
	"registreChoisi_registreIndexer": function() {
		return Session.get('registreChoisi_registreIndexer');
	},
	"pageChoisie_registreIndexer": function() {
		return Session.get('pageChoisie_registreIndexer');
	},
});

Template.RegistreIndexerActeArchives.events = {
	'focusout input[name="pers_nom"]': function(e,tpl){
		e.preventDefault();
		// On remplit automatiquement avec le nom de la personne
		
		// ???????????
		// A voir si on l'implémente
		/*
		tpl.find('input[name="pere_nom"]').value = tpl.find('input[name="pers_nom"]').value ;
		*/
	},
};