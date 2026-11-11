//#region 03_data/01_crystals/black.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Black: Elbow — fast, cheap, a little knockback on the jab.
Crystals.black = {
	key: 'black',
	name: 'Elbow',
	uses: 128,
	cooldown: 0.17,
	cost: 0.1,
	pos: 'FC',
	anim: 'attack-elbow',
	icon: 'icon-black',
	melee: {           // sharp elbow jab, knocks enemies back a bit
		dmg: 30,
		accuracy: 86,
		push: 16,      // px impulse applied to whatever it hits
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
	},
	ranged: {          // rapid darts from the elbow
		dmg: 15,
		accuracy: 55,
		speed: 750,
		shape: {kind: 'bullet'},
		pattern: {kind: 'single'},
	},
};

//#endregion
