//#region 03_data/03_enemies/snake.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.snake = {
	key: 'snake',
	name: 'Snake',
	health: 60,
	speed: 100,
	style: 'burrow',
	reveal: 9,
	size: 2,
	anim: 'snake',
	attack: {
		name: 'Poison Spit',
		dmg: 25,
		cooldown: 4,
		pos: 'FT',
		shape: {kind: 'lob'},
		pattern: {kind: 'lob'},
		speed: 400,
		effects: [{status: 'dot', amount: 20, duration: 5}],
	},
};

//#endregion
