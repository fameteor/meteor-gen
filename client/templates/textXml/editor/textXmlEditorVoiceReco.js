// ==============================================
// textXmlEditorVoiceReco
// ==============================================

// Améliorations à prévoir 
/*
- Quand une instance est en reco, cliquer sur une autre instance 
  arrête la reco en cours avant d'en lancer une autre.
- Gérer les mots encore en reco intermédiaire en cas d'un abort
*/

// ==============================================
// On created
// ==============================================
Template.textXmlEditorVoiceReco.onCreated (function () {
	// A l'initialisation du template, on crée une variable locales réactive
	// Cette variable indique l'état de l'exploration des enfants de cette personne
	this.audioTranscriptIsOn = new ReactiveVar(false);
});

// ==============================================
// Helpers
// ==============================================
Template.textXmlEditorVoiceReco.helpers({
	"audioTranscriptIsOn" : function () {
		return Template.instance().audioTranscriptIsOn.get();
	},
});

// ==============================================
// Events
// ==============================================
Template.textXmlEditorVoiceReco.events = {
	// Gestion du bouton DICTER/ ARRËTER la dictée
	'click #dicter': function (e,tpl) {
		e.preventDefault();
		// Pour garder le contexte
		var that = this;
		if (gf_audioTranscriptIsOn()) {
			// Si c'est mon instance qui est en reco, on l'arrête
			if (tpl.audioTranscriptIsOn.get())	recognition.stop();
			// Sinon, on affiche un warning
			else toastr.warning("Arrêter la reco en cours avant d'en lancer une autre");
		}
		// Si aucune instance n'est en reco
		else {
			// On prépare la reco vocale
			recognition = new webkitSpeechRecognition();
			recognition.lang = 'fr-FR';
			recognition.continuous = true;
			recognition.interimResults = true;
			var final_transcript = "";
			// Gestion de l'evt START
			recognition.onstart = function() {
				// On change les états globaux et locaux
				Session.set('audioTranscriptIsOn', true);
				tpl.audioTranscriptIsOn.set(true)
			};
			// Gestion de l'evt ERROR
			recognition.onerror = function(event) {
				// On change les états globaux et locaux
				Session.set('audioTranscriptIsOn', false);
				tpl.audioTranscriptIsOn.set(false);
				// On affiche et logue l'erreur
				toastr.warning("Reco vocale, erreur :  " + event.error);
				console.log("Reco vocale error : " + event.error);
			};
			// Gestion de l'evt END
			recognition.onend = function() {
				// On change les états globaux et locaux
				Session.set('audioTranscriptIsOn', false);
				tpl.audioTranscriptIsOn.set(false);
			};
			// Gestion de l'evt ONRESULT
			recognition.onresult = function(event) {
				var interim_transcript = "";
				if (typeof(event.results) == 'undefined') {
					recognition.onend = null;
					recognition.stop();
					return;
				}
				// On concatène les mots
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) 	final_transcript += event.results[i][0].transcript;
					else 							interim_transcript += event.results[i][0].transcript;
				}
				if (that.callback)	that.callback(interim_transcript,final_transcript);
			};
			// Gestion de l'evt onnomatch
			// recognition.onnomatch = function(event) {}
			// Gestion de l'evt onaudiostart
			// recognition.onaudiostart = function(event) {}
			// Gestion de l'evt onsoundstart
			// recognition.onsoundstart = function(event) {}
			// Gestion de l'evt onspeechstart
			// recognition.onspeechstart = function(event) {}
			// Gestion de l'evt onspeechend
			// recognition.onspeechend = function(event) {}
			// Gestion de l'evt onsoundend
			// recognition.onsoundend = function(event) {}
			// Gestion de l'evt onaudioend
			// recognition.onaudioend = function(event) {}
			// On lance la reco vocale
			recognition.start();
		}
	},
};

Template.textXmlEditorVoiceReco.onDestroyed(function () {
	// En cas de changement de page ou autre : disparition de ce template
	if (stop in recognition) recognition.stop();
});
