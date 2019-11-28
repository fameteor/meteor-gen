// ==============================================
// TEMPLATE AdminSchemaCheck 
// ==============================================
Template.AdminSchemaCheck.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	// Cette variable indique l'état de l'exploration des enfants de cette personne
	this.errorsAreDisplayed = new ReactiveVar(false);
	this.listeChecks = new ReactiveVar(null);
	var self = this;
    Meteor.call('schemasDataCheck', function (err, asyncResult) {
        if (err)
            console.log("Erreur module \"AdminSchemaCheck\" lors de l'appel à la méthode serveur \"schemasDataCheck\" : " + err);
        else 
            self.listeChecks.set(asyncResult);
    });
});

Template.AdminSchemaCheck.helpers({
	"errorsAreDisplayed" : function () {
		return Template.instance().errorsAreDisplayed.get();
	},
	"listeChecks":function() {
		return Template.instance().listeChecks.get();
	}
});

Template.AdminSchemaCheck.events = {
	'click #displayErrors': function (e,tpl) {
		e.preventDefault();
		tpl.errorsAreDisplayed.set(!tpl.errorsAreDisplayed.get());
	},
};
