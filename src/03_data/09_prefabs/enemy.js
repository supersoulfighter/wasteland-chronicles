//#region 03_data/09_prefabs/enemy.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Any `Enemies` entry → components. Capability-derived comps are the
// branch-on-capabilities rule in data form: a fly-style enemy dodges,
// a small one can be launched/flipped, a swallower can eat shots.
Prefabs.enemy = (def) => [
	[Rendered,        {anim: def.anim}],
	[Damageable,      {value: def.health, max: def.health}],
	[Allied,          {id: 'enemy'}],
	[Moveable,        {speed: def.speed}],
	[Autonomous,      {style: def.style}],
	[Armed,           {list: [def.attack]}],
	[StatusCarrying,  {}],
	...(def.style === 'fly' ? [[Evasive, {pct: 15}]] : []),
	...(def.size < 3
		? [[Launchable, {}], [Flippable, {}]]
		: []),
	...(def.swallow ? [[Swallowing, {}]] : []),
];

//#endregion
