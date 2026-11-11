//#region 02_components/Armed.js ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Attack defs this entity can fire. `list` holds def objects
// (crystals for the player, `def.attack` for enemies, `def.attacks`
// for bosses); `idx` is the boss AI's current attack. `stash` powers
// Regurge Surge — the worm swaps the swallowed def in for one shot,
// then reverts.
class Armed extends Geotic.Component {

	static properties = {
		list: [],
		idx: 0,
		stash: null,
		readyAt: 0,   // ms — current attack can't refire before this
	};

	current() {
		return this.list[this.idx] ?? this.list[0];
	}

	// One-shot replacement — pair every swapTemp with a revert.
	swapTemp(def) {
		this.stash = this.list[this.idx];
		this.list[this.idx] = def;
	}

	revert() {
		if (this.stash) {
			this.list[this.idx] = this.stash;
			this.stash = null;
		}
	}
}

ECS.registerComponent(Armed);

//#endregion
