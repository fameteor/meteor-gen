// ==============================================
// TEMPLATE LieuBoutonSupprimer
// ==============================================
Template.LieuBoutonSupprimer.events = {
	"click .supprimer" :  function(e) {
		e.preventDefault();
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LibGenObjectDeleteModal',{obj:this,type:"LIEU"},{backdrop:'static',keyboard:false});
	}
};