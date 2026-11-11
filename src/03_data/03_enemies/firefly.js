//#region 03_data/03_enemies/firefly.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.firefly = {
	key: 'firefly',
	name: 'Firefly',
	health: 16,
	speed: 80,
	style: 'fly',
	reveal: 2,
	size: 1,
	anim: 'firefly',
	attack: {
		name: 'Burn Bite',
		dmg: 20,
		cooldown: 1,
		pos: 'FB',
		shape: {kind: 'rect', size: 'XXS'},
		pattern: {kind: 'single'},
		effects: [{status: 'dot', amount: 5, duration: 5}],
	},
};

//#endregion
