//#region 05_commands/spawnMeleeboxCmd.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Melee attacks never get a sprite — they spawn a transient zone
// carrying the attack def, sized by makeBody(). Overlaps resolve as
// hits for `meleeboxMs` (80ms by default); `channel` zones persist
// for their pattern's duration and re-hit on a tick.
const spawnMeleeboxCmd = ({scene, attacker, attack, from, angle,
		channel}) => {
	const body = makeBody(attack.shape);
	// circles come back {r}; the zone's footprint is a 2r square —
	// close enough at 16px tiles and readable to beginners
	let size = body.w ?? (body.r ?? 4) * 2;
	// an effectRadius (yellow's stagger ring) widens the reach
	if (attack.effectRadius) size = attack.effectRadius * 2;
	// ring pattern boxes sit out on the band, one per angle
	const off = attack.ringInner ?? 0;
	const px = from.x + (angle !== undefined ? Math.cos(angle) * off : 0);
	const py = from.y + (angle !== undefined ? Math.sin(angle) * off : 0);
	const zone = scene.add.zone(px, py, size, size);
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

	// a melee swing that connects with nothing refunds its cost —
	// the hitbox still ran, so it can still smash crates for free
	zone.once('destroy', () => {
		const refund = zone.getData('attack')?.whiffRefund;
		const a = getWorld().getEntity(zone.getData('attackerId'));
		if (refund && a?.mutated
				&& Object.keys(zone.getData('hits')).length === 0) {
			a.mutated.refill(refund);
			game.events.emit('mutation-changed', {entity: a});
		}
	});
	return zone;
};

//#endregion
