//#region 02_components/Swallowing.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The worm's signature — it can eat a player projectile. `captured`
// is the swallowed attack def (or null). swallowProjectileCmd fills
// it; the next attack swapTemp()s it into Armed and reverts after
// firing.
class Swallowing extends Geotic.Component {

	static properties = {
		captured: null,
	};
}

ECS.registerComponent(Swallowing);

//#endregion
