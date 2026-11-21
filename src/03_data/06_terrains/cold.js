//#region 03_data/06_terrains/cold.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Cold ground (levels 16-18) — chilled air drags every projectile:
// flight speed drops 10% for both teams. spawnProjectileCmd reads it.
Terrains.grounds.cold = {
	key: 'cold',
	name: 'Cold',
	projSpeedMult: 0.9,
};

//#endregion
