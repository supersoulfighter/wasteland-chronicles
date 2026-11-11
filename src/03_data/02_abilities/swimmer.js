//#region 03_data/02_abilities/swimmer.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Water movement penalty reduced to 33% — TerrainSystem reads this
// when the tile is water (normal penalty is 66%).
Abilities.passives.swimmer = {name: 'Swimmer', stat: 'waterPenalty', set: 0.33};

//#endregion
