// ==============================================
// TEMPLATE LibClipId 
// ==============================================
Template.LibClipId.events = {
	'click a.clipId': function (e,tpl) {
		e.preventDefault();
		if (window.getSelection) {  // W3C default
			var userSelection = window.getSelection();
			// On copie en sélectionnant l'identifiant entre parenthèses
			var textNode = tpl.find("#" + this._id).childNodes[0];
			var theRange = document.createRange();
			// On sélectionne les caractères de 0 à 7
			theRange.setStart(textNode, 0);
			theRange.setEnd(textNode, 17);
			userSelection.addRange(theRange);
			// On fait la copie du texte sélectionné
			try {
				// Copy it to the clipboard
				succeeded = document.execCommand("copy");
				toastr.success("ID copié");
			}
			catch (e) {
				// On affiche la popup error
				console.log("Error in module \"LibClipId.js\" : " + e);
				toastr.error("Error in module \"LibClipId.js\", cf. logs", "Copie impossible");
			}
			// On désélectionne le texte
			window.getSelection().removeAllRanges();	
		}
		else toastr.error("La copie ne fonctionne pas sur ce navigateur, utilisez Firefox");
	}
};