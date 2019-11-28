// ==============================================
// TEMPLATE RegistreIndexer 
// ==============================================

// ??????????????????????????????????????????????
// Problèmes à résoudre avant utilisation
// -  1 fiche ou 2 fiches par mariage ? 
// - Ajouter des booléens : père, mère, conjoint décédé ou pas ?
// - Forcer les majuscules (noms et prénoms dans autoform)
// - Autoform : objets et sous objest obligatoire, comment ca fonctionne ?

// ??????????????????????????????????????????????

Template.RegistreIndexer.helpers({
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
	"registre_intitule": function() {
		var registre = Registres.findOne(Session.get('registreChoisi_registreIndexer'));
		if (registre) {
			var lieu = Lieux.findOne(registre.commune);
			if (lieu) return parametresClient.genreLieu[lieu.genre] + lieu.nom + ", " + registre.type + " " + registre.contenu + " " + registre.periode;
		}
	},
	"selected": function() {
		if (Session.get('registreChoisi_registreIndexer') == this._id) return "selected";
	},
	'listeActesDeCeRegistre': function() {
		return Docs.find({"specif.ACTE_registre" : Session.get('registreChoisi_registreIndexer')})
	},
});

Template.RegistreIndexer.events = {
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
	"click .modifier" :  function(e) {
		e.preventDefault();
		Router.go('/registre/modifier/' + this._id);
	},
	'click .registre': function(e,tpl){
		// Pas de e.preventDefault(); pour que les lien hypertexte sur les communes marchent
		Session.set('registreChoisi_registreIndexer', this._id);
	},
	'change input[name="commune_intitule"]': function(e,tpl){
		e.preventDefault();
		// On met à zéro le registre sélectionné
		Session.set('registreChoisi_registreIndexer', null);
		// On met l'id de la commune dans la variable de session
		Session.set('communeChoisie_registreIndexer', String(tpl.find('input[name="commune"]').value));
	},
};