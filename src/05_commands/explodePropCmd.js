//#region 05_commands/explodePropCmd.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// A prop hits zero hp — the def decides what happens:
//   breaks: {key, min, max}   — splits into smaller props
//   onDestroyed.dmg           — damaging burst (Explosive Crystal)
//   onDestroyed.effects       — status burst (Slowing Crystal)
// Bursts hit everything — both queries, props don't pick teams.
const explodePropCmd = ({scene, prop}) => {
	const data = prop.getData('prop');
	const def = Props[data?.key];
	const pos = {x: prop.x, y: prop.y};
	prop.destroy();
	if (!def) return;

	if (def.breaks) {
		const n = Phaser.Math.Between(def.breaks.min, def.breaks.max);
		for (let i = 0; i < n; i++) {
			const child = scene.props.create(
				pos.x + Phaser.Math.Between(-12, 12),
				pos.y + Phaser.Math.Between(-12, 12),
				`spr-${def.breaks.key}`);
			child.setData('prop', {
				key: def.breaks.key,
				hp: Props[def.breaks.key]?.hp ?? 0,
			});
			child.body.setImmovable(true);
		}
	}
	const burst = def.onDestroyed;
	if (!burst) return;

	const victims = [
		...getQueries().ai.get(),
		...getQueries().player.get(),
	];
	victims.forEach(e => {
		const p = e.rendered.pos();
		if (dist(pos.x, pos.y, p.x, p.y) > burst.radius) return;
		if (burst.dmg) {
			resolveHitCmd({
				target: e,
				attack: {dmg: burst.dmg, effects: []},
				direct: true,
			});
		}
		(burst.effects ?? []).forEach(fx =>
			addStatusCmd({target: e, def: fx}));
	});
};

//#endregion
