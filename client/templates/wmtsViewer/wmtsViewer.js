/* -----------------------------------------------------------------
	GENERAL PRINCIPLES
--------------------------------------------------------------------
See associated diagram .ppt

WMTS space = GTS space coordinates

Pour les services disponible IGN : http://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetCapabilities
( remplacer si nécessaire "pratique" par KEY !!!!

https://geoservices.ign.fr/documentation/donnees-ressources-wmts.html

The display uses what we call GTS (Google Tiles Space) coordinates.
These coordinates are described by {x,y,zoom} properties and are zoom dependant :
- zooming-in multiplies by two x and y values
- (0,0,any-zoom) coordinates represents the left top corner of the map (the axes are oriented like images pixels)

The display space (pixels) coordinates correspond to the GTS coordinates (x,y) multiplied by 256.


?????????????????????????????????????????????????
Check if data is ok before displaying maps, otherwise error !
Pouvoir passer le niveau de zoom en paramètre sinon calcul par défaut !
Zoomer selon la position de la souris

- Améliorer en ne changeant que les tiles des documents visibles
- Bug : zoom 18, 19 !!!!!!!!!!!!!!!!!
- Bug : scale do not display for zooms >= 17

V0 :
- Améliorer le style de l'échelle
- Gérer tout dans des variables réactives

FUTUR
- Mettre le menu de paramétrage le SVG
?????????????????????????????????????????????????


*/

// -----------------------------------------------------------------
// Template PARAMETERS
// -----------------------------------------------------------------
var parms = {
	zoomMin: 			10,
	zoomMax: 			17,
	initialOpacity: 	70,
	initialWidth:		1050,
	initialHeight:		700,
	
	backgroundLayersList : [
		// Use {z} {x} {y} in the template URL
		{
			label:'- Cartes IGN (local)',
			backgroundUrlTemplate:'/marais/fondCartes/cartes_IGN/{z}/{x}/{y}.jpg'
		},
		{
			label:'- Photos IGN (local)',
			backgroundUrlTemplate:'/marais/fondCartes/photos_IGN/{z}/{x}/{y}.jpg'
		},
		{
			label:'- Carte état major 1848 (local)',
			backgroundUrlTemplate:'/marais/geo_refs/tiled/carteEtatMajor1848/{z}/{x}/{y}.png'
		},
		{
			label:'- Openstreetmap (web)',
			backgroundUrlTemplate:'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
		},
		{
			label:'- Photos IGN  (web)',
			backgroundUrlTemplate:'https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg'
		},
		{
			label:'- Cartes IGN  (web)',
			backgroundUrlTemplate:'https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg'
		},
		{
			label:'Aucun fond',
			backgroundUrlTemplate:''
		}
	]
}


// -----------------------------------------------------------------
// Function to change tilesX/Y/min/max when tpl.displayCenterGts changes
// -----------------------------------------------------------------
var newTilesLimitsCalculation = function(tpl) {
	tpl.tilesXmin.set(Math.floor(tpl.displayCenterGts.get().x - (tpl.width.get()/2/256)));
	tpl.tilesXmax.set(Math.ceil(tpl.displayCenterGts.get().x - (tpl.width.get()/2/256) + tpl.width.get()/256));
	tpl.tilesYmin.set(Math.floor(tpl.displayCenterGts.get().y - (tpl.height.get()/2/256)));
	tpl.tilesYmax.set(Math.ceil(tpl.displayCenterGts.get().y - (tpl.height.get()/2/256) + tpl.height.get()/256));
}

// -----------------------------------------------------------------
// Function to zoom plus
// -----------------------------------------------------------------
var zoomPlus = function(tpl) {
	if (tpl.zoom.get() < parms.zoomMax) {
		// Update the zoom level
		tpl.zoom.set(tpl.zoom.get() + 1);
		// Scale the display center GTS coordinates
		var currentDisplayCenterGts = tpl.displayCenterGts.get();
		tpl.displayCenterGts.set({
			x:		currentDisplayCenterGts.x * 2,
			y:		currentDisplayCenterGts.y * 2,
			zoom:	tpl.zoom.get(),	
		})
		// New tiles limits calculation
		newTilesLimitsCalculation(tpl);
		
	}
}

