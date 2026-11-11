//#region 01_global/attacklib.js ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Attack-shape helpers shared by executeAttackCmd and EnemyAI. Pure
// functions — nothing here ticks, owns state, or runs at file-load.
// Lives in 01_global/ as helper-library code (a *Manager name would
// mislabel it — it manages nothing).


// Melee hitbox tiers (game.md "Shape" table): rect width in px, all
// rectangles are 8 px tall. A `C{n}` entry in the doc is a circle of
// radius n.
const MELEE_TIERS = {
	XXS: 4, XS: 8, S: 16, M: 24, L: 32, XL: 48, XXL: 64,
};

// facing name → unit vector. Screen space: +y is down.
const FACING_VECTORS = {
	up:    {x: 0, y: -1},
	down:  {x: 0, y: 1},
	left:  {x: -1, y: 0},
	right: {x: 1, y: 0},
};

// 90° rotations of a facing vector. With +y down these read as
// rotLeft(facing right) = up and rotRight(facing right) = down —
// exactly how the T/B side letters should behave.
const rotLeft = (v) => ({x: v.y, y: -v.x});
const rotRight = (v) => ({x: -v.y, y: v.x});

// Each position-code letter maps to a fixed direction relative to
// facing: F front, R rear, T left-of-facing, B right-of-facing.
const codeDir = (letter, f) => ({
	F: f,
	R: {x: -f.x, y: -f.y},
	T: rotLeft(f),
	B: rotRight(f),
	C: {x: 0, y: 0},
}[letter]);


// resolvePos — 2-letter body position code → world point on the
// entity's perimeter. The 12 perimeter codes walk a ring:
// TF→TC→TR→RT→RC→RB→BR→BC→BF→FB→FC→FT — plus `C` = center.
//   letter 1 = the side (F/R/T/B)
//   letter 2 = the slot along that edge: toward T/C/B on the F and
//              R edges, toward F/C/R on the T and B edges
// `body` is the entity's arcade body ({center, width, height}).
const resolvePos = (code, facing, body) => {
	if (code === 'C') {
		return {x: body.center.x, y: body.center.y};
	}
	const f = FACING_VECTORS[facing] ?? FACING_VECTORS.down;
	const side = codeDir(code[0], f);   // outward normal of the edge
	const along = codeDir(code[1], f);  // slide direction along it
	const halfW = body.width / 2;
	const halfH = body.height / 2;

	// step out to the edge (half-extent along the side's axis), then
	// slide along it (half-extent along the perpendicular axis)
	return {
		x: body.center.x
			+ side.x * (side.x !== 0 ? halfW : halfH)
			+ along.x * (along.x !== 0 ? halfW : halfH),
		y: body.center.y
			+ side.y * (side.y !== 0 ? halfH : halfW)
			+ along.y * (along.y !== 0 ? halfH : halfW),
	};
};


// makeBody — attack `shape` def → physics-body numbers. Returns:
//   {w, h}     rectangle — melee tiers, all 8 px tall
//   {r}        circle — Cn melee and U/P/D projectiles
//   {line}     ray (Y "beam") — resolved as a line check, not a body
//   {global}   marker (G) — hits every enemy on screen, no body
const makeBody = (shape) => {
	switch (shape.kind) {
		case 'rect':
			return {w: MELEE_TIERS[shape.size] ?? 8, h: 8};
		case 'circle':                    // Cn melee shape
			return {r: shape.r};
		case 'bullet':                    // U — straight shot
			return {r: shape.r ?? 4};
		case 'lob':                       // P — arcing ball
		case 'mine':                      // D — dropped, waits for touch
			return {r: shape.r ?? 6};
		case 'beam':                      // Y — ray
			return {line: true};
		case 'global':                    // G — no body at all
			return {global: true};
		default:
			return {w: 8, h: 8};
	}
};

// Melee vs projectile is decided by the *shape* — rect/circle bodies
// ride on the attacker, everything else flies free. DoT/hazard hits
// have no shape at all — they count as ranged (non-melee dodge).
const isMeleeShape = (shape) =>
	shape?.kind === 'rect' || shape?.kind === 'circle';

// `count` evenly spaced angles across `spread` radians, centered on
// `center`. closed = a full circle (no doubled shot at the seam).
const anglesSpread = (center, spread, count, closed = false) => {
	const angles = [];
	for (let i = 0; i < count; i++) {
		const t = closed ? i / count : (count === 1 ? 0.5 : i / (count - 1));
		angles.push(center - spread / 2 + spread * t);
	}
	return angles;
};

