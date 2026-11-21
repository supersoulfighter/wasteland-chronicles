//#region 04_systems/01_queries/TerrainSystem.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `movers`. Two terrain layers of effect, per game.md:
//   ground  the level's Terrains.grounds def — map-wide, every
//           mover gets it (mutated dmg, hot idle burn, ...)
//   hazard  the Terrains.hazards def under the body — flyers and
//           Burrowed entities skip ALL of it, lava included
// A hazard applies while the body touches its tiles. When tiles of
// two kinds share the footprint, whichever tile's own collision
// shape the body overlaps wins (the ground-transition tiles).
const TerrainSystem = {

	tick(scene, dt) {
		const ground = getGroundDef();
		for (const e of getQueries().movers.get()) {
			const mv = e.moveable;
			const s = e.rendered.sprite;

			// map-wide ground — nobody is exempt
			mv.terrainDmgMult = ground?.dmgMult ?? 1;
			if (ground?.idleDps) this.idleBurn(e, s, ground, dt);
			if (e.isDestroyed) continue;

			// per-tile hazard — flyers stay above it, Burrowed
			// entities tunnel under it
			const immune =
				e.autonomous?.style === 'fly' || e.has(Burrowed);
			const def = immune ? null : this.hazardUnder(s.body);
			this.apply(e, mv, def, dt, scene);
		}
	},

	// The ONE hazard under the body, or null — the doc's three
	// rules. The hazard layer is filled edge-to-edge and the
	// ground layer sits on top, so a hazard hurts when:
	//   - the body touches a hazard tile no ground tile covers
	//   - or it overlaps a ground transition tile's collision
	//     shape (the transparent edge where hazard shows through)
	// Only touching plain ground = clean floor.
	hazardUnder(body) {
		const layer = getHazardLayer();
		if (!layer) return null;
		const rect = new Phaser.Geom.Rectangle(
			body.x, body.y, body.width, body.height);
		const ground = getGroundLayer();
		for (const t of layer.getTilesWithinShape(rect)) {
			const key = t.properties?.hazard;
			if (!key) continue;
			const gt = ground?.getTileAt(t.x, t.y);
			if (!gt || this.inShape(rect, gt)) {
				return Terrains.hazards[key] ?? null;
			}
		}
		return null;
	},

	// Does the body overlap this ground tile's transition shape?
	// Tiles with no custom shape are solid ground — safe.
	inShape(rect, t) {
		const td = t.tileset?.getTileData(t.index - t.tileset.firstgid);
		const shapes = td?.objectgroup?.objects;
		if (!shapes?.length) return false;   // plain ground tile
		return shapes.some(o =>
			Phaser.Geom.Rectangle.Overlaps(
				rect,
				new Phaser.Geom.Rectangle(
					t.pixelX + o.x, t.pixelY + o.y,
					o.width ?? 0, o.height ?? 0)));
	},

	// Write the hazard's modifiers onto moveable, then run its
	// verbs. Off-hazard = every field back to clean slate.
	apply(e, mv, def, dt, scene) {
		if (!def) {
			mv.terrainMult = 1;
			mv.terrainIce = 0;
			mv.hazardSecs = 0;
			return;
		}
		let mult = def.moveMult ?? 1;
		// Swimmer passive halves the water penalty
		if (def.swimmerMult && e.powered?.passives.includes('swimmer')) {
			mult = def.swimmerMult;
		}
		mv.terrainMult = mult;
		mv.terrainIce = def.ice ?? 0;
		// water scrubs '…|water' dots — untilCleanse is a pipe list
		if (def.cleanse && e.statusCarrying) {
			e.statusCarrying.effects =
				e.statusCarrying.effects.filter(fx =>
					!fx.untilCleanse?.split('|').includes(def.cleanse));
		}
		if (def.fall) {
			dieCmd({entity: e, source: null});   // void swallows it
			return;
		}
		if (def.dpsMax) {
			// ramping burn — exposure resets the moment you step off
			mv.hazardSecs += dt;
			const ramp = Math.min(1, mv.hazardSecs / def.rampSecs);
			const dps = def.dps + (def.dpsMax - def.dps) * ramp;
			resolveHitCmd({
				target: e,
				attack: {dmg: dps * dt, effects: []},
				direct: true,
			});
		} else {
			mv.hazardSecs = 0;
		}
		if (def.teleport) this.warp(scene, e, mv);
	},

	// Hot ground's standing-still burn — applies to every mover,
	// flyers included: `direct` skips dodge/invulnerable.
	idleBurn(e, s, ground, dt) {
		const v = s.body.velocity;
		if (Math.abs(v.x) + Math.abs(v.y) < 4) {
			resolveHitCmd({
				target: e,
				attack: {dmg: ground.idleDps * dt, effects: []},
				direct: true,
			});
		}
	},

	// Warp: bounce to a random free tile, throttled so an arrival
	// tile (which may itself be warp) can't chain-fire instantly.
	warp(scene, e, mv) {
		const now = game.loop.now;
		if (now - mv.warpAt < 600) return;
		const spots = scene.freeTiles;
		if (!spots?.length) return;
		mv.warpAt = now;
		const spot = spots[Math.floor(Math.random() * spots.length)];
		e.rendered.sprite.body.reset(spot.x, spot.y);
	},
};

//#endregion
