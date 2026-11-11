//#region 05_commands/checkLevelClearCmd.js ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'died' reactor — the last death consequence. Killing the Gorilla
// wins the game straight away (no exit door to walk through);
// anything else leaves the level-clear path to the exit zone.
const checkLevelClearCmd = ({entity}) => {
	if (!entity?.bossy) return;
	const scene = game.scene.getScene('Playing');
	if (scene?.level.key === 'level24') {
		scene.scene.start('Victory');
	}
};

//#endregion
