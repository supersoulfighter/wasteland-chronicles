//#region 03_data/01_crystals/hand.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Innate — always owned, never runs out (uses: Infinity). Becomes
// unavailable only below the 5% Mutation floor, where Punch takes over.
Crystals.hand = {
	key: 'hand',
	name: 'Hand',
	uses: Infinity,
	cooldown: 0.5,
	cost: 0.1,
	pos: 'FC',
	anim: 'attack-hand',
	icon: 'icon-hand',
	melee: {           // bayonet-like shard from the palm
		dmg: 20,
		accuracy: 84,
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
	},
	ranged: {          // deadly shards from the palm
		dmg: 10,
		accuracy: 50,
		speed: 500,
		shape: {kind: 'bullet'},
		pattern: {kind: 'single'},
	},
};

//#endregion
