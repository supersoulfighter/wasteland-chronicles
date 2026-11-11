//#region 03_data/03_enemies/rat.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.rat = {
	key: 'rat',
	name: 'Rat',
	health: 65,
	speed: 160,
	style: 'walk',
	reveal: 2,
	size: 2,
	anim: 'rat',
	attack: {
		name: 'Chew Through',
		dmg: 40,
		cooldown: 0.2,
		pos: 'FT',
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
		// once it starts biting, the Rat does not stop until dead
		channel: true,
	},
};

//#endregion
