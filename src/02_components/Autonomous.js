//#region 02_components/Autonomous.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// AI state — enemy defs add this via the `enemy` recipe; the player
// never gets one (that's what keeps the `ai` query clean). All AI
// scratch state lives here so EnemyAI stays a pure state machine.
class Autonomous extends Geotic.Component {

	static properties = {
		style: 'walk',        // maneuver style: fly|leap|burrow|walk
		state: 'idle',        // idle|chase|attack|maneuver|lickWounds
		until: 0,             // ms — current state's hard stop
		decisionAt: 0,        // ms — next allowed decision tick (~0.25s)
		maneuverTo: null,     // {x, y} destination for this maneuver
	};
}

ECS.registerComponent(Autonomous);

//#endregion
