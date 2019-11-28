// ==============================================
// TEMPLATE PersChronologie
// ==============================================
//	Evolutions à prévoir :

// IMPORTANT :
// - Gérer le dates complètes, pas seulement l'année
// - Actuellement, la ligne de vie est tracée uniquement si la date de naissance ET la date de décès existent.
//		- traiter le cas ou la date de naissance OU la date de décès existent, ainsi qu'au moins une date de mariage
// - Ajout des points d'histoire que mes ancêtres peuvent avoir vécu (avec icones selon type de pt hist)
// - Tester tous les cas d'erreur
// - Afficher en "title" les dates au survol
// - Enlever le lien hypertexte sur la personne dont c'est la page INFOS

// SECONDAIRE :
// - Moyen de déplacement dans le temps
// - Style à faire plus joli
// - Mettre en évidence des incohérences de dates pour l'utilisateur
// - Mettre les pointillé de lien de mariage derrière lesa autres traits
// - Proposer différents styles en paramètre : couleurs selon les générations, etc...
// - Ajouter l'impression
// - Pouvoir zoomer temporellement
// - Mettre une marque plus jolie pour les personnes vivantes (flêche de fin de ligne de vie)
// - Optimisation CSS
// - DateMax inutile (selon durée fixe d'affichage temporel ou pas)
// - Afficher les personnes comme persCompletAvecLien (faire des template en SVG)

Template.PersChronologie.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	// Cette variable indique l'état de l'exploration des enfants de cette personne
	this.cursorDate 	= new ReactiveVar(null);
	this.dateMin  		= new ReactiveVar(null);
	this.dateMax	  	= new ReactiveVar(null);
});


