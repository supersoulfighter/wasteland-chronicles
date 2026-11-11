//#region 04_systems/01_queries/StatusSystem.js ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `carriers` + every flag-marker query. Two jobs:
//   1. tick StatusCarrying effects — dots deal damage through
//      resolveHitCmd({direct: true}) (no dodge, still mitigated),
//      regen heals on the same rhythm
//   2. sweep timed flag markers — a flag past endsAt gets removed
//      and the entity rejoins its queries automatically
const StatusSystem = {

	tick(scene, dt) {
		const now = game.loop.now;
		this.tickEffects(now);
		this.sweepFlags(now);
	},

	// Every effect entry ticks or expires on its own schedule.
	tickEffects(now) {
		for (const e of getQueries().carriers.get()) {
			e.statusCarrying.effects =
				e.statusCarrying.effects.filter(fx =>
					fx.endsAt > now && this.tickOne(e, fx, now));
		}
	},

	// One effect's per-tick work. Returns false to drop the entry.
	tickOne(e, fx, now) {
		if (!fx.tickMs || now < fx.nextTick) return true;
		fx.nextTick += fx.tickMs;
		switch (fx.key) {
			case 'dot':      // burn/poison/bleed/rot/acid all land here
				resolveHitCmd({
					target: e,
					attack: {dmg: fx.amount, effects: []},
					direct: true,
				});
				break;
			case 'regen':
				e.damageable?.apply(fx.amount);
				break;
		}
		// stat mults (slow/rage/weak) need no tick — consumers read
		// statusCarrying.mult(stat) directly
		return true;
	},

	// Timed flag markers: expired → entity.remove, query membership
	// does the rest. A lapsed Launched also sheds the temporary
	// Ballistic the launch gave it — the body lands, it's a creature
	// again.
	sweepFlags(now) {
		for (const C of FLAG_COMPONENTS) {
			for (const e of getQueries()[C.name].get()) {
				const flag = e[accessor(C)];
				if (!flag.expired(now)) continue;
				e.remove(flag);
				if (C === Launched && e.ballistic) {
					e.remove(e.ballistic);
				}
			}
		}
	},
};

//#endregion
