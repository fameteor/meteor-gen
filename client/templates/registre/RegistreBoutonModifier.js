// ==============================================
// TEMPLATE RegistreBoutonModifier
// ==============================================
Template.RegistreBoutonModifier.events = {
	"click .modifier" :  function(e) {
		e.preventDefault();
		Router.go('/registre/modifier/' + this._id);
	}
};