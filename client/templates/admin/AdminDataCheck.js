// ==============================================
// TEMPLATE AdminDataCheck 
// ==============================================

Template.AdminDataCheck.helpers({

	// Pour les PERS
	"persCheck":function() {
		var result =  {
			pere:[],
			mere:[],
			// -----------
			naissanceCommune:[],
			naissanceLieudit:[],
			decesCommune:[],
			decesLieudit:[],
			mariageCommune:[],
			mariageLieudit:[],
			commentLieu:[],
			noteLieu:[],
			// -----------
			naissanceDoc:[],
			decesDoc:[],
			mariageDoc:[],
			commentDoc:[],
			noteDoc:[],
			photoDocId:[],
		};
		var toutesLespers = Pers.find().fetch();
		for (var index in toutesLespers) {
			var personneCourante = toutesLespers[index];
			// On vérifie pere
			if (personneCourante.pere) {
				if (!gf_existsPersById(personneCourante.pere)) result.pere.push(personneCourante);
			}
			// On vérifie mere
			if (personneCourante.mere) {
				if (!gf_existsPersById(personneCourante.mere)) result.mere.push(personneCourante);
			}
			// ------------------------------------			
			// On vérifie naissance.commune
			if (personneCourante.naissance && personneCourante.naissance.commune) {
				if (!gf_existsLieuById(personneCourante.naissance.commune)) result.naissanceCommune.push(personneCourante);
			}
			// On vérifie naissance.lieudit
			if (personneCourante.naissance && personneCourante.naissance.lieudit) {
				if (!gf_existsLieuById(personneCourante.naissance.lieudit)) result.naissanceLieudit.push(personneCourante);
			}
			// On vérifie deces.commune
			if (personneCourante.deces && personneCourante.deces.commune) {
				if (!gf_existsLieuById(personneCourante.deces.commune)) result.decesCommune.push(personneCourante);
			}
			// On vérifie deces.lieudit
			if (personneCourante.deces && personneCourante.deces.lieudit) {
				if (!gf_existsLieuById(personneCourante.deces.lieudit)) result.decesLieudit.push(personneCourante);
			}
			// Pour tous les mariages
			if (personneCourante.mariages) {
				for (var index2 in personneCourante.mariages) {
					// On vérifie mariage.$.commune
					if (personneCourante.mariages[index2].commune) {
						if (!gf_existsLieuById(personneCourante.mariages[index2].commune)) result.mariageCommune.push(personneCourante);
					}
					// On vérifie mariage.$.lieudit
					if (personneCourante.mariages[index2].lieudit) {
						if (!gf_existsLieuById(personneCourante.mariages[index2].lieudit)) result.mariageLieudit.push(personneCourante);
					}
					// On vérifie mariage.$.acte
					if (personneCourante.mariages[index2].acte) {
						if (!gf_existsDocById(personneCourante.mariages[index2].acte)) result.mariageDoc.push(personneCourante);
					}
				}				
			}
				
			
			// On vérifie comment
			// ??????????????????
			// A faire
			// Pour PERS, LIEU, HIST, DOC et autre ?
			// ??????????????????
			
			// On vérifie note
			// ??????????????????
			// A faire
			// Pour PERS, LIEU, HIST, DOC et autre ?
			// ??????????????????
			
			// ------------------------------------		
			// On vérifie naissance.acte
			if (personneCourante.naissance && personneCourante.naissance.acte) {
				if (!gf_existsDocById(personneCourante.naissance.acte)) result.naissanceDoc.push(personneCourante);
			}
			// On vérifie deces.acte
			if (personneCourante.deces && personneCourante.deces.acte) {
				if (!gf_existsDocById(personneCourante.deces.acte)) result.decesDoc.push(personneCourante);
			}
			// Pour le mariages, cf ci-dessus
			// On vérifie photo.docId
			if (personneCourante.photo && personneCourante.photo.docId) {
				if (!gf_existsDocById(personneCourante.photo.docId)) result.photoDocId.push(personneCourante);
			}
			
			
		}
		return result;
	},
	
	// Pour les LIEUX
	"lieuxSansInclusDans":function() {
		return Lieux.find({inclusDans:{$exists:false}});
	},
	"lieuxAvecInclusDansNull":function() {
		return Lieux.find({inclusDans:null});
	},
	"lieuxAvecInclusDansPointantVersLieuInexistant":function() {
		var listeAvecInclusDansNonNull =  Lieux.find({inclusDans:{$ne:null}}).fetch();
		var result = [];
		for (var index in listeAvecInclusDansNonNull) {
			var lieuCible = Lieux.findOne(listeAvecInclusDansNonNull[index].inclusDans);
			if (!lieuCible) result.push(listeAvecInclusDansNonNull[index]);
		}
		return result;
	},
	
	// Pour les LIENS
	"lienCheck":function() {
		var result =  {
			pourAbsent : [],
			pourTypeAbsent : [],
			pourTypeErreur : [],
			pourIdAbsent : [],
			pourPERS: 	[],
			pourLIEU:	[],
			pourHIST:	[],
			pourDOC:	[],
			versAbsent : [],
			versTypeAbsent : [],
			versTypeErreur : [],
			versIdAbsent : [],
			versPERS: 	[],
			versLIEU:	[],
			versHIST:	[],
			versDOC:	[],
		};
		var tousLesLiens = Liens.find().fetch();
		for (var index in tousLesLiens) {
			var lienCourant = tousLesLiens[index];
			// Test POUR
			if (lienCourant.pour) {
				if (lienCourant.pour.type) {
					if (lienCourant.pour.id) {
						switch (lienCourant.pour.type) {
							case "PERS":
								if (!gf_existsPersById(lienCourant.pour.id)) result.pourPERS.push(lienCourant);
								break;
							case "LIEU":
								if (!gf_existsLieuById(lienCourant.pour.id)) result.pourLIEU.push(lienCourant);
								break;
							case "HIST":
								if (!gf_existsHistById(lienCourant.pour.id)) result.pourHIST.push(lienCourant);
								break;
							case "DOC":
								if (!gf_existsDocById(lienCourant.pour.id)) result.pourDOC.push(lienCourant);
								break;
							default:
								result.pourTypeErreur.push(lienCourant);
								break;
						}
					}
					else result.pourIdAbsent.push(lienCourant);
				}
				else result.pourTypeAbsent.push(lienCourant);
			}
			else result.pourAbsent.push(lienCourant);
			// Test VERS
			if (lienCourant.vers && _.isArray(lienCourant.vers) && (lienCourant.vers.length > 0)) {
				// On balaye l'array
				for (var index2 in lienCourant.vers) {
					var lienVerscourant = lienCourant.vers[index2];
					if (lienVerscourant.type) {
						if (lienVerscourant.id) {
							switch (lienVerscourant.type) {
								case "PERS":
									if (!gf_existsPersById(lienVerscourant.id)) result.versPERS.push(lienCourant);
									break;
								case "LIEU":
									if (!gf_existsLieuById(lienVerscourant.id)) result.versLIEU.push(lienCourant);
									break;
								case "HIST":
									if (!gf_existsHistById(lienVerscourant.id)) result.versHIST.push(lienCourant);
									break;
								case "DOC":
									if (!gf_existsDocById(lienVerscourant.id)) result.versDOC.push(lienCourant);
									break;
								default:
									result.versTypeErreur.push(lienCourant);
									break;
							}
						}
						else result.versIdAbsent.push(lienCourant);
					}
					else result.versTypeAbsent.push(lienCourant);
				}				
			}
			else result.versAbsent.push(lienCourant);
		}
		return result;
	},

	// Pour les REGISTRES
	"registreCheck":function() {
		var result =  {
			schemaNotOk: 	[],
			commune:		[]
		};
		var tousLesRegistres = Registres.find().fetch();
		for (var index in tousLesRegistres) {
			var registreCourant = tousLesRegistres[index];
			// On vérifie le schéma
			// if (!Registres.simpleSchema().namedContext().validate(registreCourant, {modifier: false})) result.schemaNotOk.push(registreCourant);
			// On vérifie commune
			if (registreCourant.commune) {
				if (!gf_existsLieuById(registreCourant.commune)) result.commune.push(registreCourant);
			}
		}
		return result;
	},
	
	
	// Pour l validation des schémas
	
});

