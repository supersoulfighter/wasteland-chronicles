//#region 05_commands/99_specials/hurlPlaythingCmd.js //////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Gorilla — Hurl Plaything: grab the player, slam them into the
// ground on each side, then hurl them across the arena. The victim
// isn't Launchable — the throw is a timed Launched flag plus a hard
// velocity, no projectile Ballistic (players can't detonate).
const hurlPlaythingCmd = ({scene, attacker, attack, target}) => {
	if (!target?.moveable) return;
	const now = game.loop.now;
	grabEntityCmd({attacker, target, pattern: {duration: 3, taps: 12}});
	resolveHitCmd({attacker, target, attack});

	const s = target.rendered.sprite;
	// slam left, slam right — tweens sell the back-and-forth
	scene.tweens.add({
		targets: s,
		x: s.x - 24,
		duration: 300,
		yoyo: true,
	});
	scene.time.delayedCall(600, () => {
		if (target.isDestroyed) return;
		scene.tweens.add({
			targets: s, x: s.x + 48, duration: 300, yoyo: true,
		});
	});
	// then the throw — out the far side of the arena
	scene.time.delayedCall(1300, () => {
		if (target.isDestroyed) return;
		if (target.grabbed) target.remove(target.grabbed);
		target.add(Launched, {endsAt: game.loop.now + 1500});
		const ap = attacker.rendered.pos();
		const tp = target.rendered.pos();
		const ang = angleTo(ap.x, ap.y, tp.x, tp.y);
		s.body.setVelocity(
			Math.cos(ang) * 500, Math.sin(ang) * 500);
		resolveHitCmd({attacker, target, attack});
	});
};

BossSpecials.gorilla = hurlPlaythingCmd;

//#endregion
