// ==============================================
// TEMPLATE LibSearchProgressStatus
// ==============================================
Template.LibSearchProgressStatus.helpers({
	'color' : function() {
		if (this.type === "RECORDS") 	return parametreCommuns.couleurEtatRechActes[this.value];
		if (this.type === "CHILDS")		return parametreCommuns.couleurEtatRechEnfants[this.value];
	},
	'title' : function() {
		if (this.type === "RECORDS") 	return lang.lang("actes " + this.value);
		if (this.type === "CHILDS")		return lang.lang("enfants " + this.value);
	}
});

// ==============================================
// TEMPLATE LibSearchProgressStatus_DOCAUTO
// ==============================================
Template.LibSearchProgressStatus_DOCAUTO.helpers({
	benjaminARTUS() {
		return Pers.findOne("Bmi6Ek2upAAB5HKJW");
	},
	mariagesPierreBIRON() {
		return gf_coupleEventsByPersId("g63H9Luoqta4sk2Bt",null,false);
	},
	
	
	
	
	
});