//#region 05_commands/useActiveCmd.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Fire the selected active ability. Gates on powered.ready() (the
// cooldown clock) then mutated.canAfford (the cost), spends, and
// routes by def shape: `attack` defs go through spawnForPattern,
// `effect` defs apply a one-shot change to the caster.
// Antenna is the exception — its cooldown starts when it dies
// (Attuned.block), not at cast.
const useActiveCmd = ({scene, entity}) => {
	const key = entity.slotted.actives[entity.slotted.activeSel];
	const def = Abilities.actives[key];
	if (!def) return;
	if (!entity.powered.ready(key)) return;
	if (!entity.mutated.canAfford(def.cost)) return;

	entity.mutated.spend(def.cost);
	if (key !== 'antenna') {
		entity.powered.startCd(key, def.cooldown);
	}
	game.events.emit('mutation-changed', {entity});

	// attack defs — charge dashes, everything else is pattern spawn
	if (def.attack) {
		const attack = {...def.attack, pos: def.pos};
		if (attack.pattern?.kind === 'charge') {
			const mv = entity.moveable;
			const f = FACING_VECTORS[mv.facing] ?? FACING_VECTORS.down;
			mv.dashDir = {x: f.x, y: f.y};
			mv.dashUntil = game.loop.now
				+ (attack.pattern.dist / attack.pattern.speed) * 1000;
			spawnMeleeboxCmd({
				scene, attacker: entity, attack,
				from: entity.rendered.pos(),
				channel: {duration: 0.5},
			});
		} else {
			spawnForPattern({
				scene, attacker: entity, attack,
				aim: InputManager.aim(entity.rendered.pos(), 0),
			});
		}
	}

	// one-shot effect defs — `effect` is an object: either a plain
	// {heal: n} or a {status: …} def routed by its status name
	const fx = def.effect;
	if (fx?.heal) {
		entity.damageable.apply(fx.heal);
		game.events.emit('health-changed', {entity});
	}
	switch (fx?.status) {
		case 'armor':
			// refresh or grant the timed mitigation window
			if (entity.armored) {
				entity.armored.mult = fx.amount;
				entity.armored.endsAt =
					game.loop.now + fx.duration * 1000;
			} else {
				entity.add(Armored, {
					mult: fx.amount,
					endsAt: game.loop.now + fx.duration * 1000,
				});
			}
			break;
		case 'rage':
			addStatusCmd({target: entity, def: fx});
			break;
		case 'antenna':
			if (entity.attuned) entity.remove(entity.attuned);
			entity.add(Attuned, {
				blocksLeft: fx.blocks,
				activeKey: key,
				cooldown: def.cooldown,
			});
			break;
		case 'flipped': {
			// nearest Flippable enemy within arm's reach joins us
			const p = entity.rendered.pos();
			let best = null;
			let bd = Infinity;
			for (const e of getQueries().ai.get()) {
				if (!e.flippable) continue;
				const op = e.rendered.pos();
				const d = dist(p.x, p.y, op.x, op.y);
				if (d < bd) {
					best = e;
					bd = d;
				}
			}
			if (best && bd < 96) {
				flipEntityCmd({scene, entity: best, seconds: fx.duration});
			}
			break;
		}
	}
};

//#endregion
