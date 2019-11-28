// ==============================================
// TEMPLATE LibChrono
// ==============================================
/* FONCTIONNEMENT :
Le SVG comprend deux zones verticales :
- la partie gauche, la "labelZone" 
- la partie droite, la "graphZone" dont l'axe X correspond à l'échelle des timestamps multipliés
par le facteur "pxPerTsUnit" de façon à ce que la largeur de la viewBox corresponde à la largeur
de la graphZone.
*/

var chronoSettings = {
	// Size, zoom and limits --------------------
	"svgWidth":							1000,
	"labelZoneWidth":					200,
	"zoomFactor":						1.2, 				// per scrollwheel event
	"maximumTsDuration": 				6460800000000,		// corresponds to roughly 300 years
	"minimumTsDuration":				1209600000,			// corresponds to roughly 2 weeks
	"minimumDateTs":					new Date(1498,4,7).getTime(),
	"maximumDateTs":					new Date().getTime(),
	"tsWidthForHistoryPoints":			315360000000,		// corresponds to roughly 10 years
	"tsMargin":							315360000000,		// For pers auto width settings only (roughly 10 years)
	// Legend and cursor position ---------------
	"yOffset_cursorText":				10,
	"yOffset_horizontalLegendAxis":		28,
	"yOffset_legendText":				23,
	// Persons positions ------------------------
	"xOffset_pers":						5,
	"xOffset_persType":					20,
	"yOffset_persLabel":				295,
	"pxPerPersLine":					25,
	// History periods --------------------------
	"yOffset_histPeriodslabel":			140,
	"xOffset_histPeriodText":			2,
	"yOffset_histPeriodText":			45,
	"pxPerHistPeriodLine":				15,
	"nbLinesHistPeriodText":			4,
	// Labels -----------------------------------
	"xOffset_histLabel":				25,
	"yOffset_histPeriodLabel":			80,
	// History points ---------------------------
	// ??????????????????????????????????????????
	// To be deleted
	"yOffset_generalHistPoints":		115,
	"yOffset_local2HistPoints":			145,
	// ??????????????????????????????????????????
	"yOffset_nationalHistPoints":		175,
	"yOffset_regionalHistPoints":		205,
	"yOffset_localHistPoints":			235,
	// Margin -----------------------------------
	"bottom_margin":					20
};

// Global functions

// Add years, months, days, hours, minutes, seconds and milliseconds to a timestamp to return a new timestamp
// Quantity is an objet  {"y"::number,"m"::number,"d"::number,"hh"::number,"mm"::number,"ss"::number,"ms"::number}
var addToTimestamp = function(ts,quantity) {
	// ??????????????????????????????
	// Add parameters checking
	// ??????????????????????????????
	if (ts) {
		var initialDate = new Date(ts);
		// We increment one month
		return new Date(
			initialDate.getFullYear() + quantity.y,
			initialDate.getMonth() + quantity.m,
			initialDate.getDate() + quantity.d,
			initialDate.getHours() + quantity.hh,
			initialDate.getMinutes() + quantity.mm,
			initialDate.getSeconds() + quantity.ss,
			initialDate.getMilliseconds() + quantity.ms,
		).getTime();
	}
};

