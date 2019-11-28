// ==============================================
// TEMPLATE UserJoignability
// ==============================================
Template.UserJoignability.helpers({
	chatDisabled() {
		if (this.user._id == Meteor.userId()) return "disabled";
	},
	phoneDisabled() {
		if (		(this.user._id == Meteor.userId())
				||	(this.user && this.user.presence && this.user.presence.status != "online") 
				|| 	Session.get("callState") != "DISCONNECTED") 	return "disabled";
	},
	visioDisabled() {
		if (		(this.user._id == Meteor.userId())
				||	(this.user && this.user.presence && this.user.presence.status != "online")
				|| Session.get("callState") != "DISCONNECTED") 	return "disabled";
	},
	titleChat() {
		if (this.user._id == Meteor.userId()) 						return "appel impossible, c'est moi";
		else														return "chatter";
	},
	titlePhone() {
		if (this.user._id == Meteor.userId()) 						return "appel impossible, c'est moi";
		else {
			if (		this.user
					&& 	this.user.presence 
					&& 	this.user.presence.status != "online") 		return "appel impossible, non connecté";
			else {
				if (Session.get("callState") != "DISCONNECTED")	 	return "appel impossible, autre appel en cours";
				else												return "appeler";
			}
		}
	},
	titleVisio() {
		if (this.user._id == Meteor.userId()) 						return "appel impossible, c'est moi";
		else {
			if (		this.user
					&& 	this.user.presence 
					&& 	this.user.presence.status != "online") 		return "visio impossible, non connecté";
			else {
				if (Session.get("callState") != "DISCONNECTED")	 	return "visio impossible, autre appel en cours";
				else												return "faire une visio";
			}
		}
	},
});

Template.UserJoignability.events = {
	'click button.chat:not(.disabled)' :  function(e,tpl) {
		e.preventDefault();
		alert("Lancer chat à faire");
	},
	'click button.phone:not(.disabled)' :  function(e,tpl) {
		e.preventDefault();
		Session.set("callState","CONNECTING");
	},
	'click button.visio:not(.disabled)' :  function(e,tpl) {
		e.preventDefault();
		Session.set("callState","CONNECTING");
	}
}

// ==============================================
// TEMPLATE UserJoignability_DOCAUTO
// ==============================================
Template.UserJoignability_DOCAUTO.helpers({
	moi() {
		return Meteor.user();
	}
});
