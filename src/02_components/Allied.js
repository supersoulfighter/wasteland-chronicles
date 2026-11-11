//#region 02_components/Allied.js //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Team tag — 'player' | 'enemy' | 'allied'. Commands read it to
// decide who a hit belongs to; the collision matrix uses the sprite's
// group, but commands that re-target (chain, fragments) ask here.
class Allied extends Geotic.Component {

	static properties = {
		id: 'enemy',
	};
}

ECS.registerComponent(Allied);

//#endregion
