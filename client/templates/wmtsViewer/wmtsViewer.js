/* -----------------------------------------------------------------
Pour un bon fonctionnement, il faut installer les modules NPM suivant :
- meteor npm install --save leaflet
- meteor npm install --save leaflet.control.opacity
- meteor npm install --save leaflet.fullscreen

Mais les fichiers CSS de ces libraires importent des images. Pour que cela fonctionne, il faut modifier l'URL des CSS
et copier ces CSS dans :
- wmtsViewer/lib/leaflet.css
- wmtsViewer/lib/Control.FullScreen.css
- wmtsViewer/lib/L.Control.Opacity.css

en mettant les images dans les directories :
- /public/images_leaflet
- /public/images_leaflet_fullscreen
- /public/images_leaflet.opacity.control

Il faudra donc modifier ces CSS et les images si nécessaire suite à une montée de version de la librairie

*/
// Import des librairies -------------------------------------------
import 'leaflet/dist/leaflet'
import 'leaflet.control.opacity/dist/L.Control.Opacity'
import 'leaflet.fullscreen/Control.FullScreen.js'

// -----------------------------------------------------------------
// Variables GLOBAL to this template
// -----------------------------------------------------------------
var map = 							null;
var layer1_allLieuxditsMarkers = 	null;
var layer2_draggableMarkers = 		null;
var layer3_docs = 					null;
var type = 							null;
var targetObj = 					null;
var opacityControl = 				null;
var cropped =						false;

// -----------------------------------------------------------------
// LEAFLET icons creation
// -----------------------------------------------------------------
var blueIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-blue.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var goldIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-gold.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var redIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-red.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-green.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-orange.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-yellow.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-violet.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-grey.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: '/images_leaflet_markers/marker-icon-black.png',
	shadowUrl: '/images_leaflet_markers/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// -----------------------------------------------------------------
// Default parameters
// -----------------------------------------------------------------
var defaultParms = {
	// Point central par défaut : l'église du Perrier
	'defaultMapCenter' : {
		'lat':	46.820169,
		'lng':	-1.993933
	},
	'backgroundLayer': {
		'Cartes IGN (local)': 	new L.tileLayer(
			'http://marais.dev.com/marais/fondCartes/cartes_IGN/{z}/{x}/{y}.jpg', 
			{
				attribution: ' &copy; Copyright service d\'images tuilées <a href="https://geoservices.ign.fr/documentation/geoservices/wmts.html">IGN</a>',
				maxZoom: 	17,
				minZoom:	10,
				id: 		'cartesLocal'
			}
		),
		'Photos IGN (local)': 	new L.tileLayer(
			'http://marais.dev.com/marais/fondCartes/photos_IGN/{z}/{x}/{y}.jpg', 
			{
				attribution: ' &copy; Copyright service d\'images tuilées <a href="https://geoservices.ign.fr/documentation/geoservices/wmts.html">IGN</a>',
				maxZoom: 	17,
				minZoom:	10,
				id: 		'photosLocal'
			}
		),
		"Cartes IGN (web)": 	new L.tileLayer(
			'https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg', 
			{
				attribution: ' &copy; Copyright service d\'images tuilées <a href="https://geoservices.ign.fr/documentation/geoservices/wmts.html">IGN</a>',
				maxZoom: 	18,
				minZoom:	2,
				id: 		'cartesWeb'
			}
		),
		"Photos IGN (web)": 	new L.tileLayer(
			'https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg', 
			{
				attribution: ' &copy; Copyright service d\'images tuilées <a href="https://geoservices.ign.fr/documentation/geoservices/wmts.html">IGN</a>',
				maxZoom: 	19,
				minZoom:	2,
				id: 		'photosWeb'
			}
		),
		"OpenStreetMap (web)": 	new L.tileLayer(
			'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 
			{
				attribution:  ' &copy; Copyright <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 	19,
				minZoom:	2,
				id: 		'openStreetMap'
			}
		)		
	}
};

