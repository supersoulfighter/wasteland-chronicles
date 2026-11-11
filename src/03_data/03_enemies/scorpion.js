//#region 03_data/03_enemies/scorpion.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Enemies.scorpion = {
	key: 'scorpion',
	name: 'Scorpion',
	health: 40,
	speed: 48,
	style: 'walk',
	reveal: 1,
	size: 2,
	anim: 'scorpion',
	attack: {
		name: 'Triple Strike',
		dmg: 20,
		cooldown: 5,
		pos: 'FC',
		shape: {kind: 'rect', size: 'M'},
		// claw, claw, tail — +20 bonus if all three connect
		pattern: {kind: 'volley', strikes: 3, delay: 0.3, bonusDmg: 20},
	},
};

//#endregion
