//#region 03_data/10_cutscenes/IntroScene.js ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// One file per timeline — TimelineManager walks the flat list; `say`
// blocks on confirm, `end` names the next scene. Played before the
// menu on a fresh save (Boot routes here when !seenIntro).
const IntroScene = [
	{do: 'fade', from: 1, to: 0, secs: 1.5},
	{do: 'say', name: 'Xavier', text: 'The cave was quiet when I woke.'},
	{do: 'say', name: 'Xavier', text: 'My body is wrong now. Stronger. Hungrier.'},
	{do: 'say', name: 'Xavier', text: 'The crystals hum with something older than the world above.'},
	{do: 'say', name: 'Xavier', text: 'Whatever happened up there — it ended. Down here, something begins.'},
	{do: 'end', next: 'Menu'},
];

//#endregion
