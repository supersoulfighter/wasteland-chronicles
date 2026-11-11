//#region 03_data/02_abilities/bomb.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Innate active — spike ball from the chest, explodes on impact
// (radius 16). Not a level-up award; the player starts with it.
Abilities.actives.bomb = {
	key: 'bomb',
	name: 'Bomb',
	slot: '1',
	cost: 4,
	cooldown: 2,
	pos: 'TF',
	attack: {
		dmg: 30,
		accuracy: 75,
		speed: 300,
		shape: {kind: 'bullet'},
		pattern: {kind: 'aoe', radius: 16},
	},
};

//#endregion
