//#region 03_data/04_bosses/condor.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.condor = {
	key: 'condor',
	name: 'Condor',
	level: 21,
	health: 1800,
	speed: 70,
	style: 'fly',
	size: 3,
	anim: 'condor',
	minions: {spt: 16, type: 'swiftlet'},
	attacks: [
		{
			name: 'Decay Bite',
			dmg: 50,
			cooldown: 5,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'M'},
			pattern: {kind: 'single'},
			// rots for 20 more over 5s
			effects: [{status: 'dot', amount: 20, duration: 5}],
		},
		{
			name: 'Deathly Swoop',
			dmg: 70,
			cooldown: 5,
			weight: 1.5,
			pos: 'FB',
			shape: {kind: 'rect', size: 'M'},
			pattern: {kind: 'single'},
			effects: [{status: 'knockeddown', duration: 4}],
		},
		{
			name: 'Quill Dart',
			dmg: 35,
			cooldown: 1,
			weight: 1,
			pos: 'FC',
			shape: {kind: 'bullet'},
			// rapid volley of feathers, invulnerable throughout
			pattern: {kind: 'volley', strikes: 4, delay: 0.15},
			invulnerable: true,
		},
		{
			name: 'Quill Spray',
			dmg: 35,
			cooldown: 5,
			weight: 0.7,
			pos: 'FC',
			shape: {kind: 'bullet'},
			// 20 quills across a 150° arc, invulnerable throughout
			pattern: {kind: 'fan', count: 20, degrees: 150},
			invulnerable: true,
		},
	],
};

//#endregion
