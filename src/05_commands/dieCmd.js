//#region 05_commands/dieCmd.js ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Death is a broadcast, not a cleanup — 'died' reactors in
// wireReactions do the despawn, door opening, wave stops, and
// level-clear checks. This command only marks the fact true.
const dieCmd = ({entity, source}) => {
	game.events.emit('died', {entity, source});
};

//#endregion
