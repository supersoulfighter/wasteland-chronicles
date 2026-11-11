//#region 02_components/Mutated.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The Mutation meter — the game's energy/ammo economy. Crystal
// attacks spend it, crystal pickups refill it, and it decays slowly
// on its own so the player has to keep collecting.
class Mutated extends Geotic.Component {

	static properties = {
		value: 100,
		max: 100,
		decayRate: 0.1,   // fraction of max drained per second
	};

	spend(n) {
		this.value = Math.max(0, this.value - n);
	}

	canAfford(n) {
		return this.value >= n;
	}

	// 0..1 — the deficit curve and HUD meter both read this.
	pct() {
		return this.value / this.max;
	}

	refill(n) {
		this.value = Math.min(this.max, this.value + n);
	}

	// Passive drain, ticked by PlayerSystem.
	decay(dt) {
		this.value = Math.max(0, this.value - this.max * this.decayRate * dt);
	}
}

ECS.registerComponent(Mutated);

//#endregion