// -----------------------------------------------------------------
// Function to zoom minus
// -----------------------------------------------------------------
var zoomMinus = function(tpl) {
	if (tpl.zoom.get() > parms.zoomMin) {
		// Update the zoom level
		tpl.zoom.set(tpl.zoom.get() - 1);
		// Scale the display center GTS coordinates
		var currentDisplayCenterGts = tpl.displayCenterGts.get();
		tpl.displayCenterGts.set({
			x:		currentDisplayCenterGts.x / 2,
			y:		currentDisplayCenterGts.y / 2,
			zoom:	tpl.zoom.get(),	
		})
		// New tiles limits calculation
		newTilesLimitsCalculation(tpl);
	}
}

// -----------------------------------------------------------------
// Function to check if a doc is georeferenced
// -----------------------------------------------------------------
var isGeoReferenced = function(doc) {
	if (	doc
			&& doc.codage === "GEO_REF"
			&& doc.specif
			&& doc.specif.GEO_REF_coordPoint1
			&& doc.specif.GEO_REF_coordPoint1.lat
			&& doc.specif.GEO_REF_coordPoint1.lng
			&& doc.specif.GEO_REF_coordPoint2
			&& doc.specif.GEO_REF_coordPoint2.lat
			&& doc.specif.GEO_REF_coordPoint2.lng
			&& doc.specif.GEO_REF_tilesUrl) return true;
	else return false;
}

// -----------------------------------------------------------------
// Initialisation function
// -----------------------------------------------------------------
var initialisation = function(dataContext,tpl) {
	switch(dataContext.type) {
		
		// "displayCenterGts" reactive var calculation -------------
		// For DOC, the display is centered on the center point (means of point1 and point2)
		case "DOC" :
			if (isGeoReferenced(dataContext.targetObj)) {
				var displayCenterGts = WmtsViewerLib.wmtsFromLatLng(
						{
							lat: (dataContext.targetObj.specif.GEO_REF_coordPoint1.lat + dataContext.targetObj.specif.GEO_REF_coordPoint2.lat)/2,
							lng: (dataContext.targetObj.specif.GEO_REF_coordPoint1.lng + dataContext.targetObj.specif.GEO_REF_coordPoint2.lng)/2,
						},
						tpl.zoom.get()
					);
				tpl.displayCenterGts.set(displayCenterGts);
			}
			else {
				// Center on Le Perrier
				var displayCenterGts = WmtsViewerLib.wmtsFromLatLng(
						{
							lat: 46.820169,
							lng: -1.993933,
						},
						tpl.zoom.get()
					);
				tpl.displayCenterGts.set(displayCenterGts);				
			}
			// New tiles limits calculation
			newTilesLimitsCalculation(tpl);
			break;
			
		// For LIEU, the display is centered on the place
		case "LIEU" :
			tpl.displayCenterGts.set(WmtsViewerLib.wmtsFromLatLng(dataContext.targetObj.latLng,tpl.zoom.get()));
			// New tiles limits calculation
			newTilesLimitsCalculation(tpl);
			break;
		default:
			console.log("tiledMapsViewer.typeParmError","tiledMapsViewer template : wrong type parameter error")
			break;
		
	}
}

