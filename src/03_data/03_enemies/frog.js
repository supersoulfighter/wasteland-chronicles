//#region 03_data/03_enemies/frog.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.frog = {
	key: 'frog',
	name: 'Frog',
	health: 40,
	speed: 120,
	style: 'leap',
	reveal: 3,
	size: 2,
	anim: 'frog',
	attack: {
		name: 'Tongue Strike',
		dmg: 30,
		cooldown: 2,
		pos: 'FT',
		// a Spd field means ranged — the tongue snaps out at 600px/s
		shape: {kind: 'bullet'},
		pattern: {kind: 'single'},
		speed: 600,
	},
};

//#endregion
