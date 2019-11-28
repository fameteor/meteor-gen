// ==============================================
// TEMPLATE LibDisplayPointingObjectList
// ==============================================
Template.LibDisplayPointingObjectList.helpers({
	typeCoupleEvent() {
		var that=this;
		var coupleEventType = _.find(parametreCommuns.coupleEventType, function(item) {
			return item.valeur == that.type; 
		});
		return coupleEventType.intitule[LANG];
	},
});


