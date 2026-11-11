//#region 03_data/01_crystals/blue.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Blue: Shin — full-circle spinning kick, shrapnel burst.
Crystals.blue = {
	key: 'blue',
	name: 'Shin',
	uses: 4,
	cooldown: 1.5,
	cost: 3.2,
	pos: 'C',
	anim: 'attack-shin',
	icon: 'icon-blue',
	melee: {           // spinning kick — everyone around takes it
		dmg: 80,
		accuracy: 96,
		shape: {kind: 'circle', r: 18},
		pattern: {kind: 'cone', degrees: 360},
	},
	ranged: {          // shrapnel in all directions
		dmg: 40,
		accuracy: 80,
		speed: 350,
		shape: {kind: 'bullet'},
		pattern: {kind: 'ring', count: 8},
	},
};

//#endregion
