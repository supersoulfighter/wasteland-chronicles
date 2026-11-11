//#region 03_data/04_bosses/badger.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.badger = {
	key: 'badger',
	name: 'Badger',
	level: 18,
	health: 1600,
	speed: 50,
	style: 'burrow',
	size: 3,
	anim: 'badger',
	minions: {spt: 14, type: 'mole'},
	attacks: [
		{
			name: 'Fear Bite',
			dmg: 45,
			cooldown: 5,
			weight: 2,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			pattern: {kind: 'single'},
			// the player runs away for 3s
			effects: [{status: 'feared', duration: 3}],
		},
		{
			name: 'Ankle Crush',
			dmg: 45,
			cooldown: 5,
			weight: 1.5,
			pos: 'FB',
			shape: {kind: 'rect', size: 'S'},
			pattern: {kind: 'single'},
			effects: [{status: 'knockeddown', duration: 3}],
		},
		{
			name: 'Badgering Chase',
			dmg: 25,
			cooldown: 5,
			weight: 0.7,
			pos: 'FC',
			shape: {kind: 'rect', size: 'S'},
			// 5s of relentless pursuit, damaging on each touch and
			// invulnerable throughout → BossSpecials.badger
			pattern: {kind: 'grab', duration: 5},
			special: true,
		},
		{
			name: 'Hole Trap',
			dmg: 45,
			cooldown: 5,
			weight: 1,
			pos: 'C',
			// drops a softened patch — player falls in and is stuck 3s
			shape: {kind: 'mine'},
			pattern: {kind: 'mine', radius: 20},
			effects: [{status: 'entangled', duration: 3}],
		},
	],
};

//#endregion
