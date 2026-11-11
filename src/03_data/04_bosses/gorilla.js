//#region 03_data/04_bosses/gorilla.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The level-24 finale.
Bosses.gorilla = {
	key: 'gorilla',
	name: 'Gorilla',
	level: 24,
	health: 2000,
	speed: 40,
	style: 'leap',
	size: 3,
	anim: 'gorilla',
	minions: {spt: 20, type: 'rabbit'},
	attacks: [
		{
			name: 'Pound Down',
			dmg: 20,
			cooldown: 5,
			weight: 2,
			pos: 'FB',
			shape: {kind: 'circle', r: 12},
			// ten rapid slams, invulnerable throughout
			pattern: {kind: 'volley', strikes: 10, delay: 0.15},
			invulnerable: true,
		},
		{
			name: 'Hurl Boulder',
			dmg: 80,
			cooldown: 5,
			weight: 1.5,
			pos: 'TC',
			// breaks into 6 smaller rocks on impact
			shape: {kind: 'lob'},
			pattern: {
				kind: 'fragments',
				count: 1,
				fragCount: 6,
				dmgMult: 0.3,
				rangeMult: 0.5,
			},
			speed: 400,
		},
		{
			name: 'Hurl Plaything',
			dmg: 200,
			cooldown: 10,
			weight: 0.8,
			pos: 'FB',
			shape: {kind: 'bullet'},
			// grabs the player, slams once each side, then throws →
			// BossSpecials.gorilla
			pattern: {kind: 'grab', duration: 3},
			special: true,
		},
		{
			name: 'Chest Beat',
			dmg: 0,
			cooldown: 10,
			weight: 0.4,
			pos: 'C',
			shape: {kind: 'global'},
			pattern: {kind: 'global'},
			// +20% minion damage for 10s, stacking
			affectAllies: true,
			effects: [
				{status: 'rage', stat: 'dmg', amount: 1.2, duration: 10},
			],
		},
		{
			name: 'Boom Clap',
			dmg: 20,
			cooldown: 10,
			weight: 0.2,
			pos: 'C',
			shape: {kind: 'circle', r: 64},
			pattern: {kind: 'single'},
			effects: [{status: 'knockeddown', duration: 5}],
		},
	],
};

//#endregion
