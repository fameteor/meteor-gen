// ==============================================
// TEMPLATE lienBoutonSupprimer
// ==============================================
Template.lienBoutonSupprimer.events = {
	"click .supprimer" :  function(e) {
		e.preventDefault();
		Modal.show('LibGenObjectDeleteModal',{obj:this,type:"LIEN"},{backdrop:'static',keyboard:false});
	}
};