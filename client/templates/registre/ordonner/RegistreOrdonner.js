// ==============================================
// TEMPLATE RegistreOrdonner
// ==============================================

// ??????????????????????????????????????????????
// Problèmes à résoudre avant utilisation
// - Mettre commune en variable locale plutot que de session
// - Mettre une sélection de registre en variable réactive
// - Quand le registre est choisi, faire apparaitre un formulaire pour changer la référence d'un registre
// - Modifier les autres registres en conséquence

// - Mettre du drag and drop ultérieureument
// - Vérifier l'unicité de l'ordre par commune
// ??????????????????????????????????????????????

Template.RegistreOrdonner.helpers({
	"listeRegistres": function() {
		return Registres.find({"commune":Session.get('communeChoisie_registreIndexer')},{sort: ["ordreParCommune","asc"]});
	},
	"communeChoisie_registreIndexer": function() {
		return Session.get('communeChoisie_registreIndexer');
	},
	"registreChoisi_registreIndexer": function() {
		return Session.get('registreChoisi_registreIndexer');
	},
	"commune_intitule": function() {
		var lieu = Lieux.findOne(Session.get('communeChoisie_registreIndexer'));
		if (lieu) return parametresClient.genreLieu[lieu.genre] + lieu.nom;
	},
	"selected": function() {
		if (Session.get('registreChoisi_registreIndexer') == this._id) return "selected";
	},
});

Template.RegistreOrdonner.events = {
	'focus input[name="commune_intitule"]': function(e,tpl){
		e.preventDefault();
		// On enlève le focus de ce champs
		e.target.blur();
		var idField = tpl.find('input[name="commune"]')
		// On définit les paramètres de la fenêtre modale
		var parms = {
			title:			"Choisir une commune",
			idField:		idField,
			labelField: 	e.target,
			filter:			{'nature':"COMMUNE"},
			lockedFields:	["nature"],
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
	},
	'change input[name="commune_intitule"]': function(e,tpl){
		e.preventDefault();
		// On met à zéro le registre sélectionné
		Session.set('registreChoisi_registreIndexer', null);
		// On met l'id de la commune dans la variable de session
		Session.set('communeChoisie_registreIndexer', String(tpl.find('input[name="commune"]').value));
	},
	'click tr.dragElement': function(e,tpl){
		// Pas de e.preventDefault(); pour que les liens hypertexte sur les boutons marchent
		Session.set('registreChoisi_registreIndexer', this._id);
	},
	'submit'(e,tpl) {
		e.preventDefault();
		var newOrder = tpl.find('#nouvelOrdre').value;
		Registres.update(this._id, { $set: { ordreParCommune: newOrder } });
	},
	'click .minus_1'(e,tpl) {
		e.preventDefault();
		Registres.update(this._id, { $set: { ordreParCommune: this.ordreParCommune - 1 } });
	},
	'click .plus_1'(e,tpl) {
		e.preventDefault();
		Registres.update(this._id, { $set: { ordreParCommune: this.ordreParCommune + 1 } });
	},
};