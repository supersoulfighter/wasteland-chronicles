//#region 04_systems/01_queries/ProjectileSystem.js ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `projectiles`. Per-frame bookkeeping only — flight speed was
// set at spawn, wall bounces are arcade's; this owns expiry, and the
// post-impact pattern behaviors (pierce/chain/fragments/aoe) get
// called from Playing's overlap callbacks via afterHit().
const ProjectileSystem = {

	tick(scene, dt) {
		const now = game.loop.now;
		for (const e of getQueries().projectiles.get()) {
			if (e.ballistic.expiry && now > e.ballistic.expiry) {
				despawnCmd({scene, entity: e});
			}
		}
	},

	// Every pattern's on-hit tail. Pierce decrements hitsLeft and
	// flies on; the rest terminate the projectile one way or another.
	afterHit(scene, proj, target) {
		const b = proj.ballistic;
		b.hitsLeft--;
		if (b.pattern?.kind === 'chain') {
			if (this.chainToNext(proj, target)) return;
		}
		if (b.pattern?.kind === 'aoe') this.burst(scene, proj);
		if (b.pattern?.kind === 'fragments') this.fragment(scene, proj);
		if (b.hitsLeft <= 0) despawnCmd({scene, entity: proj});
	},

	// Bounce off a wall? arcade handles the reflection; we count down.
	onWallHit(scene, proj) {
		const b = proj.ballistic;
		if (b.bouncesLeft > 0) {
			b.bouncesLeft--;
		} else {
			despawnCmd({scene, entity: proj});
		}
	},

	// Chain — pick the nearest *unchained* enemy closer than the last
	// hop; re-aim the projectile at it. Returns false to detonate.
	chainToNext(proj, justHit) {
		const b = proj.ballistic;
		b.chainLog.push(justHit.id);
		const p = proj.rendered.pos();
		let best = null;
		let bestDist = Infinity;
		for (const e of targetsOf(proj).get()) {
			if (b.chainLog.includes(e.id)) continue;
			const op = e.rendered.pos();
			const d = dist(p.x, p.y, op.x, op.y);
			if (d < bestDist && d < b.lastHop) {
				best = e;
				bestDist = d;
			}
		}
		if (!best || (b.pattern.count && b.chainLog.length > b.pattern.count)) {
			return false;
		}
		b.lastHop = bestDist;
		const op = best.rendered.pos();
		const angle = angleTo(p.x, p.y, op.x, op.y);
		proj.rendered.sprite.body.setVelocity(
			Math.cos(angle) * b.speed, Math.sin(angle) * b.speed);
		return true;
	},

	// AoE — everything on the opposing team within `radius` takes the
	// hit (bomb blasts, mine detonations).
	burst(scene, proj) {
		const b = proj.ballistic;
		const p = proj.rendered.pos();
		const radius = b.pattern.radius ?? 24;
		for (const e of targetsOf(proj).get()) {
			const op = e.rendered.pos();
			if (dist(p.x, p.y, op.x, op.y) <= radius) {
				resolveHitCmd({attacker: null, target: e, attack: b});
			}
		}
	},

	// Fragments — child projectiles burst out on impact at reduced
	// damage and range (White's ranged half, Gorilla's boulder).
	fragment(scene, proj) {
		const b = proj.ballistic;
		const p = proj.rendered.pos();
		const count = b.pattern.fragCount ?? 4;
		const child = {
			dmg: b.dmg * (b.pattern.dmgMult ?? 0.25),
			accuracy: b.accuracy,
			speed: b.speed,
			shape: {kind: 'bullet'},
			pattern: {kind: 'single'},
			expirySecs: b.pattern.rangeMult
				? b.pattern.rangeMult * 2 : 0.5,
			effects: b.effects,
		};
		anglesSpread(0, Math.PI * 2, count, true).forEach(angle =>
			spawnProjectileCmd({
				scene,
				attacker: null,
				attack: child,
				from: p,
				angle,
			}));
	},
};

//#endregion
