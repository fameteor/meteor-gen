// ==============================================
// TEMPLATE PrefsArbreDescCouleurs
// ==============================================
Template.PrefsArbreDescCouleurs.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"listeDesCouleurs" : function() {
		return Meteor.user() && _.map(Meteor.user().profile.prefs.couleursGenArbreDescExpl,function(valeur,index) {return {couleur:valeur,index:index}});
	},
	"generation" : function() {
		return this.index + 1;
	},
});

Template.PrefsArbreDescCouleurs.events = {
	"click .boutonSupprimer" : function(e,tpl){
		e.preventDefault();
		var index = this.index;
		var nouvelleCouleur =  tpl.find("#" + index).value;
		// On supprime cette couleur
		var listeCouleurs = Meteor.user().profile.prefs.couleursGenArbreDescExpl;
		listeCouleurs.splice(index, 1);
		// On enregistre dans la base
		Meteor.users.update(Meteor.userId(), {$set: {'profile.prefs.couleursGenArbreDescExpl' : listeCouleurs}});
	},
	"click .boutonModifier" : function(e,tpl){
		e.preventDefault();
		var index = this.index;
		var nouvelleCouleur =  tpl.find("#" + index).value;
		// On modifie cette couleur
		var listeCouleurs = Meteor.user().profile.prefs.couleursGenArbreDescExpl;
		listeCouleurs[index] = nouvelleCouleur;
		// On enregistre dans la base
		Meteor.users.update(Meteor.userId(), {$set: {'profile.prefs.couleursGenArbreDescExpl' : listeCouleurs}});
	},
	"click .boutonAjouter" : function(e,tpl){
		e.preventDefault();
		// On ajoute la couleur à l'array des couleurs
		var nouvelleCouleur = tpl.find("#nouvelleCouleur").value;
		var listeCouleurs = Meteor.user().profile.prefs.couleursGenArbreDescExpl;
		listeCouleurs.push(nouvelleCouleur);
		// On enregistre dans la base
		Meteor.users.update(Meteor.userId(), {$set: {'profile.prefs.couleursGenArbreDescExpl' : listeCouleurs}});
		// On efface le champ de saisie
		 tpl.find("#nouvelleCouleur").value = "";
	},
	"click .boutonDefault" : function(e,tpl){
		e.preventDefault();
		// On enregistre les valeurs par défaut dans la base
		Meteor.users.update(Meteor.userId(), {$set: {'profile.prefs.couleursGenArbreDescExpl' : usersDefaultPrefs.couleursGenArbreDescExpl}});
	}	
};