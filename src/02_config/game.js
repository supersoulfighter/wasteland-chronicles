//#region 02_config/game.js ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Sizes, colors, physics and balance constants. Tuning lives here
// (and in 03_data/) so students tweak numbers without touching code.
const CFG = {
	// player baseline (game.md)
	hp: 100,
	mutation: 100,
	speed: 140,

	// mutation economy
	meleeCostDivisor: 3,   // melee Mutation cost = crystal cost / 3
	decay: 0.1,            // Mutation drained per second (fraction)
	mutationHalf: 0.5,     // below this fraction, damage starts fading
	mutationFloor: 0.05,   // below this, only Punch remains

	// combat feel
	aimConeDeg: 30,        // coneSelect aim-assist width
	meleeReach: 48,        // px — target this close picks the melee def
	meleeboxMs: 80,        // melee hitbox lifetime, ms

	// presentation
	lightRadius: 160,      // player vision radius, px
	zoom: 2,
	bgColor: '#1c1c26',

	// world
	tileSize: 16,
};

//#endregion
