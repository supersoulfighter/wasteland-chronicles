//#region 03_data/01_crystals/green.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Green: Foot — the kick that turns enemies into projectiles, and the
// chain-bouncing hook shot.
Crystals.green = {
	key: 'green',
	name: 'Foot',
	uses: 8,
	cooldown: 1,
	cost: 1.6,
	pos: 'FC',
	anim: 'attack-kick',
	icon: 'icon-green',
	melee: {           // victim becomes a projectile: AoE on impact
		dmg: 70,
		accuracy: 94,
		shape: {kind: 'rect', size: 'M'},
		pattern: {kind: 'launch', radius: 30, dmgMult: 0.333},
	},
	ranged: {          // flying hook — chains to up to 4 enemies, each
		dmg: 35,       // hop shorter than the last
		accuracy: 75,
		speed: 700,
		shape: {kind: 'lob'},
		pattern: {kind: 'chain', count: 4},
	},
};

//#endregion
