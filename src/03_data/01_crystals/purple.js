//#region 03_data/01_crystals/purple.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Purple: Leg — knockdown sweep and the entangling sinew ring.
Crystals.purple = {
	key: 'purple',
	name: 'Leg',
	uses: 2,
	cooldown: 2,
	cost: 6.4,
	pos: 'BC',
	anim: 'attack-leg',
	icon: 'icon-purple',
	melee: {           // low full-circle kick — knocks *ground-based*
		dmg: 90,       // enemies off their feet for 5s (flyers immune:
		accuracy: 98,  // groundOnly skips anything with Evasive)
		shape: {kind: 'circle', r: 20},
		pattern: {kind: 'cone', degrees: 360},
		effects: [
			{status: 'knockeddown', duration: 5, groundOnly: true},
		],
	},
	ranged: {          // sinew strands whip out in a ring — entangle 5s
		dmg: 45,
		accuracy: 85,
		speed: 550,
		shape: {kind: 'bullet'},
		pattern: {kind: 'ring', count: 8},
		effects: [{status: 'entangled', duration: 5}],
	},
};

//#endregion
