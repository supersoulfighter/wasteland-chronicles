//#region 02_components/Attuned.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The Antenna active: a shield that fully blocks N hits before it
// breaks. `blocksLeft` counts hits remaining; block() eats one hit
// and returns what got through (0 — it blocks the whole hit). On the
// last block the antenna dies and the ability's cooldown starts
// (useActiveCmd skips startCd for antenna — this is where it lives).
class Attuned extends Geotic.Component {

	static properties = {
		blocksLeft: 0,
		activeKey: null,   // which ability to start cooling down
		cooldown: 0,       // its cooldown secs
	};

	block(amount) {
		if (this.blocksLeft <= 0) return amount;
		this.blocksLeft--;
		if (this.blocksLeft === 0) {
			// antenna dies → its ability's cooldown starts now
			this.entity.powered?.startCd(this.activeKey, this.cooldown);
			this.entity.remove(this);
		}
		return 0;
	}
}

ECS.registerComponent(Attuned);

//#endregion
