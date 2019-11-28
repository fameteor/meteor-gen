// ==============================================
// TEMPLATE HistBoutonModifier
// ==============================================
Template.HistBoutonModifier.events = {
	"click .modifier" :  function(e) {
		e.preventDefault();
		Router.go('/hist/modifier/' + this._id);
	}
};