// -----------------------------------------------------------------
// WmtsViewerLib : WGS84 latitude/longitude, WMTS and pixels computation
// -----------------------------------------------------------------
/*
	When using Web Map Tiles Services (WMTS) images tiling system (like Google Maps, IGN, Openstreetmap...),
	we need to translate from/to Latitude/longitude to/from WMTS space and to/from pixels space.
	
	The following methods are available for this purpose :
	
	WGS84 lat/lng space						WMTS space							Pixel space
	
		{lat,lng} --------------------------> {x,y} --------------------------> {x,y}
				 wmtsFromLatLng(latLng,zoom)			pixelsFromWmts(gts)
				  <--------------------------		<--------------------------
					latLngFromWmts(gts,zoom)			wmtsFromPixels(pixels)
				  ------------------------------------------------------------>
								pixelsFromLatLng(latLng,zoom)
				  <------------------------------------------------------------
								latLngFromPixels(pixels,zoom)
		
	Nb1 : 0 <= zoom <= 23
	
	Nb2 : WMTS is zoom dependant. To have a good introduction, see the excellent article : https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/ .	
*/
WmtsViewerLib = {
	// -----------------------------------------------------------------
	// Function to get WMTS cordinates from WGS84 lat/lng coordinates and zoom level
	// -----------------------------------------------------------------
	wmtsFromLatLng : function (latLng,zoom) {
		var t = Math.pow(2,zoom);
		var s = 256/t;
		var siny =  Math.min(Math.max(Math.sin(latLng.lat* (Math.PI / 180)), -.9999),.9999);
		return {
			x: (128 + latLng.lng * (256/360))/s,
			y: (128 + 0.5 * Math.log((1 + siny) / (1 - siny)) * -(256 / (2 * Math.PI)))/s,
		};
	},

	// -----------------------------------------------------------------
	// Function to get lat/lng cordinates from WMTS coordinates and zoom level
	// -----------------------------------------------------------------
	latLngFromWmts : function (gts,zoom) {
		var t=Math.pow(2,zoom);
		var s=256/t;
		var pos = {
			x:	gts.x*s,
			y: 	gts.y*s,
		};
		return {
			lat: (2 * Math.atan(Math.exp((pos.y - 128) / -(256 / (2 * Math.PI)))) - Math.PI / 2)/ (Math.PI / 180),
			lng:  (pos.x - 128) / (256 / 360)
		};  
	},

	// -----------------------------------------------------------------
	// Function to get pixels cordinates from WMTS coordinates
	// -----------------------------------------------------------------
	pixelsFromWmts : function (gts) {
		return {
			x: gts.x * 256,
			y: gts.y * 256
		}
	},

	// -----------------------------------------------------------------
	// Function to get WMTS cordinates from pixels coordinates
	// -----------------------------------------------------------------
	wmtsFromPixels : function (pixels) {
		return {
			x: pixels.x / 256,
			y: pixels.y / 256
		}
	},

	// -----------------------------------------------------------------
	// Function to get pixels cordinates from lat/lng coordinates
	// -----------------------------------------------------------------
	pixelsFromLatLng : function (latLng,zoom) {
		return this.pixelsFromWmts(this.wmtsFromLatLng(latLng,zoom));
	},

	// -----------------------------------------------------------------
	// Function to get lat/lng cordinates from pixels coordinates
	// -----------------------------------------------------------------
	latLngFromPixels : function (pixels,zoom) {
		return this.latLngFromWmts(this.wmtsFromPixels(pixels),zoom);
	},
	
	// -----------------------------------------------------------------
	// Function to the map scale
	// -----------------------------------------------------------------
	metersPerPixels : function (latLng,zoom) {
		return 156543.03392 * Math.cos(latLng.lat * Math.PI / 180) / Math.pow(2, zoom);
	},
	

}
