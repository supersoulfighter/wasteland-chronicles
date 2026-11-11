//#region 03_data/01_crystals/red.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Red: Forearm — the wide slash and the shard fan.
Crystals.red = {
	key: 'red',
	name: 'Forearm',
	uses: 64,
	cooldown: 0.33,
	cost: 0.2,
	pos: 'FC',
	anim: 'attack-forearm',
	icon: 'icon-red',
	melee: {           // sword-like slash, 120° arc
		dmg: 40,
		accuracy: 88,
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'cone', degrees: 120},
	},
	ranged: {          // 5 jagged shards in a 60° fan
		dmg: 20,
		accuracy: 60,
		speed: 600,
		shape: {kind: 'bullet'},
		pattern: {kind: 'fan', count: 5, degrees: 60},
	},
};

//#endregion
