//#region 05_commands/sealDoorsCmd.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Arena seal: every door in the level becomes solid until the boss
// dies (openDoorsCmd is the 'died' reactor).
const sealDoorsCmd = ({scene}) => {
	scene.doors.children.iterate(door => {
		door.body.enable = true;
		door.setData('sealed', true);
		door.setAlpha(1);
	});
};

//#endregion
