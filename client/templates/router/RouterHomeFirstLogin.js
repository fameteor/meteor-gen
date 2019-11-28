// ==============================================
// TEMPLATE RouterHomeFirstLogin
// ==============================================

// ???????????????????????????????????????????????????????????????????????????
// A améliorer/résoudre :
// - à la création d'un nouvel utilsateur les sosas ne sont pas affichés (au moins si la personne n'est pas dans la base)
// - enlever le champ autosuggest des champs
// - si la personne existe déjà : quid des droits d'accès pour modifier ??????
// - Aide à afficher dans tous les cas (faire popup d'aide)
// - Vérifier les infos saisies
// - Mettre une URL pour invités (mettre un champ e-mail sur les données PERS)
// ???????????????????????????????????????????????????????????????????????????


Template.RouterHomeFirstLogin.events = {
	"submit" : function (e,tpl) {
		e.preventDefault();
		// On met à jour le profile
		Meteor.users.update(
			{_id: Meteor.userId()}, 
			{$set: {
				'profile._id':null,
				"profile.accountJustCreated":false}
			}
		);
		// On récupère les informations
		var nom = 			$("#choix_accountNom").val();
		var prenom = 		$("#choix_accountPrenom").val();
		var dateNaissance = $("#choix_accountDateNaissance").val();
		var sexe = 			$("#choix_sexe").val();
		var usage = 		$("input[name='choix_typeGene']:checked").val();
		// Si la personne a déclaré qu'elle veut faire sa généalogie, on regarde :
		if ( usage === "MA_GENE") {
			// On converti la date de naissance
			var elementsDate = dateNaissance.split("/");
			var date = {type:"LE",j1:parseInt(elementsDate[0]),m1:parseInt(elementsDate[1]),a1:parseInt(elementsDate[2])}
			// On recherche une personne de même date de naissance, nom, prénom
			var maPersonne = Pers.findOne({'nom':nom,'prenoms':prenom,'naissance.date':date,sexe:sexe})
			// - si une personne avec le même nom, un prénom identique et la même date de naissance existe
			if (maPersonne) {
				alert("Vous êtes dans la base ! (Ajouter demande de confirmation")
				
				// ???????????????????????????????????
				// Ajouter une demande de confirmation que vous êtes bien la bonne personne
				// ???????????????????????????????????
				
				// On associe la personne trouvée ou crée avec le login
				Meteor.users.update(
					{_id: Meteor.userId()}, 
					{$set: {
						'profile._id':maPersonne._id}
					},
					function(error,nbAffected) {
						if (error) 	alert("Error setting profile._id on account creation with existing person.");
						else {
							// On va à la page de cette personne
							Router.go('/pers/infos/' + maPersonne._id);
							
							// ???????????????????????????????????
							// Afficher une popup d'explication du fonctionnement du site
							// ???????????????????????????????????
						} 
					}
				);
				
			}
			// - sinon on crée cette personne
			else {
				var personne = {
					'nom':							nom,
					'prenoms':						[prenom],
					'sexe':							sexe,
					'naissance':					{date:date},
					'prenomUsuel':					0,
					'prenomUsuelEstNonOfficiel':	false,
					'estVivant':					true,
					'createdAt':					new Date().getTime(),
					'lastUpdateAt':					new Date().getTime(),
				}
				// On ajoute la personne
				Pers.insert(personne, function(error,id) {
					if (error)	alert("Erreur dans la création de la personne correspondant au nouveau login : " + error);
					else {
						console.log(id);
						// On associe la personne trouvée ou crée avec le login
						Meteor.users.update(
							{_id: Meteor.userId()}, 
							{$set: {
								'profile._id':id}
							},
							function(err,nbAffected) {
								if (error) 	alert("Error setting profile._id on account creation with new person.");
								else {
									// On va à la page de cette personne
									Router.go('/pers/infos/' + id);
								}
							}
						);
						
					}					
				});
			}
			// Sinon, on va à la page aide du nouvel utilisateur directement
			Router.go('/aide/nouvelUtilisateur');
		}
		// Sinon, on va à la page aide du nouvel utilisateur directement
		else {
			Router.go('/aide/nouvelUtilisateur');
		}
	}
};