//#region 03_data/03_enemies/worm.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The only def with `swallow: true` — the recipe adds the Swallowing
// component, and swallowProjectileCmd fills `captured` so the next
// attack fires the stolen def back at the player.
Enemies.worm = {
	key: 'worm',
	name: 'Worm',
	health: 25,
	speed: 20,
	style: 'burrow',
	reveal: 3,
	size: 1,
	swallow: true,
	anim: 'worm',
	attack: {
		name: 'Regurge Surge',
		dmg: 5,        // placeholder — the swallowed def replaces it
		cooldown: 4,
		pos: 'FT',
		shape: {kind: 'rect', size: 'XS'},
		pattern: {kind: 'single'},
	},
};

//#endregion
