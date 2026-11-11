//#region 05_commands/despawnCmd.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Any entity's teardown — sprite first (it's a plain Phaser object,
// not part of the world), then the geotic destroy which detaches
// every component and drops the entity from its queries.
// Wired as a 'died' reactor, so it also runs on deaths — safe because
// by then every command that needed the entity has run.
const despawnCmd = ({entity}) => {
	entity?.rendered?.sprite?.destroy();
	entity?.destroy();
};

//#endregion
