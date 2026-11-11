//#region 03_data/02_abilities/flip.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Touch a non-boss enemy — it joins the player's side for 10 seconds.
// Targets the nearest Flippable in reach; flipEntityCmd does the turn.
Abilities.actives.flip = {
	key: 'flip',
	name: 'Flip',
	slot: '7',
	cost: 12,
	cooldown: 20,
	pos: 'FC',
	accuracy: 90,
	effect: {status: 'flipped', duration: 10},
};

//#endregion
