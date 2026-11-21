//#region 03_data/06_terrains/Terrains.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Terrain defs — one file per terrain, in two sub-tables (game.md
// "Terrain" and "Hazards"):
//   grounds  one per LEVEL (def.terrain) — a map-wide modifier that
//            applies to every character regardless of position
//   hazards  per-TILE effects, read off the hazard layer under each
//            mover — flyers and Burrowed entities skip all of them
const Terrains = {
	grounds: {},
	hazards: {},
};

//#endregion
