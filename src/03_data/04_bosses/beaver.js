//#region 03_data/04_bosses/beaver.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.beaver = {
	key: 'beaver',
	name: 'Beaver',
	level: 6,
	health: 800,
	speed: 30,
	style: 'burrow',
	size: 3,
	anim: 'beaver',
	minions: {spt: 6, type: 'beetle'},
	attacks: [
		{
			name: 'Incisor Chop',
			dmg: 5,
			cooldown: 7,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'XS'},
			// chews continuously while facing the player — a held
			// melee box ticking every .3s until the channel ends
			pattern: {kind: 'channel', tick: 0.3, duration: 4},
		},
		{
			name: 'Tail Slap',
			dmg: 20,
			cooldown: 2,
			weight: 1,
			pos: 'RB',
			shape: {kind: 'circle', r: 32},
			pattern: {kind: 'single'},
			effects: [{status: 'staggered', duration: 1}],
		},
		{
			name: 'Wood Chuck',
			dmg: 30,
			cooldown: 1,
			weight: 1.5,
			pos: 'RB',
			shape: {kind: 'lob'},
			pattern: {kind: 'lob'},
			speed: 400,
		},
	],
};

//#endregion
