//#region 10_scenes/Victory.js /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The Gorilla is dead — the game is won. A short screen, then back
// to the menu. (checkLevelClearCmd routes here on the boss's death.)
class Victory extends Phaser.Scene {

	constructor() {
		super('Victory');
	}

	create() {
		this.add.text(400, 200, 'THE CAVE IS QUIET', {
			fontSize: '28px', color: '#aaffcc',
		}).setOrigin(0.5);
		this.add.text(400, 270, [
			'The last mutation slumps to the floor.',
			'The crystals dim to ordinary stone.',
			'You are, finally, alone.',
		].join('\n'), {
			fontSize: '14px', color: '#ffffff', align: 'center',
		}).setOrigin(0.5);
		this.add.text(400, 420, 'any key — credits', {
			fontSize: '10px', color: '#888888',
		}).setOrigin(0.5);
		this.input.keyboard.once('keydown',
			() => this.scene.start('Menu'));
	}
}

//#endregion
