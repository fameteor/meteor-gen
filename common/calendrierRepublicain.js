// ==============================================
// Objet calRep de gestion du calendrier républicain
// ==============================================

// ??????????????????????????????????????????????
// A faire :
// - vérifier les paramètres, notamment la période de conversion : 22 sept 1792 au 31 déc 1805
// ??????????????????????????????????????????????

// Inspiration de  : http://archives.numerisees.calvados.fr/cg14v3/outils/calendrier/calendrier_greg_rev.php mais bien bugué dans le sens grep -> rep !

CalendrierRepublicain =  {
	// Attributs
	
	// Correspond aux jours du calendrier grégorien / mois grégorien, correspondant au 1er du mois républicain dans l'ordre des mois indiqués dans l'array "mois"
	'jour' : Array(
		Array(20,19,21,20,20,19,19,18,22,22,21,21), /* 1792 soit An 0 - An I */	// Le 1er Pluviôse An I correspond au 20 janvier 1792, le 1er Ventôse au 19 février 1792, le 1er Germinal au 21 mars 1792 ...
		Array(20,19,21,20,20,19,19,18,22,22,21,21), /* 1793 soit An I - An II */
		Array(20,19,21,20,20,19,19,18,22,22,21,21), /* 1794 soit An II - An III */
		Array(20,19,21,20,20,19,19,18,23,23,22,22), /* 1795 soit An III - An IV */
		Array(21,20,21,20,20,19,19,18,22,22,21,21), /* 1796 soit An IV - An V */
		Array(20,19,21,20,20,19,19,18,22,22,21,21), /* 1797 soit An V - An VI */
		Array(20,19,21,20,20,19,19,18,22,22,21,21), /* 1798 soit An VI - An VII */
		Array(20,19,21,20,20,19,19,18,23,23,22,22), /* 1799 soit An VII - An VIII */
		Array(21,20,22,21,21,20,20,19,23,23,22,22), /* 1800 soit An VIII - An IX */
		Array(21,20,22,21,21,20,20,19,23,23,22,22), /* 1801 soit An IX - An X */
		Array(21,20,22,21,21,20,20,19,23,23,22,22), /* 1802 soit An X - An XI */
		Array(21,20,22,21,21,20,20,19,24,24,23,23), /* 1803 soit An XI - An XII */
		Array(22,21,22,21,21,20,20,19,23,23,22,22), /* 1804 soit An XII - An XIII */
		Array(21,20,22,21,21,20,20,19,23,23,22,22)  /* 1805 soit An XIII - An XIV */ // Vérifié sur un autre calendrier
	),
	// Correspond aux mois républicain synchronisés aux mois grégorien (commencant par janvier : array[0])
	'mois' : Array("Pluviôse","Ventôse","Germinal","Floréal","Prairial","Messidor","Thermidor","Fructidor","Vendémiaire","Brumaire","Frimaire","Nivôse"),
	'annee': Array("An I","An II","An III","An IV","An V","An VI","An VII","An VIII","An IX","An X","An XI","An XII","An XIII","An XIV"),
	
	// Propriétés
	'estBissextile' : function(annee) {
		if (annee % 4 == 0) {
			if (annee % 100 == 0) 			return (annee % 400 == 0)
			else							return true;
		}
		else 								return false;
	},
	'estJourRepublicain' : function(jour,mois,annee) {
		// Si la date est complète et entre le 22 septembre 1792 et avant le 1er janvier 1806
		// On force les paramètres à ::Integer
		jour = parseInt(jour);
		mois = parseInt(mois);
		annee = parseInt(annee);
		// On vérifie la complétude des paramètres
		if (jour && mois && annee) {
			if ((jour >= 1 && jour <= 31) && (mois >= 1 && mois <= 12)) {
				mois = mois - 1; // Pour l'utilisation du constructeur Date
				// On vérifie le créneau
				var dateMinIncludedTS = new Date(1792, 8, 22).getTime(); 
				var dateMaxExcludedTS = new Date(1806, 0, 1).getTime();
				var dateTS = new Date(annee, mois, jour).getTime();
				if (dateTS >= dateMinIncludedTS && dateTS < dateMaxExcludedTS) 	return true;
				else															return false;
			}
			else																return false;
		}
		else																	return false;
	},
	'nbJourMois': function(mois,annee) {
		if (mois==2) {
			if (this.estBissextile(annee)) 	return 29;
			else						return 28;
		}
		else {
			if (   mois == 1 
				|| mois == 3 
				|| mois == 5 
				|| mois == 7 
				|| mois == 8 
				|| mois == 10 
				|| mois == 12) 			return 31;
			else 						return 30;
		}
	},
	'repToGreg': function(jourRep,moisRep,anneeRep) {
		// Avec les mois numérotés de 1 à 12 de Vendémiaire à Fructidor,
		// Les jours complémentaires sont les jours  31 à 35 du mois 12 de l'année considérée,
		// Les années sont les années républicaines de 1 à 14.
		
		// On force les paramètres à ::Integer
		jourRep = parseInt(jourRep);
		moisRep = parseInt(moisRep);
		anneeRep = parseInt(anneeRep);
		
		if (jourRep && moisRep && anneeRep) {
			moisGreg = 	moisRep + 8;
			anneeGreg = 	anneeRep + 1791;
			if (moisGreg > 12) {
				moisGreg -= 12;
				anneeGreg++;
			}
			jourGreg = this.jour[anneeGreg - 1792][moisGreg - 1] + jourRep - 1;
			if (jourGreg > this.nbJourMois(moisGreg,anneeGreg)) {
				jourGreg -= this.nbJourMois(moisGreg,anneeGreg);
				moisGreg++;
				if (moisGreg > 12)	{
					moisGreg-=12;
					anneeGreg++;
				}
			}
			return {'jour':jourGreg,'mois':moisGreg,'annee':anneeGreg};
		}
		else return false;
	},
	'gregToRep': function(jourGreg,moisGreg,anneeGreg) {
		// On retourne :
		// Les mois numérotés de 1 à 12 de Vendémiaire à Fructidor,
		// Les jours complémentaires sont les jours  31 à 35 du mois 12 de l'année considérée,
		// Les années sont les années républicaines de 1 à 14.
		
		// On force les paramètres à integer
		jourGreg = parseInt(jourGreg);
		moisGreg = parseInt(moisGreg);
		anneeGreg = parseInt(anneeGreg);
		// Si c'est dans le créneau des jours républicains, on le convertit
		if (this.estJourRepublicain(jourGreg,moisGreg,anneeGreg)) {
			var result = {jour:null,mois:null,annee:null,text:null};
			if (jourGreg >= this.jour[anneeGreg - 1792][moisGreg - 1]) {
				// On calcule le résultat
				result.jour = (jourGreg  + 1 - this.jour[anneeGreg - 1792][moisGreg - 1]);
				// L'année révolutionnaire commence en Vendémiaire (1er mois de l'année) dont l'indice dans les tables est 8
				if (moisGreg <= 8) anneeGreg--;
				result.mois = moisGreg + 4;		
				if (result.mois > 12) result.mois -= 12;
				result.annee = anneeGreg - 1791;
				// On calcule le texte
				result.text = result.jour + " " + this.mois[moisGreg - 1] + " " + this.annee[anneeGreg - 1792];
			}
			else {
				// On calcule le jour pour le mois précédent : 
				// Le 1er d'un mois républicain équivaut au 31 du mois d'avant sauf si le mois courant est vendémiaire,
				// il faut alors ajouter les 5 ou 6 sans-culottides !
				if (moisGreg == 9) {
					// Si sextile (1795 1799 1804) : on ajoute 6 sans-culottides
					if  (anneeGreg % 4 == 3)	result.jour = 37 - (this.jour[anneeGreg - 1792][moisGreg - 1] - jourGreg);
					// Si non bissextile : on ajoute 5 sans-culottides
					else					result.jour = 36 - (this.jour[anneeGreg - 1792][moisGreg - 1] - jourGreg);
				} 	
				else 				result.jour = 31 - (this.jour[anneeGreg - 1792][moisGreg - 1] - jourGreg);
				// On passe au mois précédent			
				moisGreg--;
				if (moisGreg <= 0) {
					moisGreg = 12;
					anneeGreg--;
				}
				// L'année révolutionnaire commence en Vendémiaire (1er mois de l'année) dont l'indice dans les tables est 8
				if (moisGreg <= 8) anneeGreg--;
				// On calcule les mois et années
				result.mois = moisGreg + 4;		
				if (result.mois > 12) result.mois -= 12;
				result.annee = anneeGreg - 1791;
				// On calcule les éventuels jours complémentaires et le texte
				if (result.jour > 30) {
					switch (result.jour - 30) {
						case 1:
							result.text = "1er Compl. " + this.annee[anneeGreg - 1792];
							break;
						default:
							result.text = (result.jour - 30) + "ième Compl. " + this.annee[anneeGreg - 1792];
							break;
					}
				}
				else result.text = result.jour + " " + this.mois[moisGreg - 1] + " " + this.annee[anneeGreg - 1792];
			}
			return result;
		}
		else return false;
	}
}