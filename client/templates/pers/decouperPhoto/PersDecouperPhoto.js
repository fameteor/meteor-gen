// ==============================================
// TEMPLATE PersDecouperPhoto
// ==============================================
Template.PersDecouperPhoto.onCreated (function () {
	// A l'initialisation du template, on crée les variables locales réactives
	// Pour le drag and drop
	this.isDragDropMode = new ReactiveVar(false);
	this.xMouseInitial = new ReactiveVar(0);
	this.yMouseInitial = new ReactiveVar(0);
	this.xInitial = new ReactiveVar(0);
	this.yInitial = new ReactiveVar(0);
	// Document sélectionné
	this.selectedDoc = new ReactiveVar(false);
	// Découpe selectionnée
	this.docId = new ReactiveVar("");
	this.docPage = new ReactiveVar(1);
	this.ratioWidthOverHeight = new ReactiveVar(1);
	this.targetWidth = new ReactiveVar(1);
	this.x = new ReactiveVar(0);
	this.y = new ReactiveVar(0);
	this.width = new ReactiveVar(0);
	// Echelle
	this.scale = new ReactiveVar(1);		// Echelle : nb de pixels image par pixel écran
	
});

Template.PersDecouperPhoto.helpers({
	'age' : function() {
		/*
		var d1 = this.naissance && this.naissance.date;
		var d2 = this.date;
		var age = gf_duree(d1,d2, "formatFutureUse")
		if (age) 	return ", à l'âge de <strong>" + age + "</strong>";
		*/
	},
	'aDocIsSelected' : function() {
		return Template.instance().selectedDoc.get();
	},
	'selectedDoc' : function() {
		return Template.instance().selectedDoc.get();
	},
	'selected' : function() {
		return (Template.instance().selectedDoc.get() && (Template.instance().selectedDoc.get()._id == this._id)) ? "selected" : false;
	},
	"viewboxCalculee" : function () {
		return "0 0 " + this.specif.IMAGE_px + " " + this.specif.IMAGE_py;
	},
	"x" : function () {
		return Template.instance().x.get();
	},
	"y" : function () {
		return Template.instance().y.get();
	},
	"width" : function () {
		return Template.instance().width.get();
	},
	"height" : function () {
		return Template.instance().width.get() / Template.instance().ratioWidthOverHeight.get();
	},
	"viewboxPreview" : function () {
		return Template.instance().x.get() + " " + Template.instance().y.get() + " " + Template.instance().width.get() + " " + (Template.instance().width.get() / Template.instance().ratioWidthOverHeight.get());
	},
	"decoupe" : function () {
		var decoupe = {
			docId:					Template.instance().docId.get(), 
			docPage:				Template.instance().docPage.get(), 
			ratioWidthOverHeight:	Template.instance().ratioWidthOverHeight.get(),
			targetWidth:			Template.instance().targetWidth.get(),
			x:						Template.instance().x.get(),
			y:						Template.instance().y.get(),
			width:					Template.instance().width.get(),
		};
		return decoupe;
	},
	
	
});

