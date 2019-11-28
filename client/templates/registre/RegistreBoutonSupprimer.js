// ==============================================
// TEMPLATE RegistreBoutonSupprimer
// ==============================================
Template.RegistreBoutonSupprimer.events = {
	"click .supprimer" :  function(e) {
		e.preventDefault();
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LibGenObjectDeleteModal',{obj:this,type:"REGISTRE"},{backdrop:'static',keyboard:false});
	}
};