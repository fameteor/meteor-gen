// ==============================================
// TEMPLATE LibEditButton
// ==============================================
Template.LibEditButton.events = {
	"click .LibEditButton_insert, click .LibEditButton_update, click .LibEditButton_delete" :  function(e) {
		e.preventDefault();
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show(this.modalTemplate,this,{backdrop:'static',keyboard:false});
	}
};

// ==============================================
// TEMPLATE PersInfosFiche
// ==============================================
Template.LibEditButton_DOCAUTO.helpers({
	benjaminARTUS() {
		return Pers.findOne("Bmi6Ek2upAAB5HKJW");
	},
});