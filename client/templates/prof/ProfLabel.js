// ==============================================
// TEMPLATE ProfLabel 
// ==============================================
Template.ProfLabel.events = {
	'click .modifyProf'(e,tpl){
		Modal.show(
			"ProfFormMainEditModal",
			{
				action:"UPDATE",
				prof:this
			},
			{backdrop:'static',keyboard:false}
		);
	}
}
	
// ==============================================
// TEMPLATE ProfLabel_DOCAUTO 
// ==============================================
Template.ProfLabel_DOCAUTO.helpers({
	profMarchand() {
		return gf_profById("3fcRfyPD9mgxTtYkA");
	},
	profCure() {
		return gf_profById("omvhWEXFt3ntBafP5");
	},
	profSageFemme() {
		return gf_profById("Cc6GWQX7EiEyhnJwJ");
	}
});