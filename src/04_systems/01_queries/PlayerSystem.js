//#region 04_systems/01_queries/PlayerSystem.js ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Query `player`. Reads InputManager, writes moveable.intent, ticks
// Mutation decay and ability cooldowns, routes every button action
// to its command. The input → intent split is what makes grabs and
// staggers cheap: block the intent, physics follows for free.
const PlayerSystem = {

	tick(scene, dt) {
		for (const e of getQueries().player.get()) {
			this.move(e);
			this.upkeep(e, dt);
			this.actions(scene, e, dt);
		}
	},

	// stick/keys → intent. A grabbed player can't steer — each
	// direction press counts a wiggle tap toward freedom instead.
	move(e) {
		const x = InputManager.axis('moveX');
		const y = InputManager.axis('moveY');
		if (e.grabbed) {
			if (this.wigglePress(e)) {
				e.grabbed.taps--;
				if (e.grabbed.taps <= 0) e.remove(e.grabbed);
			}
			e.moveable.intent.x = 0;
			e.moveable.intent.y = 0;
			return;
		}
		e.moveable.intent.x = x;
		e.moveable.intent.y = y;
	},

	// True once per *new* direction while grabbed — the wiggle rule
	// is "move in each direction", so repeating the same direction
	// doesn't count.
	wigglePress(e) {
		const d = dir4(
			InputManager.axis('moveX'), InputManager.axis('moveY'));
		if (!InputManager.axis('moveX') && !InputManager.axis('moveY')) {
			this._lastWiggle = null;
			return false;
		}
		if (d === this._lastWiggle) return false;
		this._lastWiggle = d;
		return true;
	},

	// The meters: Mutation drains, cooldowns run.
	upkeep(e, dt) {
		e.mutated.decay(dt);
		e.powered.tickCd(dt);
	},

	// Buttons → commands and scene transitions.
	actions(scene, e, dt) {
		if (InputManager.pressed('attack')) {
			executeAttackCmd({
				scene, attacker: e,
				aim: InputManager.aim(e.rendered.pos(), dt),
			});
		}
		if (InputManager.pressed('special')) {
			useActiveCmd({scene, entity: e});
		}
		if (InputManager.justPressed('cycleAttack')) {
			cycleHotbarCmd({entity: e, which: 'attack', dir: 1});
		}
		if (InputManager.justPressed('cycleSpecial')) {
			cycleHotbarCmd({entity: e, which: 'active', dir: 1});
		}
		if (InputManager.justPressed('toggleBar')) {
			cycleHotbarCmd({entity: e, toggle: true});
		}
		const slot = InputManager.slotPressed();
		if (slot >= 0) cycleHotbarCmd({entity: e, slot});
		if (InputManager.justPressed('map')) {
			scene.scene.launch('Map');
			scene.scene.sleep();
		}
		if (InputManager.justPressed('pause')) {
			scene.scene.launch('Pause');
			scene.scene.sleep();
		}
		const zoom = InputManager.zoomDelta();
		if (zoom) {
			const cam = scene.cameras.main;
			cam.setZoom(Phaser.Math.Clamp(cam.zoom + zoom, 1, 4));
		}
	},
};

//#endregion
