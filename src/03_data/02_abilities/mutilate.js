//#region 03_data/02_abilities/mutilate.js /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Overloads the Mutation of every visible enemy — internal damage
// everywhere on screen at once (G).
Abilities.actives.mutilate = {
	key: 'mutilate',
	name: 'Mutilate',
	slot: '0',
	cost: 20,
	cooldown: 90,
	attack: {
		dmg: 70,
		shape: {kind: 'global'},
		pattern: {kind: 'global'},
	},
};

//#endregion
