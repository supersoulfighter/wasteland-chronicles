//#region 02_config/input.js ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Action → bindings per device. InputManager is the only code that
// reads this table; consumers ask it for action values and never see
// raw key codes, so gamepad support is automatic everywhere.
//
// Axes (`moveX`, `moveY`) read as -1..1 floats; buttons read as
// just-pressed / held booleans. Key names are Phaser.KeyCodes names.
const Bindings = {
	keyboard: {
		// movement — WASD only; arrows belong to aim/attack below
		moveX: {neg: ['A'], pos: ['D']},
		moveY: {neg: ['W'], pos: ['S']},

		// alternate aim: left/right arrows rotate a persistent angle
		// (mouse + right stick are the primaries)
		aimLeft:  ['LEFT'],
		aimRight: ['RIGHT'],

		attack:       ['UP'],            // alt to left mouse
		special:      ['DOWN'],          // alt to right mouse
		cycleAttack:  ['SLASH'],         // "/"
		cycleSpecial: ['PERIOD'],        // "."
		toggleBar:    ['SHIFT'],
		// < and > in the design table — rebound to -/= since Phaser
		// can't bind shift-modified keys
		zoomIn:       ['EQUALS'],
		zoomOut:      ['MINUS'],
		map:          ['M'],
		pause:        ['P', 'C'],
		confirm:      ['ENTER', 'SPACE'],
		back:         ['BACKSPACE', 'ESC'],
		uiUp:         ['W', 'UP'],
		uiDown:       ['S', 'DOWN'],
		uiLeft:       ['A', 'LEFT'],
		uiRight:      ['D', 'RIGHT'],

		// hotbar slots 0-9 → number row
		slot: [
			'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
			'SIX', 'SEVEN', 'EIGHT', 'NINE', 'ZERO',
		],
	},

	// mouse rides alongside the keyboard for aim/attack
	pointer: {
		attack:  0,   // left button
		special: 2,   // right button
	},

	gamepad: {
		// moveX/moveY read the left stick, aim reads the right stick;
		// zoom is LB + right stick (checked in InputManager.aim)
		moveStick: 'left',
		aimStick:  'right',

		attack:       7,    // RT
		special:      6,    // LT
		cycleAttack:  2,    // X
		cycleSpecial: 1,    // B
		toggleBar:    5,    // RB
		zoomHold:     4,    // LB (hold + right stick = zoom)
		map:          8,    // select
		pause:        9,    // start
		confirm:      0,    // A
		back:         1,    // B (share with cycleSpecial — context)
		uiUp:         12,   // dpad
		uiDown:       13,
		uiLeft:       14,
		uiRight:      15,
	},
};

//#endregion
