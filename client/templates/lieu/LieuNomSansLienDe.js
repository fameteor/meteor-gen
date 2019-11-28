// ==============================================
// TEMPLATE LieuNomSansLienDe
// ==============================================
Template.LieuNomSansLienDe.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'de_genreLieu'  :  function () {
		return parametresClient.de_genreLieu[this.genre];
	}
});
