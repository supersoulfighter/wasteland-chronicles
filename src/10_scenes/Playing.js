//#region 10_scenes/Playing.js /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The game scene. create() builds a fresh world + query table,
// loads the level (real Tiled map or the generated stub), wires the
// collision matrix, and starts the HUD. update() is the documented
// frame order — systems tick in sequence, arcade collisions fire
// commands between MovementSystem and ProjectileSystem.
class Playing extends Phaser.Scene {

	//#region Configuration & Constructor
	constructor() {
		super('Playing');
	}

	init(data) {
		// which level — from a transition, or the save's current one
		this.levelKey = data.level ?? SaveManager.load().currentLevel;
	}
	//#endregion

	//#region Events
	// Probe for the level's Tiled JSON — the file lives at
	// public/assets/maps/mapNN.json. While it hasn't shipped, the dev
	// server returns HTML, Phaser logs one 'failed to process' error,
	// the cache stays empty, and loadLevel falls back to the stub.
	preload() {
		const mapKey = Levels[this.levelKey]?.map;
		if (mapKey) {
			this.load.tilemapTiledJSON(
				mapKey, `assets/maps/${mapKey}.json`);
		}
	}

	create() {
		const world = ECS.createWorld();
		bindWorld(world, createQueries(world));
		InputManager.init(this);

		// physics groups — the collision matrix's two sides
		this.enemies = this.physics.add.group();
		this.playerShots = this.physics.add.group();
		this.enemyShots = this.physics.add.group();
		this.playerMelee = this.physics.add.group();
		this.enemyMelee = this.physics.add.group();
		this.pickups = this.physics.add.group({
			allowGravity: false, immovable: true,
		});
		this.props = this.physics.add.group({immovable: true});
		this.doors = this.physics.add.group({immovable: true});
		this.exits = this.physics.add.group({allowGravity: false});
		this.lights = [];            // map light objects for Darkness
		this.bossSpawned = false;    // enterArenaCmd latches this

		LevelManager.loadLevel(this, this.levelKey);
		this.wireCollisions();
		Darkness.init(this);
		if (!this.scene.isActive('Hud')) this.scene.launch('Hud');
		AudioManager.playMusic(this, 'music-cave');
	}

	// The documented frame order — input first, darkness last.
	update(time, delta) {
		const dt = delta / 1000;
		InputManager.beginFrame();
		PlayerSystem.tick(this, dt);
		EnemyAI.tick(this, dt);
		TerrainSystem.tick(this, dt);
		MovementSystem.tick(this, dt);
		// — arcade overlap/collide callbacks run inside physics.step —
		ProjectileSystem.tick(this, dt);
		StatusSystem.tick(this, dt);
		WaveDirector.tick(this, dt);
		Darkness.tick(this, dt);
		this.checkArena();
	}

	// Crossing the arena rect wakes the boss — a plain contain check
	// on a data rect, not a physics zone.
	checkArena() {
		if (!this.arena || this.bossSpawned || !this.playerSprite) return;
		const p = this.playerSprite;
		if (Phaser.Geom.Rectangle.Contains(this.arena, p.x, p.y)) {
			enterArenaCmd({
				scene: this,
				entity: entityOf(this.playerSprite),
			});
		}
	}
	//#endregion

	//#region Collisions
	// The collision matrix — every cell resolves sprites → entities
	// and calls a command. Ordered by the doc's table.
	wireCollisions() {
		const walls = getWalls();

		// player
		this.physics.add.collider(this.playerSprite, walls);
		this.physics.add.collider(this.playerSprite, this.enemies,
			(p, es) => {
				const mine = entityOf(es);
				if (mine?.launched) this.landLaunched(mine);
			});
		this.physics.add.collider(this.playerSprite, this.doors);
		this.physics.add.collider(this.playerSprite, this.props,
			null,
			// impassable only — passable props walk through
			(p, prop) => !Props[prop.getData('prop')?.key]?.passable);
		this.physics.add.overlap(this.enemyShots, this.playerSprite,
			(s, t) => this.onShotHit(s, t));
		this.physics.add.overlap(this.enemyMelee, this.playerSprite,
			(z, t) => this.onMeleeHit(z, t));
		this.physics.add.overlap(this.playerSprite, this.pickups,
			(p, pk) => pickupCrystalCmd({
				scene: this, entity: entityOf(p), pickup: pk,
			}));
		this.physics.add.overlap(this.playerSprite, this.exits,
			(p) => completeLevelCmd({
				scene: this, entity: entityOf(p),
			}));

		// enemies — walls block, neighbors separate; a Launched one is
		// a projectile and detonates on contact
		this.physics.add.collider(this.enemies, walls,
			(es) => {
				const e = entityOf(es);
				if (e?.launched) this.landLaunched(e);
			});
		this.physics.add.collider(this.enemies, this.props);
		this.physics.add.collider(this.enemies, this.doors);
		this.physics.add.overlap(this.enemies, this.enemies,
			(a, b) => this.onEnemyBump(a, b));

		// player shots — walls destroy or ricochet, enemies take hits,
		// props take damage
		this.physics.add.collider(this.playerShots, walls,
			(s) => {
				const e = entityOf(s);
				if (e) ProjectileSystem.onWallHit(this, e);
			});
		this.physics.add.collider(this.enemyShots, walls,
			(s) => {
				const e = entityOf(s);
				if (e) ProjectileSystem.onWallHit(this, e);
			});
		this.physics.add.overlap(this.playerShots, this.enemies,
			(s, t) => this.onShotHit(s, t));
		this.physics.add.overlap(this.playerShots, this.props,
			(s, prop) => {
				const proj = entityOf(s);
				damagePropCmd({
					scene: this, prop,
					attack: proj?.ballistic ?? {dmg: 0},
				});
				if (proj) despawnCmd({entity: proj});
			});
		this.physics.add.overlap(this.playerMelee, this.enemies,
			(z, t) => this.onMeleeHit(z, t));
		this.physics.add.overlap(this.playerMelee, this.props,
			(z, prop) => damagePropCmd({
				scene: this, prop, attack: z.getData('attack'),
			}));
	}

