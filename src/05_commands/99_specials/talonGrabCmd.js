//#region 05_commands/99_specials/talonGrabCmd.js //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Eagle — Talon Grab: seize the player, carry them up, drop them.
// 25 dmg (attack def), grabbed for 2s; the lift is a tween on the
// victim's sprite — the Grabbed flag already blocks their movement.
const talonGrabCmd = ({scene, attacker, attack, target}) => {
	if (!target?.moveable || target.has(Bossy)) return;
	grabEntityCmd({attacker, target, pattern: {duration: 2, taps: 8}});
	resolveHitCmd({attacker, target, attack});
	scene.tweens.add({
		targets: target.rendered.sprite,
		y: '-=48',
		duration: 700,
		yoyo: true,
	});
};

BossSpecials.eagle = talonGrabCmd;

//#endregion
