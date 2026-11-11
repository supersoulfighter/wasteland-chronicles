//#region 03_data/02_abilities/heal.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Restores 50 health — a plain Damageable.apply(+50).
Abilities.actives.heal = {
	key: 'heal',
	name: 'Heal',
	slot: '4',
	cost: 7,
	cooldown: 15,
	effect: {heal: 50},
};

//#endregion
