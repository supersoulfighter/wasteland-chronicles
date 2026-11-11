//#region 10_scenes/LevelComplete.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Stats summary after clearing a level — any key moves to
// AbilityPick. Playing is asleep underneath; the save is already
// written (completeLevelCmd did it).
class LevelComplete extends Phaser.Scene {

	constructor() {
		super('LevelComplete');
	}

	init(data) {
		this.levelKey = data.level;
	}

	create() {
		const save = SaveManager.load();
		this.add.text(400, 200, 'LEVEL CLEAR', {
			fontSize: '28px', color: '#aaffcc',
		}).setOrigin(0.5);
		this.add.text(400, 270, [
			Levels[this.levelKey]?.name ?? this.levelKey,
			`player level ${save.playerLevel}`,
			`max hp ${Math.round(save.maxHealth)} · max mutation ${Math.round(save.maxMutation)}`,
		].join('\n'), {
			fontSize: '14px', color: '#ffffff', align: 'center',
		}).setOrigin(0.5);
		this.add.text(400, 400, 'any key — continue', {
			fontSize: '10px', color: '#888888',
		}).setOrigin(0.5);
		this.input.keyboard.once('keydown',
			() => this.scene.start('AbilityPick'));
	}
}

//#endregion
