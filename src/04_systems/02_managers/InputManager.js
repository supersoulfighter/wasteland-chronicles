//#region 04_systems/02_managers/InputManager.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Every consumer reads actions, never raw keys — this is the one
// place Bindings gets consulted, so gamepad support is automatic
// everywhere downstream. Aim resolves in order: deflected right
// stick → arrow-key rotation of a persistent angle → mouse.
const InputManager = {

	scene: null,
	axisKeys: {},    // action → {neg: [Key], pos: [Key]}
	btnKeys: {},     // action → [Key]
	slotKeys: [],    // digit order 1-9,0
	pad: null,
	aimAngle: 0,
	wheelDelta: 0,
	padNow: 0,       // button bitmask this frame
	padPrev: 0,      // last frame — for justPressed edge detection

	//#region Setup
	// Bind once per scene (Playing.create calls this).
	init(scene) {
		this.scene = scene;
		this.axisKeys = {};
		this.btnKeys = {};
		this.slotKeys = [];
		for (const action in Bindings.keyboard) {
			const b = Bindings.keyboard[action];
			if (b?.neg) {
				this.axisKeys[action] = {
					neg: b.neg.map(n => scene.input.keyboard.addKey(n)),
					pos: b.pos.map(n => scene.input.keyboard.addKey(n)),
				};
			} else if (action === 'slot') {
				this.slotKeys = b.map(n =>
					scene.input.keyboard.addKey(n));
			} else {
				this.btnKeys[action] = b.map(n =>
					scene.input.keyboard.addKey(n));
			}
		}
		scene.input.on('wheel',
			(_p, _o, _x, dy) => { this.wheelDelta = dy; });
		scene.input.gamepad?.once('connected',
			pad => { this.pad = pad; });
	},
	//#endregion

	//#region Axes
	// -1..1 from the bound key pair; left stick covers it on gamepad.
	axis(action) {
		const a = this.axisKeys[action];
		let v = 0;
		if (a) {
			v = (a.pos.some(k => k.isDown) ? 1 : 0)
				- (a.neg.some(k => k.isDown) ? 1 : 0);
		}
		if (!v && this.pad) {
			const i = action === 'moveX' ? 0 : 1;   // left stick
			const raw = this.pad.axes[i].getValue();
			v = Math.abs(raw) > 0.2 ? raw : 0;      // deadzone
		}
		return v;
	},

	// Aim point in world space — resolution order per the controls
	// table: deflected right stick → arrow-rotated angle → mouse.
	aim(from, dt) {
		const lbHeld = this.pad?.buttons[Bindings.gamepad.zoomHold]
			.pressed;   // LB+stick is zoom, not aim
		if (this.pad && !lbHeld) {
			const x = this.pad.axes[2].getValue();
			const y = this.pad.axes[3].getValue();
			if (Math.hypot(x, y) > 0.3) {
				this.aimAngle = Math.atan2(y, x);
				return this.fromAngle(from);
			}
		}
		const spin = (this.pressed('aimRight') ? 1 : 0)
			- (this.pressed('aimLeft') ? 1 : 0);
		if (spin) {
			this.aimAngle += spin * 4 * dt;   // ~230°/s of rotation
			return this.fromAngle(from);
		}
		const cam = this.scene.cameras.main;
		const ptr = this.scene.input.activePointer;
		return cam.getWorldPoint(ptr.x, ptr.y);
	},

	// A point 120px out along aimAngle — stick/arrow aim is a
	// direction, not a position.
	fromAngle(from) {
		return {
			x: from.x + Math.cos(this.aimAngle) * 120,
			y: from.y + Math.sin(this.aimAngle) * 120,
		};
	},
	//#endregion

	//#region Buttons
	// Snapshot pad buttons each frame — call once at the top of
	// Playing.update so justPressed edges are stable all frame.
	beginFrame() {
		if (!this.pad) return;
		this.padPrev = this.padNow;
		this.padNow = 0;
		for (let i = 0; i < 17; i++) {
			if (this.pad.buttons[i].pressed) this.padNow |= (1 << i);
		}
	},

	// Held — keys, pointer buttons, or pad buttons.
	pressed(action) {
		const keys = this.btnKeys[action];
		if (keys?.some(k => k.isDown)) return true;
		const ptr = this.scene.input.activePointer;
		if (action === 'attack' && ptr.leftButtonDown()) return true;
		if (action === 'special' && ptr.rightButtonDown()) return true;
		const i = Bindings.gamepad[action];
		return i !== undefined
			&& !!(this.padNow & (1 << i));
	},

	// Edge — true only on the frame the input went down.
	justPressed(action) {
		const keys = this.btnKeys[action];
		if (keys?.some(k => Phaser.Input.Keyboard.JustDown(k))) {
			return true;
		}
		const i = Bindings.gamepad[action];
		if (i === undefined) return false;
		const bit = 1 << i;
		return !!(this.padNow & bit) && !(this.padPrev & bit);
	},

	// Number-row presses → hotbar slots ('1'→0 ... '0'→9), -1 none.
	slotPressed() {
		for (let i = 0; i < this.slotKeys.length; i++) {
			if (Phaser.Input.Keyboard.JustDown(this.slotKeys[i])) {
				return i;
			}
		}
		return -1;
	},

	// Wheel steps + held keys + LB&right-stick on pad.
	zoomDelta() {
		let d = 0;
		if (this.wheelDelta) {
			d = this.wheelDelta < 0 ? 0.25 : -0.25;
			this.wheelDelta = 0;
		}
		if (this.pressed('zoomIn')) d += 0.02;
		if (this.pressed('zoomOut')) d -= 0.02;
		if (this.pad?.buttons[Bindings.gamepad.zoomHold].pressed) {
			d -= this.pad.axes[3].getValue() * 0.05;
		}
		return d;
	},
	//#endregion
};

//#endregion
