//#region 04_systems/01_queries/Darkness.js ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The cave is dark. A RenderTexture stretched over the camera fills
// near-black every frame; a radial-gradient sprite (ERASE blend)
// punches a hole at each entity in the `lights` query — the player's
// radius is the vision circle, smaller holes sit on glowing props.
// The gradient is smooth (non-pixelated) on purpose.
const Darkness = {

	init(scene) {
		// one shared radial hole-texture, generated once
		if (!scene.textures.exists('darkness-hole')) {
			const tex = scene.textures.createCanvas(
				'darkness-hole', 256, 256);
			const ctx = tex.getContext();
			const g = ctx.createRadialGradient(
				128, 128, 0, 128, 128, 128);
			g.addColorStop(0, 'rgba(255,255,255,1)');
			g.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, 256, 256);
			tex.refresh();
		}
		this.rt = scene.add.renderTexture(
			0, 0, scene.scale.width, scene.scale.height)
			.setOrigin(0)
			.setScrollFactor(0)
			.setDepth(1000);
		// the stamp we erase with
		this.stamp = scene.make.image({key: 'darkness-hole', add: false});
	},

	tick(scene, dt) {
		if (!this.rt) return;
		const cam = scene.cameras.main;
		this.rt.clear().fill(0x050510, 0.85);
		const visionMult = getGroundDef()?.visionMult ?? 1;
		for (const e of getQueries().lights.get()) {
			const s = e.rendered.sprite;
			this.stamp
				.setPosition(s.x - cam.scrollX, s.y - cam.scrollY)
				// stamp is 256px across → scale to the light radius;
				// ash ground dims every hole in the cave
				.setScale((e.luminous.radius * 2 * visionMult) / 256);
			this.rt.erase(this.stamp);
		}
	},
};

//#endregion
