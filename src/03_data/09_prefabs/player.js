//#region 03_data/09_prefabs/player.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Xavier. Component refs resolve at call time — the recipe runs when
// the player spawns, long after every component file has loaded.
Prefabs.player = () => [
	[Controllable,    {}],
	[Rendered,        {anim: 'xavier'}],
	[Damageable,      {value: CFG.hp, max: CFG.hp}],
	[Allied,          {id: 'player'}],
	[Moveable,        {speed: CFG.speed}],
	[Mutated,         {value: CFG.mutation, max: CFG.mutation, decayRate: CFG.decay}],
	[Consumable,      {uses: {hand: Infinity, punch: Infinity}}],
	[Slotted,         {attacks: ['hand']}],
	[Powered,         {actives: {bomb: 0}}],
	[Armed,           {list: [Crystals.hand, Crystals.punch]}],
	[StatusCarrying,  {}],
	[Luminous,        {radius: CFG.lightRadius}],
];

//#endregion
