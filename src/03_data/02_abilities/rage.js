//#region 03_data/02_abilities/rage.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// All attacks do 15% more damage for 5 seconds — a 'dmg' multiplier
// carried by StatusCarrying (attacker?.statusCarrying?.mult('dmg')).
Abilities.actives.rage = {
	key: 'rage',
	name: 'Rage',
	slot: '3',
	cost: 6,
	cooldown: 12,
	effect: {status: 'rage', stat: 'dmg', amount: 1.15, duration: 5},
};

//#endregion
