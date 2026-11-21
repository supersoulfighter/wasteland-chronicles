//#region 02_components/Ballistic.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Projectile payload. spawnProjectileCmd copies the attack's numbers
// here; ProjectileSystem then owns the per-frame bookkeeping
// (bounces, chains, pierce count, expiry).
class Ballistic extends Geotic.Component {

	static properties = {
		team: 'player',      // who the hit belongs to
		dmg: 0,
		accuracy: 100,
		effects: [],         // status defs applied on hit
		hitsLeft: 1,         // pierce = how many targets may be hit
		bouncesLeft: 0,      // wall ricochets remaining
		chainLog: [],        // eids already chained to (no double-hops)
		lastHop: Infinity,   // each chain hop must be shorter than this
		expiry: 0,           // ms timestamp, 0 = flies forever
		swallowable: true,   // rays can't be swallowed (Regurge Surge)
		pattern: null,       // the def's pattern, for on-impact behavior
		speed: 0,
		// volley bookkeeping — a shared log lets the last strike pay
		// bonusDmg only when every shot connected (scorpion)
		volleyLog: null,
		volleyBonus: 0,
		lastStrike: false,
	};
}

ECS.registerComponent(Ballistic);

//#endregion
