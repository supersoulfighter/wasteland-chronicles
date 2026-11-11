//#region 03_data/03_enemies/rabbit.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.rabbit = {
	key: 'rabbit',
	name: 'Rabbit',
	health: 70,
	speed: 200,
	style: 'leap',
	reveal: 12,
	size: 2,
	anim: 'rabbit',
	attack: {
		name: 'Headbutt Leap',
		dmg: 50,
		cooldown: 1,
		pos: 'FT',
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
		// leaps in, headbutts, leaps back — the leap style's
		// attack-once-disengage rhythm handles the retreat
	},
};

//#endregion
