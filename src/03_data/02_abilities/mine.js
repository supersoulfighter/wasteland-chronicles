//#region 03_data/02_abilities/mine.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Drop a pile of shrapnel — sits until an enemy touches it, then
// explodes in a radius of 24.
Abilities.actives.mine = {
	key: 'mine',
	name: 'Mine',
	slot: '8',
	cost: 4,
	cooldown: 3,
	pos: 'RB',
	attack: {
		dmg: 60,
		accuracy: 100,
		shape: {kind: 'mine'},
		pattern: {kind: 'mine', radius: 24},
	},
};

//#endregion
