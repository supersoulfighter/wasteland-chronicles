//#region 03_data/03_enemies/swiftlet.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.swiftlet = {
	key: 'swiftlet',
	name: 'Swiftlet',
	health: 65,
	speed: 320,
	style: 'fly',
	reveal: 11,
	size: 2,
	anim: 'swiftlet',
	attack: {
		name: 'Dive Bite',
		dmg: 80,
		cooldown: 4,
		pos: 'FB',
		// passes right through the player — never slows to bite
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
		channel: true,
	},
};

//#endregion
