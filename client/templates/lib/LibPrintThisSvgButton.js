// ==============================================
// TEMPLATE LibPrintThisSvgButton
// ==============================================
Template.LibPrintThisSvgButton.events({
	"click #printButton" : function (e,tpl) {
		e.preventDefault();
		var svg = this.svgTemplate.find("svg");
		if (svg) {
			// On regarde la largeur et hauteur de la viewBox
			var viewBox = svg.getAttribute("viewBox");
			var width 	= viewBox.split(" ")[2];
			var height 	= viewBox.split(" ")[3];
			// On récupère le code SVG
			var serializer = new XMLSerializer();
			var svgCode = serializer.serializeToString(svg);
			// Information de demande d'impression
			toastr.success("Chargement de l'image en cours, veuillez patienter !");
			// On appelle la méthode d'impression
			var that = this;
			Meteor.call(
				'svgToPngDownload', 
				svgCode, 
				width , 
				height,
				that.cssFile,
				function (err, response) {
					if (err) 	toastr.error(err.reason,"Impossible de convertir en jpeg");
					else 	{
						// On tranforme la réponse en base64 en Blob
						var binary = atob(response.replace(/\s/g, '')); // Remove space for IE compatibility
						var len = binary.length;						// get binary length
						var buffer = new ArrayBuffer(len);				// create ArrayBuffer with binary length
						var view = new Uint8Array(buffer);				// create 8-bit Array
						for (var i = 0; i < len; i++) {					// save unicode of binary data into 8-bit Array
							view[i] = binary.charCodeAt(i);
						}
						var blob = new Blob( [view], {type: "image/png"});
						// On définit le nom du fichier
						nomFichier = that.fileName + ".png";
						// On enregistre sur le navigateur le fichier
						saveAs(blob, nomFichier);   
				}
			});
		}
		else toastr.error("L'image n'est pas disponible.");
	},
});

// ==============================================
// TEMPLATE LibPrintThisSvgButton_DOCAUTO
// ==============================================
Template.LibPrintThisSvgButton_DOCAUTO.helpers({
	'svgTemplate'() {
		// For SVG printing, return the template containing the svg to print
		return Template.instance();
	},
});