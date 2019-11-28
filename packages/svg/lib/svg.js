// ==============================================
// Svg object
// Cet objet est "stateless" et fournit un certain nombre de fonctions
// pour toutes les instances des templates "interactiveSvg"
// ==============================================
Svg = new function() {
	
	// ==========================================
	// Properties
	// ==========================================
	// Niveau de zoom autorisés en %
	this.niveauxDeZoom = [10,20,30,40,50,60,70,80,90,100,120,130,150,200,250,300,400,600,800];
	// ==========================================
	// Private variables
	// ==========================================
	var that = this;
	
	// ==========================================
	// Fonctions privées
	// ==========================================
	var adapterViewportSpanZoom = function(tpl) {
		// On récupère le taux de zoom
		var tauxDeZoom = that.niveauxDeZoom[tpl.indexZoomActuel.get()]/100;
		// On récupère le  viewbox actuel
		var x 		= tpl.viewbox.get()[0];
		var y 		= tpl.viewbox.get()[1];
		var width		= tpl.viewbox.get()[2];
		var height		= tpl.viewbox.get()[3];
		// On calcule le centre de l'image
		var xCentre = x + width/2;
		var yCentre = y + height/2;
		// On récupère les largeurs et hauteur du viewbox initial
		var widthInitial = 	tpl.viewboxInitialWidth.get();
		var heightInitial =	tpl.viewboxInitialHeight.get();
		// On calcule le nouveau viewport
		var nouvelleWidth = widthInitial / tauxDeZoom;
		var nouvelleHeight = heightInitial / tauxDeZoom;
		var nouveauX = xCentre - nouvelleWidth/2;
		var nouveauY = yCentre - nouvelleHeight/2;
		// On enregistre le nouveau viewbox
		var nouveauViewbox = [nouveauX, nouveauY, nouvelleWidth, nouvelleHeight];
		tpl.viewbox.set(nouveauViewbox);
		
	}
	
	// ==========================================
	// Methods
	// ==========================================
	// Check if the svg object has a specific class ----------------------
	this.hasClass = function(objetDOM,classe) {
		var classes = $(objetDOM).attr("class");
		if (classes != undefined) {
			if (classes.indexOf(classe) == -1) 	return false;
			else 						return true;
		}
	}


	this.gestionRoulette = function(event,tpl) {
		// Si la touche CTRL est enfoncée en même temps que la molette bouge
		//if (that.ctrlKey) {
			// Selon Chrome ou Firefox, on récupère la mesure du scroll			
			if (window.event) {
				// Chrome ou IE (IE à Tester !!)
				var e = window.event || e; // old IE support  
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); 
			}
			else {
				// Firefox
				var delta = -event.originalEvent.detail/3;
			}
			// Selon sens de la molette -------------------------------
			if (delta != 0) {
				// Le zoom se fait par rapport à la position actuelle de la souris
				/*
				// On calcule la postion par rapport au repère svg
				var X_sourisZoneSVG = Xcourant - $("#svg").offset().left;
				var Y_sourisZoneSVG = Ycourant - $("#svg").offset().top;
				// alert(X_sourisZoneSVG + " / " + Y_sourisZoneSVG);
				*/
			
				// Selon que c'est un zoom plus ou un zoom moins			
				if (delta < 0) {
					// Zoom moins
					// Si on peut encore dézoomer, on dézoome
					if (tpl.indexZoomActuel.get() > 0) 		tpl.indexZoomActuel.set(tpl.indexZoomActuel.get() - 1);
					// On affiche le viewport résultant -------------------------------
					adapterViewportSpanZoom(tpl);
				}
				else {
					// Zoom plus
					// Si on peut encore zoomer, on zoome
					if (tpl.indexZoomActuel.get() < Svg.niveauxDeZoom.length -1) 	tpl.indexZoomActuel.set(tpl.indexZoomActuel.get() + 1);
					// On affiche le viewport résultant -------------------------------
					adapterViewportSpanZoom(tpl);
				}
			}
		//}
		// On évite la propagation au document -----------------------
		return false;
	}
}




