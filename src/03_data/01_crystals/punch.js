//#region 03_data/01_crystals/punch.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Innate fallback — the only attack left under 5% Mutation. Weak,
// free, melee-only (no `ranged` half).
Crystals.punch = {
	key: 'punch',
	name: 'Punch',
	uses: Infinity,
	cooldown: 0.5,
	cost: 0,
	pos: 'FC',
	anim: 'attack-punch',
	icon: 'icon-punch',
	melee: {
		dmg: 5,
		accuracy: 90,
		shape: {kind: 'rect', size: 'XXS'},
		pattern: {kind: 'single'},
	},
};

//#endregion
