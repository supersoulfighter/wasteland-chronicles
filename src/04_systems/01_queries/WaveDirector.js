//#region 04_systems/01_queries/WaveDirector.js ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `waves`. Keeps `spt` minions of the boss's family alive:
// when the whole wave is dead, the next one arrives 5 seconds later
// at arena edge points. Map-placed enemies spawn once at level start
// (LevelManager), never through here.
const WaveDirector = {

	tick(scene, dt) {
		const now = game.loop.now;
		for (const boss of getQueries().waves.get()) {
			const sp = boss.spawning;
			// prune the dead out of the wave list
			sp.alive = sp.alive.filter(eid => {
				const m = getWorld().getEntity(eid);
				return m && !m.isDestroyed;
			});
			if (sp.alive.length >= sp.spt) continue;
			if (sp.nextAt === 0) {
				sp.nextAt = now + 5000;   // wipe → 5s to next wave
				continue;
			}
			if (now < sp.nextAt) continue;
			this.spawnWave(scene, boss, sp);
		}
	},

	spawnWave(scene, boss, sp) {
		const p = boss.rendered.pos();
		const arena = boss.bossy?.arena;
		for (let i = 0; i < sp.spt; i++) {
			// ring of points around the boss/arena center
			const a = (i / sp.spt) * Math.PI * 2;
			const r = arena ? Math.min(arena.width, arena.height) / 3 : 80;
			const at = {
				x: (arena ? arena.x + arena.width / 2 : p.x)
					+ Math.cos(a) * r,
				y: (arena ? arena.y + arena.height / 2 : p.y)
					+ Math.sin(a) * r,
			};
			const minion = spawnEnemyCmd({
				scene, key: sp.family, x: at.x, y: at.y,
			});
			if (minion) sp.alive.push(minion.id);
		}
		sp.nextAt = 0;
	},
};

//#endregion
