// ==============================================
// TEMPLATE LieuArticle
// ==============================================
Template.LieuArticle.helpers({
	'article'  :  function () {
		return parametresClient.genreLieu[this.genre];
	}
});
