//#region 03_data/02_abilities/antenna.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Grows a head appendage that fully blocks up to 10 incoming attacks.
// On the 10th block the antenna dies and the cooldown starts —
// useActiveCmd grants Attuned{blocksLeft: 10}.
Abilities.actives.antenna = {
	key: 'antenna',
	name: 'Antenna',
	slot: '9',
	cost: 15,
	cooldown: 30,
	effect: {status: 'antenna', blocks: 10},
};

//#endregion
