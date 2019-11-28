
var markers = [];
var markersListeners = [];
var docsLayers = {};

var defaultSettings = {
	minZoom:		12,
	maxZoom:		19,
	initialZoom :			{
		"COMMUNE":	12,
		"LIEUDIT":	16,
		"cadastre":	14,
		"default":	15
	},
	center:			{lat:46.8088279,lng:-2.0012319},
	initialOpacity:	100
};

var icons = {
	nonEditable: "http://maps.google.com/mapfiles/kml/paddle/red-circle.png",
	editable: "http://maps.google.com/mapfiles/kml/paddle/grn-circle.png"
};
/*
http://maps.google.com/mapfiles/kml/paddle/red-circle.png
http://maps.google.com/mapfiles/kml/paddle/grn-circle.png
http://maps.google.com/mapfiles/kml/paddle/purple-circle.png
http://maps.google.com/mapfiles/kml/paddle/orange-circle.png
http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png
http://maps.google.com/mapfiles/kml/paddle/wht-circle.png
http://maps.google.com/mapfiles/kml/paddle/blu-circle.png
http://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png
http://maps.google.com/mapfiles/kml/paddle/pink-circle.png
*/

var getInitialZoom = function(lieuFocus,docFocus) {
	if (lieuFocus) {
		switch(lieuFocus.nature) {
			case "LIEUDIT":
				return defaultSettings.initialZoom.LIEUDIT;
				break;
			case "COMMUNE":
				return defaultSettings.initialZoom.COMMUNE;
				break;
			default:
				return defaultSettings.initialZoom.default;
				break;
		}
	}
	else {
		if (docFocus) 	return defaultSettings.initialZoom.cadastre;
		else 			return defaultSettings.initialZoom.default;
	}
}

var isGeoReferenced = function(doc) {
	if (	doc 
			&& doc.codage == "GEO_REF"
			&& doc.specif
			&& doc.specif.GEO_REF_coordPoint1
			&& doc.specif.GEO_REF_coordPoint2
			&& doc.specif.GEO_REF_coordPoint1.lat
			&& doc.specif.GEO_REF_coordPoint1.lng
			&& doc.specif.GEO_REF_coordPoint2.lat
			&& doc.specif.GEO_REF_coordPoint2.lng ) 	return true
	else 												return false
}

var getMapCenter = function(lieuFocus,docFocus) {
	// ==================================
	// Map Center determination
	// ==================================
	// If lieuFocus exists
	if (	lieuFocus
			&& lieuFocus.latLng 
			&& lieuFocus.latLng.lat 
			&& lieuFocus.latLng.lng) {
		return new google.maps.LatLng(lieuFocus.latLng);

	}
	else {
		// If docFocus exists
		if (	docFocus 
				&& isGeoReferenced(docFocus)) {
			return new google.maps.LatLng(
				(docFocus.specif.GEO_REF_coordPoint1.lat + docFocus.specif.GEO_REF_coordPoint2.lat)/2,
				(docFocus.specif.GEO_REF_coordPoint1.lng + docFocus.specif.GEO_REF_coordPoint2.lng)/2
			);
		}
		else {
			// Centre par défaut
			return google.maps.LatLng(defaultSettings.center);
		}
	}
}

var getTileUrlFunction = function(doc,map) {
	return function(coord, zoom) {
		var mappedDocumentBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(doc.specif.GEO_REF_coordPoint1),
			new google.maps.LatLng(doc.specif.GEO_REF_coordPoint2)
		);
		var proj = map.instance.getProjection();
		var z2 = Math.pow(2, zoom);
		var tileXSize = 256 / z2;
		var tileYSize = 256 / z2;
		var tileBounds = new google.maps.LatLngBounds(
			proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
			proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
		);
		var x = coord.x >= 0 ? coord.x : z2 + coord.x
		var y = coord.y;
		
		// ?????????????????????????????????????????
		// A durcir
		// ?????????????????????????????????????????
		var toutouille = doc.urlDocument.split(".")[0].split("/");
		var nomExtraitCadastre = toutouille[toutouille.length - 1];
		
		if (	mappedDocumentBounds.intersects(tileBounds) 
				&& (defaultSettings.minZoom <= zoom) 
				&& (zoom <= defaultSettings.maxZoom)) {
			return "/marais/geo_refs/tiled/" + nomExtraitCadastre + "/" + zoom + "/" + x + "/" + y + ".png";
		}
		else
			return "https://www.maptiler.com/img/none.png";
	}
}

