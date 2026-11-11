//#region 05_commands/playerDiedCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'died' reactor — the player's death is the one that ends the run.
// Transitions to Death (retry level / quit to menu).
const playerDiedCmd = ({entity}) => {
	if (!entity?.controllable) return;
	game.scene.getScene('Playing')?.scene.start('Death');
};

//#endregion
