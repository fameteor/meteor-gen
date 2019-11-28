// ==============================================
// TEMPLATE LieuNomLienA
// ==============================================
Template.LieuNomLienA.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'a_genreLieu'  :  function () {
		return parametresClient.a_genreLieu[this.genre];
	}
});