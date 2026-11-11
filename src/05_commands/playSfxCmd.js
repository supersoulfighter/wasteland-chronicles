//#region 05_commands/playSfxCmd.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'picked-up' reactor — a sound per pickup. AudioManager tolerates
// missing audio keys, so the placeholder key is safe until real
// sounds ship.
const playSfxCmd = () => {
	const scene = game.scene.getScene('Playing');
	if (scene) AudioManager.playSfx(scene, 'sfx-pickup');
};

//#endregion
