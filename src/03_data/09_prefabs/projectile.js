//#region 03_data/09_prefabs/projectile.js /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// A fired attack → a sprite + Ballistic. attackToBallistic (in
// attacklib.js) copies the def's numbers so the projectile is
// self-contained — it survives the attacker swapping defs mid-flight.
Prefabs.projectile = (attack, team) => [
	[Rendered,   {anim: attack.icon ?? 'bullet'}],
	[Ballistic,  {team, ...attackToBallistic(attack)}],
];

//#endregion
