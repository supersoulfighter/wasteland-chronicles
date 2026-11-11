//#region 05_commands/hudRefreshCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'health-changed' / 'mutation-changed' / 'ammo-changed' reactor —
// the Hud scene is a separate scene, so the command bridges the gap:
// find it, tell it to redraw if it's awake.
const hudRefreshCmd = () => {
	const hud = game.scene.getScene('Hud');
	if (hud?.scene.isActive()) hud.refresh?.();
};

//#endregion