Template.LibChrono.onCreated (function () {
	// Recalculés à chaque zoom
	this.stopTs				= new ReactiveVar(null);
	this.startTs			= new ReactiveVar(null);
	this.tsDuration			= new ReactiveVar(null);
	this.pxPerTsUnit  		= new ReactiveVar(null);
	this.cursorTs			= new ReactiveVar(null);
	this.cursorIsOn			= new ReactiveVar(false);
	// Drap and drop management
	this.dragDrop			= new ReactiveVar(false);
	this.initialPosition	= new ReactiveVar(0);
	// Min/Max zoom management
	this.zoomMinReached		= new ReactiveVar(false);
	this.zoomMaxReached		= new ReactiveVar(false);
	that = this;
	// Template specific functions :
	this.setCursorInMiddle	= function() {
		that.cursorTs.set((that.startTs.get() + that.stopTs.get())/2);
	};
	this.setStartStopTs = function(startTs,stopTs) {
		// If minimumDate reached, we set the limit
		if (startTs < chronoSettings.minimumDateTs) {
			stopTs = stopTs + (chronoSettings.minimumDateTs - startTs);
			startTs = chronoSettings.minimumDateTs;
		}
		// If maximumDate reached, we set the limit
		if (stopTs > chronoSettings.maximumDateTs) {
			startTs = startTs - (stopTs - chronoSettings.maximumDateTs);
			stopTs = chronoSettings.maximumDateTs;
		}
		//We set the reactives variables
		that.startTs.set(startTs);
		that.stopTs.set(stopTs);
		that.tsDuration.set(stopTs - startTs);
		that.pxPerTsUnit.set((chronoSettings.svgWidth - chronoSettings.labelZoneWidth) / (stopTs - startTs));
	};
	this.zoomOut = function() {
		// We reset zoomMaxReached
		that.zoomMaxReached.set(false);
		// Relative to cursor position (or the middle of the screen if no cursor visible)
		if ((that.tsDuration.get()) < chronoSettings.maximumTsDuration) {
			var leftSpan = that.cursorTs.get() - that.startTs.get();
			var rightSpan = that.stopTs.get() - that.cursorTs.get();
			that.setStartStopTs(
				that.cursorTs.get() - (leftSpan * chronoSettings.zoomFactor),
				that.cursorTs.get() + (rightSpan * chronoSettings.zoomFactor)
			);
		}
		else {
			// To display toastr once only
			if (!that.zoomMinReached.get()) 	toastr.warning("Zoom minimum atteint");
			that.zoomMinReached.set(true);
		}
	};
	this.zoomIn = function() {
		// We reset zoomMinReached
		that.zoomMinReached.set(false);
		// Relative to cursor position (or the middle of the screen if no cursor visible)
		if ((that.tsDuration.get()) > chronoSettings.minimumTsDuration) {
			var leftSpan = that.cursorTs.get() - that.startTs.get();
			var rightSpan = that.stopTs.get() - that.cursorTs.get();
			that.setStartStopTs(
				that.cursorTs.get() - (leftSpan / chronoSettings.zoomFactor),
				that.cursorTs.get() + (rightSpan / chronoSettings.zoomFactor)
			);
		}
		else {
			// To display toastr once only
			if (!that.zoomMaxReached.get()) 	toastr.warning("Zoom maximum atteint");
			that.zoomMaxReached.set(true);
		}
	};
	this.calculateStartStop = function(relativesList) {
		var startTs = null;
		var stopTs = null;
		// For PERS only
		if (that.data.pers) {
			for (indexPers in relativesList) {
				
				// ??????????????????????????????
				// A optimiser pour les dates incomplètes, et ajouter les tests sur les dates de mariage
				// ??????????????????????????????
				
				var currentPers = relativesList[indexPers].pers;
				// Test birth date
				if (	currentPers
						&& currentPers.naissance
						&& currentPers.naissance.date
						&& currentPers.naissance.date.a1) {
					var currentTs = gf_dateToTimestamp(currentPers.naissance.date)
					// initialisation
					if (startTs === null) {
						startTs = currentTs;
						stopTs =  currentTs;
					}
					// Other dates
					else {
						if (currentTs < startTs)	startTs = currentTs;
						if (currentTs > stopTs)		stopTs = currentTs;
					}
				}
				// Test estVivant or death date
				if (currentPers.estVivant) {
					stopTs = new Date().getTime();
				}
				else {
					if (	currentPers
							&& currentPers.deces
							&& currentPers.deces.date
							&& currentPers.deces.date.a1) {
						var currentTs = gf_dateToTimestamp(currentPers.deces.date)
						// initialisation
						if (startTs === null) {
							startTs = currentTs;
							stopTs =  currentTs;
						}
						// Other dates
						else {
							if (currentTs < startTs)	startTs = currentTs;
							if (currentTs > stopTs)		stopTs = currentTs;
						}
					}
				}
			}
			// We add some TS magin
			startTs -= chronoSettings.tsMargin;
			stopTs +=  chronoSettings.tsMargin;
			that.setStartStopTs(startTs,stopTs);
		}
	}
});

