//#region 02_components/Evasive.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Dodge chance — flying enemies get this at spawn (see the enemy
// prefab); the Nimble and Slippery passives top up the player's
// per-kind chance. resolveHitCmd calls roll() before damage; a true
// roll is a whiff, the hit never lands.
class Evasive extends Geotic.Component {

	static properties = {
		pct: 0,        // 0-100 chance vs any attack
		meleePct: 0,   // extra chance vs melee only (Slippery)
		rangedPct: 0,  // extra vs projectiles only (Nimble)
	};

	roll(kind) {
		const pct = this.pct + (kind === 'melee' ? this.meleePct : this.rangedPct);
		return Math.random() * 100 < pct;
	}
}

ECS.registerComponent(Evasive);

//#endregion
