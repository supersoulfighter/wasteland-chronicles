//#region 04_systems/02_managers/TimelineManager.js ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Cutscene sequencer. Timeline data is a flat list of steps (see
// 03_data/10_cutscenes/); this walks them one at a time, each step's
// last act being "call next()". `say` blocks on confirm; `parallel`
// waits on all its sub-steps; `end` names the next scene.
const TimelineManager = {

	// onDone fires when the list runs out or a step 'end's it —
	// the Cutscene scene supplies it.
	run(scene, steps, onDone) {
		let i = 0;
		const next = () => {
			const step = steps[i++];
			if (!step) {
				onDone?.();
				return;
			}
			this.step(scene, step, next);
		};
		next();
	},

	step(scene, step, next) {
		switch (step.do) {
			case 'spawn':
				scene.actors[step.key] = scene.add.sprite(
					step.at[0], step.at[1], `spr-${step.key}`);
				next();
				break;
			case 'say':
				// the scene owns its dialogue box — it calls back on
				// confirm input
				scene.showLine(step.name, step.text, next);
				break;
			case 'move':
				scene.tweens.add({
					targets: scene.actors[step.key],
					x: step.to[0],
					y: step.to[1],
					duration: step.secs * 1000,
					onComplete: next,
				});
				break;
			case 'play':
				scene.actors[step.key].play(step.anim);
				next();
				break;
			case 'wait':
				scene.time.delayedCall(step.secs * 1000, next);
				break;
			case 'fade':
				if (step.to < step.from) {
					scene.cameras.main.fadeOut(step.secs * 1000);
					scene.cameras.main.once('camerafadeoutcomplete', next);
				} else {
					scene.cameras.main.fadeIn(step.secs * 1000);
					scene.cameras.main.once('camerafadeincomplete', next);
				}
				break;
			case 'parallel': {
				// every sub-step runs; we continue when all call back
				let left = step.steps.length;
				step.steps.forEach(sub =>
					this.step(scene, sub, () => {
						if (--left === 0) next();
					}));
				break;
			}
			case 'end':
				scene.scene.start(step.next);
				break;
			default:
				next();
		}
	},
};

//#endregion
