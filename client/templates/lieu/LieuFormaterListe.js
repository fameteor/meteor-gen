// ==============================================
// TEMPLATE LieuFormaterListe
// ==============================================
Template.LieuFormaterListe.helpers({
	"lieux"() {
		return this;
	},
	"surlieu"() {
		return Lieux.findOne({_id:this.inclusDans});
	},
	"isGeoLocalised"() {
		return (this.latLng && this.latLng.lat && this.latLng.lng);
	},
	"nbLiensLatLng"() {
		var nb = Liens.find(
			{
				"pour.type":"DOC",
				vers: {id:this._id,type:"LIEU"},
				zone:"LAT_LNG"								
			}
		).count();
		return nb;
	}
});