//#region 03_data/04_bosses/cougar.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.cougar = {
	key: 'cougar',
	name: 'Cougar',
	level: 12,
	health: 1200,
	speed: 60,
	style: 'leap',
	size: 3,
	anim: 'cougar',
	minions: {spt: 10, type: 'squirrel'},
	attacks: [
		{
			name: 'Severe Scratch',
			dmg: 40,
			cooldown: 1,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			pattern: {kind: 'single'},
			// bleeds 10 more over 5s
			effects: [{status: 'dot', amount: 10, duration: 5}],
		},
		{
			name: 'Brutal Pounce',
			dmg: 6,
			cooldown: 5,
			weight: 1,
			pos: 'FB',
			shape: {kind: 'rect', size: 'S'},
			// grabs and keeps attacking until the player wiggles free
			// (4 taps per direction) → BossSpecials.cougar
			pattern: {kind: 'grab', taps: 4},
			special: true,
		},
		{
			name: 'Rumbling Growl',
			dmg: 0,
			cooldown: 10,
			weight: 0.3,
			pos: 'C',
			shape: {kind: 'global'},
			pattern: {kind: 'global'},
			// player's damage output −10% for 10s, stacking
			effects: [
				{status: 'weak', stat: 'dmg', amount: 0.9, duration: 10},
			],
		},
	],
};

//#endregion
