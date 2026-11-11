//#region 01_global/placeholder.js /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Generates a colored stand-in texture for every asset key the game
// references, skipping keys a real file already provided. Called once
// by Boot — code is written against final keys from day one, so art
// drops in later without touching logic.

// Stable color per key so placeholders are visually distinct.
const keyColor = (key) => {
	let h = 0;
	for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	return Phaser.Display.Color
		.HSLToColor((h % 360) / 360, 0.75, 0.55).color;
};

// `spr-{name}` — a 16x48 strip split into 3 frames, matching the real
// sheets' rows: down / right / up (left is 'right' + flipX). A small
// facing notch per frame keeps direction readable.
const ensureSprite = (scene, key) => {
	if (scene.textures.exists(key)) return;
	const g = scene.make.graphics({add: false});
	g.fillStyle(keyColor(key)).fillRect(0, 0, 16, 48);
	g.lineStyle(1, 0x000000).strokeRect(0, 0, 16, 48);
	g.fillStyle(0xffffff);
	g.fillRect(6, 12, 4, 4);   // down frame: notch low
	g.fillRect(11, 22, 4, 4);  // right frame: notch right
	g.fillRect(6, 34, 4, 4);   // up frame: notch high
	g.generateTexture(key, 16, 48);
	g.destroy();
	// split the strip into frames 0=down, 1=right, 2=up
	[0, 1, 2].forEach(i =>
		scene.textures.get(key).add(i, 0, 0, i * 16, 16, 16));
};

// `icon-{key}` — a 16x16 chip with a light border.
const ensureIcon = (scene, key) => {
	if (scene.textures.exists(key)) return;
	const g = scene.make.graphics({add: false});
	g.fillStyle(keyColor(key)).fillRect(0, 0, 16, 16);
	g.lineStyle(1, 0xffffff).strokeRect(0.5, 0.5, 15, 15);
	g.generateTexture(key, 16, 16);
	g.destroy();
};

// Walk every data table, collect the asset keys it references, and
// fill whatever is missing. The tables are call-time globals here —
// this runs inside Boot.create, long after file-load.
const makePlaceholderTextures = (scene) => {
	const sprites = new Set(['xavier', 'bullet', 'crystal']);
	const icons = new Set();

	Object.values(Crystals).forEach(def => icons.add(def.icon));
	Object.entries(Enemies).forEach(([key, def]) =>
		sprites.add(`spr-${def.anim ?? key}`));
	Object.entries(Bosses).forEach(([key, def]) =>
		sprites.add(`spr-${def.anim ?? key}`));
	Object.entries(Abilities.actives).forEach(([key, def]) =>
		icons.add(def.icon ?? `icon-${key}`));
	Object.entries(Abilities.passives).forEach(([key, def]) =>
		icons.add(def.icon ?? `icon-${key}`));
	Object.entries(Props).forEach(([key, def]) =>
		sprites.add(`spr-${def.anim ?? key}`));

	sprites.forEach(key => ensureSprite(scene, key));
	icons.forEach(key => ensureIcon(scene, key));

	// `tiles` — the stub-map tileset: index 0 empty, 1 floor,
	// 2 wall, 3 water. One 4-frame 16px strip.
	if (!scene.textures.exists('tiles')) {
		const g = scene.make.graphics({add: false});
		const shades = [0x000000, 0x3a3f44, 0x707a85, 0x2255aa];
		shades.forEach((color, i) => {
			g.fillStyle(color).fillRect(i * 16, 0, 16, 16);
			g.lineStyle(1, 0x222222).strokeRect(
				i * 16 + 0.5, 0.5, 15, 15);
		});
		g.generateTexture('tiles', 64, 16);
		g.destroy();
	}
};

//#endregion
