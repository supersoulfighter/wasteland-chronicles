//#region 02_components/Damageable.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Health. The one place hit points are applied — always through
// apply() so the clamp can't be skipped.
class Damageable extends Geotic.Component {

	static properties = {
		value: 1,   // current hp
		max: 1,     // ceiling for heals/refills
	};

	// Signed delta: negative to hurt, positive to heal.
	apply(n) {
		this.value = Phaser.Math.Clamp(this.value + n, 0, this.max);
	}

	dead() {
		return this.value <= 0;
	}
}

ECS.registerComponent(Damageable);

//#endregion
