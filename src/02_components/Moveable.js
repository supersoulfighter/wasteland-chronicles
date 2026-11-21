//#region 02_components/Moveable.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Locomotion state. PlayerSystem and EnemyAI only write `intent`;
// MovementSystem is the sole writer of body velocity. That split is
// what makes grabs/staggers cheap — block the intent, physics follows.
class Moveable extends Geotic.Component {

	static properties = {
		speed: 0,                  // base px/sec
		facing: 'down',            // up|down|left|right (anim rows)
		intent: {x: 0, y: 0},      // desired direction, -1..1
		terrainMult: 1,            // TerrainSystem sets this per tile
		terrainIce: 0,             // ice slide factor, 0 = normal stop
		terrainDmgMult: 1,         // mutated ground buffs damage dealt
		hazardSecs: 0,             // exposure on the current dps hazard
		warpAt: 0,                 // ms — last warp hazard teleport
		dashUntil: 0,              // Charge active — dash channel ends
		dashDir: {x: 0, y: 0},
	};

	// Speed after every active multiplier — sibling reads are allowed
	// (component APIs stay entity-local, this is the textbook case).
	effectiveSpeed() {
		let mult = this.terrainMult;
		mult *= this.entity.statusCarrying?.mult('speed') ?? 1;
		return this.speed * mult;
	}
}

ECS.registerComponent(Moveable);

//#endregion