// -----------------------------------------------------------------
// Function to check if a doc is georeferenced
// -----------------------------------------------------------------
var isGeoReferencedDoc = function(doc) {
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
// Function to center map
// -----------------------------------------------------------------
var getMapCenter = function() {
	// Set the default map center position 
	var center = defaultParms.defaultMapCenter;
	if (type) {
		switch(type) {
			case "DOC":
				// The center is the middle of the geo-referenced document
				if (isGeoReferencedDoc(targetObj)) {
					center = {
						'lat': (targetObj.specif.GEO_REF_coordPoint1.lat + targetObj.specif.GEO_REF_coordPoint2.lat) / 2,
						'lng': (targetObj.specif.GEO_REF_coordPoint1.lng + targetObj.specif.GEO_REF_coordPoint2.lng) / 2
					};
				}
				break;
			case "LIEU":
				if (targetObj) 	center = targetObj.latLng;
				break;
			default:
				console.log('"wmtsViewer" template error : unsupported "type" parameter in the "getMapCenter" function : ' + type);
			case "NONE":
				break;
		};
	}
	else {
		console.log('"wmtsViewer" template error : no "type" parameter in the "getMapCenter" function');
	}
	return center;
};

// -----------------------------------------------------------------
// draggableMarkersRefresh
// -----------------------------------------------------------------
var draggableMarkersRefresh = function() {
	if (type === "LIEU" && targetObj && targetObj.latLng ) {
		// We clear the existing markers
		layer2_draggableMarkers.clearLayers();
		// We add the marker
		var marker = L.marker(
			targetObj.latLng, 
			{
				icon:		redIcon,
				draggable: 	true
			}
		);
		// We add data to the marker
		marker.lieu = targetObj;
		// With a popup showing the place name
		marker.bindPopup(parametresClient.genreLieu[targetObj.genre] + " " + targetObj.nom);
		// Displayed on mouse over
		marker.on(
			'mouseover', 
			function (e) {
				this.openPopup();
			}
		);
		marker.on('dragend', function(e) {
			if (confirm("Voulez-vous déplacer le lieu " + parametresClient.genreLieu[e.target.lieu.genre] + " " + e.target.lieu.nom + " ?")) Lieux.update({_id : e.target.lieu._id},{$set:{latLng : e.target._latlng}});
		});
	
		// We add the marker to the markers layer
		layer2_draggableMarkers.addLayer(marker);
	}
}


// -----------------------------------------------------------------
// docsRefresh
// -----------------------------------------------------------------
var docsRefresh = function() {
	var docLayers = {}; 
	// We clear the layer
	layer3_docs.clearLayers();
	// We find the associated docs
	var geoRefsDocsList = [];
	switch (type) {
		case 'DOC':
			// If geo referenced
			if (isGeoReferencedDoc(targetObj)) geoRefsDocsList.push(targetObj);
			break;
		case 'LIEU':
			// Find all docs with geoRefs link to this place
			var linkedDocsIdsList = Liens.find({
				"pour.type":"DOC",
				"vers.id":targetObj._id,
				"vers.type":"LIEU"
			}).fetch().map(function(obj){
				return obj.pour.id
			});
			geoRefsDocsList = Docs.find({
				_id:{$in: linkedDocsIdsList},
				codage:"GEO_REF",
				"specif.GEO_REF_coordPoint1.lat":{"$exists":true},
				"specif.GEO_REF_coordPoint1.lng":{"$exists":true},
				"specif.GEO_REF_coordPoint2.lat":{"$exists":true},
				"specif.GEO_REF_coordPoint2.lng":{"$exists":true},
				"specif.GEO_REF_tilesUrl":{"$exists":true},
			},{sort: {titre: 1}}).fetch();
			break;		
	}
	// We create a layer for each doc
	geoRefsDocsList.map(function(doc) {
		var layer = new L.tileLayer(
			cropped ? doc.specif.GEO_REF_tilesUrl.replace("/tiled/","/tiledCropped/") : doc.specif.GEO_REF_tilesUrl, 
			{
				attribution: ' &copy; Copyright <a href="archives.vendee.fr">archives départementales 85</a>',
				maxZoom: 	17,
				minZoom:	10,
				id: 		doc._id
			}
		);
		layer3_docs.addLayer(layer);
		docLayers[doc.titre] = layer; 
	});
	// We delete and recreate the opacity control
	if (opacityControl) {
		//?????????????????????????????
		// Do not work
		map.removeControl(opacityControl);
		
	}
	//?????????????????????????????
	opacityControl = L.control.opacity(
		docLayers,
		{
			collapsed: 	true,
			// label:		"opacité"
		}
	).addTo(map);
	//?????????????????????????????
}

// -----------------------------------------------------------------
// layer1_allLieuxditsMarkersRefresh
// -----------------------------------------------------------------
var layer1_allLieuxditsMarkersRefresh = function() {
		// We clear the existing markers
		layer1_allLieuxditsMarkers.clearLayers();
		// We get all the bounded places
		var bounds = map.getBounds();
		var boundedPlaces = Lieux.find({
			"latLng.lat":{$lt:bounds._northEast.lat,$gt:bounds._southWest.lat},
			"latLng.lng":{$lt:bounds._northEast.lng,$gt:bounds._southWest.lng},
		}).fetch();
		var result = []
		// We create a maker for all bounded places
		boundedPlaces.map(function(place) {
			// We create a marker for that place
			var marker = L.marker(
				place.latLng, 
				{
					icon:greenIcon
				}
			);
			// With a popup showing the place name
			marker.bindPopup(parametresClient.genreLieu[place.genre] + " " + place.nom);
			// Displayed on mouse over
			marker.on(
				'mouseover', 
				function (e) {
					this.openPopup();
				}
			);
			// And go to this place page when clicked
			marker.on(
				'click', 
				function() {
						Router.go('/lieu/infos/' + place._id);
				}
			);
			// We add the marker to the markers layer
			layer1_allLieuxditsMarkers.addLayer(marker);
		});
	}

// -----------------------------------------------------------------
// TEMPLATE wmtsViewer ONCREATED
// -----------------------------------------------------------------
Template.wmtsViewer.onCreated (function () {
	
});

// -----------------------------------------------------------------
// TEMPLATE wmtsViewer HELPERS
// -----------------------------------------------------------------
Template.wmtsViewer.helpers({
	'helperToReinitialiseMapWhenDataChanges'() {
		type = this.type;
		targetObj = this.targetObj;
		// If map is loaded
		if (map) {
			map.panTo(getMapCenter());
			docsRefresh();
		}
	}
});
	
// -----------------------------------------------------------------
// TEMPLATE wmtsViewer EVENTS
// -----------------------------------------------------------------
Template.wmtsViewer.events({
	
});
	
// -----------------------------------------------------------------
// TEMPLATE wmtsViewer ONRENDERED
// -----------------------------------------------------------------
Template.wmtsViewer.onRendered (function () {
	// Set global variables ----------------------------------------
	type = this.data.type;
	targetObj = this.data.targetObj;
	// Map instance initialisation ---------------------------------
	map = L.map(
		'mapid', 
		{
			center: getMapCenter(),
			zoom: 14,
			zoomControl: true,
			fullscreenControl: true,
			// Default background layer value
			layers: [defaultParms.backgroundLayer["Cartes IGN (local)"]]
		}
	);
	// Map layers added --------------------------------------------
	layer1_allLieuxditsMarkers = 	L.layerGroup().addTo(map);
	layer2_draggableMarkers = 		L.layerGroup().addTo(map);
	layer3_docs = 					L.layerGroup().addTo(map);
	// AddLayer
	const addLayers = {
		'<i class="glyphicon glyphicon-globe"></i> lieu actuel':layer2_draggableMarkers,
		'<i class="glyphicon glyphicon-globe"></i> tous les lieux': layer1_allLieuxditsMarkers,
		'<i class="glyphicon glyphicon-file"></i> document(s) associé(s)': layer3_docs
	};
	// Add the docs and docs opacity control -----------------------
	docsRefresh();
	// Add the layer display control -------------------------------
	L.control.layers(
		defaultParms.backgroundLayer,
		addLayers,
		{
		collapsed: false
		}
	).addTo(map);
	// Update all fixed markers ------------------------------------	
	layer1_allLieuxditsMarkersRefresh();
	// Update all draggable markers --------------------------------
	draggableMarkersRefresh();
	// Add the scale -----------------------------------------------
	L.control.scale(
		{
			maxWidth:200,
			metric:true,
			imperial:false
		}
	).addTo(map);
	// Click on the map management (outside markers) ---------------
	map.on('click', function(e) {        
        // On définit le callback
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
			callback: lieuSelectedCallback(null,e.latlng)
		}
		// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
		Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
    });
	// When display bounds change due to zoom or span ---------------
	map.on('moveend', function() { 
		layer1_allLieuxditsMarkersRefresh();
		draggableMarkersRefresh()
	});
	
	// Custom control for cropping documents ------------------------
	L.Control.Cropped = L.Control.extend({
		onAdd: function (map) {
			var div = L.DomUtil.create('div', 'command');
			div.setAttribute("class","leaflet-control-layers leaflet-control-layers-expanded leaflet-control");
			// div.setAttribute('aria-haspopup', true);
			div.innerHTML = '<form><div><label><input id="command" type="checkbox"/> détourer le(s) document(s)</div></label></form>'; 
			return div;
		},

		onRemove: function(map) {
			// Nothing to do here
		}
	});

	L.control.cropped = function(opts) {
		return new L.Control.Cropped(opts);
	}

	L.control.cropped({ position: 'topright'}).addTo(map);
	
	// add the event handler
	function handleCommand(e) {
		cropped = this.checked;
		docsRefresh();
		e.stopPropagation();
	}

	document.getElementById ("command").addEventListener ("click", handleCommand, false);
});