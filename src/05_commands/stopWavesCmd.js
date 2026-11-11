//#region 05_commands/stopWavesCmd.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// 'died' reactor — a dead boss stops calling minion waves. Zeroing
// `spt` is enough; WaveDirector reads it every frame.
const stopWavesCmd = ({entity}) => {
	if (entity?.spawning) entity.spawning.spt = 0;
};

//#endregion
