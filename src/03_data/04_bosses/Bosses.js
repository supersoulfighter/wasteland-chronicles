//#region 03_data/04_bosses/Bosses.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Boss defs — one file per boss, self-registering into this table.
// Same shape as an enemy def plus `attacks[]` (each with `weight`)
// and `minions` for wave upkeep. Attacks marked `special` defer to
// BossSpecials[boss.key] — data never holds function refs.
const Bosses = {};

//#endregion
