//#region 05_commands/resolveHitCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The single funnel for every damage source — attacks, lava,
// explosive props, launched bodies, DoT ticks. Ordering is code
// order; modifier enumeration is explicit (geotic has no event
// priority, so we don't dispatch one). `direct: true` is the
// DoT/hazard path: skips dodge/invulnerable — the hit already
// landed — but mitigation still applies.
const resolveHitCmd = ({attacker, target, attack, direct}) => {
	if (!target?.damageable) return;

	// 1. prevent — dodge/invulnerable can't be reordered by prefabs
	const melee = attack.isMelee ?? isMeleeShape(attack.shape);
	if (!direct) {
		if (target.has(Invulnerable)) return;
		if (target.evasive?.roll(melee ? 'melee' : 'ranged')) return;
	}

	// 2. mitigate — commutative multipliers/blocks
	let amount = attack.dmg;
	amount = target.armored?.mitigate(amount) ?? amount;
	if (target.attuned && !direct && !melee) {
		amount = target.attuned.block(amount);   // antenna: ranged only
	}
	amount *= attacker?.statusCarrying?.mult('dmg') ?? 1;
	amount *= attacker?.moveable?.terrainDmgMult ?? 1;   // mutated ground
	// mud ground muffles explosions — aoe-pattern hits only
	if (attack.pattern?.kind === 'aoe') {
		amount *= getGroundDef()?.aoeDmgMult ?? 1;
	}
	// Boxer / Dexterity passives
	if (attacker?.powered) {
		const stat = melee ? 'meleeDmg' : 'rangedDmg';
		for (const key of attacker.powered.passives) {
			const def = Abilities.passives[key];
			if (def?.stat === stat) amount *= def.mult ?? 1;
		}
	}
	// fully blocked — but a zero-damage hit still delivers its
	// effects (the stagger half of an outer-ring touch)
	if (amount <= 0 && !attack.effects?.length) return;

	// 3. apply — one place, guaranteed last
	target.damageable.apply(-amount);
	game.events.emit('health-changed', {entity: target});

	// knockback impulse — the elbow's little shove
	if (attack.push && target.moveable) {
		const a = attacker?.rendered?.pos();
		const t = target.rendered.pos();
		if (a && t) {
			const ang = angleTo(a.x, a.y, t.x, t.y);
			const body = target.rendered.sprite.body;
			body.velocity.x += Math.cos(ang) * attack.push * 15;
			body.velocity.y += Math.sin(ang) * attack.push * 15;
		}
	}

	// 4. on-hit payloads + death
	(attack.effects ?? []).forEach(def =>
		addStatusCmd({target, attacker, def}));
	if (target.damageable.dead()) {
		dieCmd({entity: target, source: attacker});   // emits 'died'
	}
};

//#endregion
