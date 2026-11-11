//#region 05_commands/99_specials/BossSpecials.js //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Bespoke boss behavior, keyed by boss def.key — EnemyAI does
// BossSpecials[entity.bossy.key]?.(payload) in place of the generic
// attack when armed.current() carries `special: true`. Data stays
// pure (no function refs in 03_data), and this file sorting before
// the lowercase specials means the map exists by the time they
// self-register.
const BossSpecials = {};

//#endregion
