//#region 02_components/Luminous.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Light radius in px. The Darkness system punches a hole this wide
// in the shadow overlay for each entity in the `lights` query —
// the player's `radius` gets multiplied by the Nightvision passive.
class Luminous extends Geotic.Component {

	static properties = {
		radius: 0,
	};
}

ECS.registerComponent(Luminous);

//#endregion
