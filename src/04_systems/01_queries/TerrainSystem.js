//#region 04_systems/01_queries/TerrainSystem.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `movers`. Reads the tile under each entity, looks the
// terrain key up in Terrains, and writes the results onto the
// entity's moveable — MovementSystem consumes them next tick.
//
// Tiles carry `properties.terrain` naming a Terrains key. Flyers
// ignore everything except lava; Burrowed entities ignore everything
// except lava too (they're underground — water can't slow them).
const TerrainSystem = {

	tick(scene, dt) {
		const layer = getTerrain();
		for (const e of getQueries().movers.get()) {
			const mv = e.moveable;
			const flyer = e.autonomous?.style === 'fly';
			const buried = e.has(Burrowed);
			const s = e.rendered.sprite;
			const tile = layer?.getTileAtWorldXY(s.x, s.y);
			const def = tile?.properties?.terrain
				? Terrains[tile.properties.terrain] : null;

			this.apply(e, mv, def, flyer, buried);
			if (def?.lavaDps) this.lava(e, s, def, dt);
		}
	},

	// Write the terrain's three modifiers onto moveable.
	apply(e, mv, def, flyer, buried) {
		if (!def || flyer || buried) {
			mv.terrainMult = 1;
			mv.terrainIce = 0;
			mv.terrainDmgMult = 1;
			return;
		}
		let mult = def.moveMult ?? 1;
		// Swimmer passive halves the water penalty
		if (def.swimmerMult && e.powered?.passives.includes('swimmer')) {
			mult = def.swimmerMult;
		}
		mv.terrainMult = mult;
		mv.terrainIce = def.ice ?? 0;
		mv.terrainDmgMult = def.dmgMult ?? 1;
		// water scrubs acid-type dots — untilCleanse is a pipe list
		// like 'water|crystal'
		if (def.cleanse && e.statusCarrying) {
			e.statusCarrying.effects =
				e.statusCarrying.effects.filter(fx =>
					!fx.untilCleanse?.split('|').includes(def.cleanse));
		}
	},

	// Standing still on lava burns — move and you're safe. `direct`
	// skips dodge/invulnerable; the tile can't be dodged.
	lava(e, s, def, dt) {
		const v = s.body.velocity;
		if (Math.abs(v.x) + Math.abs(v.y) < 4) {
			resolveHitCmd({
				target: e,
				attack: {dmg: def.lavaDps * dt, effects: []},
				direct: true,
			});
		}
	},
};

//#endregion
