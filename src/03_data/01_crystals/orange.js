//#region 03_data/01_crystals/orange.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Orange: Arm — pierce on both halves.
Crystals.orange = {
	key: 'orange',
	name: 'Arm',
	uses: 32,
	cooldown: 0.5,
	cost: 0.4,
	pos: 'FC',
	anim: 'attack-arm',
	icon: 'icon-orange',
	melee: {           // arm-spear: pierces everything in the hitbox
		dmg: 50,
		accuracy: 90,
		shape: {kind: 'rect', size: 'M'},
		pattern: {kind: 'pierce'},
	},
	ranged: {          // javelin — flies through every enemy in its path
		dmg: 25,
		accuracy: 65,
		speed: 900,
		shape: {kind: 'bullet'},
		pattern: {kind: 'pierce'},
	},
};

//#endregion