// -----------------------------------------------------------------
// Callback when Lieu choisi
// -----------------------------------------------------------------
var lieuSelectedCallback = function(docFocus, latLngCursorPosition) {
	return function(idLieu) {
		// We add/modify the coordinates
		var request = {"$set": {"latLng": latLngCursorPosition}};
		var result = Lieux.update({_id : idLieu} , request);
		// We add a link to the docFocus if it doesn't exist yet
		if (docFocus) {
			var nblinks = Liens.find(
				{
					pour: {id:docFocus._id,type:"DOC"},
					vers: {id:idLieu,type:"LIEU"},
					zone:"LAT_LNG"								
				}
			).count();
			if (nblinks === 0) {
				var res1 = Liens.insert(
					{
						pour: {id:docFocus._id,type:"DOC"},
						vers: {id:idLieu,type:"LIEU"},
						zone:"LAT_LNG"								
					}
				);
			}
		}
		else console.log("Pas de lien ajouté, docFocus absent !");
		//
		var lieu = Lieux.findOne(idLieu);
		if (result === 1) {
			toastr.success("Les coordonnées ajoutées/changées pour " + parametresClient.genreLieu[lieu.genre] + " " + lieu.nom + ".");
		}
		else {
			toastr.warning("Les coordonnées non ajoutées/modifiées pour " + parametresClient.genreLieu[lieu.genre] + " " + lieu.nom + ".");
		}
	}
};




// -----------------------------------------------------------------
// TEMPLATE wmtsViewer ONCREATED
// -----------------------------------------------------------------
Template.wmtsViewer.onCreated (function () {
	var dataContext = Template.currentData();
	// Reactive variable creation ---------------
	this.width 						= new ReactiveVar(parms.initialWidth);
	this.height 					= new ReactiveVar(parms.initialHeight);
	
	// Initial zoom calculation -----------------
	switch (dataContext.type) {
		case "DOC":
			this.zoom 				= new ReactiveVar(14);
			break;
		case "LIEU":
			switch (dataContext.targetObj.nature) {
				case "COMMUNE":
					this.zoom 		= new ReactiveVar(12);
					break;
				case "LIEUDIT":
					this.zoom 		= new ReactiveVar(16);
					break;
				default :
					this.zoom 		= new ReactiveVar(12);
					break;
			}
			break;
		default :
			this.zoom 				= new ReactiveVar(12);
			break;
	}
	
	this.displayCenterGts 			= new ReactiveVar(null);
	this.tilesXmin 					= new ReactiveVar(0);
	this.tilesXmax 					= new ReactiveVar(0);
	this.tilesYmin 					= new ReactiveVar(0);
	this.tilesYmax 					= new ReactiveVar(0)
	// SPAN management --------------------------
	this.spanMode 					= new ReactiveVar(false);
	this.xMouseInitial 				= new ReactiveVar(null);
	this.yMouseInitial 				= new ReactiveVar(null);
	this.displayCenterGtsInitial 	= new ReactiveVar(null);
	// Click without dragging management --------
	this.dragged 					= new ReactiveVar(false);
	// Form management --------------------------
	this.placeIconsIsChecked 		= new ReactiveVar(true);
	this.docCroppedIsChecked 		= new ReactiveVar(false);
	this.backgroundUrlTemplate		= new ReactiveVar(parms.backgroundLayersList[0].backgroundUrlTemplate);
	this.displayTilesCoordinatesIsChecked	= new ReactiveVar(false);
	this.rectAroundIsChecked		= new ReactiveVar(false);
	// Opacity management -----------------------
	this.docOpacityObject			= new ReactiveVar({});
	this.globalDocOpacity			= new ReactiveVar(0);
	// Get targetObject if ID only provided
	
	// Initialisation ---------------------------
	initialisation(dataContext,this);
	
});

