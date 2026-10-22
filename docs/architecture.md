# Wasteland Chronicles — Architecture

Companion to `game.md` (the design doc). This document describes how the
game is built: file layout, scenes, entities (ECS), commands, systems,
data schemas, and the level-authoring pipeline. Read this before writing
code.

## Constraints

- Phaser 4 + Arcade physics. Web target via Vite; also builds for
  Phaser Desktop, which requires **no modules** — every file is a
  script-tag global. The Vite concat plugin merges `src/` into
  `wasteland-chronicles.js` in alphabetical order, so folder names are
  numbered to control load order.
- Entity structure uses **Geotic ECS** — but vendored as a global
  script (`src/00_libraries/01_geotic.js`), so the no-modules rule
  still holds. See "Vendor step" under File layout.
- Teaching project: optimize for readability. Short functions, heavy
  comments, all game balance lives in `03_data/` as plain objects that
  students can edit without touching logic.
- Placeholder shapes now (colored rectangles/circles generated at
  boot), frame-animated sprites later. Code always references final
  asset keys so swapping art never touches logic.
- Keyboard + mouse **and** gamepad are required. All input goes
  through one abstraction layer.
- Progress persists across sessions via `localStorage`.

## File layout

```
src/
  00_libraries/00_ui/      existing submodule: UI, UIButton, UIInput,
                           UILabel, UIRegister
  00_libraries/01_geotic.js  vendored Geotic bundle — an IIFE that
                           defines the `Geotic` global (see below)
  01_global/               tiny shared helpers
    ecs.js                 `const ECS = new Geotic.Engine()` + helpers
    math.js                angle/cone/distance helpers
    los.js                 tilemap line-of-sight raycast
    weighted.js            weighted random pick
    attacklib.js           attack pos/shape/pattern/LOS helpers
    placeholder.js         generates colored shape textures at boot
  02_config/
    game.js                sizes, colors, physics + balance constants
    input.js               action → key/gamepad binding table
  02_components/           geotic Component classes — one class per
                           file, each self-registers via
                           `ECS.registerComponent` at load
    Rendered.js  Damageable.js  Allied.js  Moveable.js
    Controllable.js  Mutated.js  Consumable.js  Slotted.js
    Powered.js  Evasive.js  Armored.js  Attuned.js  Luminous.js
    Armed.js  Ballistic.js  Autonomous.js  Swallowing.js
    Spawning.js  Bossy.js  Launchable.js  Flippable.js
    StatusCarrying.js
    Timed.js                 marker base + its one-line flag
                             subclasses — Staggered, KnockedDown,
                             Grabbed, Feared, Silenced, Entangled,
                             Invulnerable, Burrowed, Launched — plus
                             FLAG_COMPONENTS (helpers live with
                             their main class)
  03_data/                 pure data, no logic — numbered subfolder
                           per table, ONE ELEMENT PER FILE. The table
                           file (PascalCase, sorts first) creates the
                           empty table; element files self-register:
                           `Enemies.rat = {...}`
    01_crystals/           Crystals.js then hand.js, red.js, ...,
                           punch.js (11 files)
    02_abilities/          Abilities.js then fortitude.js, sealed.js,
                           ..., bomb.js, ... (21 files; assign into
                           `.passives` / `.actives`)
    03_enemies/            Enemies.js then rat.js, bat.js, ... (20)
    04_bosses/             Bosses.js then wolf.js, worm.js, ... (8)
    05_props/              Props.js then one file per prop
    06_terrains/           Terrains.js then one file per terrain (7)
    07_levels/             Levels.js then level01.js ... level24.js
    08_worldmap/           WorldMap.js — node graph for the map screen
    09_prefabs/            Prefabs.js then player.js, enemy.js,
                           boss.js, projectile.js
    10_cutscenes/          one file per timeline — IntroScene.js, ...
  04_systems/              scene-driven runtime, split in two
    01_queries/            the world-query table + per-frame loops
                           that tick over it (entity modifiers)
      createQueries.js     ALL world queries in one file
      PlayerSystem.js      input → intent + commands
      TerrainSystem.js     tile under mover → effects
      MovementSystem.js    intent → velocity/anim
      ProjectileSystem.js  pattern motion, expiry
      StatusSystem.js      effect ticks, flag expiry
      EnemyAI.js           weighted state machine
      WaveDirector.js      boss minion waves
      Darkness.js          vision radius mask
    02_managers/           event-driven services — every file is
                           *Manager.js
      InputManager.js      unified KBM + gamepad
      LevelManager.js      map load, doors, exit
      SaveManager.js       localStorage
      CrystalManager.js    random crystal placement per level
      TimelineManager.js   cutscene sequencer
      AudioManager.js      sound/music keys + helpers
  05_commands/             the game's verbs — one global `*Cmd`
                           function per file, `verbCmd(payload)`
    resolveHitCmd.js  executeAttackCmd.js  addStatusCmd.js  dieCmd.js
    despawnCmd.js  spawnPlayerCmd.js  spawnEnemyCmd.js
    spawnProjectileCmd.js  spawnMeleeboxCmd.js  pickupCrystalCmd.js
    gainAbilityCmd.js  useActiveCmd.js  cycleHotbarCmd.js
    launchEntityCmd.js  flipEntityCmd.js  grabEntityCmd.js
    damagePropCmd.js  explodePropCmd.js  sealDoorsCmd.js
    openDoorsCmd.js  enterArenaCmd.js  completeLevelCmd.js
    retryLevelCmd.js  saveProgressCmd.js  swallowProjectileCmd.js
    reaction listeners:  stopWavesCmd.js  checkLevelClearCmd.js
      hudRefreshCmd.js  playSfxCmd.js
    99_specials/           one `*Cmd` per boss special + the map
      BossSpecials.js      `const BossSpecials = {}` (uppercase sorts
                           before the lowercase `*Cmd` files)
      suckerTongueCmd.js  maulCmd.js  poundDownCmd.js  ...  each
                           file ends `BossSpecials.wolf =
                           suckerTongueCmd`
    wireReactions.js       `wireReactions(game)` — broadcast → command
                           subscription table
  10_scenes/
    Boot.js  Menu.js  Playing.js  Hud.js  Pause.js  Map.js
    LevelComplete.js  AbilityPick.js  Death.js  Victory.js
    Cutscene.js  Settings.js
  main.js                  Phaser config + scene list (loads last)
```

