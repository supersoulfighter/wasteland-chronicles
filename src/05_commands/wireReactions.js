//#region 05_commands/wireReactions.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The reaction map — the grep-able answer to "what happens when X".
// Two mechanisms exist in the game: direct calls (a projectile
// overlap knows it's a hit) and game.events broadcasts (one global
// bus — Hud is a separate scene and needs the same facts). This is
// the complete broadcast wiring; call it once from Playing.create.
const wireReactions = (game) => {
	game.events.on('died',             despawnCmd);
	game.events.on('died',             openDoorsCmd);
	game.events.on('died',             stopWavesCmd);
	game.events.on('died',             checkLevelClearCmd);
	game.events.on('died',             playerDiedCmd);
	game.events.on('health-changed',   hudRefreshCmd);
	game.events.on('mutation-changed', hudRefreshCmd);
	game.events.on('ammo-changed',     hudRefreshCmd);
	game.events.on('picked-up',        playSfxCmd);
};

//#endregion
