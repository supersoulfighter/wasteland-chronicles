//#region 02_components/Consumable.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Ammo pool — remaining attack uses per crystal key. `Infinity` is a
// legal count (innate attacks never run out) and survives add()
// untouched.
class Consumable extends Geotic.Component {

	static properties = {
		uses: {},   // {crystalKey: count}
	};

	left(key) {
		return this.uses[key] ?? 0;
	}

	// Returns false when the pool is dry — the command then falls
	// back to Punch.
	spend(key) {
		const left = this.uses[key] ?? 0;
		if (left === Infinity) return true;
		if (left <= 0) return false;
		this.uses[key] = left - 1;
		return true;
	}

	add(key, n) {
		this.uses[key] = (this.uses[key] ?? 0) + n;
	}
}

ECS.registerComponent(Consumable);

//#endregion