// World angles to spawn for a projectile pattern. Kinds not listed
// here (pierce, bounce, chain, fragments, lob, mine, beam, global)
// all fire a single projectile at the aim angle — the pattern rides
// along on the Ballistic component for the system to interpret.
const projectileAngles = (pattern, aim, from) => {
	const count = pattern.count ?? 1;
	const aimAngle = angleTo(from.x, from.y, aim.x, aim.y);
	switch (pattern.kind) {
		case 'fan':
			return anglesSpread(
				aimAngle,
				Phaser.Math.DegToRad(pattern.degrees ?? 0),
				count
			);
		case 'ring':
			if (pattern.random) {
				return Array.from(
					{length: count},
					() => Math.random() * Math.PI * 2
				);
			}
			return anglesSpread(0, Math.PI * 2, count, true);
		default:
			return [aimAngle];
	}
};


// Who an attacker targets — 'enemy' aims at the player, everything
// else (player + flipped 'allied' minions) aims at the ai query.
const targetsOf = (attacker) =>
	attacker.allied?.id === 'enemy'
		? getQueries().player.get()
		: getQueries().ai.get();

// Enemies caught by a beam: project each onto the aim ray — inside
// the hit width, in front of the attacker, past the LOS check.
const beamTargets = (attacker, from, aim, range = 600, width = 8) => {
	const aimAngle = angleTo(from.x, from.y, aim.x, aim.y);
	return targetsOf(attacker).filter(e => {
		const p = e.rendered.pos();
		const along = (p.x - from.x) * Math.cos(aimAngle)
			+ (p.y - from.y) * Math.sin(aimAngle);
		if (along < 0 || along > range) return false;
		const perp = Math.abs(
			-(p.x - from.x) * Math.sin(aimAngle)
			+ (p.y - from.y) * Math.cos(aimAngle));
		if (perp > width) return false;
		return hasLineOfSight(from.x, from.y, p.x, p.y, getWalls());
	});
};


// spawnForPattern — the shape/pattern dispatch. Turns an attack def
// into the right spawn calls; every branch funnels into
// spawnMeleeboxCmd / spawnProjectileCmd (05_commands/), or direct
// resolveHitCmd calls for shapes that never get a body.
const spawnForPattern = ({scene, attacker, attack, aim}) => {
	const pattern = attack.pattern ?? {kind: 'single'};
	const from = resolvePos(
		attack.pos ?? 'FC',
		attacker.moveable?.facing ?? 'down',
		attacker.rendered.sprite.body
	);
	const payload = {scene, attacker, attack, from, aim, pattern};

	// no body at all — hit everything on screen, optionally the
	// attacker's own team (affectAllies: the screech/roar buffs)
	if (pattern.kind === 'global') {
		const targets = attack.affectAllies
			? getQueries().ai.get() : targetsOf(attacker);
		targets.forEach(target =>
			resolveHitCmd({attacker, target, attack}));
		return;
	}
	// a ray, not a projectile — line check each activation
	if (attack.shape?.kind === 'beam' || pattern.kind === 'beam') {
		beamTargets(attacker, from, aim).forEach(target =>
			resolveHitCmd({attacker, target, attack}));
		return;
	}
	// volleys are one spawn per strike on a timer — works for both
	// melee combos and rapid-fire darts
	if (pattern.kind === 'volley') {
		const strikes = pattern.strikes ?? 3;
		for (let i = 0; i < strikes; i++) {
			scene.time.delayedCall(i * (pattern.delay ?? 0.2) * 1000,
				() => spawnForPattern({
					scene, attacker,
					attack: {...attack, pattern: {kind: 'single'}},
					aim,
				}));
		}
		return;
	}
	// channel = a held hitbox ticking until the duration ends
	if (pattern.kind === 'channel') {
		spawnMeleeboxCmd({...payload, channel: pattern});
		return;
	}

	if (isMeleeShape(attack.shape)) {
		// `ring` on a melee shape = hitboxes radiating from the body
		// (White's 16 spikes); every other melee pattern spawns one
		// hitbox — cone arc, volley timing, grab channel are the
		// command's job, not ours.
		if (pattern.kind === 'ring') {
			anglesSpread(0, Math.PI * 2, pattern.count ?? 16, true)
				.forEach(angle => spawnMeleeboxCmd({...payload, angle}));
			return;
		}
		spawnMeleeboxCmd(payload);
		return;
	}
	projectileAngles(pattern, aim, from).forEach(angle =>
		spawnProjectileCmd({...payload, angle})
	);
};

