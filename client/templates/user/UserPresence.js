// ==============================================
// TEMPLATE UserPresence
// ==============================================
Template.UserPresence.helpers({
	present : function() {
		if (this.presence && this.presence.status == 'online') 	return true;
		else 													return false;
	},
});

// ==============================================
// TEMPLATE UserPresence_DOCAUTO
// ==============================================
Template.UserPresence_DOCAUTO.helpers({
	moi() {
		return Meteor.user();
	}
});