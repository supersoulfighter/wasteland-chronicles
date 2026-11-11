//#region 03_data/03_enemies/moth.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.moth = {
	key: 'moth',
	name: 'Moth',
	health: 24,
	speed: 40,
	style: 'fly',
	reveal: 4,
	size: 1,
	anim: 'moth',
	attack: {
		name: 'Goo Bomb',
		dmg: 10,
		cooldown: 4,
		pos: 'FB',
		// lobs a toxic glob; a miss leaves it on the ground as a
		// touchable hazard for 5s
		shape: {kind: 'lob'},
		pattern: {kind: 'lob', lingerSecs: 5},
		speed: 200,
	},
};

//#endregion
