// ==============================================
// TEMPLATE DateFormulaire 
// ==============================================
Template.DateFormulaire.helpers({
	'type' : function() {return this.name + '.type';},
	'j1' : function() {return this.name + '.j1';},
	'm1' : function() {return this.name + '.m1';},
	'a1' : function() {return this.name + '.a1';},
	'j2' : function() {return this.name + '.j2';},
	'm2' : function() {return this.name + '.m2';},
	'a2' : function() {return this.name + '.a2';},
});

Template.DateFormulaire.events = {
	'click a': function (e,tpl) {
		e.preventDefault();
		// On enregistre l'ID et ferme la modale
		gf_saveAndCloseRegistreChercherModal(this._id);
	},
	'click #dateRep1': function (e,tpl) {
		e.preventDefault();
		// On définit les paramètres de la fenêtre modale
		var day = tpl.$('input[name$="date.j1"]');
		var month = tpl.$('input[name$="date.m1"]');
		var year = tpl.$('input[name$="date.a1"]');
		var callback = function(day,month,year) {
			return function(selectedGregorianDate) {
				day.val(parseInt(selectedGregorianDate.jour));
				month.val(parseInt(selectedGregorianDate.mois));
				year.val(parseInt(selectedGregorianDate.annee));
			}
		}
		var parms = {
			callback : callback(day,month,year),
			date:{jour:day.val(),mois:month.val(),annee:year.val()}
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('DateRepModalChoice',parms,{backdrop:'static',keyboard:false});
	},
	'click #dateRep2': function (e,tpl) {
		e.preventDefault();
		// On définit les paramètres de la fenêtre modale
		var day = tpl.$('input[name$="date.j2"]');
		var month = tpl.$('input[name$="date.m2"]');
		var year = tpl.$('input[name$="date.a2"]');
		var callback = function(day,month,year) {
			return function(selectedGregorianDate) {
				day.val(parseInt(selectedGregorianDate.jour));
				month.val(parseInt(selectedGregorianDate.mois));
				year.val(parseInt(selectedGregorianDate.annee));
			}
		}
		var parms = {
			callback : callback(day,month,year),
			date:{jour:day.val(),mois:month.val(),annee:year.val()}
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('DateRepModalChoice',parms,{backdrop:'static',keyboard:false});
	},
	
	
};