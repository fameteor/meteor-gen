// ==============================================
// TEMPLATE RegistreIndexerSvgInfosRegistre 
// ==============================================

// ??????????????????????????????????????????????
// Améliorations à faire
// - Problème de la numérotation : 1-51-101 au lieu de 1-100-101 à résoudre
// - Décaler la légende des pages au milieu du créneau. Décaler les barres des pages de la base en conséquence.
// - Afficher le % des pages dépouillées quand à zéro
// ??????????????????????????????????????????????

// On suppose :
// - une largeur de la barre de registre de 500px
var largeurBarreRegistre = 500; 

Template.RegistreIndexerSvgInfosRegistre.helpers({
	
	// Global -----------------------------------
	"viewBox": function() {
		return "-10 -15 520 60";
	},
	
	// Legende ----------------------------------
	'listeNumeroPagesPourLegende' : function() {
		var nbPages = this.nbPages;
		if (nbPages) {
			var nbPixelsParPage = largeurBarreRegistre/nbPages;
			var pas = 0;	// Une graduation tous les "pas" pages
			if (nbPages < 20)			pas = 1;
			else {
				if (nbPages < 100)		pas = 5;
				else {
					if (nbPages < 200)	pas = 10;	
					else {
						if (nbPages < 1000)	pas = 50;	
						else				pas = 100;
					}	
				}				
			}
			var legendePage = [];
			// On met une graduation tous les 10 ans avec indication de l'année
			// Si année multiple de 50, texte indiqué et graduation plus forte
			for (var page = 0; page < nbPages; page = page + pas) {
				// On crée l'objet indication
				var indication = {
					'label':	String(page + 1),
					'x':		page * nbPixelsParPage,
				};
				// On le rajoute dans l'array légende
				legendePage.push(indication);
			}
			return legendePage;
		}
	},
	
	// Pour les données sur les actes -----------
	'listeActesDeCeRegistre': function() {
		return Docs.find({"specif.ACTE_registre" : this._id})
	},
	'xLineActe': function() {
		var nbPages = Template.parentData(2).nbPages;
		if (nbPages) {
			var nbPixelsParPage = largeurBarreRegistre/nbPages;
			return this.specif.ACTE_page * nbPixelsParPage;
		}
	},
	
	// Pour les données sur l'indexation --------
	'listeNumerosDesPagesIndexeesDeCeRegistre': function() {
		// Renvoie l'array des numéros des pages indexées dédoublonnées
		var data = ActesArchives.find({'registre':this._id},{fields: {page:1}}).fetch();
		var distinctData = _.uniq(data, false, function(d) {return d.page});
		var result = _.pluck(distinctData, "page");
		return result;
	},
	'pourcentagePagesIndexees': function() {
		var nbPages = Template.parentData(1).nbPages;
		var nbPagesDépouillees = this.length;
		if (nbPages) return Math.round((nbPagesDépouillees / nbPages) * 100);
	},
	'xRectPageIndexee': function() {
		var nbPages = Template.parentData(2).nbPages;
		if (nbPages) {
			var nbPixelsParPage = largeurBarreRegistre/nbPages;
			return (this - 1) * nbPixelsParPage;
		}
	},
	'widthRectPageIndexee': function() {
		var nbPages = Template.parentData(2).nbPages;
		if (nbPages) return largeurBarreRegistre/nbPages;
	},
});

Template.RegistreIndexerSvgInfosRegistre.events = {

};