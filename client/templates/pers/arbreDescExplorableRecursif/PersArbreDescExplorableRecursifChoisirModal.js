// ==============================================
// TEMPLATE PersArbreDescExplorableRecursifChoisirModal
// ==============================================
Template.PersArbreDescExplorableRecursifChoisirModal.onCreated (function () {
	this.isExplored = new ReactiveVar(false);
});

Template.PersArbreDescExplorableRecursifChoisirModal.helpers({
	"isExplored" : function () {
		return Template.instance().isExplored.get();
	},
	"generation" : function () {
		return Template.parentData(5).generation;
	},
	"generationSuivante" : function () {
		return Template.parentData(6).generation + 1;
	},
	"couleurFond" : function () {
		// En gris pour les génération impaires, blanc pour les autres
		// La première génération est numérotée 1,  on enlève 1 
		// pour correspondre à l'index de l'array couleursGenArbreDescExpl
		var listeCouleurs = Meteor.user().profile.prefs.couleursGenArbreDescExpl;
		var nbCouleursDispos = listeCouleurs.length;
		return listeCouleurs[(Template.parentData(4).generation -1) % nbCouleursDispos];
	}
});

Template.PersArbreDescExplorableRecursifChoisirModal.events({
	'click img': function(e,tpl){
		// On arrête la propagation de l'evt au navigateur
		e.preventDefault();
		// On inverse l'état du développement
		tpl.isExplored.set(!tpl.isExplored.get());
		// Pour éviter la propagation au templates récursifs supérieurs
		e.stopPropagation();
	}
});