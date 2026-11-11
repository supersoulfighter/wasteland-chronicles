//#region 03_data/01_crystals/white.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// White: Torso — the once-per-pickup nova. 16 spikes in random
// directions melee-side; ranged side detonates again into 4 fragments
// at quarter range/damage.
Crystals.white = {
	key: 'white',
	name: 'Torso',
	uses: 1,
	cooldown: 3,
	cost: 12.8,
	pos: 'C',
	anim: 'attack-nova',
	icon: 'icon-white',
	melee: {
		dmg: 100,
		accuracy: 100,
		shape: {kind: 'circle', r: 22},
		pattern: {kind: 'ring', count: 16, random: true},
	},
	ranged: {
		dmg: 50,
		accuracy: 90,
		speed: 650,
		shape: {kind: 'bullet'},
		pattern: {
			kind: 'fragments',
			count: 16,        // initial spikes out of the body
			fragCount: 4,     // children per impact
			dmgMult: 0.25,
			rangeMult: 0.25,
		},
	},
};

//#endregion
