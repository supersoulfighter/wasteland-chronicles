//#region 05_commands/openDoorsCmd.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'died' reactor — only a boss's death opens the arena (branch on
// the Bossy capability, not the def). Scene comes off the global
// game object — event payloads carry no scene.
const openDoorsCmd = ({entity}) => {
	if (!entity?.bossy) return;
	const scene = game.scene.getScene('Playing');
	scene?.doors.children.iterate(door => {
		door.body.enable = false;        // passable again
		door.setData('sealed', false);
		door.setAlpha(0.3);
	});
};

//#endregion
