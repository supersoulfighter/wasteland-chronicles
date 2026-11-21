//#region 05_commands/executeAttackCmd.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The attack verb — used by the player (button held) and by EnemyAI
// (state decision). Gates on the attacker's Armed.readyAt cooldown,
// then spends Mutation + ammo for the player, then hands the resolved
// attack def to spawnForPattern for the actual spawning.
const executeAttackCmd = ({scene, attacker, attack, aim, target}) => {
	const now = game.loop.now;
	const armed = attacker.armed;
	if (armed && now < armed.readyAt) return;
	if (attacker.has(Silenced)) return;   // mute = no attacks at all
	let cost = 0;   // enemies pay nothing; whiffRefund reads this

	if (attacker.controllable) {
		// player path: crystal def → melee/ranged half, Mutation
		// deficit curve, ammo gate — all resolved by pickPlayerAttack
		const pick = pickPlayerAttack(attacker, aim);
		if (!pick) return;
		const {def} = pick;
		// empty ammo pool → the slot dies quietly (HUD re-reads)
		if (def.uses !== Infinity && !attacker.consumable.left(def.key)) {
			attacker.slotted.attacks = attacker.slotted.attacks
				.filter(k => k !== def.key);
			game.events.emit('ammo-changed', {entity: attacker});
			return;
		}
		attack = pick.attack;
		aim = pick.aim;
		armed.readyAt = now + def.cooldown * 1000;
		cost = pick.melee && def.melee
			? def.cost / CFG.meleeCostDivisor : def.cost;
		if (cost) attacker.mutated.spend(cost);
		if (def.uses !== Infinity) attacker.consumable.spend(def.key);
		attacker.rendered.playAnim(def.anim);
		game.events.emit('mutation-changed', {entity: attacker});
		game.events.emit('ammo-changed', {entity: attacker});
	} else {
		attack ??= armed?.current();
		if (!attack) return;
		armed.readyAt = now + (attack.cooldown ?? 1) * 1000;
		if (attack.anim) attacker.rendered.playAnim(attack.anim);
		// Regurge Surge: a worm that ate a shot fires the captured
		// def back instead of its listed attack — swapTemp() slips
		// it into the slot, revert() after the synchronous spawn
		const sw = attacker.swallowing;
		if (sw?.captured) {
			armed.swapTemp(sw.captured);
			attack = sw.captured;
			sw.captured = null;
		}
	}

	// attacks marked invulnerable wrap the flag around their
	// volley/channel window
	if (attack.invulnerable) {
		const secs = attack.pattern?.strikes
			? attack.pattern.strikes * (attack.pattern.delay ?? 0.2)
			: attack.pattern?.duration ?? 1;
		attacker.add(Invulnerable, {endsAt: now + secs * 1000});
	}

	// a melee swing that connects with nothing is free — the cost
	// rides the def so the hitbox can refund it on the way out.
	// (Whiffing a crate still counts as a whiff: props stay
	// breakable for free per game.md.)
	if (attack.isMelee && cost) attack.whiffRefund = cost;
	spawnForPattern({scene, attacker, attack, aim, target});
	attacker.armed?.revert();   // Regurge Surge — restore the slot
};

//#endregion
