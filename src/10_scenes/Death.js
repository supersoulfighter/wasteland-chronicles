//#region 10_scenes/Death.js ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The run ended — retry the level or quit to menu. The save's
// currentLevel still points at the level that killed the player.
class Death extends Phaser.Scene {

	constructor() {
		super('Death');
	}

	create() {
		this.options = ['Retry Level', 'Quit to Menu'];
		this.sel = 0;
		this.add.text(400, 220, 'YOU DIED', {
			fontSize: '32px', color: '#ff5566',
		}).setOrigin(0.5);
		this.menuText = this.add.text(400, 320, '', {
			fontSize: '16px', color: '#ffffff',
		}).setOrigin(0.5, 0);
		this.draw();
		this.input.keyboard.on('keydown', e => this.onKey(e));
	}

	draw() {
		this.menuText.setText(this.options.map(
			(o, i) => `${i === this.sel ? '>' : ' '} ${o}`
		).join('\n\n'));
	}

	onKey(e) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			this.sel = 1 - this.sel;
		}
		if (e.key === 'Enter' || e.key === ' ') {
			if (this.sel === 0) {
				retryLevelCmd({scene: this});
			} else {
				this.scene.start('Menu');
			}
			return;
		}
		this.draw();
	}
}

//#endregion
