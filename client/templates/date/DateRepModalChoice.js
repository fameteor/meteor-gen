// ==============================================
// TEMPLATE DateRepModalChoice 
// ==============================================
// Common function ------------------------------
var checkValidity = function(name,value,reactiveVar) {
	var validityCheck = reactiveVar.get();
	if (value === "") {
		validityCheck[name].error = true;
		validityCheck[name].helpText = "Choisir une valeur";
	}
	else {
		validityCheck[name].error = false;
		validityCheck[name].helpText = "";
	}
	reactiveVar.set(validityCheck);
}

// ==============================================
Template.DateRepModalChoice.onCreated (function () {
	// For validity check errors reporting
	this.validityCheck = new ReactiveVar({
		'repDay': 		{'error':false,'helpText':""},
		'repMonth': 	{'error':false,'helpText':""},
		'repYear': 		{'error':false,'helpText':""},
	});
	// Initial republican date if available and complete
	if (	this.data 
			&& this.data.date
			&& this.data.date.jour
			&& this.data.date.mois
			&& this.data.date.annee
			&& CalendrierRepublicain.estJourRepublicain(this.data.date.jour,this.data.date.mois,this.data.date.annee)){
		this.initialRepDate = new ReactiveVar(CalendrierRepublicain.gregToRep(this.data.date.jour,this.data.date.mois,this.data.date.annee));
		
	}
	else {
		this.initialRepDate = new ReactiveVar({jour:"",mois:"",annee:"",text:""});
	}
});

// ==============================================
Template.DateRepModalChoice.helpers({
	'hasError'(inputName) {
		return Template.instance().validityCheck.get()[inputName].error ? "has-error" : "";
	},
	"validityCheck"() {
		return Template.instance().validityCheck.get();
	},
	"repDaySelectedIf"(selectedValue) {
		return selectedValue == Template.instance().initialRepDate.get().jour ? "selected" : "";
	},
	"repMonthSelectedIf"(selectedValue) {
		return selectedValue == Template.instance().initialRepDate.get().mois ? "selected" : "";
	},
	"repYearSelectedIf"(selectedValue) {
		return selectedValue == Template.instance().initialRepDate.get().annee ? "selected" : "";
	},
	"repDays"() {
		return [
			{value:1,label:"1"},
			{value:2,label:"2"},
			{value:3,label:"3"},
			{value:4,label:"4"},
			{value:5,label:"5"},
			{value:6,label:"6"},
			{value:7,label:"7"},
			{value:8,label:"8"},
			{value:9,label:"9"},
			{value:10,label:"10"},
			{value:11,label:"11"},
			{value:12,label:"12"},
			{value:13,label:"13"},
			{value:14,label:"14"},
			{value:15,label:"15"},
			{value:16,label:"16"},
			{value:17,label:"17"},
			{value:18,label:"18"},
			{value:19,label:"19"},
			{value:20,label:"20"},
			{value:21,label:"21"},
			{value:22,label:"22"},
			{value:23,label:"23"},
			{value:24,label:"24"},
			{value:25,label:"25"},
			{value:26,label:"26"},
			{value:27,label:"27"},
			{value:28,label:"28"},
			{value:29,label:"29"},
			{value:30,label:"30"},
			{value:31,label:"1er compl. (Vertu)"},
			{value:32,label:"2ième compl. (Génie)"},
			{value:33,label:"3ième compl. (Travail)"},
			{value:34,label:"4ième compl. (Opinion)"},
			{value:35,label:"5ième compl. (Récompenses)"},
			{value:36,label:"6ième compl. (Révolution)"}
		];
	},
	"repMonths"() {
		return [
			{value:1,label:"Vendémiaire"},
			{value:2,label:"Brumaire"},
			{value:3,label:"Frimaire"},
			{value:4,label:"Nivôse"},
			{value:5,label:"Pluviôse"},
			{value:6,label:"Ventôse"},
			{value:7,label:"Germinal"},
			{value:8,label:"Floréal"},
			{value:9,label:"Prairial"},
			{value:10,label:"Messidor"},
			{value:11,label:"Thermidor"},
			{value:12,label:"Fructidor"},
			{value:12,label:"jours compl. ou Sans-culottides"}
		];
	},
	"repYears"() {
		return [
			{value:1,label:"An I"},
			{value:2,label:"An II"},
			{value:3,label:"An III"},
			{value:4,label:"An IV"},
			{value:5,label:"An V"},
			{value:6,label:"An VI"},
			{value:7,label:"An VII"},
			{value:8,label:"An VIII"},
			{value:9,label:"An IX"},
			{value:10,label:"An X"},
			{value:11,label:"An XI"},
			{value:12,label:"An XII"},
			{value:13,label:"An XIII"},
			{value:14,label:"An XIV"}
		];
	}
});

// ==============================================
Template.DateRepModalChoice.events = {
	'submit': function (evt,tpl) {
		evt.preventDefault();
		const repDay = evt.target.repDay.value;
		const repMonth = evt.target.repMonth.value;
		const repYear = evt.target.repYear.value;
		// We check the validity
		checkValidity("repDay",repDay,Template.instance().validityCheck);
		checkValidity("repMonth",repMonth,Template.instance().validityCheck); 
		checkValidity("repYear",repYear,Template.instance().validityCheck); 
		// If valid, we try to run the callback and close the popup
		var validityCheck = Template.instance().validityCheck.get();
		if( !validityCheck.repDay.error 
				&& !validityCheck.repMonth.error
				&& !validityCheck.repYear.error) {
			if (	tpl.data 
					&& tpl.data.callback 
					&& _.isFunction(tpl.data.callback)) {
				this.callback(CalendrierRepublicain.repToGreg(repDay,repMonth,repYear));
			}
			// We close the popup
			Modal.hide(Template.instance());
		}
	},
	'change select[name="repDay"]': function (evt,tpl) {
		checkValidity("repDay",evt.target.value,Template.instance().validityCheck);
	},
	'change select[name="repMonth"]': function (evt,tpl) {
		checkValidity("repMonth",evt.target.value,Template.instance().validityCheck);
	},
	'change select[name="repYear"]': function (evt,tpl) {
		checkValidity("repYear",evt.target.value,Template.instance().validityCheck);
	}
};