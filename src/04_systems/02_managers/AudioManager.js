//#region 04_systems/02_managers/AudioManager.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Thin audio wrapper — playSfx/playMusic honor the saved volume
// settings. Until students deliver sounds every key is a no-op:
// cache-miss keys return quietly so calls can be written against the
// final keys today.
const AudioManager = {

	music: null,

	playSfx(scene, key) {
		if (!scene.cache.audio.exists(key)) return;
		const vol = SaveManager.load().settings.sfx;
		scene.sound.play(key, {volume: vol});
	},

	playMusic(scene, key) {
		if (!scene.cache.audio.exists(key)) return;
		const vol = SaveManager.load().settings.music;
		if (this.music?.key === key) return;      // already playing
		this.music?.stop();
		this.music = scene.sound.add(key, {volume: vol, loop: true});
		this.music.play();
	},
};

//#endregion
