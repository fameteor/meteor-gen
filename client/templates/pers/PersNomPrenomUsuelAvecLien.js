// ==============================================
// TEMPLATE PersNomPrenomUsuelAvecLien
// ==============================================
Template.PersNomPrenomUsuelAvecLien.helpers({
	
});

Template.PersNomPrenomUsuelAvecLien_DOCAUTO.helpers({
	benjaminArtus() {
		return Pers.findOne({id:"P00000002"});
	}
});
