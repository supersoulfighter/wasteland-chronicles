//#region 04_systems/02_managers/SaveManager.js ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// One localStorage blob, versioned. Written on level complete,
// ability pick, settings change, and quit-to-menu (each via its
// command) — reads the player's components at write time, never
// world.serialize.
const SaveManager = {

	KEY: 'wc-save',

	// A fresh save — the shape the schema documents.
	fresh() {
		return {
			v: 1,
			playerLevel: 1,
			maxHealth: CFG.hp,
			maxMutation: CFG.mutation,
			passives: [],
			actives: ['bomb'],
			ammo: {},
			hotbar: {attacks: ['hand'], actives: ['bomb']},
			currentLevel: 'level01',
			visited: [],
			seenIntro: false,
			settings: {sfx: 1, music: 1, zoom: CFG.zoom},
		};
	},

	load() {
		try {
			const raw = localStorage.getItem(this.KEY);
			if (!raw) return this.fresh();
			const save = JSON.parse(raw);
			// unknown version → start over rather than crash
			return save.v === 1 ? save : this.fresh();
		} catch (err) {
			return this.fresh();
		}
	},

	// Merge a patch into the stored save and persist it.
	write(patch) {
		const save = {...this.load(), ...patch, v: 1};
		localStorage.setItem(this.KEY, JSON.stringify(save));
		return save;
	},

	has() {
		return !!localStorage.getItem(this.KEY);
	},

	clear() {
		localStorage.removeItem(this.KEY);
	},
};

//#endregion
