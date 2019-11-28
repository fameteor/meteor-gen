// ==============================================
// TEMPLATE LibIcone
// ==============================================
Template.LibIcone.helpers({
	"icon" : function() {
		return clientParms.iconsList[this];
	}
});

// ==============================================
// TEMPLATE LibIcone_DOCAUTO
// ==============================================
Template.LibIcone_DOCAUTO.helpers({
	"iconsList" : function() {
		return _.map(clientParms.iconsList,function(value, key){return key;});
	}
});