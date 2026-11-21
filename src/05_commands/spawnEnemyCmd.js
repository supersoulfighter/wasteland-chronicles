//#region 05_commands/spawnEnemyCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Any Enemies or Bosses table key → a live entity. `boss: true`
// switches tables and recipes (bosses carry the extra Bossy/Spawning
// components). `activationRadius` > 0 spawns it dormant — it idles
// until the player steps inside the radius (Tiled spawn markers).
// The sprite joins the enemies physics group — that's what the
// collision matrix wires against.
const spawnEnemyCmd = ({scene, key, x, y, boss, activationRadius}) => {
	const def = boss ? Bosses[key] : Enemies[key];
	if (!def) return null;

	const e = getWorld().createEntity();
	const recipe = boss ? Prefabs.boss(def) : Prefabs.enemy(def);
	recipe.forEach(([C, props]) => e.add(C, props));
	if (activationRadius > 0) {
		e.autonomous.activationRadius = activationRadius;
		e.autonomous.dormant = true;
	}

	const sprite = scene.physics.add.sprite(x, y, `spr-${def.anim}`);
	sprite.setData('eid', e.id);
	sprite.body.setSize(14, 14);   // a hair under the 16px tile
	e.rendered.sprite = sprite;
	scene.enemies.add(sprite);
	return e;
};

//#endregion
