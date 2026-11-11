//#region 02_components/Slotted.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The 10-slot hotbar. Two sets — crystal `attacks` and ability
// `actives` — and `mode` picks which is shown (toggleBar flips it).
// `sel` is the highlighted slot within the shown set.
class Slotted extends Geotic.Component {

	static properties = {
		attacks: [],         // crystal keys in slot order
		actives: [],         // ability keys
		mode: 'attacks',     // or 'actives'
		sel: 0,              // cursor in the *shown* set
		attackSel: 0,        // which attack is armed (survives toggles)
		activeSel: 0,        // which ability is armed
	};

	// The set currently on screen.
	list() {
		return this.mode === 'attacks' ? this.attacks : this.actives;
	}

	current() {
		return this.list()[this.sel];
	}

	// Shift / right-shoulder — swap which set is shown.
	toggle() {
		this.mode = this.mode === 'attacks' ? 'actives' : 'attacks';
		this.sel = 0;
	}

	// Q/E — step the selection inside the shown set.
	cycle(dir = 1) {
		const n = this.list().length;
		if (n > 0) this.sel = (this.sel + dir + n) % n;
	}

	// Number keys — jump to a slot when it exists.
	slot(i) {
		if (i < this.list().length) this.sel = i;
	}
}

ECS.registerComponent(Slotted);

//#endregion
