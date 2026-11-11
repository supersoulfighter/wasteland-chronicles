//#region 03_data/05_props/mediumRock.js ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Breaks into 2-4 Small Rocks when destroyed.
Props.mediumRock = {
	key: 'mediumRock',
	name: 'Medium Rock',
	hp: 240,
	anim: 'medium-rock',
	breaks: {key: 'smallRock', min: 2, max: 4},
};

//#endregion
