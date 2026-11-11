//#region 05_commands/addStatusCmd.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Routes a status def to the right holder. Flag statuses (staggered,
// knockeddown, feared, silenced, entangled, burrowed, invulnerable,
// grabbed, launched) become Timed marker components — query
// membership does the rest. Everything else (dot, regen, slow, rage,
// weak) lands in StatusCarrying for StatusSystem to tick.
const addStatusCmd = ({target, attacker, def}) => {
	const Flag = FLAG_COMPONENTS.find(
		C => C.name.toLowerCase() === def.status);
	if (!Flag) {
		target.statusCarrying?.add(def);
		return;
	}

	// Sturdy passive: a roll can shake off knockdowns outright
	if (def.status === 'knockeddown'
		&& target.powered?.passives.includes('sturdy')
		&& Math.random() * 100 < Abilities.passives.sturdy.pct) {
		return;
	}
	// groundOnly skips flyers — the purple sweep can't trip them
	if (def.groundOnly && target.evasive) return;

	const props = {endsAt: game.loop.now + (def.duration ?? 1) * 1000};
	if (def.status === 'feared' && attacker) {
		// flee directly away from the source
		const p = target.rendered.pos();
		const a = attacker.rendered.pos();
		const ang = angleTo(a.x, a.y, p.x, p.y);
		props.dir = {x: Math.cos(ang), y: Math.sin(ang)};
	}
	if (target.has(Flag)) {
		// already afflicted — refresh the timer, never stack flags
		target[accessor(Flag)].endsAt = props.endsAt;
	} else {
		target.add(Flag, props);
	}
};

//#endregion
