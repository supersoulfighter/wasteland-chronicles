//#region 05_commands/flipEntityCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The Flip active: a non-boss enemy joins the player's side for the
// duration. Its Allied id moves to 'allied', which is all it takes —
// targetsOf() then aims its attacks at the enemy query. Reverts on a
// timer, or immediately when the entity despawns.
const flipEntityCmd = ({scene, entity, seconds = 10}) => {
	if (!entity.flippable) return false;
	entity.allied.id = 'allied';
	entity.autonomous.state = 'idle';
	entity.remove(entity.flippable);        // can't be re-flipped
	scene.time.delayedCall(seconds * 1000, () => {
		if (!entity.isDestroyed) {
			entity.allied.id = 'enemy';
		}
	});
	return true;
};

//#endregion