var markerDragendCallback = function(lieuFocus,docFocus,draggedLieu) {
	return function(event) {
		var pos = {
			"lat" : 	Math.round(event.latLng.lat()*1000000)/1000000,
			"lng" : 	Math.round(event.latLng.lng()*1000000)/1000000
		};
		// On enregistre dans la base la position
		Lieux.update({_id : draggedLieu._id} , {$set: {"latLng": pos}});
		toastr.success("Les coordonnées changées pour " + parametresClient.genreLieu[draggedLieu.genre] + " " + draggedLieu.nom + ".");
	}
}

var getLayerDocsCursor = function(lieuFocus,docFocus) {
	if (lieuFocus) {
		var docsIdList = Liens.find({
			"pour.type":"DOC",
			"vers":{id:lieuFocus._id,"type":"LIEU"}							
		}).map(function(obj) {
			return obj.pour.id;
		});
		return layerDocsCursor = Docs.find({
			_id:{$in:docsIdList},
			codage:"GEO_REF",
			"specif.GEO_REF_coordPoint1.lat":{$ne : null},
			"specif.GEO_REF_coordPoint1.lng":{$ne : null},
			"specif.GEO_REF_coordPoint2.lat":{$ne : null},
			"specif.GEO_REF_coordPoint2.lng":{$ne : null},
			
		});
	}
	else {
		if (docFocus) return layerDocsCursor = Docs.find(docFocus._id);
	}
};

var getOpacityPerLayerDocArray = function(layerDocsCursor) {
	return layerDocsCursor.fetch()
	.reduce(
		function(accu,current) {
			accu[current._id] = defaultSettings.initialOpacity;
			return accu;
		},
		{}
	)
};

var createdocsLayers = function(layerDocsCursor,map) {
	return layerDocsCursor.fetch().reduce(
		function(accu,doc) {
			var tilesLayer = new google.maps.ImageMapType({
				getTileUrl: getTileUrlFunction(doc,map),
				tileSize: new google.maps.Size(256, 256),
				isPng: true,
				name: doc.titre,
				alt: "Rendered with MapTiler Desktop",
				opacity: defaultSettings.initialOpacity/100
			});
			// We add the layer and add it to the docsLayers
			map.instance.overlayMapTypes.insertAt(0, tilesLayer);
			// We add the layer handler to the indexed list
			accu[doc._id] = tilesLayer;
			return accu;
		},
		{} // accu initial value is empty object 
	)
}

var addMarkerCallback = function(lieuFocus,docFocus) {
	return function(event) {
		if (lieuFocus) {
			toastr.warning("Pour ajouter des points, se positionner sur une vue du cadastre.");
		}
		else if(docFocus) {
			var lieuSelectedCallback = function(evt) {
						
				// ????????????????????????????
				// Faut-il mettre un warning si des coordonnées existent déjà ?
				// ????????????????????????????
				
				return function(idLieu) {
					// We add/modify the coordinates
					var request = {"$set": {"latLng": {lat:evt.latLng.lat(),lng:evt.latLng.lng()}}};
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
						console.log("Nb de liens entre ce doc et ce lieu : " + nblinks);
						if (nblinks === 0) {
							var res1 = Liens.insert(
								{
									pour: {id:docFocus._id,type:"DOC"},
									vers: {id:idLieu,type:"LIEU"},
									zone:"LAT_LNG"								
								}
							);
							console.log("Id du lien ajouté : " + res1);
						}
					}
					else console.log("Pas de lien ajouté");
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
				lockedFields:	["nature"],
				clearButton:	false,
				addButton:		true,
				callback: lieuSelectedCallback(event)
			}
			// On appelle la fenêtre modale avec paramètre et en interdisant la fermeture
			Modal.show('LieuChoisirModal',parms,{backdrop:'static',keyboard:false});
		}
	}
}

