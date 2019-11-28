// ==============================================
// TEMPLATE PersInfosFiche
// ==============================================
Template.PersInfosFiche.helpers({
	aUnPere() {
		return this.pere;
	},
	aUneMere() {
		return this.mere;
	},
	h_pere() {
		return Pers.findOne({_id:this.pere});
	},
	h_mere() {
		return Pers.findOne({_id:this.mere});
	},
	h_conjoint() {
		return Pers.findOne({_id:this.conjoint});
	},
	sexeFeminin() {
	// Le helper "sexeFeminin" peut-être appelé avec le contexte PERSONNE
	// ou le contexte CoupleEvent d'une personne.
		// Pour éviter les erreurs au reload
		if (this.sexe) 	return this.sexe === "F";
		else	{
			if (Template.parentData(2) && Template.parentData(2).sexe)	return Template.parentData(2).sexe === "F";
		}
	},
	lieuConnu() {
		return this.lieudit || this.commune;
	},
	ageDeces() {
		var d1 = this.naissance && this.naissance.date;
		var d2 = this.deces && this.deces.date;
		var age = gf_duree(d1,d2, "formatFutureUse")
		if (age) 	return " à l'âge (calculé) de <strong>" + age + "</strong>";
	},
	ageMariage(d2) {
		var d1 = (Template.parentData(2) && Template.parentData(2).naissance && Template.parentData(2).naissance.date);
		var age = gf_duree(d1,d2, "formatFutureUse")
		if (age) 	return " à l'âge (calculé) de <strong>" + age + "</strong>";
	},
	age(d1,d2) {
		var age = gf_duree(d1,d2, "formatFutureUse")
		if (age) 	return age;
	},
	Pers() {
		return Pers;
	},
	CoupleEvents() {
		return CoupleEvents;
	},
	listeEnfantsMemePere() {
		if (this.pere) return Pers.find({"pere": this.pere, "mere": {"$ne":this.mere}}, {sort: {"naissance.date.a1" : 1}});
	},
	listeEnfantsMemeMere() {
		if (this.mere)	return Pers.find({"pere": {"$ne":this.pere}, "mere": this.mere}, {sort: {"naissance.date.a1" : 1}});
	},
	// Couple events
	h_conjointA() {
		return Pers.findOne({_id:this.persA});
	},
	h_conjointB() {
		return Pers.findOne({_id:this.persB});
	},
	classIncertainForMariage(persFiche) {
		// Si c'est la personne A
		if (persFiche._id === this.persA) {
			return this.incertainA ? "incertain" : "";
		}
		// Si c'est la personne B
		if (persFiche._id === this.persB) {
			return this.incertainB ? "incertain" : "";
		}
	},
});


Template.PersInfosFiche.events = {
	"click .addSibling" :  function(e) {
		e.preventDefault();
		// On vérifie qu'on a bien les deux parents et que le père est bien un homme et la mère bien une femme
		var pere = gf_persById(this.pere);
		var mere = gf_persById(this.mere);
		if (pere && mere) {
			if (pere.sexe === "M" && mere.sexe === "F") {
				var pers = {
					pere:	this.pere,
					mere:	this.mere,
					nom:	pere.nom
				};
				// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
				Modal.show("PersFormMainEditModal",{action:"INSERT",pers:pers},{backdrop:'static',keyboard:false});
			}
			else {
				// Dans les autres cas, afficher une erreur.
				toastr.error("Impossible d'ajouter un frère ou soeur : incohérence de sexe des parents.");
			}
		}
	},
	"click .addChild" :  function(e) {
		e.preventDefault();
		// On vérifie qu'on a bien les deux parents et que le père est bien un homme et la mère bien une femme
		var persA = gf_persById(this.persA);
		var persB = gf_persById(this.persB);
		if (persA && persB) {
			if (persA.sexe === "M" && persB.sexe === "F") {
				var pers = {
						pere:	this.persA,
						mere:	this.persB,
						nom:	persA.nom
					};
				Modal.show("PersFormMainEditModal",{action:"INSERT",pers:pers},{backdrop:'static',keyboard:false});
			}
			else {
				if (persB.sexe === "M" && persA.sexe === "F") {
					var pers = {
						pere:	this.persB,
						mere:	this.persA,
						nom:	persB.nom
					};
					Modal.show("PersFormMainEditModal",{action:"INSERT",pers:pers},{backdrop:'static',keyboard:false});
				}
				else {
					// Dans les autres cas, afficher une erreur.
					toastr.error("Impossible d'ajouter un enfant : incohérence de sexe des parents.");
				}
			}
		}
	}
};