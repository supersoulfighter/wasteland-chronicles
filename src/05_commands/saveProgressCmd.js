//#region 05_commands/saveProgressCmd.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Compose the save blob from the player's live components (never
// world.serialize). `completed: true` marks a level clear: bumps the
// player level, records the visit, and advances currentLevel along
// the WorldMap chain.
const saveProgressCmd = ({scene, completed}) => {
	const e = getQueries().player.get()[0];
	if (!e) return;
	const save = SaveManager.load();
	const patch = {
		maxHealth: e.damageable.max,
		maxMutation: e.mutated.max,
		passives: [...e.powered.passives],
		actives: Object.keys(e.powered.actives),
		ammo: {...e.consumable.uses},
		hotbar: {
			attacks: [...e.slotted.attacks],
			actives: [...e.slotted.actives],
		},
	};
	if (completed) {
		patch.playerLevel = save.playerLevel + 1;
		patch.visited = [...save.visited, scene.level.key];
		// progression follows the worldmap chain — the node lists
		// which level unlocks next
		const node = WorldMap.nodes.find(n => n.id === scene.level.key);
		if (node?.to.length) patch.currentLevel = node.to[0];
	}
	SaveManager.write(patch);
};

//#endregion
