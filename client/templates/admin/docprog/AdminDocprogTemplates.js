// ==============================================
// TEMPLATE AdminDocprogTemplates
// ==============================================
Template.AdminDocprogTemplates.helpers({
	// Booléens ------------------------------------------------------------ 
	//Attributs -------------------------------------------------------------
	"date" : function() {
		return { 
			"type":"ENTRE", 
			"j1":"12", 
			"m1":"4", 
			"a1":"1993", 
			"j2":"5", 
			"m2":"5", 
			"a2":"1994", 
		};
	},
	"dateRep" : function() {
		return { 
			"type":"LE", 
			"j1":"12", 
			"m1":"4", 
			"a1":"1800"
		};
	},
	"dateRep2" : function() {
		return { 
			"type":"ENTRE", 
			"j1":"12", 
			"m1":"4", 
			"a1":"1800", 
			"j2":"20", 
			"m2":"8", 
			"a2":"1801", 
		};
	},
	"benjaminARTUS" : function() {
		return Pers.findOne({id:"P00000002"});
	},
	"micheleRIVALLIN" : function() {
		return Pers.findOne({id:"P00000003"});
	},
	"martheARTUS" : function() {
		return Pers.findOne({id:"P00010031"});
	},
	"elieRIVALLIN" : function() {
		return Pers.findOne({id:"P00000006"});
	},
	"P00000004" : function() {
		return Pers.findOne({id:"P00000004"});
	},
	"h_pere" : function() {
		return Pers.findOne({_id:this.pere});
	},
	"h_mere" : function() {
		return Pers.findOne({_id:this.mere});
	},
	"sexeNonConnu" : function() {
		return Pers.findOne({id:"P00011080"});
	},
	"listeMargueriteBurgaud" : function() {
		return Pers.find({nom:"BURGAUD",prenoms:"Marguerite"});
	},
	"listeDocs" : function() {
		return Docs.find({ 
			$or: [ 
				{ id:"D00000008"}, 
				{ id:"D00000009"},
				{ id:"D00000010"} 
			]
		});
	},
	"listeLieux" : function() {
		return Lieux.find({ 
			$or: [ 
				{ id:"L10000003"}, 
				{ id:"L10000006"},
				{ id:"L10000009"} 
			]
		});
	},
	"lePerrier" : function() {
		return Lieux.findOne({nom:"Perrier"});
	},
	"vendee" : function() {
		return Lieux.findOne({nom:"Vendée"});
	},
	"D00000010" : function() {
		return Docs.findOne({id:"D00000010"});
	},
	"B00001000" : function() {
		return Docs.findOne({id:"B00001000"});
	},
	"H00000020" : function() {
		return Hists.findOne({id:"H00000020"});
	},
	"listeHistBouin" : function() {
		var Bouin =  Lieux.findOne({nom:"Bouin"});
		if (Bouin) return Hists.find({lieux:Bouin._id},{sort: [["date.a1","asc"],["date.m1","asc"],["date.j1","asc"]]});
	}
});