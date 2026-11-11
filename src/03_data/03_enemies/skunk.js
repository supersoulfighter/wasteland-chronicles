//#region 03_data/03_enemies/skunk.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.skunk = {
	key: 'skunk',
	name: 'Skunk',
	health: 75,
	speed: 120,
	style: 'walk',
	reveal: 10,
	size: 2,
	anim: 'skunk',
	attack: {
		name: 'Acid Spray',
		dmg: 30,
		cooldown: 2,
		pos: 'RC',
		// a Y ray — and the acid keeps burning (1 dmg/s) until the
		// player touches water or a crystal
		shape: {kind: 'beam'},
		pattern: {kind: 'beam'},
		effects: [{
			status: 'dot',
			amount: 1,
			tickMs: 1000,
			duration: Infinity,
			untilCleanse: 'water|crystal',
		}],
	},
};

//#endregion
