//#region 03_data/09_prefabs/boss.js ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// A boss is an enemy plus Bossy (key → BossSpecials indirection),
// the full attacks list for Armed, and a Spawning component when the
// def calls for a minion wave. The enemy recipe's single-attack
// Armed is dropped — geotic refuses a second add of the same class.
Prefabs.boss = (def) => [
	...Prefabs.enemy(def).filter(([C]) => C !== Armed),
	[Bossy,    {key: def.key}],
	[Armed,    {list: def.attacks}],
	...(def.minions
		? [[Spawning, {spt: def.minions.spt, family: def.minions.type}]]
		: []),
];

//#endregion
