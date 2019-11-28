// ==============================================
// TEMPLATE AdminUsersCreate
// ==============================================
Template.AdminUsersCreate.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactives de gestion des erreurs du formulaire
	this.email_error = new ReactiveVar(false);
	this.password_error = new ReactiveVar(false);
	this.passwordCheck_error = new ReactiveVar(false);
	// Et les messages d'erreur
	this.email_errorMessage = new ReactiveVar("Saisir un E-mail valide");
	this.password_errorMessage = new ReactiveVar("Saisir un mot de passe de plus de 5 caractères");
	this.passwordCheck_errorMessage = new ReactiveVar("Saisir un mot de passe identique au précédent");
});

Template.AdminUsersCreate.helpers({
	"personneValide" : function () {
		if (this && this.estVivant && (Meteor.users.find({"profile._id":this._id}).count() === 0)) return true;
		else return false;
	},
	"email_error" : function () {
		return Template.instance().email_error.get();
	},
	"password_error" : function () {
		return Template.instance().password_error.get();
	},
	"passwordCheck_error" : function () {
		return Template.instance().passwordCheck_error.get();
	},
	"email_error_class" : function () {
		return (Template.instance().email_error.get() == true) ? "has-error" : "";
	},
	"password_error_class" : function () {
		return (Template.instance().password_error.get() == true) ? "has-error" : "";
	},
	"passwordCheck_error_class" : function () {
		return (Template.instance().passwordCheck_error.get() == true) ? "has-error" : "";
	},
	"email_errorMessage" : function () {
		return Template.instance().email_errorMessage.get();
	},
	"password_errorMessage" : function () {
		return Template.instance().password_errorMessage.get();
	},
	"passwordCheck_errorMessage" : function () {
		return Template.instance().passwordCheck_errorMessage.get();
	},
});

Template.AdminUsersCreate.events = {
	"submit" :  function(e,tpl) {
		e.preventDefault();
		// On suppose qu'il n'y a pas d'erreur
		tpl.email_error.set(false);
		tpl.password_error.set(false);
		tpl.passwordCheck_error.set(false);
		// On récupère les données
		var email = $("#email").val();
		var password = $("#password").val();
		var passwordCheck = $("#passwordCheck").val();
		// Vérifier si les données sont correctes
		if (!email) 						tpl.email_error.set(true);
		if (!password) 						tpl.password_error.set(true);
		if (!passwordCheck)					tpl.passwordCheck_error.set(true);
		if (password != passwordCheck) 		tpl.passwordCheck_error.set(true);
		if (password.length < 6) 			tpl.password_error.set(true);
		// Si les données sont valides
		if (!(tpl.email_error.get() || tpl.password_error.get() || tpl.passwordCheck_error.get())) {
			// Appeler la méthode de création
			Meteor.call('createLogin',email, password, tpl.data._id, function (err, response) {
				if (err) 	toastr.error(err.reason,"Impossible de créer le login");
				else {
					// On remet le formulaire à zéro
					$("#email").val("");
					$("#password").val("");
					$("#passwordCheck").val("");
					// On affiche l'avertissement
					toastr.success("Nouveau login créé");
					// On va à la page de gestion des users
					Router.go('/admin/users');
				}	
			});
		}
	}
};