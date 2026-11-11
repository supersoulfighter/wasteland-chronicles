//#region 02_components/Armored.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Damage reduction. `mult` is the fraction shaved off — Armor
// ability grants 0.25 for 5 seconds (endsAt is the ms timestamp it
// lapses; the command rewrites both on re-use).
class Armored extends Geotic.Component {

	static properties = {
		mult: 0,
		endsAt: 0,   // 0 = permanent (e.g. granted by a passive)
	};

	// The Armor ability's 5s window: lapsed → mitigation is a no-op.
	expired() {
		return this.endsAt > 0 && game.loop.now > this.endsAt;
	}

	mitigate(amount) {
		if (this.expired()) return amount;
		return amount * (1 - this.mult);
	}
}

ECS.registerComponent(Armored);

//#endregion
