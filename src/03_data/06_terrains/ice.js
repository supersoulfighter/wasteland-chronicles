//#region 03_data/06_terrains/ice.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Ice hazard — no traction: the body keeps most of its old velocity
// each frame instead of snapping to intent. MovementSystem reads
// moveable.terrainIce as the retention factor.
Terrains.hazards.ice = {
	key: 'ice',
	name: 'Ice',
	ice: 0.85,
};

//#endregion
