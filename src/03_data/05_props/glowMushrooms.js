//#region 03_data/05_props/glowMushrooms.js ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Light-casting decoration — the `light` field feeds the Darkness
// overlay and the `lights` query.
Props.glowMushrooms = {
	key: 'glowMushrooms',
	name: 'Glowing Mushrooms',
	passable: true,
	anim: 'glow-mushrooms',
	light: {radius: 48, color: 0x88ffaa},
};

//#endregion
