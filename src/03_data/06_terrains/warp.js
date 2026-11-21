//#region 03_data/06_terrains/warp.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Warp hazard — a fold in the cave: touch it and you're spat out on
// a random free floor tile. warpAt throttles re-triggers so a
// teleport can't re-fire on the same frame.
Terrains.hazards.warp = {
	key: 'warp',
	name: 'Warp',
	teleport: true,
};

//#endregion
