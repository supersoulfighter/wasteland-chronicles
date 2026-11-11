//#region 03_data/03_enemies/porcupine.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.porcupine = {
	key: 'porcupine',
	name: 'Porcupine',
	health: 70,
	speed: 120,
	style: 'walk',
	reveal: 4,
	size: 2,
	anim: 'porcupine',
	attack: {
		name: 'Spine Blast',
		dmg: 30,
		cooldown: 2,
		pos: 'C',
		// up to 8 spines in all directions
		shape: {kind: 'bullet'},
		pattern: {kind: 'ring', count: 8},
		speed: 500,
	},
};

//#endregion
