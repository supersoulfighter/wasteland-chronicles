//#region 03_data/04_bosses/bear.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.bear = {
	key: 'bear',
	name: 'Bear',
	level: 15,
	health: 1400,
	speed: 40,
	style: 'walk',
	size: 3,
	anim: 'bear',
	minions: {spt: 12, type: 'fox'},
	attacks: [
		{
			name: 'Angry Gaze',
			dmg: 5,
			cooldown: 5,
			weight: 2,
			pos: 'FT',
			// a burning ray, ticking every .1s while it lasts
			shape: {kind: 'beam'},
			pattern: {kind: 'channel', tick: 0.1, duration: 3},
		},
		{
			name: 'Heavy Swipe',
			dmg: 65,
			cooldown: 1,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			pattern: {kind: 'single'},
			effects: [{status: 'staggered', duration: 1}],
		},
		{
			name: 'Fearsome Roar',
			dmg: 0,
			cooldown: 10,
			weight: 0.4,
			pos: 'C',
			shape: {kind: 'global'},
			pattern: {kind: 'global'},
			// strips attack ability for 5s
			effects: [{status: 'silenced', duration: 5}],
		},
		{
			name: 'Absolute Maul',
			dmg: 7,
			cooldown: 10,
			weight: 0.3,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			// seven swipes at .12s, invulnerable throughout
			pattern: {kind: 'volley', strikes: 7, delay: 0.12},
			invulnerable: true,
		},
	],
};

//#endregion
