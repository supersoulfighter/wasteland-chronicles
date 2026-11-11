//#region 05_commands/launchEntityCmd.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Green kick's signature: the kicked enemy *becomes* a projectile.
// Launchable is the gate — too-big enemies and bosses refuse. The
// entity keeps its components; a temporary Ballistic turns it into
// the attack, and Launched (a Timed flag) says when the ride ends.
// StatusSystem's expiry sweep removes both.
const launchEntityCmd = ({scene, entity, attacker, attack}) => {
	if (!entity.launchable) return false;

	const now = game.loop.now;
	entity.add(Launched, {endsAt: now + 3000});
	// rides as a player-team projectile — impacts detonate the AoE
	entity.add(Ballistic, {
		team: 'player',
		dmg: attack.dmg * (attack.pattern?.dmgMult ?? 1 / 3),
		accuracy: 100,
		effects: [],
		hitsLeft: Infinity,
		bouncesLeft: 0,
		chainLog: [entity.id],
		expiry: now + 3000,
		swallowable: false,
		pattern: {kind: 'aoe', radius: attack.pattern?.radius ?? 30},
		speed: 400,
	});

	// hurl away from the attacker — even a dead enemy still flies
	const a = attacker?.rendered?.pos();
	const p = entity.rendered.pos();
	const ang = a ? angleTo(a.x, a.y, p.x, p.y) : Math.random() * Math.PI * 2;
	entity.rendered.sprite.body.setVelocity(
		Math.cos(ang) * 400, Math.sin(ang) * 400);
	return true;
};

//#endregion
