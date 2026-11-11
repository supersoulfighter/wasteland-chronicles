//#region 05_commands/swallowProjectileCmd.js //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Regurge Surge, part one: a Swallowing enemy eats an incoming
// projectile instead of taking the hit. The eaten attack def is
// stored on the component; the worm's next attack fires it back
// (useActiveCmd/executeAttackCmd's swapTemp path). Rays can't be
// eaten — Ballistic.swallowable is false for beams.
//
// Returns true when the projectile was eaten, false when the caller
// should resolve it as a normal hit.
const swallowProjectileCmd = ({scene, entity, projectile}) => {
	const sw = entity.swallowing;
	if (!sw || !projectile.ballistic?.swallowable) return false;

	const b = projectile.ballistic;
	sw.captured = {
		dmg: b.dmg,
		accuracy: b.accuracy,
		speed: b.speed,
		shape: {kind: 'bullet'},      // regurgitated as a plain shot
		pattern: b.pattern ?? {kind: 'single'},
		effects: b.effects,
	};
	despawnCmd({scene, entity: projectile});
	return true;
};

//#endregion
