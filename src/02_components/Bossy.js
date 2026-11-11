//#region 02_components/Bossy.js ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Boss identity. `key` indexes BossSpecials for bespoke attacks
// (data holds no function refs — this key is the indirection) and
// `arena` remembers the arena rect so door commands know which room
// this fight seals.
class Bossy extends Geotic.Component {

	static properties = {
		key: null,
		arena: null,   // {x, y, width, height} from the map object
	};
}

ECS.registerComponent(Bossy);

//#endregion
