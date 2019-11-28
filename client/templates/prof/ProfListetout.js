// ==============================================
// TEMPLATE ProfListetout 
// ==============================================
Template.ProfListetout.events = {
	'click .addProf'(e,tpl){
		Modal.show(
			"ProfFormMainEditModal",
			{
				action:"INSERT",
			},
			{backdrop:'static',keyboard:false}
		);
	},
	'click .modifyProf'(e,tpl){
		Modal.show(
			"ProfFormMainEditModal",
			{
				action:"UPDATE",
				prof:this
			},
			{backdrop:'static',keyboard:false}
		);
	},
	'click .deleteProf'(e,tpl){
		Modal.show(
			"ProfFormMainEditModal",
			{
				action:"DELETE",
				prof:this
			},
			{backdrop:'static',keyboard:false}
		);
	},
}