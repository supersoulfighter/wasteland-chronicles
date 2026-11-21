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

	// Tiled path — the layer contract (architecture.md), bottom to
	// top: hazard (filled edge-to-edge; tiles carrying a `hazard`
	// property hurt, the rest are plain fill), ground (walkable
	// floor, its edges transition to transparent), wall (colliding
	// rock, tiles carry collides: true), then the objects and
	// lights object layers, and wall-top drawn over everything —
	// depth 10 keeps it above the sprites.
	// Older single-layer maps still load: 'ground' doubles as the
	// wall layer when no 'wall' exists.
	loadTiled(scene, def) {
		const map = scene.make.tilemap({key: def.map});
		const tiles = map.addTilesetImage('tiles');
		const hazard = map.getLayer('hazard')
			? map.createLayer('hazard', tiles, 0, 0) : null;
		const ground = map.getLayer('ground')
			? map.createLayer('ground', tiles, 0, 0) : null;
		const wall = map.getLayer('wall')
			? map.createLayer('wall', tiles, 0, 0)
			: (ground ?? map.createLayer('wall', tiles, 0, 0));
		wall.setCollisionByProperty({collides: true});
		if (map.getLayer('wall-top')) {
			map.createLayer('wall-top', tiles, 0, 0).setDepth(10);
		}
		bindLevel({wallLayer: wall, hazardLayer: hazard,
			groundLayer: ground});
		// free tiles FIRST — spawn markers scatter onto them
		scene.freeTiles = this.freeTiles(wall, ground);
		this.placeObjects(scene, map);
		CrystalManager.scatter(scene, def, scene.freeTiles);
		return {map, walls: wall};
	},

	// Spawnable floor: solid ground tiles — not a wall, and not a
	// transition tile (their edge shapes are where hazard bleeds
	// through). Crystals scatter and enemy spawnCount both draw
	// from this list.
	freeTiles(wall, ground) {
		const free = [];
		const base = ground ?? wall;   // single-layer maps: wall IS floor
		base.forEachTile(t => {
			if (t.index < 0) return;
			if (wall.getTileAt(t.x, t.y)?.collides) return;
			const td = t.tileset
				?.getTileData(t.index - t.tileset.firstgid);
			if (ground && td?.objectgroup?.objects?.length) return;
			free.push({x: t.pixelX + 8, y: t.pixelY + 8});
		});
		return free;
	},

	//#region Objects
	// The 'objects' and 'lights' layers list named rects, points,
	// and tile objects; each type fans out to a command or a plain
	// Phaser object — pickups, doors and zones stay objects, only
	// creatures become entities.
	placeObjects(scene, map) {
		['objects', 'lights'].forEach(name => {
			map.getObjectLayer(name)?.objects
				.forEach(o => this.place(scene, map, o));
		});
	},

	place(scene, map, o) {
		if (o.gid) {
			// tile object — the enemies tileset's spawn marker
			this.placeTileObject(scene, map, o);
			return;
		}
		const kind = o.name || o.type;
		switch (kind) {
			case 'playerStart':
				spawnPlayerCmd({scene, x: o.x, y: o.y});
				break;
			case 'enemy':
				this.spawnMarker(scene, o);
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

	// Tile-object dispatch — the `enemies` separate-image tileset
	// marks spawn points. `gid & 0x1FFFFFFF` strips Tiled's flip
	// flags; the tile's custom `key` property names the Enemies row.
	placeTileObject(scene, map, o) {
		const gid = o.gid & 0x1FFFFFFF;
		const ts = map.tilesets.find(t =>
			gid >= t.firstgid && gid < t.firstgid + t.total);
		const props = ts?.getTileProperties(gid - ts.firstgid);
		if (Enemies[props?.key]) {
			this.spawnMarker(scene, o, props);
		}
	},

	// One spawn marker → `spawnCount` enemies on the free tiles
	// nearest it. `activationRadius` starts them dormant; 0 (or
	// missing) = awake on sight. Tile objects take defaults from
	// the marker tile's own properties; per-instance object
	// properties always win. `key` falls back to `type` for plain
	// named 'enemy' rects on old maps.
	spawnMarker(scene, o, tileProps = {}) {
		const key = this.propOf(o, 'key')
			?? tileProps.key ?? this.propOf(o, 'type');
		if (!Enemies[key]) return;
		const count = this.propOf(o, 'spawnCount')
			?? tileProps.spawnCount ?? 1;
		const activationRadius = this.propOf(o, 'activationRadius')
			?? tileProps.activationRadius ?? 0;
		this.scatterSpots(scene, o.x, o.y, count).forEach(spot =>
			spawnEnemyCmd({
				scene, key, x: spot.x, y: spot.y, activationRadius,
			}));
	},

	// `count` free tiles nearest the marker, so a pack reads as a
	// pack. The tiles are consumed — the next marker and the
	// crystal scatter can't land on a spot already taken. A
	// boxed-in marker falls back to its own spot rather than
	// silently spawning nothing.
	scatterSpots(scene, x, y, count) {
		const pool = scene.freeTiles ?? [];
		pool.forEach(t => {
			t.d = dist(x, y, t.x, t.y);
		});
		pool.sort((a, b) => a.d - b.d);
		const near = pool.splice(0, count);
		return near.length ? near : [{x, y}];
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
		// a second layer is the hazard sheet — the stub only knows
		// water pools (index 3)
		const hazardLayer = map.createBlankLayer(
			'hazard', tiles, 0, 0, W, H, 16, 16);
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				if (data[y][x] === 3) {
					hazardLayer.putTileAt(3, x, y).properties =
						{hazard: 'water'};
				}
			}
		}
		bindLevel({wallLayer: layer, hazardLayer});
		// stub has no ground layer — hazardUnder treats every
		// hazard-prop tile as bare hazard
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
		scene.freeTiles = floor;
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
