//#region 03_data/05_props/explosiveCrystal.js /////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Does 50 damage in radius 60 when destroyed — explodePropCmd reads
// `onDestroyed` and hits everything in range.
Props.explosiveCrystal = {
	key: 'explosiveCrystal',
	name: 'Explosive Crystal',
	hp: 70,
	anim: 'explosive-crystal',
	onDestroyed: {dmg: 50, radius: 60},
};

//#endregion
