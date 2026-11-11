//#region 03_data/03_enemies/spider.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.spider = {
	key: 'spider',
	name: 'Spider',
	health: 20,
	speed: 80,
	style: 'leap',
	reveal: 1,
	size: 1,
	anim: 'spider',
	attack: {
		name: 'Poison Bite',
		dmg: 20,
		cooldown: 1,
		pos: 'FT',
		shape: {kind: 'rect', size: 'XXS'},
		pattern: {kind: 'single'},
		effects: [{status: 'dot', amount: 10, duration: 5}],
	},
};

//#endregion
