// ==============================================
// TEMPLATE RouterNav
// ==============================================
Template.RouterNav.helpers({
	// Booleans -----------------------------------
	//Attributes ----------------------------------
	"status" : function() {
		return Meteor.status().status;
	},
	"activeIfRouteIs" : function(templateName) {
		var currentRoute = Router.current();
		// Garde sur currentRoute
		return currentRoute && templateName === currentRoute.lookupTemplate() ? 'active' : '';
	},
	"activeIfRouteContains" : function(name) {
		var currentRoute = Router.current();
		// Garde sur currentRoute
		return currentRoute && (currentRoute.lookupTemplate().indexOf(name) > -1) ? 'active' : '';
	},
	"activeIfAdminMenu" : function(name) {
		var currentRoute = Router.current();
		var active = false;
		if (currentRoute) {
			active = active || (currentRoute.lookupTemplate().indexOf("AdminUsers") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("AdminDump") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("LieuListetout") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("HistListetout") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("DocListe") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("RegistreListetout") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("RegistreAjouter") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("LienListetout") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("LienAjouter") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("AdminBugs") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("AdminDocprogLiens") > -1)
			active = active || (currentRoute.lookupTemplate().indexOf("AdminDocprogTips") > -1)
		}
		return active ? 'active' : '';
	},
	// Pour la création d'un login pour la personne actuelle
	"currentPageIsLivePersonWithoutAccount" : function() {
		// Si on est une la page d'info d'un personne, on renvoie TRUE, sinon FALSE
		// On vérifie qu'on est sur la page d'info d'un personne
		if (Router.current().lookupTemplate().indexOf("PersInfos") > -1) {
			// Si oui, on vérifie que la personne existe et est vivante
			var persId = Router.current().params.id;
			if (persId) {
				var pers = Pers.findOne({_id:persId});
				if (pers && pers.estVivant) {
					// On vérifie qu'il n'y a pas déjà un login lié à cette personne
					if (Meteor.users.find({"profile._id":persId}).count() === 0) return true
					else return false
				}
				else return false;
			}
			else return false;
		}
		else return false;
	},
	"currentPers" : function() {
		// On cherche la personne avec l'ID de la page courante (à appeler uniquement si on est sur la page info d'une personne)
		return Pers.findOne({_id:Router.current().params.id});
	},
});

Template.RouterNav.events = {
	// Boutons de navigation
	"click #previousButton" : function(e,tpl) {
		e.preventDefault();
		window.history.back();		
	},
	"click #nextButton" : function(e,tpl) {
		e.preventDefault();
		window.history.forward();		
	},
	// Boutons ajouter
	"click #ajouterPers" : function(e,tpl) {
		e.preventDefault();
		Modal.show("PersFormMainEditModal",{"action":"INSERT"},{backdrop:'static',keyboard:false});
	},
	"click #ajouterDoc" : function(e,tpl) {
		e.preventDefault();
		Modal.show("DocFormMainEditModal",{"action":"INSERT"},{backdrop:'static',keyboard:false});
	},
	// Boutons chercher !
	"click #chercherPers" : function(e,tpl) {
		e.preventDefault();
		Modal.show('PersChoisirModal',{'title':'Choisir une personne'});
	},
	"click #chercherLieu" : function(e,tpl) {
		e.preventDefault();
		Modal.show('LieuChoisirModal',{'title':'Choisir un lieu'});
	},
	"click #ajouterTag" : function(e,tpl) {
		e.preventDefault();
		Modal.show("TagFormMainEditModal",{"action":"INSERT"},{backdrop:'static',keyboard:false});
	},
};