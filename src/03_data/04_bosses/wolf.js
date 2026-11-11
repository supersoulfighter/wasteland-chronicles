//#region 03_data/04_bosses/wolf.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.wolf = {
	key: 'wolf',
	name: 'Wolf',
	level: 3,
	health: 600,
	speed: 30,
	style: 'walk',
	size: 3,
	anim: 'wolf',
	minions: {spt: 4, type: 'rat'},
	attacks: [
		{
			name: 'Fang Bite',
			dmg: 20,
			cooldown: 1,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'XS'},
			pattern: {kind: 'single'},
		},
		{
			name: 'Claw Combo',
			dmg: 10,
			cooldown: 5,
			weight: 0.7,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			// five swipes, half a second apart
			pattern: {kind: 'volley', strikes: 5, delay: 0.5},
		},
		{
			name: 'Chilling Howl',
			dmg: 0,
			cooldown: 10,
			weight: 0.3,
			pos: 'C',
			shape: {kind: 'global'},
			pattern: {kind: 'global'},
			// slows the player 10% for 10s — stacks
			effects: [
				{status: 'slow', stat: 'speed', amount: 0.9, duration: 10},
			],
		},
	],
};

//#endregion
