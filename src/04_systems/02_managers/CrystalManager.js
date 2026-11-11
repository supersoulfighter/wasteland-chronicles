//#region 04_systems/02_managers/CrystalManager.js /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Setup-time service (not a tick). Rolls the level def's `crystals`
// counts into pickup objects on free floor tiles — cyan sizes
// restore 30/60/90 Mutation, color crystals grant their attack pair.
// Pickups stay plain sprites; `data.crystal` is what
// pickupCrystalCmd reads on overlap.
const CrystalManager = {

	// sprite tint per crystal color
	TINTS: {
		cyan:   0x55ffff,
		black:  0x333333,
		red:    0xff3344,
		orange: 0xff8833,
		yellow: 0xffdd33,
		green:  0x44dd66,
		blue:   0x4488ff,
		purple: 0xaa55ff,
		white:  0xeeeeee,
	},

	// cyan sizes → Mutation restored
	SIZES: {S: 30, M: 60, L: 90},

	scatter(scene, def, freeTiles) {
		// shuffle a copy so repeated levels don't repeat spots
		const spots = Phaser.Utils.Array.Shuffle([...freeTiles]);
		let i = 0;
		const take = () => spots[i++ % spots.length];
		for (const [color, spec] of Object.entries(def.crystals)) {
			if (color === 'cyan') {
				// {S: n, M: n, L: n} — one pickup per unit
				for (const [size, count] of Object.entries(spec)) {
					for (let n = 0; n < count; n++) {
						this.place(scene, take(), {color, size});
					}
				}
			} else {
				for (let n = 0; n < spec; n++) {
					this.place(scene, take(), {color});
				}
			}
		}
	},

	place(scene, tile, crystal) {
		const sprite = scene.pickups.create(tile.x, tile.y, 'spr-crystal');
		sprite.setTint(this.TINTS[crystal.color] ?? 0x55ffff);
		sprite.setData('crystal', crystal);
	},
};

//#endregion
