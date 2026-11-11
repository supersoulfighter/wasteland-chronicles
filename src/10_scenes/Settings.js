//#region 10_scenes/Settings.js ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Volume + default zoom sliders and the binding reference. Arrows
// adjust the highlighted row; changes save immediately so they
// persist for the next scene.
class Settings extends Phaser.Scene {

	constructor() {
		super('Settings');
	}

	create() {
		this.rows = ['sfx', 'music', 'zoom'];
		this.sel = 0;
		this.text = this.add.text(400, 140, '', {
			fontSize: '14px', color: '#ffffff',
		}).setOrigin(0.5, 0);
		this.add.text(400, 60, 'SETTINGS', {
			fontSize: '24px', color: '#aaffcc',
		}).setOrigin(0.5);
		this.draw();
		this.input.keyboard.on('keydown', e => this.onKey(e));
	}

	draw() {
		const s = SaveManager.load().settings;
		this.text.setText(this.rows.map((r, i) => {
			const v = s[r];
			const bar = '█'.repeat(Math.round(v * 10))
				.padEnd(10, '░');
			return `${i === this.sel ? '>' : ' '} ${r.padEnd(6)} ${bar} ${v.toFixed(1)}`;
		}).join('\n\n') + '\n\n\nEsc — back');
	}

	onKey(e) {
		const n = this.rows.length;
		const key = this.rows[this.sel];
		const s = SaveManager.load().settings;
		if (e.key === 'ArrowUp') this.sel = (this.sel - 1 + n) % n;
		if (e.key === 'ArrowDown') this.sel = (this.sel + 1) % n;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			const step = e.key === 'ArrowLeft' ? -0.1 : 0.1;
			s[key] = Math.max(0, Math.min(
				key === 'zoom' ? 4 : 1, s[key] + step));
			SaveManager.write({settings: s});
		}
		if (e.key === 'Escape') this.scene.start('Menu');
		this.draw();
	}
}

//#endregion