Naming rule: **one class or function per file, and the file name
matches the symbol exactly** (`resolveHitCmd.js`, `Rendered.js`).
Components are adjectives describing what the entity *is*
(`Rendered`, `Armored`, `Evasive`) — the geotic accessor is the
lowercase form (`entity.armored`). Every folder in `src/` starts
with a two-digit number — the concat
is alphabetical and folders may nest (only `assets/` is exempt: the
loader fetches it, order-free). Exceptions to one-per-file: helper
data-structure classes live with their main class (`Timed.js`
carries the flag markers + `FLAG_COMPONENTS`); loose helpers may
group in `01_global/` and `02_config/`; `03_data/` element files
are named for the key they assign (`rat.js` → `Enemies.rat`).

Load order rules:

- **Only file-load-time references constrain order.** Function/method
  bodies resolve globals at call time, so by scene runtime order is
  irrelevant. The actual chain: `Geotic` (00) → `ECS` engine (01) →
  component classes + `registerComponent` (02) → `09_prefabs/`
  element files' component refs (03).
- This is why data never holds function references — `03_data/` loads
  before `05_commands/`, so `special:` can't name a command. Bosses
  carry a `key`; `BossSpecials` maps it to the function (see below).
  Same rule inside `99_specials/` and every `03_data/` subfolder:
  `BossSpecials.js` / `Enemies.js` sort before the lowercase element
  files, so each file self-registers into them. That is the third
  use of the self-registration pattern (components, specials, data).
- NB `02_components/` sorts before `02_config/` — keep `static
  properties` literal; read `CFG` inside methods (call-time is fine).
- `main.js` is always last.

Vendor step (once, then whenever geotic upgrades):

```
yarn add geotic
yarn add -D esbuild
esbuild node_modules/geotic --bundle --format=iife \
  --global-name=Geotic --outfile=src/00_libraries/01_geotic.js
```

Wire this as a `vendor:geotic` script in `package.json`.

## Scenes

`Playing` owns the world. Overlay scenes run in parallel via
`scene.launch` while `Playing` sleeps (`scene.sleep` pauses physics,
timers, and update). `Hud` is a separate always-on-top scene so it
keeps drawing while `Playing` is paused.

```
Boot → Menu → [Cutscene: intro] → Playing ⇄ Hud
                                   ├─ Pause (overlay; character sheet)
                                   ├─ Map (overlay)
                                   ├─ LevelComplete → AbilityPick
                                   ├─ Death → restart Playing (same level)
                                   └─ boss dead at level 24 → Victory
Settings ← Menu or Pause
Cutscene ← before level 1 (first run), optional boss intros, victory
```

## Data schemas

Each table lives in a numbered subfolder: the table file creates the
empty object (`const Enemies = {}` in `Enemies.js`) and each element
file assigns one key (`Enemies.rat = {...}` in `rat.js`). Adding an
entry = adding a file; table files never change. Keys match
animation, icon, and asset names by convention.

