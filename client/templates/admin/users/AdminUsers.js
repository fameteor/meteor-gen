// ==============================================
// TEMPLATE AdminUsers
// ==============================================
Template.AdminUsers.helpers({
	"email" : function() {
		return this.emails[0].address;
	},
	"emailVerif" : function() {
		if (this.emails[0].verified) 	return "<p class='text-success'>OUI</p>";
		else 						return "<p class='text-danger'>NON</p>";
	},
	"nbPersOwner" : function() {
		var nb = Pers.find({"createdBy" : this._id}).count();
		return nb;
	},
	"nbLieuOwner" : function() {
		var nb = Lieux.find({"createdBy" : this._id}).count();
		return nb;
	},
	"nbHistOwner" : function() {
		var nb = Hists.find({"createdBy" : this._id}).count();
		return nb;
	},
	"nbDocOwner" : function() {
		var nb = Docs.find({"createdBy" : this._id}).count();
		return nb;
	},
	"justeCree" : function() {
		if (this.profile && this.profile.accountJustCreated) 	return "<p class='text-danger'>OUI</p>";
		else 										return "<p class='text-success'>NON</p>"
	},
	"role" : function() {
		if (this.profile && this.profile.role === "USER") 	return "<p class='text-success'>" + this.profile.role + "</p>";
		else 										return "<p class='text-danger'>" + this.profile.role + "</p>"
	},
	"notMe" : function() {
		return Meteor.userId() != this._id;
	},
});

Template.AdminUsers.events = {
	"click .supprimer" :  function(e) {
		e.preventDefault();
		// On supprime l'utilisateur si ce n'est pas soi-même (sécurité)
		var that = this;
		if (Meteor.userId() != this._id) {
			if (confirm("Attention, vous aller supprimer l'utilisateur : " + that.emails[0].address + ", voulez vous continuer ?")) {
				Meteor.users.remove(
					that._id,
					function(error) {
						// On affiche la popup erreur
						toastr.warning("Impossible de supprimer cet utilisateur : " + error.reason);
					}
				);
			}
		}
		else		toastr.warning("Vous ne pouvez pas vous supprimer vous même !");
	}
};