	// A projectile meets a body — resolve the hit unless it's dodged,
	// swallowed, or already ignored this target. Pattern follow-ups
	// (chain/pierce/aoe/fragments) live in ProjectileSystem.afterHit.
	onShotHit(projSprite, targetSprite) {
		const proj = entityOf(projSprite);
		const target = entityOf(targetSprite);
		if (!proj || !target) return;
		if (target.autonomous?.dormant) return;   // hasn't woken yet
		const b = proj.ballistic;
		if (b.ignoredTargets?.includes(target.id)) return;
		// a worm eats the shot instead of taking the hit
		if (target.swallowing && b.swallowable
			&& swallowProjectileCmd({
				scene: this, entity: target, projectile: proj,
			})) {
			return;
		}
		// player shots decay in accuracy with distance flown —
		// a miss marks the target so it sails through, not just
		// once but for every remaining frame of overlap
		if (b.team !== 'enemy' && b.origin) {
			const s = projSprite;
			const flown = dist(b.origin.x, b.origin.y, s.x, s.y);
			const acc = b.accuracy
				- (b.accuracy * 0.5) * Math.min(1, flown / 600);
			if (Math.random() * 100 > acc) {
				(b.ignoredTargets ??= []).push(target.id);
				return;
			}
		}
		b.volleyLog?.hits.push(target.id);
		resolveHitCmd({attacker: null, target, attack: b});
		this.volleyBonus(target, b);
		ProjectileSystem.afterHit(this, proj, target);
	}

	// A melee zone overlaps a body. Non-channel boxes hit a target
	// once; channels re-hit on their tick. Every melee target must
	// pass the tilemap LOS check — no hitting through walls.
	onMeleeHit(zone, targetSprite) {
		const target = entityOf(targetSprite);
		if (!target) return;
		if (target.autonomous?.dormant) return;   // hasn't woken yet
		const attack = zone.getData('attack');
		const hits = zone.getData('hits');
		const channel = zone.getData('channel');
		const now = game.loop.now;
		if (hits[target.id]
			&& (!channel || now - hits[target.id] < (channel.tick ?? 0.2) * 1000)) {
			return;
		}
		const attacker = getWorld()
			.getEntity(zone.getData('attackerId'));
		if (!attacker?.rendered) return;
		const a = attacker.rendered.pos();
		const t = target.rendered.pos();
		if (!hasLineOfSight(a.x, a.y, t.x, t.y, getWalls())) return;
		const d = dist(a.x, a.y, t.x, t.y);
		// ring patterns hit the band, not the hole — inside
		// `ringInner` you're standing in the safe center
		if (d < attack.ringInner) return;
		hits[target.id] = now;
		attack.volleyLog?.hits.push(target.id);
		// an effectRadius (yellow's r40 stagger) widened the zone —
		// targets outside the damage shape only take the effects
		if (attack.effectRadius && d > (attack.shape?.r ?? Infinity)) {
			(attack.effects ?? []).forEach(fx =>
				addStatusCmd({target, attacker, def: fx}));
			return;
		}
		resolveHitCmd({attacker, target, attack});
		this.volleyBonus(target, attack);
	}

	// Scorpion's bonus: the last strike pays volleyBonus only when
	// every strike in the shared log connected with something.
	volleyBonus(target, attack) {
		if (!attack.lastStrike || !attack.volleyBonus
				|| !attack.volleyLog
				|| attack.volleyLog.hits.length < attack.volleyLog.strikes) {
			return;
		}
		if (target.isDestroyed || target.damageable.dead()) return;
		target.damageable.apply(-attack.volleyBonus);
		game.events.emit('health-changed', {entity: target});
		if (target.damageable.dead()) {
			dieCmd({entity: target, source: null});
		}
	}

	// Launched bodies are projectiles — on bumping another enemy they
	// detonate their AoE and land (flags removed; they rejoin ai).
	onEnemyBump(a, b) {
		const ea = entityOf(a);
		const eb = entityOf(b);
		const launched = ea?.launched ? ea : eb?.launched ? eb : null;
		if (!launched) return;
		this.landLaunched(launched);
	}

	// A mine (or any Launched body) touches down: burst the AoE,
	// strip the projectile disguise, and stop it where it landed.
	landLaunched(launched) {
		ProjectileSystem.burst(this, launched);
		launched.remove(launched.launched);
		if (launched.ballistic) launched.remove(launched.ballistic);
		launched.rendered.sprite.body.setVelocity(0, 0);
	}
	//#endregion
}

//#endregion
