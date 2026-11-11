//#region 05_commands/spawnPlayerCmd.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Xavier, from the recipe. The spawn composes the prefab, makes the
// sprite, applies the save's progression (level-scaled maxes, owned
// abilities, ammo pools, hotbar), and puts the camera on him.
const spawnPlayerCmd = ({scene, x, y}) => {
	const e = getWorld().createEntity();
	Prefabs.player().forEach(([C, props]) => e.add(C, props));

	const sprite = scene.physics.add.sprite(x, y, 'spr-xavier');
	sprite.setData('eid', e.id);
	e.rendered.sprite = sprite;
	scene.playerSprite = sprite;   // collision matrix reads this

	// restore save state — each level compounds +10% to both maxes
	const save = SaveManager.load();
	const growth = Math.pow(1.1, save.playerLevel - 1);
	e.damageable.max = CFG.hp * growth;
	e.damageable.value = e.damageable.max;
	e.mutated.max = CFG.mutation * growth;
	e.mutated.value = e.mutated.max;
	Object.assign(e.consumable.uses, save.ammo);
	e.slotted.attacks = [...save.hotbar.attacks];
	e.slotted.actives = [...save.hotbar.actives];
	save.passives.forEach(k => gainAbilityCmd({entity: e, key: k}));
	save.actives.forEach(k => gainAbilityCmd({entity: e, key: k}));

	scene.cameras.main.startFollow(sprite, true, 0.1, 0.1);
	scene.cameras.main.setZoom(save.settings.zoom ?? CFG.zoom);
	return e;
};

//#endregion
