// ==============================================
// TEMPLATE LibDocAnalysis 
// ==============================================
Template.LibDocAnalysis.helpers({
	
	// ------------------------------------------
	// <x-pers id="P00000226" status="VIVANT" role="CONJOINT" signe="NON" habite="L00000000">
	// <x-info pers="P00000452">
	// <x-prof id="" pers="">
	// ------------------------------------------
	
	infosList() {
		/* Structure renvoyée : 
		
			// Si objType == "PERS"
			[
				// Par document contenant des informations :
				{
					doc 		::DOC,
					status 		::,
					role 		::,
					signe 		::,
					habite 		::,
					age			::,				//voir comment coder l'âge
					profession 	:: String,
					infos 		::String
				},
				...
			]
			
			// Si objType == "LIEU", "HIST" ou "DOC"
			[
				// Par document contenant des informations :
				{
					doc 		::DOC,
					infos 		::String
				},
				...
			]
		
		*/
		var docsList = Docs.find(
			{$or:[
				// Legacy ID
				{"specif.ACTE_transcription": {"$regex":'.*' + this.obj.id + '.*',"$options":"i"}},
				// Mongo ID
				{"specif.ACTE_transcription": {"$regex":'.*' + this.obj._id + '.*',"$options":"i"}}
			]},
			{sort:{"date.a1":1,"date.m1":1,"date.j1":1}}
		).fetch();
		var result = [];
		// On recherche les infos dans chaque doc selon le type de l'objet pour lequel on cerche les infos
		for (var index in docsList) {
			var docCourant = docsList[index];
			// On crée un doc XMLDocument de la transcription
			var transcriptionXml = $($.parseXML('<?xml version="1.0"?><root>' + docCourant.specif.ACTE_transcription + '</root>'));
			var infos = {};
			infos.infos = "";
			infos.doc = docCourant;
			switch (this.objType){
				case "PERS":
					// On suppose 1 seul tag "x-pers" par personne et par document (ou seul le premier est retenu)
					// pour l'ID legacy et l'ID mongoDB
					var infosXml = transcriptionXml.find('x-pers[id="' + this.obj.id + '"],x-pers[id="' + this.obj._id + '"]');
					if (infosXml.length !== 0) {
						infos.status = 	infosXml.attr("status");
						infos.role = 	infosXml.attr("role");
						infos.signe = 	infosXml.attr("signe");
						infos.habite = 	infosXml.attr("habite");
						infos.age = 	infosXml.attr("age");
						infos.prof = 	infosXml.attr("prof");
						infos.incertain = 	infosXml.attr("incertain");
					}
					// On suppose 1 seul tag "x-prof" par personne et par document (ou seul le premier devrait être retenu, mais le code fait une concaténation)
					// pour l'ID legacy et l'ID mongoDB
					infos.profession = 	transcriptionXml.find('x-prof[pers="' + this.obj.id + '"],x-prof[pers="' + this.obj._id + '"]').text();
					// On peut avoir autant de tags "x-info" par pers et par document que l'on veut. 
					// pour l'ID legacy et l'ID mongoDB
					transcriptionXml.find('x-info[pers="' + this.obj.id + '"],x-info[pers="' + this.obj._id + '"]').each(function(){
						if (infos.infos)	infos.infos = infos.infos + " ... " + $(this).text();
						else				infos.infos = $(this).text();
					});
					break;
				case "LIEU":
					// On suppose 1 seul tag "x-lieu" par lieu et par document (ou seul le premier est retenu)
					// pour l'ID legacy et l'ID mongoDB
					var infosXml = transcriptionXml.find('x-lieu[id="' + this.obj.id + '"],x-lieu[id="' + this.obj._id + '"]');
					if (infosXml.length !== 0) infos.incertain = 	infosXml.attr("incertain");
					// On peut avoir autant de tags "x-info" par lieu et par document que l'on veut. 
					// pour l'ID legacy et l'ID mongoDB
					transcriptionXml.find('x-info[lieu="' + this.obj.id + '"],x-info[lieu="' + this.obj._id + '"]').each(function(){
						if (infos.infos)	infos.infos = infos.infos + " ... " + $(this).text();
						else				infos.infos = $(this).text();
					});
					break;
				case "HIST":
					// On suppose 1 seul tag "x-hist" par point d'histoire et par document (ou seul le premier est retenu)
					// pour l'ID legacy et l'ID mongoDB
					var infosXml = transcriptionXml.find('x-hist[id="' + this.obj.id + '"],x-hist[id="' + this.obj._id + '"]');
					if (infosXml.length !== 0) infos.incertain = 	infosXml.attr("incertain");
					// On peut avoir autant de tags "x-info" par hist et par document que l'on veut. 
					// pour l'ID legacy et l'ID mongoDB
					transcriptionXml.find('x-info[hist="' + this.obj.id + '"],x-info[hist="' + this.obj._id + '"]').each(function(){
						if (infos.infos)	infos.infos = infos.infos + " ... " + $(this).text();
						else				infos.infos = $(this).text();
					});
					break;
				case "DOC":
				// On suppose 1 seul tag "x-doc" par doc et par document (ou seul le premier est retenu)
					// pour l'ID legacy et l'ID mongoDB
					var infosXml = transcriptionXml.find('x-doc[id="' + this.obj.id + '"],x-doc[id="' + this.obj._id + '"]');
					if (infosXml.length !== 0) infos.incertain = 	infosXml.attr("incertain");
					// On peut avoir autant de tags "x-info" par doc et par document que l'on veut. 
					// pour l'ID legacy et l'ID mongoDB
					transcriptionXml.find('x-info[doc="' + this.obj.id + '"],x-info[doc="' + this.obj._id + '"]').each(function(){
						if (infos.infos)	infos.infos = infos.infos + " ... " + $(this).text();
						else				infos.infos = $(this).text();
					});
					break;
				default :
					console.log("Erreur module \"LibDocAnalysis\" : objType inconnu : " + this.objType + ' (valeur autorisées : {"PERS","LIEU","HIST","DOC"})');
					break;
			}
			result.push(infos);
		}
		return result;
	},
	lieu() {
		if (this.habite && this.habite != "L00000000") {
			if (this.habite.length === 9)  	return Lieux.findOne({id:this.habite});
			else 							return gf_lieuById(this.habite);
		}
	},
	ageFormate() {
		if ( this.age) return gf_durationNiceFormat(365.25 * this.age);
	},
	ageCalcule(dateNaissance,dateActe) {
		var resultat = gf_duree(dateNaissance,dateActe)
		if (resultat) return gf_duree(dateNaissance,dateActe) + " (calculé)";
	},
	incertain() {
		return this.incertain;
	}
	
});

// ==============================================
// TEMPLATE LibDocAnalysis_DOCAUTO 
// ==============================================
Template.LibDocAnalysis_DOCAUTO.helpers({
	jeromeFleury() {
		return gf_persById("GyNZJQyFvPqECwhzm");
	},
	lieuTest() {
		return gf_lieuById("Pf6yyR3sCLfujwe9w");
	}
});