**JSON instead?** No — JS data wins three ways: comments (the "why"
of balance numbers matters, especially for students), `Infinity`
(hand/punch `uses` isn't representable in JSON), and zero async —
script-tag globals just exist, while JSON would go through Phaser's
asset loader and `file://` fetches break on Phaser Desktop. JSON is
still right for *tool-generated* data: the Tiled maps from
`tools/spritefusion2tiled`.

**Modding?** A mod is just another script tag —
`document.createElement('script')` has no CORS problem where
`fetch('file://')` does, and a JS mod can ship *behavior* (a new
`BossSpecials` entry, a pattern kind) while JSON can only fill
existing schema slots. The tables are plain objects, so a
`modLoader` that merges an external pack stays additive later —
this decision forecloses nothing.

### 01_crystals/

One file per crystal. Melee and ranged share `uses`, `cooldown`,
`cost`, `pos`, and `anim`; melee Mutation cost = `cost / 3`.

```js
// 01_crystals/Crystals.js — the table, loads first
const Crystals = {};

// 01_crystals/hand.js — innate
Crystals.hand = {
		name: 'Hand',
		uses: Infinity,
		cooldown: 0.5,
		cost: 0.1,
		pos: 'FC',
		anim: 'attack-hand',
		icon: 'icon-hand',
		melee: {
			dmg: 20,
			accuracy: 84,
			shape: {kind: 'rect', size: 'XS'},
			pattern: {kind: 'single'},
		},
		ranged: {
			dmg: 10,
			accuracy: 50,
			speed: 500,
			shape: {kind: 'bullet'},
			pattern: {kind: 'single'},
		},
};

// 01_crystals/red.js
Crystals.red = {
		name: 'Forearm',
		uses: 64,
		cooldown: 0.33,
		cost: 0.2,
		pos: 'FC',
		anim: 'attack-forearm',
		icon: 'icon-red',
		melee: {
			dmg: 40,
			accuracy: 88,
			shape: {kind: 'rect', size: 'XS'},
			pattern: {kind: 'cone', degrees: 120},
		},
		ranged: {
			dmg: 20,
			accuracy: 60,
			speed: 600,
			shape: {kind: 'bullet'},
			pattern: {kind: 'fan', count: 5, degrees: 60},
		},
};
// ...black.js, orange.js, yellow.js, green.js, blue.js,
// purple.js, white.js

// 01_crystals/punch.js — fallback below 5% Mutation, melee only
Crystals.punch = {
		name: 'Punch',
		uses: Infinity,
		cooldown: 0.5,
		cost: 0,
		pos: 'FC',
		anim: 'attack-punch',
		icon: 'icon-punch',
		melee: {
			dmg: 5,
			accuracy: 90,
			shape: {kind: 'rect', size: 'XXS'},
			pattern: {kind: 'single'},
		},
};
```

`pattern` is the only structurally open field. Kinds needed by the
design doc:

- `single` — one hitbox/projectile
- `cone {degrees}` — melee wedge: all targets within range and angle
- `fan {count, degrees}` — spread of projectiles
- `ring {count}` — projectiles in all directions (random for White:
  `{count: 16, random: true}`)
- `pierce` — projectile passes through every target it hits
- `bounce {count}` — projectile reflects off obstacles N times
- `chain {count}` — jumps to next enemy, each hop shorter than the last
- `aoe {radius}` — point-blank burst around attacker or impact point
- `launch {radius, dmgMult}` — Green kick: victim becomes a projectile
- `fragments {count, dmgMult, rangeMult}` — White ranged: child
  projectiles on impact
- `lob {lingerSecs}` — parabolic (P) arc to the target point; optional
  ground linger turns it into a temporary hazard (Goo Bomb)
- `mine {triggerRadius}` — dropped (D), sits until touched
- `beam` — ray (Y): line check each active frame
- `global` — (G) hits every enemy currently on screen
- `volley {strikes, delay}` — boss/enemy melee combos
- `grab` — scripted grab (Talon Grab, Hurl Plaything, Brutal Pounce)

### 02_abilities/

```js
// 02_abilities/Abilities.js — two sub-tables
const Abilities = {passives: {}, actives: {}};

// 02_abilities/fortitude.js
Abilities.passives.fortitude = {
	name: 'Fortitude', stat: 'maxHealth', mult: 1.10,
};

// 02_abilities/sealed.js
Abilities.passives.sealed = {name: 'Sealed', stat: 'decay', set: 0.05};
// ...11 passives total; each maps to one stat modifier or chance roll

// 02_abilities/bomb.js
Abilities.actives.bomb = {
	name: 'Bomb',
	key: '1',
	cost: 4,
	cooldown: 2,
	pos: 'TF',
	attack: {
		dmg: 30,
		accuracy: 75,
		speed: 300,
		shape: {kind: 'bullet'},
		pattern: {kind: 'aoe', radius: 16},
	},
};
// ...armor, rage, heal, charge, beam, flip, mine, antenna,
// mutilate (10 actives total incl. innate Bomb)
```

Non-attack actives (Armor, Rage, Heal, Antenna) use `effect` instead
of `attack`, e.g. `{effect: {status: 'armor', amount: 0.25,
duration: 5}}`.

### 03_enemies/

```js
// 03_enemies/Enemies.js
const Enemies = {};

// 03_enemies/rat.js
Enemies.rat = {
		name: 'Rat',
		health: 65,
		speed: 160,
		style: 'walk',       // maneuver style: fly|leap|burrow|walk
		reveal: 2,           // first level it may appear (author guide)
		anim: 'rat',
		attack: {
			name: 'Chew Through',
			dmg: 40,
			cooldown: 0.2,
			pos: 'FT',
			shape: {kind: 'rect', size: 'XS'},
			pattern: {kind: 'single'},
			channel: true,   // does not disengage once started
		},
};
// ...20 files; attack.effects carries status payloads:
// effects: [{status: 'dot', amount: 10, duration: 5}]
```

### 04_bosses/

`Bosses.js` + one file per boss (`Bosses.wolf = {...}`). Same shape
as enemies plus `attacks[]` (each with `weight` and optional
`invulnerable`), `minions` (`spt` count + type key), and `arena`
hint. The `Spd` column in the doc maps to `speed` for projectiles or
`strikeDelay` inside a `volley` pattern. Bespoke boss attacks are
*not* referenced from the def — EnemyAI looks the boss's `key` up in
`BossSpecials` (`05_commands/99_specials/BossSpecials.js`), which maps
to the `*Cmd` function.

### 07_levels/

Keyed table — progression order lives in the worldmap links, so the
key is the level's identity (no redundant `key:` field).

```js
// 07_levels/Levels.js
const Levels = {};

// 07_levels/level01.js
Levels.level01 = {
		name: 'Shallow Dark',
		map: 'map01',          // asset key for the Tiled JSON
		boss: null,
		crystals: {            // ground scatter: counts per type
			cyan: {S: 6, M: 3, L: 1}, // sizes restore 30/60/90
			black: 3,
			red: 1,
		},
};
// ...24 files; boss levels set boss: 'wolf' etc.
```

Enemies, props, doors, the exit, and light sources all come from the
map's object layers — only crystals and boss minions spawn
procedurally.

### 08_worldmap/

```js
const WorldMap = {
	nodes: [ // ids are keys into the Levels table
		{id: 'level01', x: 40, y: 300, to: ['level02']},
		// ...
	],
};
```

The map screen draws nodes + links; visited nodes render a low-detail
miniature of their tilemap (drawn to a `RenderTexture` at small
scale), unvisited nodes are dimmed/partially obscured.

## Entities (ECS)

Geotic gives us three primitives: **components** (state + small
entity-local API), **queries** (named filters over the world's
entities), and **entities** (bags of components). Around those we
layer two conventions of our own: **commands** (the game's verbs) and
**broadcasts** (facts on `game.events`).

### The layer rules

- **Components** hold state and answer questions about their own
  entity. Thin APIs — `damageable.apply(n)`, `armored.mitigate(n)`,
  `evasive.roll()`. A component may read sibling components on the same
  entity (`this.entity.statusCarrying`) but never reaches across
  entities and never emits events.
- **Commands** are the only code allowed to know about more than one
  component type. Every transaction — a hit, a pickup, a level
  transition — is one named global function, `verbCmd(payload)`, in
  `05_commands/`. Calls flow *down* (command → component APIs).
- **Systems** run per-frame over a query. They hold no entity-specific
  behavior; they write `intent` into components or call commands.
- **Broadcasts** announce facts on `game.events` (past-tense names:
  `died`, `picked-up`). Subscriptions live in one table,
  `wireReactions(game)` — see Events & wiring. Events flow *up*.
- **Commands branch on capabilities, never identities.**
  `entity.has(Invulnerable)`, `target.dodge?.roll()`, def fields —
  never `def.name === 'rat'`. This is what keeps a new enemy from
  touching command code.

Dependency direction: broadcasts/systems → commands → components.

### Geotic primer (the API surface we actually use)

```js
// 01_global/ecs.js — the one engine, created at file-load
const ECS = new Geotic.Engine();

// a component is a class with static `properties` (defaults)
class Damageable extends Geotic.Component {
	static properties = {value: 100, max: 100};
	apply(n) { this.value = Phaser.Math.Clamp(this.value + n, 0, this.max); }
	dead() { return this.value <= 0; }
}
ECS.registerComponent(Damageable); // done at the bottom of each comp file

// Playing.create — one world per level run
this.world = ECS.createWorld();
const e = this.world.createEntity();
e.add(Damageable, {max: 65, value: 65});
e.damageable.apply(-10);      // geotic exposes comps as lowercase props
e.has(Invulnerable);          // boolean
e.remove(e.staggered);        // pass the instance
e.destroy();

// queries auto-update as components come and go
const movers = this.world.createQuery({
	all:  [Rendered, Moveable],
	none: [Staggered, KnockedDown, Grabbed, Entangled],
});
movers.get().forEach(e => { /* per-frame work */ });
```

Geotic features we deliberately **do not use**:

- `entity.fireEvent` — dispatch order is component *attachment*
  order with no priority, so runtime-added components (level-up
  passives!) would run late. Ordering must live in code anyway, so
  commands enumerate modifiers explicitly. Escape hatch if the
  on-hit modifier set ever explodes.
- Geotic prefab registry — our own `03_data/09_prefabs/` recipes keep
  composition visible next to the def data.
- `world.serialize` — SaveManager owns the (much smaller) save schema.

### Entity ↔ sprite bridge

Every entity that appears on screen carries `Rendered{sprite, anim}`;
every arcade sprite stores `sprite.setData('eid', entity.id)`. Physics
callbacks receive sprites, resolve the entity, and call a command:

```js
onProjectileHit(projSprite, targetSprite) {
	const target = this.world.getEntity(targetSprite.getData('eid'));
	resolveHitCmd({attacker: ..., target, attack: projSprite.getData('attack')});
}
```

Destroy order is one-way: `despawnCmd` calls `entity.destroy()` then
recycles the sprite (`disableBody` into the pool for projectiles,
`destroy()` for the rest). Never kill a sprite without its entity.

### What is an entity vs a plain object

**Entities**: creatures (player, enemies, bosses) and projectiles —
the things with rich component interplay. **Plain Phaser objects**:
pickups, doors, exit/arena/light zones, melee hitboxes, props —
stateless triggers or simple `hp`-in-data objects handled by commands
directly. ECS only where composition pays.

### Component catalog (`02_components/`)

Core

| Component     | Fields                        | API                                   |
|---------------|-------------------------------|---------------------------------------|
| Rendered      | `sprite`, `anim`              | `face(dir)`, `playAnim()`, `pos()`    |
| Damageable    | `value`, `max`                | `apply(n)` (clamped), `dead()`        |
| Allied        | `id` — player\|enemy\|allied  |                                       |
| Moveable      | `speed`, `facing`, `intent{x,y}`, `terrainMult` | `effectiveSpeed()` — reads siblings (slow, rage, terrain) |

Player

| Component        | Fields                          | API                              |
|------------------|----------------------------------|----------------------------------|
| Controllable     | *(marker)*                       |                                  |
| Mutated          | `value`, `max`, `decayRate`      | `spend(n)`, `canAfford(n)`, `refill(n)` |
| Consumable       | `uses` — `{crystalKey: n}`       | `spend(key)`, `add(key, n)`, `left(key)` |
| Slotted          | `attacks[]`, `actives[]`, `mode`, `sel` | `cycle()`, `slot(i)`, `current()` |
| Powered          | `passives[]`, `cds{}`            | `grant(key)`, `ready(key)`, `tickCd(dt)` |
| Evasive          | `pct`                            | `roll()` → bool                  |
| Armored          | `mult`, `endsAt?`                | `mitigate(amount)`               |
| Attuned          | `blocksLeft`                     | `block(amount)` → post-block amt |
| Luminous         | `radius`                         |                                  |

Combat

| Component      | Fields                                              | API                              |
|----------------|-----------------------------------------------------|----------------------------------|
| Armed          | `list[]` (defs), `idx`, `stash`                     | `current()`, `swapTemp(def)`, `revert()` — Regurge Surge swaps in the swallowed def (`uses: 1`), reverts after firing |
| Ballistic      | `team`, `dmg`, `accuracy`, `effects`, `hitsLeft`, `bouncesLeft`, `chainLog`, `expiry`, `swallowable` | |
| Swallowing     | `captured` — swallowed attack def or null           | worm capability marker           |
| Spawning       | `spt`, `family`, `nextAt`                           |                                  |
| Bossy          | `key`, `arena`                                      |                                  |
| Launchable     | *(marker)* — absent on size ≥ 3 and bosses          |                                  |
| Flippable      | *(marker)* — same rule                              |                                  |

Status

| Component      | Fields                              | Notes                            |
|----------------|-------------------------------------|----------------------------------|
| StatusCarrying | `effects[]` — `{key, endsAt, amount, tickMs, stacks}` | `add(def)`, `has(key)`, `mult(stat)`; ticked by StatusSystem |
| Timed          | `endsAt` — base class for flags     | subclasses are one-line markers  |
| Staggered, KnockedDown, Feared, Silenced, Entangled, Invulnerable, Burrowed | `endsAt` | flag markers: systems query them by type, which is why they're separate classes |
| Grabbed        | `endsAt`, `dir`, `taps`             | wiggle-free counter              |
| Launched       | `endsAt`, `dmg`                     | entity is currently a projectile |

### Prefab recipes (`03_data/09_prefabs/`)

Recipes are `[ComponentClass, props]` pairs assembled per archetype —
visible data, not hidden in geotic's registry. Same self-registration
pattern: `Prefabs.js` creates the table, one archetype per file.
`spawn*Cmd` applies them, creates the sprite, sets `eid`, and joins
physics groups.

```js
// 09_prefabs/Prefabs.js
const Prefabs = {};

// 09_prefabs/player.js
Prefabs.player = () => [
		[Controllable, {}],
		[Rendered,  {anim: 'xavier'}],
		[Damageable,  {value: CFG.hp, max: CFG.hp}],
		[Allied,      {id: 'player'}],
		[Moveable,    {speed: CFG.speed}],     // 140
		[Mutated,     {value: 100, max: 100, decayRate: 0.1}],
		[Consumable,  {uses: {hand: Infinity}}],
		[Slotted,     {}],
		[Powered,     {actives: {bomb: 0}}],
		[Armed,       {list: [Crystals.hand, Crystals.punch]}],
		[StatusCarrying, {}],
		[Luminous,    {radius: CFG.lightRadius}],
];

// 09_prefabs/enemy.js
Prefabs.enemy = (def) => [
		[Rendered,  {anim: def.anim}],
		[Damageable,  {value: def.health, max: def.health}],
		[Allied,      {id: 'enemy'}],
		[Moveable,    {speed: def.speed}],
		[Autonomous,  {style: def.style}],
		[Armed,       {list: [def.attack]}],
		[StatusCarrying, {}],
		// capability-derived comps — the branch-on-capabilities rule
		...(def.style === 'fly'  ? [[Evasive, {pct: 15}]] : []),
		...(def.size < 3         ? [[Launchable, {}], [Flippable, {}]] : []),
		...(def.swallow          ? [[Swallowing, {}]] : []),
];

// 09_prefabs/boss.js
Prefabs.boss = (def) => [
		...Prefabs.enemy(def),
		[Bossy,        {key: def.key, arena: def.arena}],
		[Armed,       {list: def.attacks}],
		...(def.minions ? [[Spawning, {spt: def.minions.spt, family: def.minions.type}]] : []),
];

// 09_prefabs/projectile.js
Prefabs.projectile = (attack, team) => [
		[Rendered,  {anim: attack.icon}],
		[Ballistic,   {team, ...attackToBallistic(attack)}],
];
```

`Autonomous` (`{style, state, until, decisionAt, maneuverTo}`) is in
`Autonomous.js` like every component — enemy defs add it via the
`enemy` recipe; the player never gets one.

Adding a new enemy is one new file in `03_enemies/` and nothing
else: the `enemy` recipe maps def fields to components generically.
Adding a new *capability* adds a component file + a recipe line + at
most a few lines in the commands that consume it.

## Systems

`04_systems/` splits by shape: **`01_queries/`** — the query table
plus every per-frame loop that ticks over it, the only code that
modifies entities each frame; **`02_managers/`** — event-driven
services, every file `*Manager.js`. Pure helpers (`attacklib.js`)
live in `01_global/`. Systems write `intent` into components and
call commands — they hold no entity-specific behavior. **All queries
are declared in `04_systems/01_queries/createQueries.js`** —
queries update themselves as components are added/removed, so a
missing component silently excludes an entity. When an entity "does
nothing", this file is the checklist.

```js
const createQueries = (world) => {
	const q = {
		player:      world.createQuery({all: [Controllable, Rendered]}),
		movers:      world.createQuery({all: [Rendered, Moveable],
			none: [Staggered, KnockedDown, Grabbed, Entangled]}),
		ai:          world.createQuery({all: [Autonomous, Rendered],
			none: [Staggered, KnockedDown, Grabbed]}),
		projectiles: world.createQuery({all: [Ballistic, Rendered]}),
		carriers:    world.createQuery({all: [StatusCarrying]}),
		waves:       world.createQuery({all: [Spawning]}),
		lights:      world.createQuery({all: [Luminous, Rendered]}),
	};
	// one query per timed flag marker for StatusSystem's expiry sweep
	FLAG_COMPONENTS.forEach(C => {
		q[C.name] = world.createQuery({all: [C]});
	});
	return q;
};
```

`FLAG_COMPONENTS` is the list of timed markers exported by
`02_components/Timed.js` — the same array StatusSystem sweeps.

### InputManager (`04_systems/02_managers/InputManager.js`)

Actions: `moveX`, `moveY` (axes), `aim` (mouse position, arrow-key
rotation, or right-stick), `attack`, `special`, `zoomIn/Out`,
`cycleAttack`, `cycleSpecial`, `toggleBar`, `slot0..9`, `map`,
`pause`, plus UI nav (`confirm`, `back`, `uiUp/Down/Left/Right`).

- One bindings table in `02_config/input.js` per device.
- Aim resolution order: right-stick if deflected → arrow keys rotate a
  persistent aim angle → else mouse position.
- Every consumer reads actions, never raw keys → gamepad support is
  automatic everywhere.

### PlayerSystem (`04_systems/01_queries/PlayerSystem.js`)

Query `player`. Each frame: read InputManager → write
`moveable.intent` → tick `mutated` decay → route button actions to
commands (`attack` → `executeAttackCmd`, `special` → `useActiveCmd`,
`cycleAttack`/`slot*` → `cycleHotbarCmd`).

### TerrainSystem (`04_systems/01_queries/TerrainSystem.js`)

Query `movers`. Tile under the entity → terrain def → set
`moveable.terrainMult`, apply ice drag, and lava ticks via
`resolveHitCmd({direct: true})`. Burrowed entities skip everything
except lava.

### MovementSystem (`04_systems/01_queries/MovementSystem.js`)

Query `movers`. `body.velocity = intent × effectiveSpeed()`
(`effectiveSpeed` reads StatusCarrying slow/rage + `terrainMult` +
`baseSpeed`), then `rendered.face()` and walk-anim selection from
velocity — 8-dir motion → 4-dir anim, diagonal keeps last cardinal,
`flipX` for left. Cheap flocking: `ai` entities add a separation
vector from neighbors.

### AttackLib (`01_global/attacklib.js`)

Pure helpers — no tick. Called by `executeAttackCmd` and AI.

- `resolvePos(code, facing, body)` — 13 position codes → perimeter
  point; the ring TF→TC→TR→RT→RC→RB→BR→BC→BF→FB→FC→FT plus `C`.
- `makeBody(shape)` — rect from the size tier table (8px tall), `Cn`
  circles, projectile, beam line, or global marker.
- `spawnForPattern(attack, attacker, aim)` — dispatches on
  `pattern.kind`, calling `spawnProjectileCmd`/`spawnMeleeboxCmd`.
- `coneSelect(attacker, aimPoint)` — nearest enemy inside a ~30° cone
  with tilemap LOS (`los.js`); picks melee vs ranged for the pair.
- Accuracy (player only): per-target roll; ranged accuracy decays
  linearly to −50% at max range; missed projectiles pass through
  (`ignoreTargets` set on the sprite).
- No melee through walls: every melee target must pass the `los.js`
  check before `resolveHitCmd` is called, regardless of overlap.

### ProjectileSystem (`04_systems/01_queries/ProjectileSystem.js`)

Query `projectiles`. Per-frame pattern motion only: bounce/chain
bookkeeping (`bouncesLeft`, `chainLog`), `hitsLeft` for pierce, lob
arcs (gravity on those bodies), `expiry` → `despawnCmd`.

### StatusSystem (`04_systems/01_queries/StatusSystem.js`)

Query `carriers` + every flag-marker query. Ticks StatusCarrying
effects: `dot` variants (burn/poison/bleed/rot/acid) call
`resolveHitCmd({direct: true})` — no dodge, still mitigated; regen
applies; expiry and stacking policy in `StatusCarrying.add`. Sweeps
timed flag markers by `endsAt` → `entity.remove`. Acid (Skunk) is a
`dot` with `untilCleanse: water|crystal`.

### EnemyAI (`04_systems/01_queries/EnemyAI.js`)

Query `ai`. Weighted state machine; state + timers live in the
entity's `Autonomous` component. Decision tick (~0.25s) picks among:
`attack` (w 2), `maneuver` (w by style: fly 1, leap .9, burrow .6,
walk .5), `lickWounds` (w .3, ×0 at high HP). States are interruptible
by stagger/knockdown/grab channel rules.

- `attack` — close to range (or LOS for ranged), call
  `executeAttackCmd` on `armed.current()`.
- `maneuver` — destination angle per style (walk→front, leap→sides,
  burrow→behind, fly→any), stop at max maneuver time.
- Style movement: fly = free 8-dir (Evasive component added at spawn) +
  ignores terrain except lava; leap = hop arcs; burrow = toggles
  `Burrowed` + `Invulnerable`, keeps wall collision, sinks sprite;
  walk = direct chase.
- `lickWounds` — retreat point, regen status over 5s.
- Bosses: `BossSpecials[entity.bossy.key]?.(payload)` replaces the
  generic attack pick when the boss has a special; attack defs with
  `invulnerable: true` add/remove `Invulnerable` around their
  channel.

### WaveDirector (`04_systems/01_queries/WaveDirector.js`)

Query `waves`. Keeps `spt` minions of the boss's family type alive;
5s after a full wipe, spawns the next wave at arena edge points via
`spawnEnemyCmd`. Map-placed enemies spawn once at level start (see
LevelManager), not through here.

### CrystalManager (`04_systems/02_managers/CrystalManager.js`)

Setup-time function (not a tick). Rolls `level.crystals` counts,
picks random floor tiles (colliding = false, away from walls and the
player start, not in water unless allowed), places pickup objects.

### LevelManager (`04_systems/02_managers/LevelManager.js`)

- Loads Tiled JSON: layers `ground`, `terrain`, `props`, `objects`.
- Instantiates map objects: `playerStart` → `spawnPlayerCmd`, `enemy`
  → `spawnEnemyCmd`, `prop`/`door`/`exit`/`bossArena`/`light` → plain
  zone/prop objects.
- Exit zone → `completeLevelCmd`; `bossArena` enter → `enterArenaCmd`
  (seal doors, spawn boss); `died` on a boss → `openDoorsCmd` (wired).

### SaveManager (`04_systems/02_managers/SaveManager.js`)

`localStorage['wc-save']`, versioned:

```js
{
	v: 1,
	playerLevel: 3,
	maxHealth: 121, maxMutation: 121,
	passives: ['fleetfoot'],
	actives: ['bomb', 'heal'],
	ammo: {black: 40, red: 64},
	hotbar: {attacks: [...], actives: [...]},
	currentLevel: 'level04',
	visited: ['level01', 'level02', 'level03'],
	seenIntro: true,
	settings: {sfx: 1, music: 1, zoom: 2},
}
```

Written on level complete, ability pick, settings change, quit to
menu (each via its `*Cmd`). Reads the player's components on write —
not `world.serialize`.

### Darkness (`04_systems/01_queries/Darkness.js`)

A `RenderTexture` over the camera filled near-black each frame; a
radial-gradient sprite punches a hole at the player (`luminous.radius` ×
Nightvision), smaller holes at `light` map objects and bright
projectiles (`blendMode ERASE`). Iterates the `lights` query.
Gradient is smooth (non-pixelated) per the art direction.

### TimelineManager (`04_systems/02_managers/TimelineManager.js`)

Cutscene sequencer; data is a flat list of steps, one file per
timeline in `03_data/10_cutscenes/`:

```js
// 10_cutscenes/IntroScene.js
const IntroScene = [
	{do: 'spawn', key: 'xavier', at: [120, 80]},
	{do: 'fade', from: 1, to: 0, secs: 1.5},
	{do: 'say', name: 'Xavier', text: 'Where... am I?'},
	{do: 'move', key: 'xavier', to: [160, 80], secs: 2},
	{do: 'play', key: 'xavier', anim: 'wake'},
	{do: 'wait', secs: 1},
	{do: 'parallel', steps: [/* simultaneous sub-steps */]},
	{do: 'end', next: 'Playing'},
];
```

`Cutscene` scene steps through it; `say` blocks on confirm; any key
skips the whole scene after a hold-confirm.

### AudioManager (`04_systems/02_managers/AudioManager.js`)

Thin wrapper: `playSfx(key)`, `playMusic(key)` honoring
`save.settings` volumes. Placeholder silence/tones until students
deliver sounds.

## Commands (`05_commands/`)

The game's verbs — every transaction is one named global function,
`verbCmd(payload)`, in its own file. `05_commands/` reads as a table
of contents of everything the game can do.

Rules:

- **One payload object**, `{entity, target, attack, scene, ...}` —
  works as a direct call and as a `game.events` listener.
- **Commands are the only code allowed to know about more than one
  component type.** Orchestration lives here; components expose
  entity-local APIs (`armored.mitigate(n)`, `consumable.spend(key)`).
- **Branch on capabilities, never identities** — `target.has(X)`,
  `target.evasive?.roll()`, def fields. Never `def.name === 'rat'`.
- **Call directly when the verb is known** (a projectile overlap
  knows it's a hit); subscribe via `wireReactions` only when the
  notifier shouldn't know its reactors.
- **Bespoke enemy/boss behavior lives in `05_commands/99_specials/`** —
  each special file defines its `*Cmd` then self-registers
  (`BossSpecials.wolf = suckerTongueCmd`); `BossSpecials.js` just
  creates the empty map and sorts first (uppercase beats lowercase).
  EnemyAI does
  `BossSpecials[entity.bossy.key]?.(payload)`. Data stays pure and
  load order never bites.

Command roster (grouped; each file name = its function name):

- **Combat**: `resolveHitCmd`, `executeAttackCmd`, `addStatusCmd`,
  `dieCmd`, `swallowProjectileCmd`, `launchEntityCmd`, `flipEntityCmd`,
  `grabEntityCmd`
- **Entity lifecycle**: `spawnPlayerCmd`, `spawnEnemyCmd`,
  `spawnProjectileCmd`, `spawnMeleeboxCmd`, `despawnCmd`
- **Player**: `pickupCrystalCmd`, `gainAbilityCmd`, `useActiveCmd`,
  `cycleHotbarCmd`
- **Level**: `enterArenaCmd`, `sealDoorsCmd`, `openDoorsCmd`,
  `completeLevelCmd`, `retryLevelCmd`, `saveProgressCmd`
- **Props**: `damagePropCmd`, `explodePropCmd`

## Events & wiring (`05_commands/wireReactions.js`)

Two mechanisms only: **direct calls** and **`game.events` broadcasts**.
(One global bus, not `scene.events` — Hud is a separate scene and
needs to hear the same facts.)

```js
const wireReactions = (game) => {
	game.events.on('died',            despawnCmd);
	game.events.on('died',            openDoorsCmd);
	game.events.on('died',            stopWavesCmd);
	game.events.on('died',            checkLevelClearCmd);
	game.events.on('health-changed',  hudRefreshCmd);
	game.events.on('mutation-changed', hudRefreshCmd);
	game.events.on('ammo-changed',    hudRefreshCmd);
	game.events.on('picked-up',       playSfxCmd);
};
```

Broadcast names are past-tense facts; payloads are `{entity, ...}`.
`wireReactions` is the reaction map — the grep-able answer to "what
happens when X". Emit from commands at the point the fact is true:

| Broadcast          | Emitted by            | Reactors                     |
|--------------------|-----------------------|------------------------------|
| `died`             | `dieCmd`              | despawn, doors, waves, clear |
| `health-changed`   | `resolveHitCmd`, heal | HUD meter                    |
| `mutation-changed` | spend/refill paths    | HUD meter                    |
| `ammo-changed`     | `pickupCrystalCmd`    | HUD hotbar                   |
| `picked-up`        | `pickupCrystalCmd`    | sfx                          |
| `level-clear`      | `completeLevelCmd`    | scene transition             |

`stopWavesCmd`, `checkLevelClearCmd`, `hudRefreshCmd`, `playSfxCmd`
are small listener-shaped commands — same convention, reaction
roster rather than transaction verbs.

## Damage pipeline (`05_commands/resolveHitCmd.js`)

The single funnel for every damage source — attacks, lava, explosive
props, launched bodies, DoT ticks. Ordering is code order; modifier
enumeration is explicit.

```js
const resolveHitCmd = ({attacker, target, attack, direct}) => {
	// 1. prevent — dodge/invulnerable can't be reordered by prefabs
	if (!direct) {
		if (target.has(Invulnerable)) return;
		if (target.evasive?.roll()) return;             // whiff
	}

	// 2. mitigate — commutative multipliers/blocks
	let amount = attack.dmg;
	amount = target.armored?.mitigate(amount) ?? amount; // passive + active
	if (target.attuned && !direct) {
		amount = target.attuned.block(amount);           // 10-block shield
	}
	amount *= attacker?.statusCarrying?.mult('dmg') ?? 1; // rage/buffs
	if (amount <= 0) return;                           // fully blocked

	// 3. apply — one place, guaranteed last
	target.damageable.apply(-amount);
	game.events.emit('health-changed', {entity: target});

	// 4. on-hit payloads + death
	(attack.effects ?? []).forEach(e => addStatusCmd({target, def: e}));
	if (target.damageable.dead()) {
		dieCmd({entity: target, source: attacker});        // emits 'died'
	}
};
```

Accuracy rolls happen upstream (projectile overlap = one roll; melee
rolls per target inside `executeAttackCmd`'s LOS-gated collection).
`direct: true` is the DoT/hazard path: skips dodge/invulnerable — the
hit already landed — but mitigation still applies.

## Physics groups & collision matrix

| A \ B          | walls | enemies | e-projectiles | e-melee | pickups | doors | props |
|----------------|-------|---------|---------------|---------|---------|-------|-------|
| player         | collide | collide | overlap→hit | overlap→hit | overlap→take | collide when sealed | collide impassable |
| enemies        | collide | separate | — | — | — | collide | collide |
| p-projectiles  | destroy/bounce | overlap→hit | — | — | — | destroy | overlap→damage prop |
| p-melee        | — | overlap→hit | — | — | — | — | overlap→damage prop |

Burrowing enemies keep wall collision, ignore props. Flying enemies
collide with walls. `G` attacks bypass collision entirely.

Every overlap/collide cell resolves sprites → entities
(`sprite.getData('eid')` → `world.getEntity`) and calls a `*Cmd` —
"overlap→hit" means `resolveHitCmd`, "overlap→take" means
`pickupCrystalCmd`, "damage prop" means `damagePropCmd`.

## Frame update order (`Playing.update`)

1. `InputManager` — poll devices, resolve aim.
2. `PlayerSystem` — input → intent, mutation decay, button → commands.
3. `EnemyAI` — decision ticks → intent / `executeAttackCmd` / specials.
4. `TerrainSystem` — tile under movers → mults, ice, lava damage.
5. `MovementSystem` — intent → velocity, facing/anims, separation.
6. *(arcade step runs inside Phaser)* — overlap/collide callbacks call
   commands as hits land.
7. `ProjectileSystem` — pattern motion, expiry.
8. `StatusSystem` — effect ticks, flag-marker expiry sweep.
9. `WaveDirector` — minion counts, wave timers.
10. `Darkness` redraw, HUD refresh (dirty-flagged).

Commands also run outside the tick — inside physics callbacks (step 6)
and UI events — which is why they own whole transactions.

## Asset conventions

- Spritesheets: `assets/images/spr-{name}.png`, 16×16 frames, rows =
  down/right/up (left = `flipX`). Anim keys `spr-{name}-{anim}`;
  attack anims keyed by crystal `anim` field.
- Tilesets: `assets/images/tiles-{terrain}.png`; maps:
  `assets/maps/{key}.json`.
- Icons: `assets/images/icons/icon-{key}.png` (already an icons dir).
- Particles: `assets/images/particles/`; emitter configs as data in
  `03_data/particles.js` so students tune without code.
- Placeholders: `placeholder.js` generates solid-color textures for
  every missing key at boot — code is written against final keys from
  day one.

## Level authoring pipeline (SpriteFusion)

1. Draw map in SpriteFusion; export its **broad JSON** (richer than
   the Phaser/Tiled preset — object metadata survives) plus the
   tileset PNG into `art/maps/`.
2. `tools/convert-spritefusion.mjs` (node script, run via
   `yarn convert-maps`) reads the broad JSON and emits Tiled JSON into
   `public/assets/maps/`.
3. Conventions students must follow:
   - Layers named exactly `ground`, `terrain`, `props`, `objects`.
   - Wall tiles from the marked collision range of the tileset.
   - Objects by type name: `playerStart`, `enemy` (custom prop
     `type=rat`), `prop` (`type=largeRock`), `door` (`id=n`),
     `exit`, `bossArena` (rect), `light` (`color`, `radius`).
4. Add `07_levels/levelNN.js` (name, map key, crystal counts, boss
   key) and its node in `08_worldmap/WorldMap.js`.

## Screens

- **Hud** — health + mutation meters, player level, level name,
  hotkey bar (10 slots; Shift / right-shoulder toggles attacks ↔
  abilities; number keys select within the shown set; attack slots
  show remaining uses, ability slots show cooldown sweep).
- **Menu** — title, continue (if save), new game, settings.
- **Settings** — volume, default zoom, binding reference.
- **Pause** — character sheet: stats, passives, actives; resume,
  settings, quit to menu.
- **Map** — worldmap node graph as described above.
- **LevelComplete** — stats summary → **AbilityPick** (full list of all
  20 abilities, pick one) → next level.
- **Death** — retry level / quit to menu.
- **Victory** — after Gorilla; leads into credits cutscene.
- **Cutscene** — timeline runner + dialogue box.

## Decisions log

Resolved:

- Cyan crystals come in sizes: S=30, M=60, L=90.
- AbilityPick lists all 20 abilities; player picks one.
- No melee through walls — LOS check gates melee damage.
- Regurge Surge = swappable attack def with `uses: 1` (targeting, not
  mirroring); swallowed projectile must be able to collide with the
  player.
- SpriteFusion: use the broad JSON export + `tools/` converter.
- Ammo pools persist between levels (they're in the save schema).
- Commands branch on capabilities (`has(X)`, def fields), never on
  entity names — a new enemy is one new file in `03_enemies/`.
- Boss-specific attacks live in `05_commands/99_specials/`; EnemyAI
  resolves them via the `BossSpecials` map keyed on `def.key` — data
  holds no function refs, which also dodges a 03→05 load-order trap.
- `03_data/` is one element per file in numbered subfolders,
  self-registering into PascalCase table files — a new enemy/crystal/
  level is a new file, never an edit to a shared table.

- Entity structure: **Geotic ECS**, vendored as a global script
  (`00_libraries/01_geotic.js`) — no modules needed at runtime.
- Logic layering: components (state + local API) ← commands
  (`*Cmd(payload)` globals, the only multi-component code) ← systems
  (per-frame query loops) / broadcasts (`game.events`, wired in
  `05_commands/wireReactions.js`). Calls flow down, events flow up.
- No `entity.fireEvent` — geotic dispatches in component attachment
  order with no priority, so commands enumerate modifiers directly.
- Entities = creatures + projectiles only; pickups/doors/zones/props
  stay plain Phaser objects.
