//#region 03_data/03_enemies/bat.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.bat = {
	key: 'bat',
	name: 'Bat',
	health: 50,
	speed: 200,
	style: 'fly',
	reveal: 7,
	size: 2,
	anim: 'bat',
	attack: {
		name: 'Wing Barbs',
		dmg: 50,
		cooldown: 4,
		pos: 'C',
		// sprays 4 barbs in a 36° arc
		shape: {kind: 'bullet'},
		pattern: {kind: 'fan', count: 4, degrees: 36},
		speed: 300,
	},
};

//#endregion
