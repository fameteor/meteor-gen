// ==============================================
// TEMPLATE UserNameWithLink
// ==============================================
Template.UserNameWithLink.helpers({
	pers() {
		if (this.user && this.user.profile && this.user.profile._id) {
			return Pers.findOne(this.user.profile._id);
		}
	}
});

Template.UserNameWithLink_DOCAUTO.helpers({
	moi() {
		return Meteor.user();
	}
});
