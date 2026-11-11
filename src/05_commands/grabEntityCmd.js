//#region 05_commands/grabEntityCmd.js /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Grab helper the boss specials share — Grabbed is a Timed flag plus
// the wiggle-free state: `dir` is which way the grabber sits (the
// sprite may lean into it), `taps` is how many direction presses break
// free early. The movers query excludes Grabbed, so the flag alone
// stops the victim moving.
const grabEntityCmd = ({attacker, target, pattern = {}}) => {
	if (!target?.moveable) return false;
	const p = target.rendered.pos();
	const a = attacker?.rendered?.pos() ?? p;
	const ang = angleTo(a.x, a.y, p.x, p.y);
	const props = {
		endsAt: game.loop.now + (pattern.duration ?? 2) * 1000,
		taps: pattern.taps ?? 16,
		dir: {x: Math.cos(ang), y: Math.sin(ang)},
	};
	if (target.has(Grabbed)) {
		Object.assign(target.grabbed, props);   // re-grab refreshes
	} else {
		target.add(Grabbed, props);
	}
	return true;
};

//#endregion
