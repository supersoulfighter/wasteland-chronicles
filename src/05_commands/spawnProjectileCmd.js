//#region 05_commands/spawnProjectileCmd.js ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// One fired attack → a sprite + Ballistic, spawned from the prefab
// so the projectile owns its numbers. `angle` comes pre-resolved from
// spawnForPattern's pattern math. The sprite lands in the team group
// the collision matrix expects.
const spawnProjectileCmd = ({scene, attacker, attack, from, angle}) => {
	const team = attacker?.allied?.id ?? 'enemy';
	const e = getWorld().createEntity();
	Prefabs.projectile(attack, team)
		.forEach(([C, props]) => e.add(C, props));

	const sprite = scene.physics.add.sprite(
		from.x, from.y, `spr-${attack.icon ?? 'bullet'}`);
	sprite.setData('eid', e.id);
	e.rendered.sprite = sprite;
	e.ballistic.origin = {x: from.x, y: from.y};   // accuracy decay reads this

	const speed = e.ballistic.speed;
	sprite.body.setVelocity(
		Math.cos(angle) * speed, Math.sin(angle) * speed);
	// bounce patterns ricochet off walls — arcade does the reflecting
	if (e.ballistic.bouncesLeft > 0) {
		sprite.body.setBounce(1, 1);
	}
	// lobs arc — gravity pulls them down
	if (attack.shape?.kind === 'lob') {
		sprite.body.setGravityY(300);
	}
	// mines and goo don't move
	if (speed === 0) sprite.body.setImmovable(true);

	(team === 'player' ? scene.playerShots : scene.enemyShots)
		.add(sprite);
	return e;
};

//#endregion
