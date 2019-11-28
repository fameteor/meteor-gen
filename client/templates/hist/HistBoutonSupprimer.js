// ==============================================
// TEMPLATE HistBoutonSupprimer
// ==============================================
Template.HistBoutonSupprimer.events = {
	"click .supprimer" :  function(e) {
		e.preventDefault();
		Modal.show('LibGenObjectDeleteModal',{obj:this,type:"HIST"},{backdrop:'static',keyboard:false});
	}
};