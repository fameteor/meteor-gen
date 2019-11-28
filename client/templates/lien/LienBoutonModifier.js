// ==============================================
// TEMPLATE LienBoutonModifier
// ==============================================
Template.LienBoutonModifier.events = {
	"click .modifier" :  function(e) {
		e.preventDefault();
		Router.go('/lien/modifier/' + this._id);
	}
};