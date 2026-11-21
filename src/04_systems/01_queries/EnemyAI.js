//#region 04_systems/01_queries/EnemyAI.js /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `ai`. A weighted state machine — all state and timers live on
// the entity's Autonomous component, so this file is a pure behavior
// loop. Every ~0.25s the entity re-decides; between decisions it
// just executes its current state's steering.
const EnemyAI = {

	tick(scene, dt) {
		const player = getQueries().player.get()[0];
		if (!player) return;
		const now = game.loop.now;
		for (const e of getQueries().ai.get()) {
			const ai = e.autonomous;
			// spawn-marker leashes: hold position until the player
			// crosses activationRadius, then behave normally forever
			if (ai.dormant) {
				const p = e.rendered.pos();
				const pp = player.rendered.pos();
				if (dist(p.x, p.y, pp.x, pp.y) > ai.activationRadius) {
					e.moveable.intent.x = 0;
					e.moveable.intent.y = 0;
					continue;
				}
				ai.dormant = false;   // it heard you
			}
			this.behave(scene, e, ai, player, now);
			if (now < ai.decisionAt) continue;
			ai.decisionAt = now + 250;
			this.decide(e, ai, player);
		}
	},

	// Weighted state pick. Bosses pick their attack the same way —
	// armed.list entries carry `weight`.
	decide(e, ai, player) {
		const hurt = e.damageable.value / e.damageable.max;
		const pick = weightedPick([
			{key: 'attack', w: 2},
			{key: 'maneuver', w: {
				fly: 1, leap: 0.9, burrow: 0.6, walk: 0.5,
			}[ai.style] ?? 0.5},
			{key: 'lickWounds', w: hurt < 0.6 ? 0.3 : 0},
		], c => c.w);
		ai.state = pick?.key ?? 'idle';
		ai.until = game.loop.now + 1500;    // maneuver hard cap
		if (ai.state === 'lickWounds') {
			ai.maneuverTo = this.retreatSpot(e, player);
			// regenerates 25% of max over 5s
			addStatusCmd({
				target: e,
				def: {
					status: 'regen',
					amount: e.damageable.max * 0.05,
					tickMs: 1000,
					duration: 5,
				},
			});
		}
		if (ai.state === 'maneuver') {
			ai.maneuverTo = this.maneuverSpot(e, player);
		}
	},

	// Per-frame execution of the current state.
	behave(scene, e, ai, player, now) {
		// burrowers travel underground: untouchable while they
		// reposition, and they have to surface to fight
		if (ai.style === 'burrow') {
			this.setBurrowed(e,
				ai.state === 'maneuver' || ai.state === 'lickWounds');
		}
		switch (ai.state) {
			case 'attack':
				this.attackStep(scene, e, player);
				break;
			case 'maneuver':
			case 'lickWounds':
				this.steerTo(e, ai.maneuverTo);
				break;
			default:
				this.steerTo(e, player.rendered.pos());
		}
		if (now > ai.until && ai.state !== 'attack') ai.state = 'idle';
	},

	// Down or up. The flags are AI-owned (endsAt Infinity, so
	// StatusSystem never sweeps them) — only this method removes
	// them. Burrowed reads as a visual fade and, because
	// Invulnerable rides along, hazards and hits can't reach it.
	setBurrowed(e, under) {
		const s = e.rendered.sprite;
		if (under && !e.has(Burrowed)) {
			e.add(Burrowed, {endsAt: Infinity});
			e.add(Invulnerable, {endsAt: Infinity});
			s.setAlpha(0.4);
		} else if (!under && e.has(Burrowed)) {
			e.remove(e.burrowed);
			e.remove(e.invulnerable);
			s.setAlpha(1);
		}
	},

	// Steer intent toward a point; arrive → stand still.
	steerTo(e, to) {
		if (!to) return;
		const p = e.rendered.pos();
		const dx = to.x - p.x;
		const dy = to.y - p.y;
		if (Math.hypot(dx, dy) < 8) {
			e.moveable.intent.x = 0;
			e.moveable.intent.y = 0;
			return;
		}
		const len = Math.hypot(dx, dy);
		e.moveable.intent.x = dx / len;
		e.moveable.intent.y = dy / len;
	},

	// Bosses pick a weighted attack from their list; specials route
	// through BossSpecials[key]. Everyone else fires armed.current().
	attackStep(scene, e, player) {
		const attack = this.pickAttack(e);
		if (!attack) return;
		if (attack.special) {
			BossSpecials[e.bossy?.key]?.({
				scene, attacker: e, attack, target: player,
			});
			return;
		}
		const p = e.rendered.pos();
		const pp = player.rendered.pos();
		const ranged = attack.speed > 0 || attack.shape?.kind === 'beam';
		const reach = ranged ? 400 : CFG.meleeReach;
		const clear = hasLineOfSight(p.x, p.y, pp.x, pp.y, getWalls());
		if (dist(p.x, p.y, pp.x, pp.y) > reach || !clear) {
			this.steerTo(e, pp);            // close in
			return;
		}
		e.moveable.intent.x = 0;
		e.moveable.intent.y = 0;
		executeAttackCmd({
			scene, attacker: e, attack,
			aim: pp, target: player,
		});
	},

	// Bosses pick weighted; normal enemies always use index 0.
	pickAttack(e) {
		const list = e.armed.list;
		if (!e.bossy) return e.armed.current();
		const pick = weightedPick(list, a => a.weight ?? 1);
		if (pick) e.armed.idx = list.indexOf(pick);
		return pick;
	},

	// Where each style wants to circle: walkers press the front,
	// leapers take the sides, burrowers go behind, flyers take any
	// angle. Returns a point ~64px off the player.
	maneuverSpot(e, player) {
		const p = player.rendered.pos();
		const f = FACING_VECTORS[player.moveable.facing]
			?? FACING_VECTORS.down;
		switch (e.autonomous.style) {
			case 'walk':
				return {x: p.x + f.x * 64, y: p.y + f.y * 64};
			case 'leap': {
				const side = Math.random() < 0.5 ? -1 : 1;
				return {
					x: p.x + -f.y * 64 * side,
					y: p.y + f.x * 64 * side,
				};
			}
			case 'burrow':
				return {x: p.x - f.x * 64, y: p.y - f.y * 64};
			default: {   // fly — anywhere
				const a = Math.random() * Math.PI * 2;
				return {
					x: p.x + Math.cos(a) * 80,
					y: p.y + Math.sin(a) * 80,
				};
			}
		}
	},

	// Lick wounds retreats: a point ~160px away from the player.
	retreatSpot(e, player) {
		const p = player.rendered.pos();
		const me = e.rendered.pos();
		const a = angleTo(p.x, p.y, me.x, me.y);
		return {
			x: me.x + Math.cos(a) * 160,
			y: me.y + Math.sin(a) * 160,
		};
	},
};

//#endregion
