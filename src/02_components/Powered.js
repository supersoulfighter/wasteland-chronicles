//#region 02_components/Powered.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Owned abilities + their cooldown clocks. `passives` is a plain
// list of keys; `actives` maps key → seconds of cooldown left
// (0 = ready). AbilityPick grants through here.
class Powered extends Geotic.Component {

	static properties = {
		passives: [],          // ability keys
		actives: {},           // key → cooldown seconds remaining
	};

	// Learn an ability — the key's table decides which list it joins.
	// (`Abilities` is a 03_data global; safe to read at call time.)
	grant(key) {
		if (Abilities.passives[key]) {
			if (!this.passives.includes(key)) this.passives.push(key);
		} else {
			this.actives[key] = 0;
		}
	}

	ready(key) {
		return (this.actives[key] ?? Infinity) <= 0;
	}

	// Seconds since start used to stamp a cooldown (call after firing).
	startCd(key, secs) {
		this.actives[key] = secs;
	}

	// PlayerSystem ticks this once per frame.
	tickCd(dt) {
		for (const key in this.actives) {
			if (this.actives[key] > 0) {
				this.actives[key] = Math.max(0, this.actives[key] - dt);
			}
		}
	}
}

ECS.registerComponent(Powered);

//#endregion