// ==============================================
// TEMPLATE GoogleMap
// ==============================================
Template.GoogleMap.helpers({
	// Options to start the map
	"myMapOptions"() {
		var that = this;
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded()) {
			// Zoom level determination
			var zoom = defaultSettings.zoom;
			// Returns map initialization options
			return {
				zoom: 				getInitialZoom(this.lieuFocus,this.docFocus),
				center:  			getMapCenter(this.lieuFocus,this.docFocus),
				mapTypeId: 			'hybrid',
				tilt:				0,
				streetViewControl: 	false
			};
		}
	},
	"layerDocsCursor"() {
		return Template.instance().layerDocsCursor.get();
	},
	"opacityPerLayerDoc"() {
		return Template.instance().opacityPerLayerDocArray.get()[this._id];
	},
	"pseudoHelperForReactivity"() {
		// When the template parameters change
		if (	(Template.instance().lieuFocusId.get() != (this.lieuFocus && this.lieuFocus._id)) 
				|| (Template.instance().docFocusId.get() != (this.docFocus && this.docFocus._id)) ) {
			// Set the new template parameters
			Template.instance().lieuFocusId.set(this.lieuFocus && this.lieuFocus._id);
			Template.instance().docFocusId.set(this.docFocus && this.docFocus._id);
			
			Template.instance().layerDocsCursor.set(getLayerDocsCursor(this.lieuFocus,this.docFocus));
			Template.instance().opacityPerLayerDocArray.set(getOpacityPerLayerDocArray(Template.instance().layerDocsCursor.get()));
			// Remove and recreate the click event listener to get the right context
			if (	GoogleMaps
					&& GoogleMaps.maps
					&& GoogleMaps.maps.myMap
					&& GoogleMaps.maps.myMap.instance) {
				// We change the center of the map
				GoogleMaps.maps.myMap.instance.setCenter(getMapCenter(this.lieuFocus,this.docFocus));
				// We change the initial zoom level
				GoogleMaps.maps.myMap.instance.setZoom(getInitialZoom(this.lieuFocus,this.docFocus));
				// Remove and recreate event listener
				google.maps.event.clearListeners(GoogleMaps.maps.myMap.instance, 'click');
				google.maps.event.addListener(
					GoogleMaps.maps.myMap.instance,
					'click',
					addMarkerCallback(that.lieuFocus,that.docFocus)
				);
				
				// Remove all tiles layers
				GoogleMaps.maps.myMap.instance.overlayMapTypes.clear();
				// Recreate all tiles layers
				docsLayers = createdocsLayers(Template.instance().layerDocsCursor.get(),GoogleMaps.maps.myMap);	
				// Delete all markers listeners and all markers
				markersListeners.map(function(currentListener) {
					google.maps.event.removeListener(currentListener);
				});
				markersListeners = [];
				markers.map(function(currentMarker) {
					currentMarker.setMap(null);
				});
				markers = [];
				// Recreate markers and listeners if not reactive
				if (this.lieuFocus) {
					var marker = new google.maps.Marker({
						draggable: 	true,
						icon : 		icons["editable"], // icons["nonEditable"]
						position: 	new google.maps.LatLng(this.lieuFocus.latLng.lat, this.lieuFocus.latLng.lng),
						map: 		GoogleMaps.maps.myMap.instance,
						title:		parametresClient.genreLieu[this.lieuFocus.genre] + " " + this.lieuFocus.nom,
						// We store the document _id on the marker in order 
						// to update the document within the 'dragend' event below.
						id: 		this.lieuFocus._id,
					});
					markersListeners.push(google.maps.event.addListener(
						marker,
						"dragend",
						markerDragendCallback(this.lieuFocus,this.docFocus,this.lieuFocus)
					));
					markers.push(marker);
				}
			}
		}
	}

});

