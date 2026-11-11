//#region 02_components/Spawning.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Boss minion upkeep — WaveDirector reads this to keep `spt`
// minions of `family` type alive and to time the next wave after a
// full wipe.
class Spawning extends Geotic.Component {

	static properties = {
		spt: 0,         // minions to keep alive
		family: null,   // Enemies table key for the minions
		nextAt: 0,      // ms timestamp the next wave may spawn
		alive: [],      // eids of the current wave — [] = wipe
	};
}

ECS.registerComponent(Spawning);

//#endregion
