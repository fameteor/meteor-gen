// ==============================================
// TEMPLATE LieuNature
// ==============================================
Template.LieuNature.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	'nature'  :  function () {
		var text = "";
		if (this.nature in parametresClient.natureLieu)		text += parametresClient.natureLieu[this.nature];
		else					alert("Erreur template LieuNature : nature inconnu (" + this.nature+ ") pour le lieu (" + this._id + ").");
		return text;
	}
});

