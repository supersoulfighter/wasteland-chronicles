//#region 05_commands/gainAbilityCmd.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// AbilityPick's verb. powered.grant() owns the passives/actives
// split (the key's table decides); this command applies the stat
// side of passives and puts new actives on the hotbar.
const gainAbilityCmd = ({entity, key}) => {
	const passive = Abilities.passives[key];
	entity.powered.grant(key);
	if (!passive) {
		if (!entity.slotted.actives.includes(key)) {
			entity.slotted.actives.push(key);
		}
		return;
	}

	// stat passives fold into their component now; the rest are
	// read passively (dodge rolls, sturdy, swimmer)
	switch (passive.stat) {
		case 'maxHealth':
			entity.damageable.max *= passive.mult;
			entity.damageable.apply(entity.damageable.max * 0.1);
			break;
		case 'speed':
			entity.moveable.speed *= passive.mult;
			break;
		case 'maxMutation':
			entity.mutated.max *= passive.mult;
			break;
		case 'decay':
			entity.mutated.decayRate = passive.set;
			break;
		case 'lightRadius':
			entity.luminous.radius *= passive.mult;
			break;
		case 'dodgeRanged':
			if (!entity.evasive) entity.add(Evasive, {});
			entity.evasive.rangedPct += passive.pct;
			break;
		case 'dodgeMelee':
			if (!entity.evasive) entity.add(Evasive, {});
			entity.evasive.meleePct += passive.pct;
			break;
	}
};

//#endregion
