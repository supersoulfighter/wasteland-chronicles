//#region 02_components/Timed.js ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Flag markers — statuses so simple they're just "entity has X until
// endsAt". One base class plus one-line subclasses: queries filter
// by type, which is why they're separate classes and not a list
// field. This file is the sanctioned exception to one-class-per-file
// — the markers are Timed's helper data-structures and live here.
class Timed extends Geotic.Component {

	static properties = {endsAt: 0};   // ms timestamp the flag lapses

	expired(now) {
		return now >= this.endsAt;
	}
}

// The plain flags — all behavior is "block the query until endsAt".
class Staggered extends Timed {}
class KnockedDown extends Timed {}
// Feared carries the flee vector — MovementSystem overrides intent
// with it while the flag lives.
class Feared extends Timed {

	static properties = {endsAt: 0, dir: {x: 0, y: 0}};
}
class Silenced extends Timed {}
class Entangled extends Timed {}
class Invulnerable extends Timed {}
class Burrowed extends Timed {}

// Grabbed adds the wiggle-free state: which way the grabber is, and
// how many opposite taps it takes to break free early.
class Grabbed extends Timed {

	static properties = {endsAt: 0, dir: null, taps: 0};
}

// Launched = this entity is currently a projectile (Green's kick) —
// damage it deals on impact rides in `dmg`.
class Launched extends Timed {

	static properties = {endsAt: 0, dmg: 0};
}

// StatusSystem sweeps every one of these by `endsAt`.
const FLAG_COMPONENTS = [
	Staggered, KnockedDown, Feared, Silenced, Entangled,
	Invulnerable, Burrowed, Grabbed, Launched,
];

FLAG_COMPONENTS.forEach(C => ECS.registerComponent(C));

//#endregion