Template.AdminDataCheck.events = {
	/*
	'click #dump': function (e,tpl) {
		e.preventDefault();
		Meteor.call('dump', function (err, response) {
			if (err) 	toastr.error(err.reason,"Impossible d'effectuer le dump");
			else 	{
				// On récupère la console
				Session.set('consoleDumps', Session.get('consoleDumps') + "<b>Dump lancé</b><br/>" +  response + "<br/>");
			}
			// On réinitialise la liste des dumps
			getDumpList();
		});
	},
	*/
};

// ==============================================
// TEMPLATE AdminDataCheck_td_listeLieux 
// ==============================================

Template.AdminDataCheck_td_listeLieux.helpers({
	"checkIfEmpty":function(list) {
		if (hlp_count(list) == 0) 	return "checkOk";
		else					return "checkFailed";
	},
});

// ==============================================
// TEMPLATE AdminDataCheck_td_listePers 
// ==============================================

Template.AdminDataCheck_td_listePers.helpers({
	"checkIfEmpty":function(list) {
		if (hlp_count(list) == 0) 	return "checkOk";
		else					return "checkFailed";
	},
});

// ==============================================
// TEMPLATE AdminDataCheck_td_listeLiens 
// ==============================================

Template.AdminDataCheck_td_listeLiens.helpers({
	"checkIfEmpty":function(list) {
		if (hlp_count(list) == 0) 	return "checkOk";
		else					return "checkFailed";
	},
});

// ==============================================
// TEMPLATE AdminDataCheck_td_listeRegistres 
// ==============================================

Template.AdminDataCheck_td_listeRegistres.helpers({
	"checkIfEmpty":function(list) {
		if (hlp_count(list) == 0) 	return "checkOk";
		else					return "checkFailed";
	},
});