
const config = {
	scale: { zoom: 2.0 },
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#2d2d2d',
	parent: 'game-container',
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: Game
};

const game = new Phaser.Game(config);