Template.LibChrono.helpers({
	// Parms ----------------
	'svgWidth'() {
		return chronoSettings.svgWidth;
	},
	'labelZoneWidth'() {
		return chronoSettings.labelZoneWidth;
	},
	'yOffset_cursorText'() {
		return chronoSettings.yOffset_cursorText;
	},
	'yOffset_horizontalLegendAxis'() {
		return chronoSettings.yOffset_horizontalLegendAxis;
	},
	'yOffset_legendText'() {
		return chronoSettings.yOffset_legendText;
	},
	'xOffset_pers'() {
		return chronoSettings.xOffset_pers;
	},
	'yOffset_persLabel'() {
		return chronoSettings.yOffset_persLabel;
	},
	'pxPerPersLine'() {
		return chronoSettings.pxPerPersLine;
	},
	'bottom_margin'() {
		return chronoSettings.bottom_margin;
	},
	'xOffset_histPeriodText'() {
		return chronoSettings.xOffset_histPeriodText;
	},
	
	// ???????????????????????????????????
	// To be deleted
	'yOffset_generalHistPoints'() {
		return chronoSettings.yOffset_generalHistPoints;
	},
	'yOffset_local2HistPoints'() {
		return chronoSettings.yOffset_local2HistPoints;
	},
	// ???????????????????????????????????
	'yOffset_nationalHistPoints'() {
		return chronoSettings.yOffset_nationalHistPoints;
	},
	'yOffset_regionalHistPoints'() {
		return chronoSettings.yOffset_regionalHistPoints;
	},
	'yOffset_localHistPoints'() {
		return chronoSettings.yOffset_localHistPoints;
	},
	'xOffset_histLabel'() {
		return chronoSettings.xOffset_histLabel;
	},
	'yOffset_histPeriodLabel'() {
		return chronoSettings.yOffset_histPeriodLabel;
	},
	// Reactive vars --------
	'startTs'() {
		return Template.instance().startTs.get();
	},
	'stopTs'() {
		return Template.instance().stopTs.get();
	},
	'tsDuration'() {
		return Template.instance().tsDuration.get();
	},
	'pxPerTsUnit'() {
		return Template.instance().pxPerTsUnit.get();
	},
	'cursorTs'() {
		return Template.instance().cursorTs.get();
	},
	'cursorIsOn'() {
		return Template.instance().cursorIsOn.get();
	},
	// Computation -----------
	'todayTs'() {
		return new Date().getTime();
	},
	'age'() {
		// ???????????????????????????????????
		// Algo approximatif : une erreur de quelques jours peut exister !!
		// ???????????????????????????????????
		var cursorTs = Template.instance().cursorTs.get();
		// If we know the birth date
		if (this.pers.naissance && this.pers.naissance.date && this.pers.naissance.date.a1) {
			var birthTs = gf_dateToTimestamp(this.pers.naissance.date);
			// If this person is still alive
			if (this.pers.estVivant) {
				if (cursorTs > birthTs) {
					var age = (cursorTs - birthTs) / (31556952000); // 365,2425 jours
					if(age < 1) {
						var months = age * 12;
						if (months < 1) {
							var days = months * 365 /12;
							return Math.floor(days) + " jour" + ((days >= 2) ? "s" : "");
						}
						else return Math.floor(months) + " mois";
					}
					else return Math.floor(age) + " an" + ((age >= 2) ? "s" : "");
				}	
			}
			// If this person is dead
			else {
				if (this.pers.deces && this.pers.deces.date && this.pers.deces.date.a1) {
					var deathTs = gf_dateToTimestamp(this.pers.deces.date);
					if (cursorTs > birthTs && cursorTs < deathTs) {
						var age = (cursorTs - birthTs) / (31556952000); // 365,2425 jours
						if(age < 1) {
							var months = age * 12;
							if (months < 1) {
								var days = months * 365 /12;
								return Math.floor(days) + " jour" + ((days >= 2) ? "s" : "");
							}
							else return Math.floor(months) + " mois";
						}
						else return Math.floor(age) + " an" + ((age >= 2) ? "s" : "");
					}
				}
			}
		}

		
		/*
		if (	this.pers.naissance 
				&& this.pers.naissance.date
				&& this.pers.naissance.date.a1
				&& ((this.pers.deces 
				&& this.pers.deces.date
				&& this.pers.deces.date.a1) || this.pers.estVivant)) {
			var naissanceTs = gf_dateToTimestamp(this.pers.naissance.date);
			if (cursorTs > naissanceTs && this.pers.estVivant) {
				var age = Math.floor((cursorTs - naissanceTs) / (31556952000)); // 365,2425 jours
				return age + " an" + ((age > 1) ? "s" : "");
			}	
			else {
				var decesTs = gf_dateToTimestamp(this.pers.deces.date);
				if (cursorTs > naissanceTs && cursorTs < decesTs) {
					var age = Math.floor((cursorTs - naissanceTs) / (31556952000)); // 365,2425 jours
					return age + " an" + ((age > 1) ? "s" : "");
				}
			}
		}
		*/
	},
	'tsToDate'(ts) {
		var tsDate = new Date(ts);
		return tsDate.getDate() + "/" + (tsDate.getMonth() + 1) + "/" + tsDate.getFullYear();
	},
	'historyPeriods'(ts) {
		return _.map(histPeriods.FR, function(obj,index) {obj.index = index;return obj;});
	},
	'histPeriodClass'() {
		if (this.index % 2 === 0 ) 	return "chrono_histPeriodOdd";
		else						return "chrono_histPeriodEven";
	},
	'yHistPeriods'() {
		return chronoSettings.yOffset_histPeriodText + ((this.index % chronoSettings.nbLinesHistPeriodText) * chronoSettings.pxPerHistPeriodLine);
	},
	'histPeriodsheight'(relativesList) {
		return chronoSettings.yOffset_persLabel - chronoSettings.yOffset_horizontalLegendAxis + ((relativesList.length - 1) * chronoSettings.pxPerPersLine) + chronoSettings.bottom_margin;
	},
	'svgHeight'() {
		return chronoSettings.yOffset_persLabel + ((this.relativesList.length - 1) * chronoSettings.pxPerPersLine) + chronoSettings.bottom_margin;
	},
	'xGraduations' : function() {
		/* Return an array of object representing each x scale graduations : 
			[
				{
					'label':		null || ::String,
					'ts':			::Integer,
					'labelClass':	::String,
					'lineClass':	::String
				},
				...
			]
		*/

		// Reactive vars
		var tsDuration 		= Template.instance().tsDuration.get();
		var startTs 		= Template.instance().startTs.get();
		var stopTs 			= Template.instance().stopTs.get();
		
		// New
		var firstGraduationTs = {
			START_CURRENT_YEAR : function(ts) {
				var tsDate = new Date(ts);
				return new Date(tsDate.getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
			},
			START_CURRENT_MONTH : function(ts) {
				var tsDate = new Date(ts);
				return new Date(tsDate.getFullYear(), tsDate.getMonth(), 1, 0, 0, 0, 0).getTime();
			},
			START_CURRENT_DAY : function(ts) {
				var tsDate = new Date(ts);
				return new Date(tsDate.getFullYear(), tsDate.getMonth(), tsDate.getDate(), 0, 0, 0, 0).getTime();
			},
			START_FLOOR_10_YEARS : function(ts) {
				var tsDate = new Date(ts);
				return new Date(Math.floor(tsDate.getFullYear()/10)*10, 0, 1, 0, 0, 0, 0).getTime();
			},
			START_FLOOR_5_YEARS : function(ts) {
				var tsDate = new Date(ts);
				return new Date(Math.floor(tsDate.getFullYear()/20)*20, 0, 1, 0, 0, 0, 0).getTime();
			}
			
		};
		
		var stepRules_if = {
			// General to specific order
			IS_START_OF_YEAR_XX00 : function(ts) {
				var tsDate = new Date(ts);
				return (tsDate.getFullYear() % 100 === 0 && tsDate.getMonth() === 0 && tsDate.getDate() === 1);
			},
			IS_START_OF_YEAR_XX50 : function(ts) {
				var tsDate = new Date(ts);
				return (tsDate.getFullYear() % 50 === 0 && tsDate.getMonth() === 0 && tsDate.getDate() === 1);
			},
			IS_START_OF_YEAR_XX10 : function(ts) {
				var tsDate = new Date(ts);
				return (tsDate.getFullYear() % 10 === 0 && tsDate.getMonth() === 0 && tsDate.getDate() === 1);
			},
			IS_START_OF_YEAR_XXX5 : function(ts) {
				var tsDate = new Date(ts);
				return (tsDate.getFullYear() % 5 === 0 && tsDate.getMonth() === 0 && tsDate.getDate() === 1);
			},
			IS_START_OF_YEAR : function(ts) {
				var tsDate = new Date(ts);
				return (tsDate.getMonth() === 0 && tsDate.getDate() === 1);
			},
			IS_START_OF_MONTH : function(ts) {
				return new Date(ts).getDate() === 1;
			},
			IS_START_OF_DAY_X5 : function(ts) {
				return new Date(ts).getDate() % 5 === 0;
			},
			IS_OTHER : function(ts) {
				return true;
			}			
		};
		
		var stepRules_label = {
			YEAR : function(ts) {
				return String(new Date(ts).getFullYear());
			},
			MONTH : function(ts) {
				return parametresClient.moisCourts[new Date(ts).getMonth() + 1];
			},
			DAY : function(ts) {
				return String(new Date(ts).getDate());
			}
		}

		var graduationsTemplatesArray = [
			// Duration less than around 1 month
			{
				duration: 2678400000,
				name: "Case 1",
				action: {												
					step : {"y":0,"m":0,"d":1,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_DAY",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",		"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_START_OF_YEAR",		"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_MONTH",		"label":"MONTH",	"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV4"},	
						{"if":"IS_OTHER",				"label":"DAY",		"labelClass":"chrono_xLegend_1day",		"lineClass":"chrono_xLegend_NIV5"},	
					]
				}
			},
			// Duration less than around 1.67 month
			{
				duration: 4464000000,
				name: "Case 2",
				action: {												
					step : {"y":0,"m":0,"d":1,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_DAY",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",		"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_START_OF_YEAR",		"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_MONTH",		"label":"MONTH",	"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV4"},	
						{"if":"IS_START_OF_DAY_X5",		"label":"DAY",		"labelClass":"chrono_xLegend_1day",		"lineClass":"chrono_xLegend_NIV5"},	
					]
				}
			},
			// Duration less than around 2 year
			{
				duration: 63072000000,
				name: "Case 3",
				action: {												
					step : {"y":0,"m":1,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_MONTH",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",		"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_START_OF_YEAR",		"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_OTHER",				"label":"MONTH",	"labelClass":"chrono_xLegend_1month",	"lineClass":"chrono_xLegend_NIV4"},	
					]
				}
			},
			// Duration less than around 5 years
			{
				duration: 152680000000,
				name: "Case 4",
				action: {												
					step : {"y":0,"m":1,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_MONTH",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",		"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_START_OF_YEAR",		"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_OTHER",				"label":null,		"labelClass":null,						"lineClass":"chrono_xLegend_NIV4"},	
					]
				}
			},
			// Duration less than around 15 years
			{
				duration: 473040000000,
				name: "Case 5",
				action: {												
					step : {"y":1,"m":0,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_YEAR",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",		"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_OTHER",				"label":"YEAR",		"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},	
					]
				}
			},
			// Duration less than around 30 years
			{
				duration: 946080000000,
				name: "Case 6",
				action: {												
					step : {"y":1,"m":0,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_YEAR",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",	"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",	"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",	"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",	"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
						{"if":"IS_OTHER",				"label":null,	"labelClass":null,						"lineClass":"chrono_xLegend_NIV3"},	
					]
				}
			},
			// Duration less than around 75 years
			{
				duration: 2365200000000,
				name: "Case 7",
				action: {												
					step : {"y":1,"m":0,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_CURRENT_YEAR",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",	"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",	"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",	"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
						{"if":"IS_START_OF_YEAR_XXX5",	"label":"YEAR",	"labelClass":"chrono_xLegend_1year",	"lineClass":"chrono_xLegend_NIV3"},
					]
				}
			},
			// Duration less than around 150 years
			{
				duration: 4730400000000,
				name: "Case 8",
				action: {												
					step : {"y":5,"m":0,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_FLOOR_5_YEARS",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",	"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",		"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":"YEAR",		"labelClass":"chrono_xLegend_10years",	"lineClass":"chrono_xLegend_NIV3"},	
					]
				}
			},
			// Other (less than around 10000 years)
			{
				duration: 315360000000000,
				name: "Case 9",
				action: {												
					step : {"y":10,"m":0,"d":0,"hh":0,"mm":0,"ss":0,"ms":0},
					firstGraduationTs : "START_FLOOR_10_YEARS",
					stepRules : [
						{"if":"IS_START_OF_YEAR_XX00",	"label":"YEAR",	"labelClass":"chrono_xLegend_100years",	"lineClass":"chrono_xLegend_NIV1"},
						{"if":"IS_START_OF_YEAR_XX50",	"label":"YEAR",	"labelClass":"chrono_xLegend_50years",	"lineClass":"chrono_xLegend_NIV2"},
						{"if":"IS_START_OF_YEAR_XX10",	"label":null,	"labelClass":null,						"lineClass":"chrono_xLegend_NIV3"},	
					]
				}
			}
		];

		// Recursive graduations generator function
		var graduationCalculus =  function(interval) {
			// We recurse to find the right graduationsTemplates
			if (interval >= graduationsTemplatesArray.length)	return [];
			else {
				if (tsDuration < graduationsTemplatesArray[interval].duration) {
					// console.log("graduationsTemplatesArray " + graduationsTemplatesArray[interval].name);
					// We generate the graduation according to the template
					var action = graduationsTemplatesArray[interval].action;
					var xGraduations = [];
					// If firstGraduationTs function exists
					if (firstGraduationTs[action.firstGraduationTs]) {
						for (var gratuationTs = firstGraduationTs[action.firstGraduationTs](startTs); gratuationTs <= stopTs; gratuationTs = addToTimestamp(gratuationTs,action.step)) {
							// We apply the rules
							var index = 0;
							var ruleDoNotMatch = true;
							do {
								var currentRule = action.stepRules[index];
								// If current rule exists
								if (stepRules_if[currentRule.if]) {
									// If current rule matches
									if (stepRules_if[currentRule.if](gratuationTs)) {
										// If currentRule.label is nul or stepRules_label function exists
										if (currentRule.label === null || stepRules_label[currentRule.label]) {
										ruleDoNotMatch = false;
										var graduation = {
											'label':	currentRule.label ?  stepRules_label[currentRule.label](gratuationTs) : null,
											'ts':		gratuationTs,
											'labelClass':	currentRule.labelClass,
											'lineClass':	currentRule.lineClass
										};
										xGraduations.push(graduation);
										}
										else console.log("Error graduationsTemplatesArray " + graduationsTemplatesArray[interval].name + " : "  + "stepRules_label function does'nt exist : " + currentRule.label)
									}
								}
								else console.log("Error graduationsTemplatesArray " + graduationsTemplatesArray[interval].name + " : "  + "currentRule doesn't exist : " + currentRule.if);
								// Next rule (if no match yet)
								index += 1;
							}
							while (ruleDoNotMatch && index < action.stepRules.length);
						}
					}
					else console.log("Error graduationsTemplatesArray " + graduationsTemplatesArray[interval].name + " : "  + "firstGraduationTs function does'nt exist : " + action.firstGraduationTs);
					return xGraduations;
				}
				else return graduationCalculus(interval + 1);
			}
		};
		// We run recursive calculus
		return graduationCalculus(0);
	},
	'fileName'() {
		// For SVG printing
		var nomFichier = "";
		// For Pers
		if (this.pers) {
			nomFichier = "chronologie-" + this.pers.nom + "-" + this.pers.prenoms[this.pers.prenomUsuel];
			if (Session.get('sosas')[this.pers._id]) 	nomFichier = nomFichier + "-Sosa" + Session.get('sosas')[this.pers._id][0];
		}
		// For Hist point
		else {
			nomFichier = "chronologie-histPt-" + this.hist._id;
		}
		return nomFichier;
	},
	'svgTemplate'() {
		// For SVG printing, return the template containing the svg to print
		return Template.instance();
	},
	// ??????????????????????????????
	// To be deleted
	'generalHistPoints'() {
		return Hists.find({"impacteAncetres":false,"scope":{$exists:false}});
	},
	'local2HistPoints'() {
		return Hists.find({"impacteAncetres":true,"scope":{$exists:false}});
	},
	// ??????????????????????????????
	'nationalHistPoints'() {
		return Hists.find({"scope":"NATIONAL"});
	},
	'regionalHistPoints'() {
		return Hists.find({"scope":"REGIONAL"});
	},
	'localHistPoints'() {
		return Hists.find({"scope":"LOCAL"});
	},
	'histTs'() {
		if (this.date) return gf_dateToTimestamp(this.date);
	},
	'typeTemplate'() {
		var templates = {
			"HIST_GUERRES":			"guerres",
			"HIST_EPIDEMIES":		"epidemies",
			"HIST_NATURE":			"nature",
			"HIST_ADMINISTRATIF":	"administratif",
			"HIST_ECONOMIE":		"economie",
			"HIST_INDUSTRIE":		"industrie",
			"HIST_TRANSPORTS":		"transports",
			"HIST_ELEVAGE":			"elevage",
			"HIST_POLITIQUE":		"politique",
			"HIST_CULTURE":			"culture",
			"HIST_RELIGION":		"religion",
			"HIST_TECHNIQUE":		"technique",
			"HIST_NOTABLES":		"notables",
			"HIST_AUTRES":			"default"
		}
		if (this.themes[0] in templates) return templates[this.themes[0]];
		else {
			console.log("Erreur module \"LibChrono\" : type de point d'histoire inconnu (id=" + this._id + ") : " + this.themes[0]);
			return "default";
		}
	},
	
	
	
	
	
	



	// Lib helpers ----------
	'hlp_mux'(a,b) {
		return a*b;
	},
	'hlp_sum'(a,b) {
		return a+b;
	},
	'hlp_neg'(a) {
		return -a;
	},
	
	// Computation -----------
	'typeOffset'(type) {
		switch (type) {
			case "GRAND_PARENT":
				return 0;
				break;
			case "PARENT":
				return chronoSettings.xOffset_persType;
				break;
			case "CHILD":
				return chronoSettings.xOffset_persType * 2;
				break;
			default:
				console.log("template \"LibChrono\" error : unsupported person type : " + type);
				break;
		}
	},
	'prepareForHist'() {
		if (this.hist) {
			// We calculus the start and stop TS if not already done
			if (Template.instance().startTs.get() == null) {
				if (this.hist.date) {
					// We set min max around the hist point year
					var middleTs = gf_dateToTimestamp(this.hist.date,false);
					startTs = 	middleTs - (chronoSettings.tsWidthForHistoryPoints/2);
					stopTs = 	middleTs + (chronoSettings.tsWidthForHistoryPoints/2);
					Template.instance().setStartStopTs(startTs,stopTs);
				}
			}
			return this.hist;
		}
	},
	'prepareForPers'() {
		/*	If a pers is provided, returns : 
			{index:0, pers::PERS, type:"GRAND_PARENT",	spouseIndex:null},
			{index:1, pers::PERS, type:"GRAND_PARENT",	spouseIndex:0},
			{index:2, pers::PERS, type:"PARENT",		spouseIndex:null},
			{index:3, pers::PERS, type:"GRAND_PARENT",	spouseIndex:null},
			{index:4, pers::PERS, type:"GRAND_PARENT",	spouseIndex:3},
			{index:5, pers::PERS, type:"PARENT",		spouseIndex:2},
			{index:6, pers::PERS, type:"CHILD",			spouseIndex:null},
			
	if a hist is provided, [] is returned
		*/
		var relativesList = [];
		// Function to add a person to the relativesList in the structured format, adding and returning index.
		var addToRelativeList = function(pers,type,spouseIndex) {
			relativesList.push({
					index:relativesList.length,
					pers:pers,
					type:type,
					spouseIndex:(spouseIndex !== undefined) ? spouseIndex : null});
			return relativesList.length - 1;
		}
		if (this.pers) {
			// Person parents ------------------------
			var persParentIndex = addToRelativeList(gf_persById(this.pers.pere),"GRAND_PARENT");
			addToRelativeList(gf_persById(this.pers.mere),"GRAND_PARENT",persParentIndex);
			// Person --------------------------------
			var persIndex = addToRelativeList(this.pers,"PARENT");
			// For each spouse -----------------------
			var listeCoupleEvents = gf_coupleEventsByPersId(this.pers._id,null,true);
			for (var index in listeCoupleEvents) {
				var coupleEventCourant = listeCoupleEvents[index];
				var spouse = gf_conjoint(this.pers._id,coupleEventCourant);
				// Spouse parents
				var spouseParentIndex = addToRelativeList(gf_persById(spouse.pere),"GRAND_PARENT");
				addToRelativeList(gf_persById(spouse.mere),"GRAND_PARENT",spouseParentIndex);
				// Affichage du conjoint
				addToRelativeList(spouse,"PARENT",persIndex);
				// For each child
				var childsList = gf_listeEnfants(this.pers,spouse);
				for (var childIndex in childsList) {
					addToRelativeList(childsList[childIndex],"CHILD");
				}
			}
			// We calculate the min and max date
			Template.instance().calculateStartStop(relativesList);
		}
		// We return the list
		return relativesList;
	},
});


