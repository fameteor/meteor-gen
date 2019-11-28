// ==============================================
// TEMPLATE LibDebug
// ==============================================
Template.LibDebug.helpers({
	// Booleans -----------------------------------

	//Attributes ----------------------------------
	"debug" : function() {
		return Session.get('debug');
	},
	"json" : function() {
		return JSON.stringify(this, null, 4);
	}
});
