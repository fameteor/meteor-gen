// ==============================================
// TEMPLATE DecoupeDocImageViewer
// ==============================================
Template.DecoupeDocImageViewer.helpers({
	height : function() {
		return this.width / this.ratioWidthOverHeight;
	},
	targetHeight : function() {
		return this.targetWidth / this.ratioWidthOverHeight;
	}
});