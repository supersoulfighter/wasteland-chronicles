//#region main.js //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Phaser game config + the full scene list. main.js loads last by
// design — every class and constant it references already exists.
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	pixelArt: true,
	backgroundColor: CFG.bgColor,
	scale: {zoom: CFG.zoom},
	physics: {
		default: 'arcade',
		arcade: {gravity: {y: 0}},
	},
	scene: [
		Boot, Menu, Playing, Hud, Pause, Map,
		LevelComplete, AbilityPick, Death, Victory,
		Cutscene, Settings,
	],
};

// `game` is a global: commands broadcast facts on `game.events`, the
// one event bus every scene can hear.
const game = new Phaser.Game(config);

//#endregion