// attack def → Ballistic component props (everything except `team`,
// which the recipe supplies). The projectile carries a copy of the
// numbers it needs at flight time, so the def can be swapped or
// dropped safely afterward — Regurge Surge relies on this.
const attackToBallistic = (attack) => {
	const pattern = attack.pattern ?? {kind: 'single'};
	return {
		dmg: attack.dmg ?? 0,
		accuracy: attack.accuracy ?? 100,
		effects: attack.effects ?? [],
		hitsLeft: pattern.kind === 'pierce' ? Infinity : 1,
		bouncesLeft: pattern.kind === 'bounce' ? pattern.count ?? 1 : 0,
		chainLog: [],
		// expirySecs (fecal ball) or a lob/mine's lingerSecs both
		// land here — the projectile dies when it lapses
		expiry: (attack.expirySecs ?? pattern.lingerSecs)
			? game.loop.now
				+ (attack.expirySecs ?? pattern.lingerSecs) * 1000
			: 0,
		swallowable: attack.shape?.kind !== 'beam', // rays can't be eaten
		pattern,
		speed: attack.speed ?? 400,
	};
};


// The player's attack pick — hotbar crystal → melee/ranged half via
// coneSelect, the 5% Mutation floor falls back to Punch, and the
// deficit curve scales damage. Pure selection: spending mutation and
// ammo is executeAttackCmd's job.
const pickPlayerAttack = (attacker, aimPoint) => {
	const key = attacker.slotted.attacks[attacker.slotted.attackSel];
	let def = Crystals[key] ?? Crystals.punch;
	const pct = attacker.mutated.pct();
	// the floor: below 5% Mutation the powered attacks drop out
	if (pct < CFG.mutationFloor) def = Crystals.punch;
	const sel = coneSelect(attacker, aimPoint);
	const attack = sel.kind === 'melee'
		? (def.melee ?? def.ranged)
		: (def.ranged ?? def.melee);
	// deficit: under 50% Mutation, damage eases down a quadratic to a
	// floor of 10% at the 5% boundary
	const t = Math.max(0, (pct - CFG.mutationFloor)
		/ (CFG.mutationHalf - CFG.mutationFloor));
	const dmgMult = pct >= CFG.mutationHalf ? 1 : 0.1 + 0.9 * t * t;
	return {
		def,
		attack: {...attack, dmg: attack.dmg * dmgMult, isMelee: sel.kind === 'melee'},
		aim: {x: sel.x, y: sel.y},
		melee: sel.kind === 'melee',
	};
};


// Aim assist for the player: the nearest enemy inside a ~30° cone
// toward aimPoint, line-of-sight checked against the wall layer.
// Returns the resolved aim point plus which half of the crystal def
// to use — 'melee' when the target is within arm's reach.
const coneSelect = (attacker, aimPoint) => {
	const body = attacker.rendered.sprite.body;
	const aimAngle = angleTo(
		body.center.x, body.center.y, aimPoint.x, aimPoint.y
	);
	const halfCone = Phaser.Math.DegToRad(CFG.aimConeDeg / 2);

	let best = null;
	let bestDist = Infinity;
	for (const enemy of getQueries().ai.get()) {
		const eb = enemy.rendered.sprite.body;
		const toward = angleTo(
			body.center.x, body.center.y, eb.center.x, eb.center.y
		);
		if (Math.abs(angleDiff(aimAngle, toward)) > halfCone) continue;
		if (!hasLineOfSight(
			body.center.x, body.center.y,
			eb.center.x, eb.center.y, getWalls()
		)) continue;
		const d = dist(
			body.center.x, body.center.y, eb.center.x, eb.center.y
		);
		if (d < bestDist) {
			best = eb;
			bestDist = d;
		}
	}
	if (!best) return {x: aimPoint.x, y: aimPoint.y, kind: 'ranged'};
	return {
		x: best.center.x,
		y: best.center.y,
		kind: bestDist <= CFG.meleeReach ? 'melee' : 'ranged',
	};
};

//#endregion
