//#region 02_components/StatusCarrying.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The status-effect holder — everything ticking or lingering on an
// entity lives in `effects`. addStatusCmd writes here; StatusSystem
// ticks dots and sweeps expired entries.
class StatusCarrying extends Geotic.Component {

	static properties = {
		// {key, endsAt, amount, tickMs, nextTick, stacks, stat,
		//  untilCleanse}
		effects: [],
	};

	// def: {status, amount?, duration?, tickMs?, stat?, untilCleanse?}
	// Re-applying an existing status refreshes it — keep the stronger
	// amount, push the end out, count the stack.
	add(def) {
		const now = game.loop.now;
		const endsAt = now + (def.duration ?? 1) * 1000;
		const found = this.effects.find(e => e.key === def.status);
		if (found) {
			found.amount = Math.max(found.amount, def.amount ?? found.amount);
			found.endsAt = Math.max(found.endsAt, endsAt);
			found.stacks = (found.stacks ?? 1) + 1;
			return;
		}
		this.effects.push({
			key: def.status,
			endsAt,
			amount: def.amount ?? 0,
			tickMs: def.tickMs ?? 1000,
			nextTick: now + (def.tickMs ?? 1000),
			stacks: 1,
			stat: def.stat,
			untilCleanse: def.untilCleanse,
		});
	}

	has(key) {
		return this.effects.some(e => e.key === key);
	}

	// Product of every effect modifying `stat` — statuses carry their
	// multiplier in `amount` (rage: {stat: 'dmg', amount: 1.5}).
	mult(stat) {
		return this.effects.reduce(
			(total, e) => e.stat === stat ? total * e.amount : total, 1);
	}
}

ECS.registerComponent(StatusCarrying);

//#endregion
