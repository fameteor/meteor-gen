// ==============================================
// TEMPLATE LieuInfosSousLieux
// ==============================================
Template.LieuInfosSousLieux.helpers({
	sousLieux() {
		return Lieux.find({inclusDans : this._id},{sort: {nom: 1}});
	},
});