//#region 04_systems/02_managers/LevelManager.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Loads the level's map and instantiates its objects. Two paths:
// real Tiled JSON when the map ships, and makeStub() — a generated
// bordered room that keeps the game playable while art is pending.
// Both end at bindLevel() so downstream code never knows the
// difference.
const LevelManager = {

	loadLevel(scene, levelKey) {
		const def = Levels[levelKey];
		scene.level = {key: levelKey, def};
		if (scene.cache.tilemap.exists(def.map)) {
			return this.loadTiled(scene, def);
		}
		return this.makeStub(scene, def);
	},

	// Tiled path — layer names are a contract with the map converter:
	// 'ground' (walls carry collides: true), 'terrain' (tiles carry a
	// terrain prop), 'props', and the 'objects' layer that drives
	// everything else.
	loadTiled(scene, def) {
		const map = scene.make.tilemap({key: def.map});
		const tiles = map.addTilesetImage('tiles');
		const ground = map.createLayer('ground', tiles, 0, 0);
		ground.setCollisionByProperty({collides: true});
		const terrain = map.getLayer('terrain')
			? map.createLayer('terrain', tiles, 0, 0) : null;
		map.createLayer('props', tiles, 0, 0);
		bindLevel({wallLayer: ground, terrainLayer: terrain});
		this.placeObjects(scene, map);
		return {map, walls: ground};
	},

	//#region Objects
	// The 'objects' layer is a list of named rects/points; each type
	// fans out to a command or a plain Phaser object — pickups, doors
	// and zones stay objects, only creatures become entities.
	placeObjects(scene, map) {
		const objects = map.getObjectLayer('objects');
		if (!objects) return;
		objects.objects.forEach(o => this.place(scene, o));
	},

	place(scene, o) {
		const kind = o.name || o.type;
		switch (kind) {
			case 'playerStart':
				spawnPlayerCmd({scene, x: o.x, y: o.y});
				break;
			case 'enemy':
				spawnEnemyCmd({
					scene,
					key: this.propOf(o, 'type'),
					x: o.x, y: o.y,
				});
				break;
			case 'prop': {
				const def = Props[this.propOf(o, 'type')];
				const sprite = scene.props.create(
					o.x, o.y, `spr-${this.propOf(o, 'type')}`);
				sprite.setData('prop', {
					key: def.key, hp: def.hp ?? 0,
				});
				sprite.body.setImmovable(true);
				if (def.light) {
					scene.lights.push({x: o.x, y: o.y, ...def.light});
				}
				break;
			}
			case 'door': {
				const door = scene.doors.create(o.x, o.y, 'spr-door');
				door.setData('doorId', this.propOf(o, 'id'));
				// open until an arena seals it
				door.body.enable = false;
				door.setAlpha(0.3);
				break;
			}
			case 'exit': {
				const zone = scene.add.zone(o.x, o.y, o.width, o.height);
				scene.physics.add.existing(zone, true);
				zone.setData('exit', true);
				scene.exits.add(zone);
				break;
			}
			case 'bossArena':
				scene.arena = {x: o.x, y: o.y, width: o.width, height: o.height};
				break;
			case 'light':
				scene.lights.push({
					x: o.x, y: o.y,
					radius: this.propOf(o, 'radius') ?? 48,
				});
				break;
		}
	},

	// Tiled custom properties arrive as [{name, value}] pairs.
	propOf(o, name) {
		return o.properties?.find(p => p.name === name)?.value;
	},
	//#endregion

	//#region Stub
	// Generated room: 60×40 tiles, wall border, a few water pools, a
	// scatter of revealed enemies, crystals from the level def, and an
	// exit zone at the top. Keeps the whole loop playable pre-art.
	makeStub(scene, def) {
		const W = 60;
		const H = 40;
		const data = [];
		for (let y = 0; y < H; y++) {
			const row = [];
			for (let x = 0; x < W; x++) {
				const border = x === 0 || y === 0 || x === W - 1 || y === H - 1;
				if (border) {
					row.push(2);                    // wall tile
				} else if (
					x > 8 && x < 14 && y > 24 && y < 30) {
					row.push(3);                    // a water pool
				} else {
					row.push(1);                    // floor
				}
			}
			data.push(row);
		}
		const map = scene.make.tilemap({
			data, tileWidth: 16, tileHeight: 16,
		});
		const tiles = map.addTilesetImage('tiles');
		const layer = map.createLayer(0, tiles, 0, 0);
		layer.setCollision(2);
		// mark water tiles' terrain key for TerrainSystem
		layer.forEachTile(t => {
			if (t.index === 3) t.properties = {terrain: 'water'};
		});
		bindLevel({wallLayer: layer, terrainLayer: layer});
		scene.cameras.main.setBounds(0, 0, W * 16, H * 16);
		scene.physics.world.setBounds(0, 0, W * 16, H * 16);

		const center = {x: W * 8, y: H * 8};
		spawnPlayerCmd({scene, x: center.x, y: center.y});
		this.stubEnemies(scene, def);
		this.stubExit(scene, W, H);
		const floor = [];
		layer.forEachTile(t => {
			if (t.index === 1) {
				floor.push({x: t.pixelX + 8, y: t.pixelY + 8});
			}
		});
		CrystalManager.scatter(scene, def, floor);
		return {map, walls: layer};
	},

	// A handful of enemies this level is allowed to show —
	// def.reveal <= the level's number.
	stubEnemies(scene, def) {
		const num = Number(scene.level.key.slice(5));
		const pool = Object.values(Enemies).filter(e => e.reveal <= num);
		if (def.boss) {   // arena fights get their boss, not wanderers
			spawnEnemyCmd({scene, key: def.boss, x: 480, y: 160, boss: true});
			return;
		}
		for (let i = 0; i < 8; i++) {
			const pick = pool[Math.floor(Math.random() * pool.length)];
			spawnEnemyCmd({
				scene, key: pick.key,
				x: 120 + Math.random() * 720,
				y: 120 + Math.random() * 400,
			});
		}
	},

	stubExit(scene, W, H) {
		const zone = scene.add.zone(W * 8, 24, 64, 32);
		scene.physics.add.existing(zone, true);
		zone.setData('exit', true);
		scene.exits.add(zone);
	},
	//#endregion
};

//#endregion
