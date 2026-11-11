//#region 03_data/08_worldmap/WorldMap.js //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The map screen's node graph. `id` keys into Levels; `to` lists
// which nodes a completed level unlocks. Positions are in map-screen
// pixels — a straight descent down the cave.
const WorldMap = {
	nodes: [
		{id: 'level01', x: 400, y: 60,   to: ['level02']},
		{id: 'level02', x: 330, y: 100,  to: ['level03']},
		{id: 'level03', x: 430, y: 145,  to: ['level04']},
		{id: 'level04', x: 300, y: 190,  to: ['level05']},
		{id: 'level05', x: 390, y: 235,  to: ['level06']},
		{id: 'level06', x: 470, y: 275,  to: ['level07']},
		{id: 'level07', x: 350, y: 320,  to: ['level08']},
		{id: 'level08', x: 420, y: 360,  to: ['level09']},
		{id: 'level09', x: 320, y: 405,  to: ['level10']},
		{id: 'level10', x: 450, y: 445,  to: ['level11']},
		{id: 'level11', x: 370, y: 490,  to: ['level12']},
		{id: 'level12', x: 300, y: 530,  to: ['level13']},
		{id: 'level13', x: 430, y: 575,  to: ['level14']},
		{id: 'level14', x: 340, y: 615,  to: ['level15']},
		{id: 'level15', x: 460, y: 660,  to: ['level16']},
		{id: 'level16', x: 360, y: 700,  to: ['level17']},
		{id: 'level17', x: 410, y: 745,  to: ['level18']},
		{id: 'level18', x: 310, y: 785,  to: ['level19']},
		{id: 'level19', x: 440, y: 830,  to: ['level20']},
		{id: 'level20', x: 350, y: 870,  to: ['level21']},
		{id: 'level21', x: 450, y: 915,  to: ['level22']},
		{id: 'level22', x: 330, y: 955,  to: ['level23']},
		{id: 'level23', x: 420, y: 1000, to: ['level24']},
		{id: 'level24', x: 380, y: 1045, to: []},
	],
};

//#endregion
