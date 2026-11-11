//#region 03_data/03_enemies/ant.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.ant = {
	key: 'ant',
	name: 'Ant',
	health: 3,
	speed: 32,
	style: 'burrow',
	reveal: 1,
	size: 1,
	anim: 'ant',
	attack: {
		name: 'Micro Bite',
		dmg: 8,
		cooldown: 0.33,
		pos: 'FT',
		shape: {kind: 'rect', size: 'XXS'},
		pattern: {kind: 'single'},
		// ants attack in mass — the danger is the swarm, not the bite
	},
};

//#endregion
