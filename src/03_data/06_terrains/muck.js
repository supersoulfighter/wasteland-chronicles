//#region 03_data/06_terrains/muck.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Muck hazard — deep sludge, a 70% speed penalty. Worse than water
// and it cleans nothing off you — but Swimmer still halves the
// penalty (35%).
Terrains.hazards.muck = {
	key: 'muck',
	name: 'Muck',
	moveMult: 0.3,
	swimmerMult: 0.65,
};

//#endregion