Template.PersDecouperPhoto.events = {
	"click .doc" :  function(e,tpl) {
		e.preventDefault();
		// Le document vient d'être sélectionné, on l'initialise
		tpl.selectedDoc.set(this);
		// Initialisation de la découpe
		tpl.docId.set(this._id);
		tpl.docPage.set(1);
		tpl.ratioWidthOverHeight.set(0.8);
		tpl.targetWidth.set(100);
		// On initialise aussi la taille de la zone de découpe
		tpl.x.set(this.specif.IMAGE_px * .4);		//40% de la gauche
		tpl.y.set(this.specif.IMAGE_py * .15);		//15% du haut
		tpl.width.set(this.specif.IMAGE_py * .2);	//20% de large
		// On définit l'échelle de l'affichage : nb de pixels image par pixel écran
		tpl.scale.set(this.specif.IMAGE_px/800);
	},
		//Zoom for Firefox and Chrome
	'DOMMouseScroll #decoupe, mousewheel #decoupe': function(e,tpl){
		e.preventDefault();
		// Selon Chrome ou Firefox, on récupère la mesure du scroll			
		if (window.event) {
			// Chrome ou IE (IE à Tester !!)
			var e = window.event || e; // old IE support  
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); 
		}
		else {
			// Firefox
			var delta = -e.originalEvent.detail;
		}
		// Selon sens de la molette -------------------------------
		if (delta != 0) {
			// Selon que c'est un zoom plus ou un zoom moins			
			if (delta < 0) {
				// Zoom moins
				// On déplace x et y pour garder le centre du rectangle constant
				var newWidth = Template.instance().width.get() * .95;
				var deltaWidth = Template.instance().width.get() * .05;
				Template.instance().x.set(Template.instance().x.get() + deltaWidth/2);
				Template.instance().y.set(Template.instance().y.get() + deltaWidth/2);
				// On modifie la largeur
				Template.instance().width.set(newWidth);
				
			}
			else {
				// Zoom plus
				// On déplace x et y pour garder le centre du rectangle constant
				var newWidth = Template.instance().width.get() / .95;
				var deltaWidth = Template.instance().width.get() * .05;
				Template.instance().x.set(Template.instance().x.get() - deltaWidth/2);
				Template.instance().y.set(Template.instance().y.get() - deltaWidth/2);
				// On modifie la largeur
				Template.instance().width.set(newWidth);
			}
		}
		// On évite la propagation au document -----------------------
		return false;
	},
	// Pour éviter le scrolling sur le svg
	'DOMMouseScroll svg, mousewheel svg': function(e,tpl){
		e.preventDefault();
	},
	// Suivi des déplacements de la souris
	'mousemove #decoupe' : function(e,tpl) {
		e.preventDefault();
		// Si on est en mode drag and drop, on modifie le viewpoint
		if ( tpl.isDragDropMode.get()) {
			// On calcule le déplacement
			var deplacementX = e.clientX - tpl.xMouseInitial.get(); 
			var deplacementY = e.clientY - tpl.yMouseInitial.get();
			// On modifie la position du rectangle de sélection en conséquence
			tpl.x.set(tpl.xInitial.get() + (deplacementX * tpl.scale.get()));
			tpl.y.set(tpl.yInitial.get() + (deplacementY * tpl.scale.get()));
		}
	},
	'mousedown #decoupe' :  function(e,tpl) {
		e.preventDefault();
		// On calcule la position initiale de la souris
		tpl.xMouseInitial.set(e.clientX);
		tpl.yMouseInitial.set(e.clientY);
		// On enregistre la position initiale du rectangle
		tpl.xInitial.set(tpl.x.get());
		tpl.yInitial.set(tpl.y.get());
		tpl.isDragDropMode.set(true);
	},	
	'mouseup' : function(e,tpl) {
		e.preventDefault();
		// On enregistre la nouvelle position du rectangle
		// On arrête le mode Drag and Drop
		tpl.isDragDropMode.set(false);
	},
	'click #enregistrer' : function(e,tpl) {
		e.preventDefault();
		// On génère la découpe
		var decoupe = {
			docId:					tpl.docId.get(), 
			docPage:				tpl.docPage.get(), 
			ratioWidthOverHeight:	tpl.ratioWidthOverHeight.get(),
			targetWidth:			tpl.targetWidth.get(),
			x:						tpl.x.get(),
			y:						tpl.y.get(),
			width:					tpl.width.get(),
		};
		// On modifie la photo de la personne en conséquence
		Pers.update(
			this.id,
			{$set: {'photo': decoupe}},
			function(err,nbAffected) {
				if (err) 	toastr.warning("Impossible de modifier la photo : " + err);
				else 		toastr.success("Photo modifiée");
		})

	},
};