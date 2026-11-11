//#region 10_scenes/Boot.js ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// First scene. Loads every real asset that ships (today: Tiled maps
// + the tileset — anything absent just 404s and keeps the stub),
// generates placeholder textures for whatever's left, wires the
// event bus once, then routes: fresh save → intro cutscene → menu;
// returning save → straight to the menu.
class Boot extends Phaser.Scene {

	constructor() {
		super('Boot');
	}

	// Only globally-needed assets here — 'tiles' is the tileset every
	// map (and the stub) shares. Per-level maps load in Playing.
	preload() {
		this.load.image('tiles', 'assets/images/tiles.png');
	}

	create() {
		makePlaceholderTextures(this);
		wireReactions(game);
		const save = SaveManager.load();
		if (!save.seenIntro) {
			this.scene.start('Cutscene', {timeline: IntroScene});
		} else {
			this.scene.start('Menu');
		}
	}
}

//#endregion
