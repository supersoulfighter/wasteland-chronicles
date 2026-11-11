//#region 05_commands/retryLevelCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Death → "try again" — restart Playing at the save's currentLevel.
// `scene` is whichever scene is asking (Death, Pause); scene.start
// replaces it.
const retryLevelCmd = ({scene}) => {
	scene.scene.start('Playing', {
		level: SaveManager.load().currentLevel,
	});
};

//#endregion
