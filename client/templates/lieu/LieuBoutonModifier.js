// ==============================================
// TEMPLATE LieuBoutonModifier
// ==============================================
Template.LieuBoutonModifier.events = {
	"click .modifier" :  function(e) {
		e.preventDefault();
		Router.go('/lieu/modifier/' + this._id);
	}
};