Template.GoogleMap.events({
	'input .opacity_slider, change .opacity_slider': function(e,tpl){
		e.preventDefault();
		var newOpacity = e.target.value;
		var opacityArray = tpl.opacityPerLayerDocArray.get();
		opacityArray[this._id] = newOpacity;
		tpl.opacityPerLayerDocArray.set(opacityArray);
		// We change the opacity on the correct layer
		docsLayers[this._id].setOpacity(newOpacity/100);
	},
});

Template.GoogleMap.rendered = function() {
	// We load the google-maps package
	GoogleMaps.load({
		key:		Meteor.settings.public.GoogleMapsKey
	});
}

Template.GoogleMap.onCreated (function () {
	// Context variables
	var lieuFocus = this.data.lieuFocus;
	var docFocus = this.data.docFocus;
	this.lieuFocusId = new ReactiveVar(this.data.lieuFocus && this.data.lieuFocus._id);
	this.docFocusId = new ReactiveVar(this.data.docFocus && this.data.docFocus._id);
	// Reactive variables
	this.layerDocsCursor = new ReactiveVar(getLayerDocsCursor(lieuFocus,docFocus));
	this.opacityPerLayerDocArray = new ReactiveVar(getOpacityPerLayerDocArray(this.layerDocsCursor.get()));
	
	var that = this;

	// Once the map is ready.
	GoogleMaps.ready('myMap', function(map) {
		// ======================================
		// Markers management
		// ======================================
		if (lieuFocus) {
			// We add the marker
			var marker = new google.maps.Marker({
				draggable: 	true,
				icon : 		icons["editable"], // icons["nonEditable"]
				position: 	new google.maps.LatLng(lieuFocus.latLng.lat, lieuFocus.latLng.lng),
				map: 		map.instance,
				title:		parametresClient.genreLieu[lieuFocus.genre] + " " + lieuFocus.nom,
				// We store the document _id on the marker in order 
				// to update the document within the 'dragend' event below.
				id: 		lieuFocus._id,
			});
			// We add the drag and drop listener
			markersListeners.push(google.maps.event.addListener(
				marker,
				"dragend",
				markerDragendCallback(lieuFocus,docFocus,lieuFocus)
			));
			markers.push(marker);
		}
		else {
			if (docFocus) {
				// We make an array of all places that are referenced by that document
				var lieuxList = Liens.find({
					"pour": {"id":docFocus._id,"type":"DOC"},
					"vers.type":"LIEU",
					"zone":"LAT_LNG"								
				}).observe({  
					"added": function(document) {
						// Create a marker for the LIEU accociated ton this LIEN
						var lieu = Lieux.findOne(document.vers.id);
						var marker = new google.maps.Marker({
							draggable: 	false,
							icon : 		icons["nonEditable"],
							position: 	new google.maps.LatLng(lieu.latLng.lat, lieu.latLng.lng),
							map: 		map.instance,
							title:		parametresClient.genreLieu[lieu.genre] + " " + lieu.nom,
							// We store the document _id on the marker in order 
							// to update the document within the 'dragend' event below.
							id: 		document._id,
						});

						// When marker is click, go to lieu infos
						google.maps.event.addListener(
							marker,
							"click",
							function() {
								Router.go("/lieu/infos/" + lieu._id);
							}
						)
					}
				});
			}
			else {
				// No marker are displayed
			}
		}

		// ======================================
		// Tiles management
		// ======================================
		docsLayers = createdocsLayers(that.layerDocsCursor.get(),map);		
		
		// ======================================
		// Add marker
		// ======================================
		google.maps.event.addListener(
			map.instance,
			'click',
			addMarkerCallback(lieuFocus,docFocus)
		);

	});
});

// ==============================================
// TEMPLATE GoogleMap_DOCAUTO
// ==============================================
Template.GoogleMap_DOCAUTO.helpers({
	// Options to start the map
	'cadastreLePerrierA2'() {
		return gf_docById("ifBf2akunZxXGBR6n");
	}
});