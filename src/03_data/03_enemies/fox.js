//#region 03_data/03_enemies/fox.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.fox = {
	key: 'fox',
	name: 'Fox',
	health: 90,
	speed: 180,
	style: 'walk',
	reveal: 14,
	size: 3,   // too big to launch or flip
	anim: 'fox',
	attack: {
		name: 'Eerie Cry',
		dmg: 45,
		cooldown: 2,
		pos: 'C',
		shape: {kind: 'rect', size: 'XXL'},
		pattern: {kind: 'single'},
		// the shriek strips attack ability for 2s
		effects: [{status: 'silenced', duration: 2}],
	},
};

//#endregion