Template.LibChrono.events = {
	// We calculate the TS corresponding to the mouse position
	'mousemove svg#chrono' : function(e,tpl) {
		e.preventDefault();
		// We get the reactive variables
		var startTs 		= tpl.startTs.get();
		var stopTs 			= tpl.stopTs.get();
		// We calculate the TimeStamp corresponding to the mouse position
		var pxPosition = (e.clientX - $("svg#chrono").position().left) * chronoSettings.svgWidth / $("svg#chrono").width();
		// If we are in the graphZone
		if (pxPosition > chronoSettings.labelZoneWidth) 	{
			// If Drap and Drop mode
			if (tpl.dragDrop.get()) {
				deltaTs = (tpl.initialPosition.get() - pxPosition) / tpl.pxPerTsUnit.get() ;
				newStartTs = startTs + deltaTs;
				newStopTs = stopTs + deltaTs;
				tpl.setStartStopTs(newStartTs,newStopTs);
				tpl.initialPosition.set(pxPosition);
			}
			else {
				tpl.cursorIsOn.set(true);
				cursorTs = startTs + ((pxPosition - chronoSettings.labelZoneWidth) * (stopTs - startTs) / (chronoSettings.svgWidth - chronoSettings.labelZoneWidth) );
				tpl.cursorTs.set(cursorTs);
			}
		}
		else {
			tpl.cursorIsOn.set(false);
			tpl.dragDrop.set(false);
			tpl.setCursorInMiddle();
		}
	},
	'mouseout svg#chrono' : function(e,tpl) {
		e.preventDefault();
		tpl.cursorIsOn.set(false);
		// tpl.dragDrop.set(false);
		tpl.setCursorInMiddle();
	},
	// Span management
	'mousedown svg#graphZone' : function(e,tpl) {
		e.preventDefault();
		tpl.dragDrop.set(true);
		// We calculate the TimeStamp corresponding to the mouse position
		var pxPosition = (e.clientX - $("svg#chrono").position().left) * chronoSettings.svgWidth / $("svg#chrono").width();
		tpl.initialPosition.set(pxPosition);
	},
	'mouseup svg#graphZone' : function(e,tpl) {
		e.preventDefault();
		tpl.dragDrop.set(false);
	},
	//Scroll zoom for Firefox and Chrome
	'DOMMouseScroll svg': function(e,tpl){
		e.preventDefault();
		// If we are over the graphZone (there is a cursor)
		if (tpl.cursorTs.get()) {
			// We get the scroll delta		
			if (window.e) {
				// Chrome ou IE (IE to be tested !!)
				var e = window.e || e; // old IE support  
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); 
			}
			else {
				// Firefox
				var delta = -e.originalEvent.detail/3;
			}
			// Selon sens de la molette -------------------------------
			if (delta != 0) {
				// Zoom minus
				if (delta > 0) 	tpl.zoomIn();
				// Zoom plus
				else 			tpl.zoomOut();
			}
		}
		// To avoid propagation to the document
		return false;
	},
	'click #zoomIn' : function(e,tpl) {
		e.preventDefault();
		tpl.zoomIn();
	},
	'click #zoomOut' : function(e,tpl) {
		e.preventDefault();
		tpl.zoomOut();
	},
	'click #zoomAuto' : function(e,tpl) {
		e.preventDefault();
		// Only for pers
		if (!this.hist) {
			tpl.calculateStartStop(this.relativesList);
		}
	},
	"click text.chrono_linkPers" : function (e,tpl) {
		e.preventDefault();
		if(this.pers) Router.go('/pers/infos/' + this.pers._id);
	},
	"click .chrono_linkHistPt" : function (e,tpl) {
		e.preventDefault();
		Router.go('/hist/infos/' + this._id);
	},
};