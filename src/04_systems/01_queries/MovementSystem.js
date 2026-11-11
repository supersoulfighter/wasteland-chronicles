//#region 04_systems/01_queries/MovementSystem.js //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `movers`. The sole writer of body velocity:
// `velocity = intent × effectiveSpeed()`. Also owns facing and
// walk-anim selection — 8-direction motion, 4-direction art;
// diagonals keep the last cardinal, 'left' is 'right' + flipX.
const MovementSystem = {

	tick(scene, dt) {
		for (const e of getQueries().movers.get()) {
			const mv = e.moveable;
			const body = e.rendered.sprite.body;

			if (e.feared) {              // fear overrides input
				mv.intent.x = e.feared.dir.x;
				mv.intent.y = e.feared.dir.y;
			}

			// normalize diagonals to unit speed
			let vx = mv.intent.x;
			let vy = mv.intent.y;
			const len = Math.hypot(vx, vy);
			if (len > 1) {
				vx /= len;
				vy /= len;
			}
			// cheap flocking — ai entities steer slightly apart
			if (e.autonomous) {
				const sep = this.separation(e);
				vx += sep.x;
				vy += sep.y;
			}

			// Charge dash — a timed velocity burst that ignores intent
			if (game.loop.now < mv.dashUntil) {
				body.setVelocity(
					mv.dashDir.x * mv.speed * 3,
					mv.dashDir.y * mv.speed * 3);
				continue;
			}

			const spd = mv.effectiveSpeed();
			let tx = vx * spd;
			let ty = vy * spd;
			if (mv.terrainIce) {
				// icy ground slides: keep most of the old velocity
				tx = body.velocity.x * mv.terrainIce
					+ tx * (1 - mv.terrainIce);
				ty = body.velocity.y * mv.terrainIce
					+ ty * (1 - mv.terrainIce);
			}
			body.setVelocity(tx, ty);

			this.face(e, vx, vy);
		}
	},

	// Push vector away from nearby movers — keeps enemies from
	// stacking on one tile. ~24px of personal space, gently applied.
	separation(e) {
		const p = e.rendered.pos();
		let sx = 0;
		let sy = 0;
		for (const other of getQueries().ai.get()) {
			if (other === e) continue;
			const op = other.rendered.pos();
			const d = dist(p.x, p.y, op.x, op.y);
			if (d > 0 && d < 24) {
				sx += (p.x - op.x) / d * (24 - d) / 24;
				sy += (p.y - op.y) / d * (24 - d) / 24;
			}
		}
		return {x: sx * 0.5, y: sy * 0.5};
	},

	// Dominant axis picks the facing; a true diagonal keeps the last
	// cardinal (the sprite only has 4 directions anyway).
	face(e, vx, vy) {
		const mv = e.moveable;
		if (Math.abs(vx) > Math.abs(vy)) {
			mv.facing = vx < 0 ? 'left' : 'right';
		} else if (Math.abs(vy) > 0) {
			mv.facing = vy < 0 ? 'up' : 'down';
		}
		if (vx || vy) {
			e.rendered.face(mv.facing);
			e.rendered.playAnim(`walk-${mv.facing}`);
		}
	},
};

//#endregion
