//#region 03_data/02_abilities/boxer.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Melee attacks do 10% more damage — resolveHitCmd checks the
// attacker's Powered.passives for this stat before applying.
Abilities.passives.boxer = {name: 'Boxer', stat: 'meleeDmg', mult: 1.10};

//#endregion
