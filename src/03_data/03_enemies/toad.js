//#region 03_data/03_enemies/toad.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.toad = {
	key: 'toad',
	name: 'Toad',
	health: 60,
	speed: 100,
	style: 'leap',
	reveal: 8,
	size: 2,
	anim: 'toad',
	attack: {
		name: 'Gas Cloud',
		dmg: 25,
		cooldown: 0.5,
		pos: 'C',
		// dropped cloud — sits on the ground as a hazard for 6s
		shape: {kind: 'mine'},
		pattern: {kind: 'mine', radius: 24},
		expirySecs: 6,
	},
};

//#endregion
