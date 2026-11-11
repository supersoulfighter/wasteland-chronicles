//#region 05_commands/spawnMeleeboxCmd.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Melee attacks never get a sprite — they spawn a transient zone
// carrying the attack def, sized by makeBody(). Overlaps resolve as
// hits for `meleeboxMs` (80ms by default); `channel` zones persist
// for their pattern's duration and re-hit on a tick.
const spawnMeleeboxCmd = ({scene, attacker, attack, from, angle,
		channel}) => {
	const body = makeBody(attack.shape);
	const zone = scene.add.zone(from.x, from.y, body.w, body.h);
	scene.physics.add.existing(zone);
	zone.body.setAllowGravity(false);
	// overlap callbacks read these straight off the zone
	zone.setData('attack', {...attack, isMelee: true});
	zone.setData('attackerId', attacker.id);
	zone.setData('team', attacker.allied?.id ?? 'enemy');
	zone.setData('hits', {});   // targetId → last hit ms (channel ticks)

	const team = attacker.allied?.id === 'enemy';
	(team ? scene.enemyMelee : scene.playerMelee).add(zone);

	// channel hitboxes ride the attacker — re-centered each frame,
	// re-hit on the channel's tick (badger chase, charge dash)
	if (channel?.duration) {
		zone.setData('channel', channel);
		const follow = () => {
			const a = getWorld().getEntity(zone.getData('attackerId'));
			if (!a?.rendered) {
				zone.destroy();
				return;
			}
			const p = a.rendered.pos();
			zone.setPosition(p.x, p.y);
		};
		scene.events.on('update', follow);
		zone.once('destroy',
			() => scene.events.off('update', follow));
	}

	const life = channel?.duration
		? channel.duration * 1000
		: CFG.meleeboxMs;
	scene.time.delayedCall(life, () => zone.destroy());
	return zone;
};

//#endregion
