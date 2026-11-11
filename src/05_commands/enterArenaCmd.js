//#region 05_commands/enterArenaCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Player crossed the bossArena rect — seal the doors and wake the
// boss. `scene.bossSpawned` latches it: leaving and re-entering the
// rect mustn't double-spawn.
const enterArenaCmd = ({scene, entity}) => {
	const bossKey = scene.level?.def?.boss;
	if (!bossKey || scene.bossSpawned) return;
	scene.bossSpawned = true;

	sealDoorsCmd({scene});
	const a = scene.arena;
	const boss = spawnEnemyCmd({
		scene, key: bossKey,
		x: a ? a.x + a.width / 2 : entity.rendered.pos().x,
		y: a ? a.y + a.height / 2 : entity.rendered.pos().y - 160,
		boss: true,
	});
	// WaveDirector reads the arena off the boss to place minions
	if (boss?.bossy) boss.bossy.arena = a;
};

//#endregion
