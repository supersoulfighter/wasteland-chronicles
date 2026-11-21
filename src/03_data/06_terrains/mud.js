//#region 03_data/06_terrains/mud.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Mud ground (levels 13-15) — the muck eats explosions: every AoE
// hit on this map lands 20% softer. resolveHitCmd reads it.
Terrains.grounds.mud = {
	key: 'mud',
	name: 'Mud',
	aoeDmgMult: 0.8,
};

//#endregion
