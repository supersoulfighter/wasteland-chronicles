//#region 03_data/01_crystals/yellow.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Yellow: Double Hands — the stagger club and the bouncing spike wave.
Crystals.yellow = {
	key: 'yellow',
	name: 'Double Hands',
	uses: 16,
	cooldown: 0.75,
	cost: 0.8,
	pos: 'C',
	anim: 'attack-club',
	icon: 'icon-yellow',
	melee: {           // fused fists: damage + stagger all around
		dmg: 60,
		accuracy: 92,
		shape: {kind: 'circle', r: 16},
		effectRadius: 40,   // stagger reaches past the damage circle
		pattern: {kind: 'cone', degrees: 360},
		effects: [{status: 'staggered', duration: 1}],
	},
	ranged: {          // spike wave bounces off obstacles twice
		dmg: 30,
		accuracy: 70,
		speed: 650,
		shape: {kind: 'bullet'},
		pattern: {kind: 'bounce', count: 2},
	},
};

//#endregion
