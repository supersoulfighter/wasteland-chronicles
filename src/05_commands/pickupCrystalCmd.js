//#region 05_commands/pickupCrystalCmd.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Overlap a crystal → take it. Cyan refills Mutation by size; colors
// grant the attack (ammo pool + a hotbar slot). Also a cleanse for
// '…|crystal' effects — grabbing a crystal scrubs acid off.
const pickupCrystalCmd = ({scene, entity, pickup}) => {
	const crystal = pickup.getData('crystal');
	if (!crystal) return;

	// crystal pickups cleanse — same rule as stepping into water
	if (entity.statusCarrying) {
		entity.statusCarrying.effects =
			entity.statusCarrying.effects.filter(fx =>
				!fx.untilCleanse?.split('|').includes('crystal'));
	}

	if (crystal.color === 'cyan') {
		entity.mutated.refill(CrystalManager.SIZES[crystal.size]);
		game.events.emit('mutation-changed', {entity});
	} else {
		const def = Crystals[crystal.color];
		entity.consumable.add(def.key, def.uses);
		if (!entity.slotted.attacks.includes(def.key)) {
			entity.slotted.attacks.push(def.key);
		}
		game.events.emit('ammo-changed', {entity});
	}

	pickup.destroy();
	game.events.emit('picked-up', {entity, crystal});
};

//#endregion
