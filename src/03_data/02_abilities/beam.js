//#region 03_data/02_abilities/beam.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Mutation energy ray — held down, it cuts every enemy along the aim
// line each active frame. Cooldown is the attack rate; cost and
// damage are per attack.
Abilities.actives.beam = {
	key: 'beam',
	name: 'Beam',
	slot: '6',
	cost: 0.1,
	cooldown: 0.1,
	pos: 'FT',
	attack: {
		dmg: 1,
		accuracy: 80,
		shape: {kind: 'beam'},
		pattern: {kind: 'beam'},
	},
};

//#endregion
