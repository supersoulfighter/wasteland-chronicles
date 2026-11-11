//#region 03_data/05_props/slowingCrystal.js ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Slows enemies 20% for 5 seconds in radius 60 when destroyed.
Props.slowingCrystal = {
	key: 'slowingCrystal',
	name: 'Slowing Crystal',
	hp: 70,
	anim: 'slowing-crystal',
	onDestroyed: {
		radius: 60,
		effects: [
			{status: 'slow', stat: 'speed', amount: 0.8, duration: 5},
		],
	},
};

//#endregion
