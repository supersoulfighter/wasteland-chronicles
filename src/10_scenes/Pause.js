//#region 10_scenes/Pause.js ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The character-sheet pause screen — stats, owned abilities, and
// resume/settings/quit options. Launched over a sleeping Playing;
// resume just wakes it.
class Pause extends Phaser.Scene {

	constructor() {
		super('Pause');
	}

	create() {
		this.options = ['Resume', 'Settings', 'Quit to Menu'];
		this.sel = 0;
		const e = getQueries()?.player.get()[0];
		this.add.text(400, 40, 'PAUSED', {
			fontSize: '24px', color: '#aaffcc',
		}).setOrigin(0.5);
		// character sheet — read straight off the entity
		if (e) {
			this.add.text(180, 100, [
				`HP      ${Math.ceil(e.damageable.value)} / ${e.damageable.max}`,
				`Mutation ${Math.ceil(e.mutated.value)} / ${e.mutated.max}`,
				`Speed   ${e.moveable.speed}`,
				`Passives ${e.powered.passives.join(', ') || '—'}`,
				`Actives  ${Object.keys(e.powered.actives).join(', ') || '—'}`,
			].join('\n'), {fontSize: '12px', color: '#ccccee'});
		}
		this.menuText = this.add.text(400, 380, '', {
			fontSize: '16px', color: '#ffffff',
		}).setOrigin(0.5, 0);
		this.draw();
		this.input.keyboard.on('keydown', ev => this.onKey(ev));
	}

	draw() {
		this.menuText.setText(this.options.map(
			(o, i) => `${i === this.sel ? '>' : ' '} ${o}`
		).join('\n\n'));
	}

	onKey(e) {
		const n = this.options.length;
		if (e.key === 'ArrowUp') this.sel = (this.sel - 1 + n) % n;
		if (e.key === 'ArrowDown') this.sel = (this.sel + 1) % n;
		if (e.key === 'Escape') this.pick('Resume');
		if (e.key === 'Enter' || e.key === ' ') {
			this.pick(this.options[this.sel]);
			return;
		}
		this.draw();
	}

	pick(option) {
		switch (option) {
			case 'Resume':
				this.scene.stop();
				this.scene.wake('Playing');
				break;
			case 'Settings':
				this.scene.start('Settings');
				break;
			case 'Quit to Menu':
				saveProgressCmd({scene: game.scene.getScene('Playing')});
				this.scene.stop('Playing');
				this.scene.start('Menu');
				break;
		}
	}
}

//#endregion