// -----------------------------------------------------------------
// TEMPLATE wmtsViewer HELPERS
// -----------------------------------------------------------------
Template.wmtsViewer.helpers({
	'pseudoHelperInit'() {
		console.log("init");
		// Opacity reactive vars initialisation --------------------
		var docOpacityObject = {};
		switch (this.type) {
			case 'DOC':
				docOpacityObject[this.targetObj._id] = parms.initialOpacity;
				break;
			case 'LIEU':
				// Find all docs with geoRefs link to this place
				var linkedDocsIdsList = Liens.find({
					"pour.type":"DOC",
					"vers.id":this.targetObj._id,
					"vers.type":"LIEU"
				}).fetch().map(function(obj){
					return obj.pour.id
				});
				result = Docs.find({
					_id:{$in: linkedDocsIdsList},
					codage:"GEO_REF"
				}).fetch().map(function(obj) {
					docOpacityObject[obj._id] = parms.initialOpacity;
				});
				break;			
		}
		Template.instance().docOpacityObject.set(docOpacityObject);
		Template.instance().globalDocOpacity.set(parms.initialOpacity);
	},
	// Reactive variable ------------------------
	'width'() {
		return Template.instance().width.get();
	},
	'height'() {
		return Template.instance().height.get();
	},
	'zoom'() {
		return Template.instance().zoom.get();
	},
	'displayCenterGts'() {
		return Template.instance().displayCenterGts.get();
	},
	// Form management
	'placeIconsIsChecked'() {
		return Template.instance().placeIconsIsChecked.get();
	},
	'docCroppedIsChecked'() {
		return Template.instance().docCroppedIsChecked.get();
	},
	'rectAroundIsChecked'() {
		return Template.instance().rectAroundIsChecked.get();
	},
	'backgroundLayersList'() {
		return parms.backgroundLayersList;
	},
	'backgroundUrlTemplate'() {
		return Template.instance().backgroundUrlTemplate.get();
	},
	'backgroundLayerSelected'() {
		return (this.value === Template.instance().backgroundUrlTemplate.get()) ? "selected" : "";
	},
	'displayTilesCoordinatesIsChecked'() {
		return Template.instance().displayTilesCoordinatesIsChecked.get();
	},
	// To generate the image tiles --------------
	'xTilesList'() {
		var result = [];
		for (var i = Template.instance().tilesXmin.get(); i < Template.instance().tilesXmax.get(); i++) {
		   result.push(i);
		}
		return result;
	},
	'yTilesList'() {
		var result = [];
		for (var i = Template.instance().tilesYmin.get(); i < Template.instance().tilesYmax.get(); i++) {
		   result.push(i);
		}
		return result;
	},
	// Viewport calculation
	'xOffsetPixel'() {
		return Template.instance().displayCenterGts.get().x * 256 - Template.instance().width.get()/2;
	},
	'yOffsetPixel'() {
		return Template.instance().displayCenterGts.get().y * 256 - Template.instance().height.get()/2;
	},
	'geoRefsDocsList'() {
		var result = [];
		switch (this.type) {
			case 'DOC':
				// If geo referenced
				if (isGeoReferenced(this.targetObj)) result.push(this.targetObj);
				break;
			case 'LIEU':
				// Find all docs with geoRefs link to this place
				var linkedDocsIdsList = Liens.find({
					"pour.type":"DOC",
					"vers.id":this.targetObj._id,
					"vers.type":"LIEU"
				}).fetch().map(function(obj){
					return obj.pour.id
				});
				result = Docs.find({
					_id:{$in: linkedDocsIdsList},
					codage:"GEO_REF",
					"specif.GEO_REF_coordPoint1.lat":{"$exists":true},
					"specif.GEO_REF_coordPoint1.lng":{"$exists":true},
					"specif.GEO_REF_coordPoint2.lat":{"$exists":true},
					"specif.GEO_REF_coordPoint2.lng":{"$exists":true},
					"specif.GEO_REF_tilesUrl":{"$exists":true},
				}).fetch();
				break;			
		}
		return result;
	},
	'docPosition'() {
		var southWestPoint = WmtsViewerLib.pixelsFromLatLng(this.specif.GEO_REF_coordPoint1,Template.instance().zoom.get());
		var northEastPoint = WmtsViewerLib.pixelsFromLatLng(this.specif.GEO_REF_coordPoint2,Template.instance().zoom.get());
		var result = {
			x:		southWestPoint.x,
			y:		northEastPoint.y,
			width:	northEastPoint.x - southWestPoint.x,
			height:	southWestPoint.y - northEastPoint.y			
		};
		return result;

	},
	'geoRefsPlacesList'() {
		var result = [];
		switch (this.type) {
			case 'DOC':
				result = Liens.find({
					"pour.type":	"DOC",
					"pour.id":		this.targetObj._id,
					"vers.type":	"LIEU",
					"zone":			"LAT_LNG"
				}).map(function(obj) {
					return gf_lieuById(obj.vers.id);
				});
				break;
			case 'LIEU':
				result.push(this.targetObj);
				break;
		}
		return result;
	},
	// For the background tiles display
	'tileUrl'(doc,x,y,zoom,backgroundUrlTemplate) {
		return backgroundUrlTemplate.replace("{z}",zoom).replace("{x}",x).replace("{y}",y);
	},
	'xTile'(x) {
		return 256 * x;
	},
	'yTile'(y) {
		return 256 * y;
	},
	// For the doc tiles
	'docTileUrl'(doc,x,y,zoom,docCroppedIsChecked) {
		if (docCroppedIsChecked) {
			return doc.specif.GEO_REF_tilesUrl.replace("{z}",zoom).replace("{x}",x).replace("{y}",y).replace("/tiled/","/tiledCropped/");
		}
		else {
			return doc.specif.GEO_REF_tilesUrl.replace("{z}",zoom).replace("{x}",x).replace("{y}",y);
		}
	},
	// LIEUx icons layer 
	'pointCoordinates'() {
		return WmtsViewerLib.pixelsFromLatLng(this.latLng,Template.instance().zoom.get());
	},
	'placeName'() {
		return parametresClient.genreLieu[this.genre] + " " + this.nom;
	},
	// For the scale
	'scale'(latLng,zoom) {
		var metersFor200px = WmtsViewerLib.metersPerPixels(WmtsViewerLib.latLngFromWmts(latLng,zoom),zoom)*200;
		// We look at the rounded value nearest to this distance
		var nearestDistance = Math.round(metersFor200px / Math.pow(10,Math.floor(Math.log10(metersFor200px)))) * Math.pow(10,Math.floor(Math.log10(metersFor200px)))
		// We calculate the corresponding pixels
		var correspondingPixels = (nearestDistance/metersFor200px)*200
		return {
			distance:	nearestDistance,
			pixels:		 correspondingPixels
		};
	},
	// For the docOpacityObject
	'docOpacity'(docId) {
		return Template.instance().docOpacityObject.get()[docId];
	},
	'svgDocOpacity'(docId) {
		return Template.instance().docOpacityObject.get()[docId]/100;
	},
	'globalDocOpacity'() {
		return Template.instance().globalDocOpacity.get();
	}
});

