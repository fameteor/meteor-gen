// ==============================================
// TEMPLATE LieuNomLienDe
// ==============================================
Template.LieuNomLienDe.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'de_genreLieu'  :  function () {
		return parametresClient.de_genreLieu[this.genre];
	}
});
