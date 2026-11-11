//#region 02_components/Rendered.js ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The entity↔sprite bridge: every on-screen entity carries one of
// these. The sprite is created by the spawn command; this component
// just owns the reference and the facing/anim helpers.
class Rendered extends Geotic.Component {

	static properties = {
		sprite: null,   // Phaser sprite created by the spawn command
		anim: null,     // base anim name — `spr-{anim}-*` keys
	};

	// Point the sprite at a facing name. Frames are 0=down, 1=right,
	// 2=up; 'left' is 'right' mirrored.
	face(dir) {
		const frames = {down: 0, right: 1, up: 2, left: 1};
		this.sprite.setFlipX(dir === 'left');
		this.sprite.setFrame(frames[dir] ?? 0);
	}

	// Play `spr-{anim}-{name}` if the anim exists — silently no-ops
	// while placeholder art is all we have.
	playAnim(name) {
		const key = `spr-${this.anim}-${name}`;
		if (this.sprite.anims.exists(key)) {
			this.sprite.play(key, true);
		}
	}

	// World position — the sprite's center.
	pos() {
		return {x: this.sprite.body.center.x, y: this.sprite.body.center.y};
	}
}

ECS.registerComponent(Rendered);

//#endregion
