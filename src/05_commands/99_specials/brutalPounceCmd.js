//#region 05_commands/99_specials/brutalPounceCmd.js ///////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Cougar — Brutal Pounce: leap onto the player and maul, chewing
// every half second until they wiggle free (the 16-tap grab) or the
// 4s maul ends. The boss is invulnerable through it.
const brutalPounceCmd = ({scene, attacker, attack, target}) => {
	if (!target?.moveable || target.has(Bossy)) return;
	const now = game.loop.now;
	attacker.add(Invulnerable, {endsAt: now + 4000});

	// the leap — land on top of the victim
	const p = target.rendered.pos();
	attacker.rendered.sprite.setPosition(p.x - 8, p.y - 8);
	grabEntityCmd({attacker, target, pattern: {duration: 4, taps: 16}});

	// chew — a timed re-hit for as long as the grab holds
	const timer = scene.time.addEvent({
		delay: 500,
		repeat: 7,
		callback: () => {
			if (target.isDestroyed || !target.grabbed) {
				timer.remove();
				return;
			}
			resolveHitCmd({
				attacker, target,
				attack: {dmg: 12, isMelee: true, effects: []},
				direct: true,
			});
		},
	});
};

BossSpecials.cougar = brutalPounceCmd;

//#endregion
