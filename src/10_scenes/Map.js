//#region 10_scenes/Map.js /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The worldmap — WorldMap.nodes drawn as a node graph, links as
// lines. Visited nodes are lit, the current level pulses, locked
// nodes stay dim. M / Esc closes back to Playing.
//
// (The class is named Map to match the scene key — the vendor IIFE
// pins the builtin Map inside geotic so they don't collide.)
class Map extends Phaser.Scene {

	constructor() {
		super('Map');
	}

	create() {
		const save = SaveManager.load();
		this.add.text(400, 20, 'THE CAVE', {
			fontSize: '20px', color: '#aaffcc',
		}).setOrigin(0.5);
		const g = this.add.graphics();
		// links first so nodes sit on top
		WorldMap.nodes.forEach(n => {
			n.to.forEach(toId => {
				const to = WorldMap.nodes.find(x => x.id === toId);
				if (!to) return;
				const on = save.visited.includes(n.id);
				g.lineStyle(2, on ? 0x88ffaa : 0x333344)
					.lineBetween(n.x, n.y, to.x, to.y);
			});
		});
		WorldMap.nodes.forEach(n => {
			const visited = save.visited.includes(n.id);
			const current = save.currentLevel === n.id;
			const color = visited ? 0x66ff88
				: current ? 0xffff66 : 0x333344;
			g.fillStyle(color).fillCircle(n.x, n.y, current ? 8 : 5);
			this.add.text(n.x + 10, n.y, Levels[n.id]?.name ?? n.id, {
				fontSize: '8px', color: visited ? '#aaffaa' : '#555566',
			}).setOrigin(0, 0.5);
		});
		this.add.text(400, 570, 'M / Esc — close', {
			fontSize: '10px', color: '#888888',
		}).setOrigin(0.5);
		this.input.keyboard.on('keydown', e => {
			if (e.key === 'Escape' || e.key.toLowerCase() === 'm') {
				this.scene.stop();
				this.scene.wake('Playing');
			}
		});
	}
}

//#endregion
