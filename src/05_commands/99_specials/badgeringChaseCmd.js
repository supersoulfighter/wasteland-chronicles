//#region 05_commands/99_specials/badgeringChaseCmd.js /////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Badger — Badgering Chase: 5s of invulnerable pursuit with jaws out.
// The invulnerability flag is timed; the chase is a channel meleebox
// riding the boss (it re-centers on the attacker each frame, re-hits
// on its tick); the AI decision clock is held so it won't reconsider
// mid-chase.
const badgeringChaseCmd = ({scene, attacker, attack, target}) => {
	const now = game.loop.now;
	attacker.add(Invulnerable, {endsAt: now + 5000});

	// lock the state machine into attacking for the duration
	attacker.autonomous.state = 'attack';
	attacker.autonomous.decisionAt = now + 5000;

	spawnMeleeboxCmd({
		scene, attacker,
		attack: {...attack, isMelee: true},
		from: attacker.rendered.pos(),
		channel: {duration: 5, tick: 0.5},
	});
};

BossSpecials.badger = badgeringChaseCmd;

//#endregion
