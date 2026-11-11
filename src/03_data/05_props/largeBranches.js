//#region 03_data/05_props/largeBranches.js ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Breaks into 2-4 Small Branches when destroyed.
Props.largeBranches = {
	key: 'largeBranches',
	name: 'Large Branches',
	hp: 450,
	anim: 'large-branches',
	breaks: {key: 'smallBranches', min: 2, max: 4},
};

//#endregion
