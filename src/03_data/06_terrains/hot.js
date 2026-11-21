//#region 03_data/06_terrains/hot.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Hot ground (levels 19-21) — the floor itself bakes anything that
// stands still: idleDps per second while a mover's velocity is ~0.
// Applies to all characters, flyers included. TerrainSystem ticks it.
Terrains.grounds.hot = {
	key: 'hot',
	name: 'Hot',
	idleDps: 1,
};

//#endregion
