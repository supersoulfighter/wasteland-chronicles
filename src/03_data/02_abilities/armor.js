//#region 03_data/02_abilities/armor.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Reduces damage received by 25% for 5 seconds — grants the Armored
// component with an expiry; the command rewrites endsAt on re-use.
Abilities.actives.armor = {
	key: 'armor',
	name: 'Armor',
	slot: '2',
	cost: 5,
	cooldown: 10,
	effect: {status: 'armor', amount: 0.25, duration: 5},
};

//#endregion
