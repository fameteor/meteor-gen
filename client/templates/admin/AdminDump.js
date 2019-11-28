// ==============================================
// TEMPLATE AdminDump 
// ==============================================

Template.AdminDump.helpers({
	// Booleans -----------------------------------
	//Attributes ----------------------------------
	"listeDumps":function() {
		return Session.get('listeDumps');
	},
	"consoleDumps":function(){
		var date = new Date(parseInt(this));
		return Session.get('consoleDumps');
	},
	"affichageDate":function(){
		var date = new Date(parseInt(this));
		return date.toString();
	}
	
});

Template.AdminDump.events = {
	'click #dump': function (e,tpl) {
		e.preventDefault();
		Meteor.call('dump', function (err, response) {
			if (err) 	toastr.error(err.reason,"Impossible d'effectuer le dump");
			else 	{
				// On récupère la console
				Session.set('consoleDumps', Session.get('consoleDumps') + "<b>Dump lancé</b><br/>" +  response + "<br/>");
			}
			// On réinitialise la liste des dumps
			getDumpList();
		});
	},
	'click .restore': function (e,tpl) {
		
		// ????????????????????????????????????
		// Inactif en attendant un restore qui remplace la base existante et non qui la fusionne par insert avec les données nouvelles uniquement
		// ????????????????????????????????????
			
		/*
		e.preventDefault();
		var dumpTimeStamp = String(this);
		if (confirm("Attention, vous aller écraser les données actuelle avec le contenu du dump " + this + ", voulez vous continuer ?")) {
			
			
			
			
			Meteor.call(
				'restoreDump',
				dumpTimeStamp,
				function (err, response) {
					if (err) 	toastr.error(err.reason,"Impossible de restorer le dump");
					else 	{
						// On récupère la console
						Session.set('consoleDumps', Session.get('consoleDumps') + "<b>Restauration du dump " + dumpTimeStamp + "</b><br/>" +  response + "<br/>");
					}
				}
			);
		}
		*/
	},
	'click .supprimer': function (e,tpl) {
		e.preventDefault();
		var dumpTimeStamp = String(this);
		if (confirm("Attention, vous aller supprimer le dump " + this + ", voulez vous continuer ?")) {
			Meteor.call(
				'deleteDump',
				dumpTimeStamp,
				function (err, response) {
					if (err) 	toastr.error(err.reason,"Impossible de supprimer le dump");
					else 	{
						// On récupère la console
						Session.set('consoleDumps', Session.get('consoleDumps') + "<b>Suppression du dump " + dumpTimeStamp + "</b><br/>" +  response + "<br/>");
					}
					// On réinitialise la liste des dumps
					getDumpList();
				}
			);
		}
	}
};