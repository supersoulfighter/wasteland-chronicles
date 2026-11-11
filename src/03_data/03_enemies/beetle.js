//#region 03_data/03_enemies/beetle.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.beetle = {
	key: 'beetle',
	name: 'Beetle',
	health: 30,
	speed: 40,
	style: 'burrow',
	reveal: 6,
	size: 1,
	anim: 'beetle',
	attack: {
		name: 'Fecal Ball',
		dmg: 10,
		cooldown: 4,
		pos: 'FB',
		// rolls and bounces for 3s, potentially hitting repeatedly
		shape: {kind: 'bullet'},
		pattern: {kind: 'bounce', count: Infinity},
		expirySecs: 3,
		speed: 300,
	},
};

//#endregion