Template.PersChronologie.helpers({
	// Gestion du curseur de date de la souris
	cursorDate() {
		return Template.instance().cursorDate.get();
	},
	xCursorDate() {
		//return (this.date.a2 - this.date.a1) * parametreCommuns.nbPixelsParAn;
		
	},
	yCursorDate() {
		var nbLignes = this.length;
		return (nbLignes * parametreCommuns.nbPixelsParLigne) + parametreCommuns.margeBasseSvg + parametreCommuns.margeHauteSvg + parametreCommuns.offsetDebutLignesPers;
	},
	'listeStructurePersFamilleProche' : function() {
		// Renvoie la liste ordonnée de la famille sous forme d'Array contenant des objets au format suivant :
		// {
		//		'pers': ::PERS,
		//		'classe': ["pers_grandParent","pers_parent","pers_enfant"],
		//		'y': ::Number (position Y de la ligne)
		//		'yConjoint' ::Number position Y de la ligne du conjoint (pour les conjoints uniquements) 
		//		'datesMinMax' : {dateMin: ,dateMax: } dates min et max de l'ensemble des personnes
		// }
		var datesMinMax = {dateMin:5000,dateMax:0};
		var calculDateMinMax = function(pers) {
			// On recherche la date min et date max
			if (pers && pers.naissance && pers.naissance.date && pers.naissance.date.a1 && pers.naissance.date.a1 < datesMinMax.dateMin) 	datesMinMax.dateMin = pers.naissance.date.a1;
			if (pers && pers.naissance && pers.naissance.date && pers.naissance.date.a1 && pers.naissance.date.a1 > datesMinMax.dateMax) 	datesMinMax.dateMax = pers.naissance.date.a1;
			if (pers && pers.estVivant) {
				var maintenant = new Date();
				var annee = maintenant.getFullYear();
				if (annee < datesMinMax.dateMin) 	datesMinMax.dateMin = annee;
				if (annee > datesMinMax.dateMax) 	datesMinMax.dateMax = annee;
			}
			else {
				if (pers && pers.deces && pers.deces.date && pers.deces.date.a1 && pers.deces.date.a1 < datesMinMax.dateMin) 					datesMinMax.dateMin = pers.deces.date.a1;
				if (pers && pers.deces && pers.deces.date && pers.deces.date.a1 && pers.deces.date.a1 > datesMinMax.dateMax) 					datesMinMax.dateMax = pers.deces.date.a1;
			}
			
		};
		
		var listeFamilleProche 	= [];
		var nbLignes 			= 2.5;
		var nbPixelsParLigne 	= parametreCommuns.nbPixelsParLigne;
		// Affichage des parents
		var pere = gf_persById(this.pere);
		calculDateMinMax(pere);
		listeFamilleProche.push({pers:pere,classe:"pers_grandParent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,datesMinMax:datesMinMax});
		var yConjoint = nbLignes * nbPixelsParLigne;
		var idConjoint = pere && pere._id;
		nbLignes++;
		var mere = gf_persById(this.mere);
		calculDateMinMax(mere);
		listeFamilleProche.push({pers:mere,classe:"pers_grandParent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,yConjoint:yConjoint,idConjoint:idConjoint,datesMinMax:datesMinMax});
		nbLignes++;
		// Affichage de la personne
		calculDateMinMax(this);
		listeFamilleProche.push({pers:this,classe:"pers_parent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,datesMinMax:datesMinMax});
		yConjoint = nbLignes * nbPixelsParLigne;
		idConjoint = this && this._id;
		nbLignes++;
		// Pour chacun des conjoints
		var listeCoupleEvents = gf_coupleEventsByPersId(this._id,null,true);
		for (var index in listeCoupleEvents) {
			var coupleEventCourant = listeCoupleEvents[index];
			// Recherche du conjoints
			var conjoint = gf_conjoint(this._id,coupleEventCourant);
			// Affichage des parents du conjoints
			var pereConjoint = gf_persById(conjoint.pere);
			calculDateMinMax(pereConjoint);
			listeFamilleProche.push({pers:pereConjoint,classe:"pers_grandParent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,datesMinMax:datesMinMax});
			var yConjointMere = nbLignes * nbPixelsParLigne;
			idConjointMere = pereConjoint && pereConjoint._id;
			nbLignes++;
			var mereConjoint = gf_persById(conjoint.mere);
			calculDateMinMax(mereConjoint);
			listeFamilleProche.push({pers:mereConjoint,classe:"pers_grandParent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,yConjoint:yConjointMere,idConjoint:idConjointMere,datesMinMax:datesMinMax});
			nbLignes++;
			// Affichage du conjoint
			calculDateMinMax(conjoint);
			listeFamilleProche.push({pers:conjoint,classe:"pers_parent",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,yConjoint:yConjoint,idConjoint:idConjoint,datesMinMax:datesMinMax});
			nbLignes++;
			// On affiche les enfants
			var listeEnfants = gf_listeEnfants(this,conjoint);
			for (var index2 in listeEnfants) {
				var enfantCourant = listeEnfants[index2];
				calculDateMinMax(enfantCourant);
				listeFamilleProche.push({pers:enfantCourant,classe:"pers_enfant",y:parametreCommuns.offsetDebutLignesPers + nbLignes * nbPixelsParLigne,datesMinMax:datesMinMax});
				nbLignes++;
			}
		}
		// On met à jour la date min maxvar dateMin = this[0].datesMinMax.dateMin;
		Template.instance().dateMin.set(listeFamilleProche[0].datesMinMax.dateMin);
		Template.instance().dateMax.set(listeFamilleProche[0].datesMinMax.dateMax);

		return listeFamilleProche;
	},
	'legendeTemp' : function() {
		var nbPixelsParAn = 5;
		var legendeTemp = [];
		// On met une graduation tous les 10 ans avec indication de l'année
		// Si année multiple de 50, texte indiqué et graduation plus forte
		for (var annee = 0; annee < 2200; annee += 10) {
			if (annee%50 == 0) {
				var classe = "legendeTemp_traitsNiv1";
				var label = String(annee);
			}
			else {
				var classe = "legendeTemp_traitsNiv2";
				var label = "";
			}
			// On crée l'objet indication
			var indication = {
				'label':	label,
				'x':		annee*nbPixelsParAn,
				'classe':	classe,
			};
			// On le rajoute dans l'array légende
			legendeTemp.push(indication);
		}
		return legendeTemp;
	},
	'viewBox' : function() {
		var nbLignes = this.length;
		// On recherche la date min et date max en regardant dans les données de la première personne
		var dateMin = this[0].datesMinMax.dateMin;
		var dateMax = this[0].datesMinMax.dateMax;
		var x = (dateMin - parametreCommuns.margeGaucheSvg) * parametreCommuns.nbPixelsParAn;
		var y = -parametreCommuns.margeHauteSvg;
		// Pour une largeur fixed
		var width = parametreCommuns.nbAnneesViewbox * parametreCommuns.nbPixelsParAn;
		// Pour une largeur en fonction de la dateMin et dateMax
		// var width = (dateMax + parametreCommuns.margeDroiteSvg - dateMin + parametreCommuns.margeGaucheSvg) * parametreCommuns.nbPixelsParAn;
		
		var height = (nbLignes * parametreCommuns.nbPixelsParLigne) + parametreCommuns.margeBasseSvg + parametreCommuns.margeHauteSvg + parametreCommuns.offsetDebutLignesPers;
		return  String(x) + " " + String(y) + " " + String(width) + " " + String(height);
	},
	'height' : function() {
		var nbLignes = this.length;
		return String((nbLignes * parametreCommuns.nbPixelsParLigne) + parametreCommuns.margeBasseSvg + parametreCommuns.margeHauteSvg);
	},
	// pour l'affichage des période d'histoire
	'periodesHist' : function() {
		// On renvoie les périodes d'histoire en rajoutant une propriété index;
		return _.map(
			periodesHist,
			function(value,index,list) {
				value.index = index;
				return value;
			}
		);
	},
	'classePeriodeHist' : function() {
		// Workaround car :nth_child pas supporté par Batik
		if (this.index % 2 == 0)	return "periodeHistEven";
		else						return "periodeHistOdd";
	},
	'xPeriodeHist' : function() {
		return this.date.a1 * parametreCommuns.nbPixelsParAn;
	},
	'yPeriodeHist' : function() {
		return 0;
		// Pour que les rect des périodes d'histoire couvrent tout le graphique
		// return -parametreCommuns.margeHauteSvg;
	},
	'widthPeriodeHist' : function() {
		return (this.date.a2 - this.date.a1) * parametreCommuns.nbPixelsParAn;
	},
	'heightPeriodeHist' : function() {
		var nbLignes = Template.parentData(1).length;
		return (nbLignes * parametreCommuns.nbPixelsParLigne) + parametreCommuns.margeBasseSvg + parametreCommuns.margeHauteSvg + parametreCommuns.offsetDebutLignesPers;
	},
	'offsetY' : function() {
		// Décalage en Y du texte selon la position de la période d'histoire
		switch (this.index % 3) {
				case 0:
					return 18;
					break;
				case 1:
					return 38;
					break;
				case 2:
					return 58;
					break;
		}
	},
	hists() {
		return Hists.find({"impacteAncetres":true});
	},
	histPosition() {
		return this.date.a1 * parametreCommuns.nbPixelsParAn;
	},
	typeTemplate() {
		var template = {
			"HIST_GUERRES":			"guerre",
			"HIST_EPIDEMIES":		"epidemie",
			"HIST_NATURE":			"phenomenesNaturels",
			"HIST_ADMINISTRATIF":	"default",
			"HIST_ECONOMIE":		"economie",
			"HIST_POLITIQUE":		"default",
			"HIST_CULTURE":			"culture",
			"HIST_SOCIETE":			"default",
			"HIST_RELIGION":		"religion",
			"HIST_TECHNIQUE":		"technique",
			"HIST_CURES":			"persCelebres",
			"HIST_MAIRES":			"persCelebres",
			"HIST_PERSCELEBRES":	"persCelebres", 
			"HIST_AUTRES":			"default"
		}
		if (this.themes[0] in template) return template[this.themes[0]];
		else {
			console.log("Erreur module \"PersChronologie\" : type de point d'histoire inconnu (id=" + this._id + ") : " + this.themes[0]);
			return "default";
		}
	},
	'fileName'() {
		var nomFichier = "chronologie-" + this.nom + "-" + this.prenoms[this.prenomUsuel];
		if (Session.get('sosas')[this._id]) 	nomFichier = nomFichier + "-SOSA" + Session.get('sosas')[this._id][0];
		return nomFichier;
	},
	'svgTemplate'() {
		return Template.instance();
	}

});

Template.PersChronologie.events = {
	"click .goToPtHist" : function (e,tpl) {
		e.preventDefault();
		Router.go('/hist/infos/' + this._id);
	},
	// Suivi des déplacements de la souris
	'mousemove svg' : function(e,tpl) {
		e.preventDefault();
		
		
		var xToDate = function(x) {
			return (x/ parametreCommuns.nbPixelsParAn) + tpl.dateMin.get() + parametreCommuns.margeGaucheSvg;
		};
		
		// On enregistre la date correspondant au curseur
		tpl.cursorDate.set(xToDate(e.offsetX));
		
		/*
		// Si on est en mode drag and drop, on modifie le viewpoint
		if ( tpl.spanMode.get()) {
			// On calcule le taux  de zoom
			var tauxDeZoom = Svg.niveauxDeZoom[tpl.indexZoomActuel.get()]/100;
			// On calcule le déplacement
			var deplacementX = e.clientX - tpl.xMouseInitial.get(); 
			var deplacementY = e.clientY - tpl.yMouseInitial.get();
			// On modifie le viewport
			// On récupère les information viewbox
			var x 		= tpl.xViewboxInitial.get();
			var y 		= tpl.yViewboxInitial.get();
			var widthInitial	= tpl.viewboxInitialWidth.get();
			var width		= tpl.viewbox.get()[2];
			var height		= tpl.viewbox.get()[3];
			// On récupère la largeur en pixel du rendu SVG
			var widthSvgPixels  = $(tpl.find("svg")).width();
			// On calcule le nb de points SVG par pixel
			var nbPointsParPixel = widthInitial/widthSvgPixels;
			// On calcule le nouveau viewport
			var nouveauX = x - deplacementX * nbPointsParPixel / tauxDeZoom;
			var nouveauY = y - deplacementY * nbPointsParPixel / tauxDeZoom;
			// On enregistre le nouveau viewbox
			var nouveauViewbox = [nouveauX, nouveauY, width, height];
			tpl.viewbox.set(nouveauViewbox);
		}
		*/
	},
	'mousedown svg' :  function(e,tpl) {
		e.preventDefault();
		/*
		// On calcule la position initiale de la souris
		tpl.xMouseInitial.set(e.clientX);
		tpl.yMouseInitial.set(e.clientY);
		tpl.xViewboxInitial.set( tpl.viewbox.get()[0]);
		tpl.yViewboxInitial.set( tpl.viewbox.get()[1]);
		tpl.spanMode.set(true);
		*/
	},	
	'mouseout svg' :  function(e,tpl) {
		e.preventDefault();
		tpl.cursorDate.set(null);
		/*
		// On calcule la position initiale de la souris
		tpl.xMouseInitial.set(e.clientX);
		tpl.yMouseInitial.set(e.clientY);
		tpl.xViewboxInitial.set( tpl.viewbox.get()[0]);
		tpl.yViewboxInitial.set( tpl.viewbox.get()[1]);
		tpl.spanMode.set(true);
		*/
	},
	'mouseup' : function(e,tpl) {
		e.preventDefault();
		/*
		tpl.spanMode.set(false);
		*/
	},
}