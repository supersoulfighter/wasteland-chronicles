//#region 10_scenes/Hud.js /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Always-on overlay while Playing runs — health + mutation meters,
// level name, and the 10-slot hotkey bar. hudRefreshCmd pokes
// refresh() on events; a 250ms timer also ticks so ability cooldown
// numbers and the mutation bar stay live between events.
class Hud extends Phaser.Scene {

	constructor() {
		super('Hud');
	}

	create() {
		this.meters = this.add.text(8, 8, '', {
			fontSize: '12px', color: '#ffffff',
		}).setScrollFactor(0).setDepth(2000);
		this.hotbar = this.add.text(8, 560, '', {
			fontSize: '10px', color: '#aaffaa',
		}).setScrollFactor(0).setDepth(2000);
		this.title = this.add.text(680, 8, '', {
			fontSize: '10px', color: '#8888aa',
		}).setScrollFactor(0).setDepth(2000);
		this.refresh();
		this.time.addEvent({
			delay: 250, loop: true, callback: () => this.refresh(),
		});
	}

	// Rebuild the three lines off the live player entity. Bars are
	// ascii — 20 chars wide — so the whole HUD is text until art lands.
	refresh() {
		const e = getQueries()?.player.get()[0];
		if (!e || e.isDestroyed) return;
		const bar = (v, max) => '█'.repeat(Math.round(v / max * 20))
			.padEnd(20, '░');
		const hp = e.damageable;
		const mut = e.mutated;
		this.meters.setText(
			`HP   ${bar(hp.value, hp.max)} ${Math.ceil(hp.value)}/${hp.max}\n` +
			`MUT  ${bar(mut.value, mut.max)} ${Math.ceil(mut.value)}/${mut.max}\n` +
			`LVL  ${SaveManager.load().playerLevel}`
		);
		// shown set on the hotbar; sel highlights the cursor
		const s = e.slotted;
		const slots = s.list().map((key, i) => {
			const mark = i === s.sel ? '*' : ' ';
			const detail = s.mode === 'attacks'
				? `${e.consumable.left(key)}`
				: `${e.powered.actives[key]?.toFixed(0)}s`;
			return `${mark}${i}${key}(${detail})`;
		});
		this.hotbar.setText(
			`[${s.mode}] ${slots.join(' ')}`
		);
		this.title.setText(getQueries()
			? Levels[game.scene.getScene('Playing')?.levelKey]?.name ?? ''
			: '');
	}
}

//#endregion
