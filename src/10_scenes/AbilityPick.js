//#region 10_scenes/AbilityPick.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Pick one of all 21 abilities — passives on the left, actives on
// the right. Arrows move the cursor, Enter takes it; the pick goes
// straight to the player's components (the world is asleep, not
// gone) and the game advances to the next level.
class AbilityPick extends Phaser.Scene {

	constructor() {
		super('AbilityPick');
	}

	create() {
		// flat list: passives then actives
		this.keys = [
			...Object.keys(Abilities.passives),
			...Object.keys(Abilities.actives),
		];
		this.sel = 0;
		this.add.text(400, 40, 'CHOOSE AN ABILITY', {
			fontSize: '24px', color: '#aaffcc',
		}).setOrigin(0.5);
		this.listText = this.add.text(140, 90, '', {
			fontSize: '11px', color: '#ffffff',
		});
		this.descText = this.add.text(140, 500, '', {
			fontSize: '10px', color: '#8888aa', wordWrap: {width: 520},
		});
		this.draw();
		this.input.keyboard.on('keydown', e => this.onKey(e));
	}

	def(key) {
		return Abilities.passives[key] ?? Abilities.actives[key];
	}

	draw() {
		this.listText.setText(this.keys.map((key, i) => {
			const def = this.def(key);
			return `${i === this.sel ? '>' : ' '} ${def.name ?? key}`;
		}).join('\n'));
		this.descText.setText(
			this.def(this.keys[this.sel])?.desc ?? '');
	}

	onKey(e) {
		const n = this.keys.length;
		if (e.key === 'ArrowUp') this.sel = (this.sel - 1 + n) % n;
		if (e.key === 'ArrowDown') this.sel = (this.sel + 1) % n;
		if (e.key === 'Enter' || e.key === ' ') {
			this.take(this.keys[this.sel]);
			return;
		}
		this.draw();
	}

	// Grant it, persist it, move on — Playing restarts on the next
	// level with the save's currentLevel already advanced.
	take(key) {
		const playing = game.scene.getScene('Playing');
		const e = getQueries()?.player.get()[0];
		if (e) gainAbilityCmd({entity: e, key});
		saveProgressCmd({scene: playing});
		this.scene.start('Playing', {
			level: SaveManager.load().currentLevel,
		});
	}
}

//#endregion
