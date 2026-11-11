//#region 03_data/06_terrains/water.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Wading — 66% slow. The Swimmer passive relaxes this to 33%.
// Also a cleanse for acid-type dots (untilCleanse: water).
Terrains.water = {
	key: 'water',
	name: 'Water',
	reveal: 1,
	moveMult: 0.34,
	swimmerMult: 0.67,   // Swimmer passive: penalty drops to 33%
	cleanse: 'water',
};

//#endregion
