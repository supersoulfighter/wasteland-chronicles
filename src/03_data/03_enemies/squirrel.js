//#region 03_data/03_enemies/squirrel.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.squirrel = {
	key: 'squirrel',
	name: 'Squirrel',
	health: 50,
	speed: 160,
	style: 'leap',
	reveal: 5,
	size: 1,
	anim: 'squirrel',
	attack: {
		name: 'Tail Whip',
		dmg: 40,
		cooldown: 0.5,
		pos: 'RT',
		// full-circle whip
		shape: {kind: 'circle', r: 12},
		pattern: {kind: 'cone', degrees: 360},
	},
};

//#endregion
