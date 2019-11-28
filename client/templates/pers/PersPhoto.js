// ==============================================
// TEMPLATE PersPhoto
// ==============================================
Template.PersPhoto.helpers({
	'urlIcone' : function() {
		switch (this.sexe) {
			case "M":
				return "/homme.jpg";
				break;
			case "F":
				return "/femme.jpg";
				break;
			case "NONCONNU":
			default :
				return "/nonConnu.jpg";
				break;
		}
	}
});

Template.PersPhoto.events = {
	"click #enleverPhoto" :  function(e,tpl) {
		e.preventDefault();
		Pers.update(
			Template.parentData(0)._id,
			{$set: {'photo': null}},
			function(err,nbAffected) {
				if (err) 	toastr.warning("Impossible d'enlever la photo : " + err);
				else 		toastr.success("Photo enlevée");
		})
	},
}