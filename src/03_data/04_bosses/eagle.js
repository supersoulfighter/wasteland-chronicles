//#region 03_data/04_bosses/eagle.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Bosses.eagle = {
	key: 'eagle',
	name: 'Eagle',
	level: 9,
	health: 1000,
	speed: 80,
	style: 'fly',
	size: 3,
	anim: 'eagle',
	minions: {spt: 8, type: 'bat'},
	attacks: [
		{
			name: 'Rip Bite',
			dmg: 35,
			cooldown: 1,
			weight: 2,
			pos: 'FB',
			shape: {kind: 'rect', size: 'XS'},
			pattern: {kind: 'single'},
		},
		{
			name: 'Talon Grab',
			dmg: 60,
			cooldown: 5,
			weight: 1,
			pos: 'BF',
			shape: {kind: 'rect', size: 'S'},
			pattern: {kind: 'grab', duration: 2},
			// bespoke carry-and-drop → BossSpecials.eagle
			special: true,
		},
		{
			name: 'Piercing Screech',
			dmg: 0,
			cooldown: 10,
			weight: 0.3,
			pos: 'C',
			shape: {kind: 'global'},
			pattern: {kind: 'global'},
			// buffs the wave: +10% minion damage for 10s, stacks
			affectAllies: true,
			effects: [
				{status: 'rage', stat: 'dmg', amount: 1.1, duration: 10},
			],
		},
	],
};

//#endregion
