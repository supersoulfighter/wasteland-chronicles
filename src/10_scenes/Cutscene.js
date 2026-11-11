//#region 10_scenes/Cutscene.js ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Timeline runner — plays a 03_data/10_cutscenes/ array through
// TimelineManager. `say` steps show a dialogue box that waits on
// confirm; holding any key skips the whole scene.
class Cutscene extends Phaser.Scene {

	constructor() {
		super('Cutscene');
	}

	init(data) {
		// callers pass the timeline array itself (consts aren't on
		// window in the module bundle — pass the reference)
		this.timeline = data.timeline;
		this.actors = {};
	}

	create() {
		this.cameras.main.fadeIn(600);
		// dialogue box + speaker name, hidden until a 'say' step
		this.box = this.add.rectangle(400, 500, 760, 120, 0x000000, 0.8)
			.setVisible(false);
		this.nameText = this.add.text(40, 452, '', {
			fontSize: '14px', color: '#aaffcc',
		});
		this.sayText = this.add.text(40, 470, '', {
			fontSize: '12px', color: '#ffffff',
			wordWrap: {width: 720},
		});
		this.input.keyboard.on('keydown', () => this.advance());
		TimelineManager.run(this, this.timeline,
			() => this.scene.start('Menu'));
	}

	// 'say' step → show the line and hold until confirm.
	showLine(name, text, done) {
		this.box.setVisible(true);
		this.nameText.setText(name);
		this.sayText.setText(text);
		this.waiting = done;    // advance() releases it
	}

	// Any key — advance a held 'say', or skip the whole scene when a
	// step isn't waiting on input.
	advance() {
		if (this.waiting) {
			const done = this.waiting;
			this.waiting = null;
			this.box.setVisible(false);
			done();
		} else {
			this.scene.start('Menu');
		}
	}
}

//#endregion
