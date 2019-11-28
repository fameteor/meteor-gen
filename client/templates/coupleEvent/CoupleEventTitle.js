// ==============================================
// TEMPLATE CoupleEventTitle
// ==============================================
Template.CoupleEventTitle.helpers({
	coupleEventType() {
		var that=this;
		var coupleEventType = _.find(parametreCommuns.coupleEventType, function(item) {
			return item.valeur == that.type; 
		});
		return coupleEventType.intitule[LANG];
	},
	noLink(templateContext) {
		// Affichage de la personne avec ou sans lien (paramètre contexte link=false)
		return templateContext.link === false;
	}
});


// ==============================================
// TEMPLATE CoupleEventTitle_DOCAUTO
// ==============================================
Template.CoupleEventTitle_DOCAUTO.helpers({
	coupleEventsDeMarieLaidin() {
		return gf_coupleEventsByPersId("iR74zHpND6JNLC8Mv");
	}
});