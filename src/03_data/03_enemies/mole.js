//#region 03_data/03_enemies/mole.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.mole = {
	key: 'mole',
	name: 'Mole',
	health: 80,
	speed: 140,
	style: 'burrow',
	reveal: 13,
	size: 2,
	anim: 'mole',
	attack: {
		name: 'Mound Eruption',
		dmg: 35,
		cooldown: 10,
		pos: 'TC',
		shape: {kind: 'rect', size: 'S'},
		pattern: {kind: 'single'},
		// damages, then staggers the player for 1s
		effects: [{status: 'staggered', duration: 1}],
	},
};

//#endregion
