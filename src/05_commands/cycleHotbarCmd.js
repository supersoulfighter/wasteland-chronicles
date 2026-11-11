//#region 05_commands/cycleHotbarCmd.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Every hotbar input lands here:
//   {toggle: true}          — Shift/RB flips attacks ↔ actives
//   {slot: n}               — number keys pick in the shown set
//   {which, dir}            — cycle keys step a named page
// `sel` moves the on-screen cursor; `attackSel`/`activeSel` keep
// each page's armed item so toggling never loses it.
const cycleHotbarCmd = ({entity, which, dir, slot, toggle}) => {
	const s = entity.slotted;
	if (toggle) {
		s.toggle();
		return;
	}
	if (slot !== undefined) {
		s.slot(slot);                       // shown set only
		if (s.mode === 'attacks') s.attackSel = s.sel;
		else s.activeSel = s.sel;
		return;
	}
	// named-page cycle — flips the bar onto that page first
	s.mode = which === 'attack' ? 'attacks' : 'actives';
	s.cycle(dir ?? 1);
	if (s.mode === 'attacks') s.attackSel = s.sel;
	else s.activeSel = s.sel;
	game.events.emit('ammo-changed', {entity});
};

//#endregion