// -----------------------------------------------------------------
// TEMPLATE wmtsViewer EVENTS
// -----------------------------------------------------------------
Template.wmtsViewer.events({
	// Link on cursors --------------------------
	'click .linkedPlace': function(e,tpl){
		Router.go('/lieu/infos/' + this._id);
		e.stopPropagation();
	},
	// SPAN management --------------------------
	'mousedown svg' :  function(e,tpl) {
		e.preventDefault();
		tpl.xMouseInitial.set(e.clientX);
		tpl.yMouseInitial.set(e.clientY);
		tpl.displayCenterGtsInitial.set(Template.instance().displayCenterGts.get());
		tpl.spanMode.set(true);
	},	
	'mouseup svg' : function(e,tpl) {
		e.preventDefault();
		tpl.spanMode.set(false);
		// Click without dragging detection
		if (!tpl.dragged.get()) {
			// Click to go to a linked place
			if (e.target.parentElement.getAttribute("class") == "linkedPlace") {
				// Will trigger by bubbling
			}
			// Click to add point
			else {
				// Only if DOC type and georeferenced doc 
				if (	Template.currentData()
						&& Template.currentData().type === "DOC" 
						&& isGeoReferenced(Template.currentData().targetObj)) {
					// Get directly the GTS position of the cursor (even when spanning and zooming)
					svg = document.getElementById("map");
					var pt = svg.createSVGPoint();
					pt.x = e.clientX; 
					pt.y = e.clientY;
					var pixelCursorPosition =  pt.matrixTransform(svg.getScreenCTM().inverse());
					// Get the latLng cursor position
					var latLngCursorPosition = WmtsViewerLib.latLngFromPixels(pixelCursorPosition,tpl.zoom.get());
					// We change the settings of the place in the database
					var docFocus = Template.currentData().targetObj;
					// On définit les paramètres de la fenêtre modale
					
					// ?????????????????????????????????
					// Préremplir la commune quand c'est possible
					// ?????????????????????????????????
					
					var parms = {
						title:			"Géolocaliser un lieu",
						filter:			{'nature':"LIEUDIT"},
						// lockedFields:	["nature"],
						clearButton:	false,
						addButton:		true,
						callback: lieuSelectedCallback(docFocus,latLngCursorPosition)
					}
					// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
					Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
				}
				else toastr.warning("Choisir un document géo-référencé pour ajouter/modifier une position");
			}
		}
		tpl.dragged.set(false);
	},
	'mousemove svg' : function(e,tpl) {
		e.preventDefault();
		// If mode span
		if ( tpl.spanMode.get()) {
			tpl.dragged.set(true);
			// Span calculus
			var xSpan = tpl.xMouseInitial.get() - e.clientX; 
			var ySpan = tpl.yMouseInitial.get() - e.clientY;
			// Change the display center GTS coordinates
			Template.instance().displayCenterGts.set({
				x: 		tpl.displayCenterGtsInitial.get().x + (xSpan/256),
				y: 		tpl.displayCenterGtsInitial.get().y + (ySpan/256),
				zoom: 	tpl.displayCenterGtsInitial.get().zoom
			});
			// New tiles limits calculation
			newTilesLimitsCalculation(tpl);
		}
	},
	// ZOOM management --------------------------
	'click #plus': function(e,tpl){
		e.preventDefault();
		zoomPlus(tpl);
	},
	'click #minus': function(e,tpl){
		e.preventDefault();
		zoomMinus(tpl);
	},
	// Zoom level change with mouse roller
	// For Firefox and for Chrome, IE to be tested
	'DOMMouseScroll .zoomable, mousewheel .zoomable': function(e,tpl){
		e.preventDefault();
		// Chrome or IE			
		if (window.event) {
			// Chrome ou IE
			var e = window.event || e;
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); 
		}
		// Firefox
		else var delta = -e.originalEvent.detail/3;
		// Both
		if (delta != 0) {
			if (delta < 0) zoomMinus(tpl);
			else zoomPlus(tpl);
		}
	},
	// Form management
	'change #placeIconsCheckBox': function(e,tpl){
		e.preventDefault();
		tpl.placeIconsIsChecked.set(e.target.checked);
	},
	'change #docCroppedCheckBox': function(e,tpl){
		e.preventDefault();
		tpl.docCroppedIsChecked.set(e.target.checked);
	},
	'change #rectAroundCheckBox': function(e,tpl){
		e.preventDefault();
		tpl.rectAroundIsChecked.set(e.target.checked);
	},
	'change #backgroundLayerSelect': function(e,tpl){
		e.preventDefault();
		tpl.backgroundUrlTemplate.set(e.target.value);
	},
	'change #displayTilesCoordinatesCheckBox': function(e,tpl){
		e.preventDefault();
		tpl.displayTilesCoordinatesIsChecked.set(e.target.checked);
	},
	// Opacity management
	'input .opacity_slider, change .opacity_slider': function(e,tpl){
		e.preventDefault();
		var newOpacity = e.target.value;
		var docOpacityObject = tpl.docOpacityObject.get();
		docOpacityObject[this._id] = newOpacity;
		tpl.docOpacityObject.set(docOpacityObject);
	},
	'input #globalOpacity_slider, change #globalOpacity_slider': function(e,tpl){
		e.preventDefault();
		var globalDocOpacity = e.target.value;
		// We set docOpacity to this value for all documents
		var docOpacityObject = tpl.docOpacityObject.get();
		for (var prop in docOpacityObject) {
			if (Object.prototype.hasOwnProperty.call(docOpacityObject, prop)) {
				docOpacityObject[prop] = globalDocOpacity;
			}
		}
		tpl.globalDocOpacity.set(globalDocOpacity);
		tpl.docOpacityObject.set(docOpacityObject);
	},
});