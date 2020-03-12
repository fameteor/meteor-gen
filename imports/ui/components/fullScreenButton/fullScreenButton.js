import './fullScreenButton.html';
import './fullScreenButton.css';

/* ---------------------------------------------------------
Améliorations à faire :
- comprendre comment ca fonctionne avec boostrap (interférence avec images/icones sur bouton)
- passer en paramètre au template le positionnement
- détecter le fullscreen change et synchronier l'état du bouton avec la réalité (event ne marche pas)
--------------------------------------------------------- */ 

// ---------------------------------------------------------
// ON CREATED
// ---------------------------------------------------------
Template.fullScreenButton.onCreated (function () {
	this.isFullScreen = new ReactiveVar(false);
});

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------
Template.fullScreenButton.helpers({
	"isFullScreen" : function () {
		return Template.instance().isFullScreen.get();
	}
});

// ---------------------------------------------------------
// EVENTS
// ---------------------------------------------------------
Template.fullScreenButton.events = {
	'click .fullScreenButton': function (e,tpl) {
		e.preventDefault();
		const elem = e.target.parentNode;
		if (tpl.isFullScreen.get()) {
			// If fullscreen, exit fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) { 	/* Firefox */
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { 	/* IE/Edge */
				document.msExitFullscreen();
			}
		}
		else {
			// If not fullscreen, go to fullscreen
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) { 	/* Firefox */
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) { 	/* Chrome, Safari and Opera */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { 		/* IE/Edge */
				elem.msRequestFullscreen();
			}
		}
		// Toogle fullscreen state
		tpl.isFullScreen.set(!tpl.isFullScreen.get());
	},
	'mozfullscreenchange, webkitfullscreenchange, fullscreenchange': function (e,tpl) {
		console.log(document.fullScreenElement);
	}
};