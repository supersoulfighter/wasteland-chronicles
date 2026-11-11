//#region 10_scenes/Menu.js ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Title + options. Arrow keys move the cursor, Enter confirms.
// "Continue" only shows on a save with history; "New Game" wipes the
// save and starts level01 fresh.
class Menu extends Phaser.Scene {

	constructor() {
		super('Menu');
	}

	create() {
		const save = SaveManager.load();
		this.options = [
			...(save.visited.length ? ['Continue'] : []),
			'New Game', 'Settings',
		];
		this.sel = 0;
		this.add.text(400, 160, 'WASTELAND\nCHRONICLES', {
			fontSize: '32px', color: '#aaffcc',
			align: 'center',
		}).setOrigin(0.5);
		this.menuText = this.add.text(400, 320, '', {
			fontSize: '16px', color: '#ffffff',
		}).setOrigin(0.5, 0);
		this.draw();
		this.input.keyboard.on('keydown', e => this.onKey(e));
	}

	// rebuild the option list with a > cursor
	draw() {
		this.menuText.setText(this.options.map(
			(o, i) => `${i === this.sel ? '>' : ' '} ${o}`
		).join('\n\n'));
	}

	onKey(e) {
		const n = this.options.length;
		if (e.key === 'ArrowUp') this.sel = (this.sel - 1 + n) % n;
		if (e.key === 'ArrowDown') this.sel = (this.sel + 1) % n;
		if (e.key === 'Enter' || e.key === ' ') {
			this.pick(this.options[this.sel]);
			return;
		}
		this.draw();
	}

	pick(option) {
		switch (option) {
			case 'Continue':
				this.scene.start('Playing', {
					level: SaveManager.load().currentLevel,
				});
				break;
			case 'New Game':
				SaveManager.write({seenIntro: true});
				this.scene.start('Playing', {level: 'level01'});
				break;
			case 'Settings':
				this.scene.start('Settings');
				break;
		}
	}
}

//#endregion
