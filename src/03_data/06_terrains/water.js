//#region 03_data/06_terrains/water.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Water hazard — wading costs 66% of your speed, but the splash
// scrubs every '…|water' status (skunk acid) off you. The Swimmer
// passive halves the penalty: swimmerMult is what moveable gets
// instead of moveMult.
Terrains.hazards.water = {
	key: 'water',
	name: 'Water',
	moveMult: 0.34,
	swimmerMult: 0.67,
	cleanse: 'water',
};

//#endregion
