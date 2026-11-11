//#region 03_data/02_abilities/charge.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Charge forward — up to 500px at 400px/sec, damaging everything in
// the path. useActiveCmd drives the burst; the attack numbers ride
// along for the contact damage.
Abilities.actives.charge = {
	key: 'charge',
	name: 'Charge',
	slot: '5',
	cost: 8,
	cooldown: 0,
	pos: 'C',
	attack: {
		dmg: 50,
		accuracy: 80,
		shape: {kind: 'circle', r: 10},
		pattern: {kind: 'charge', dist: 500, speed: 400},
	},
};

//#endregion
