// ==============================================
// TEMPLATE ComCallControl
// ==============================================
Template.ComCallControl.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactive
	this.screenWidth = 			new ReactiveVar($(window).width());
	this.callControlWidth = 	new ReactiveVar(400);
	// On windows resize
	that = this;
	$(window).resize(function(evt) {
		that.screenWidth.set($(window).width());
	});
});

Template.ComCallControl.helpers({
	"callControlWidth" : function() {
		return Template.instance().callControlWidth.get();
	},
	"left" : function() {
		return (Template.instance().screenWidth.get() - Template.instance().callControlWidth.get())/2;
	},
	"callStateMessage" : function() {
		var stateMsg = {
			"DISCONNECTED":	"Pas d'appel en cours",
			"CONNECTING":	"Appel lancé ...",
			"STARTED":		"Appel lancé ...",
			"RESPONDED":	"Sonnerie en cours ...",
			"ESTABLISHED":	"En communication ...",
			"ENDED":		"Communication terminée",
		};
		if (Session.get("callState") in stateMsg) return stateMsg[Session.get("callState")];
	},
});

Template.ComCallControl.events = {
	'click #hangup' :  function(e,tpl) {
		e.preventDefault();
		Session.set("callState","DISCONNECTED")
	}
}