//#region 03_data/03_enemies/mosquito.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.mosquito = {
	key: 'mosquito',
	name: 'Mosquito',
	health: 10,
	speed: 120,
	style: 'fly',
	reveal: 1,
	size: 1,
	anim: 'mosquito',
	attack: {
		name: 'Drain Bite',
		dmg: 30,
		cooldown: 2,
		pos: 'FB',
		shape: {kind: 'rect', size: 'XXS'},
		pattern: {kind: 'single'},
		// slows the player 1% for 5s — stacks (StatusCarrying.add
		// refreshes + counts stacks)
		effects: [{status: 'slow', stat: 'speed', amount: 0.99, duration: 5}],
	},
};

//#endregion
