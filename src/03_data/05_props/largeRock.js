//#region 03_data/05_props/largeRock.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Breaks into 2-3 Medium Rocks when destroyed.
Props.largeRock = {
	key: 'largeRock',
	name: 'Large Rock',
	hp: 960,
	anim: 'large-rock',
	breaks: {key: 'mediumRock', min: 2, max: 3},
};

//#endregion
