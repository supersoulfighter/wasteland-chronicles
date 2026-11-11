//#region 05_commands/completeLevelCmd.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Player touched the exit zone — write the save with this level
// marked complete, then hand off to LevelComplete (which leads into
// AbilityPick and the next level).
const completeLevelCmd = ({scene, entity}) => {
	saveProgressCmd({scene, completed: true});
	scene.scene.launch('LevelComplete', {level: scene.level.key});
	scene.scene.sleep();
};

//#endregion
