//#region 04_systems/01_queries/createQueries.js ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Every query in the game, declared in one place. Queries update
// themselves as components come and go, so a missing component
// silently excludes an entity — when an entity "does nothing", this
// file is the checklist.
//
// `Launched` sits in movers' `none` alongside the flags the doc
// lists: a launched body keeps its knock-away velocity — letting it
// into movers would have MovementSystem zero it.
const createQueries = (world) => {
	const q = {
		player: world.createQuery({
			all: [Controllable, Rendered],
		}),
		movers: world.createQuery({
			all: [Rendered, Moveable],
			none: [
				Staggered, KnockedDown, Grabbed, Entangled, Launched,
			],
		}),
		ai: world.createQuery({
			all: [Autonomous, Rendered],
			none: [Staggered, KnockedDown, Grabbed],
		}),
		projectiles: world.createQuery({
			all: [Ballistic, Rendered],
		}),
		carriers: world.createQuery({all: [StatusCarrying]}),
		waves: world.createQuery({all: [Spawning]}),
		lights: world.createQuery({all: [Luminous, Rendered]}),
	};
	// one query per timed flag marker for StatusSystem's expiry sweep
	FLAG_COMPONENTS.forEach(C => {
		q[C.name] = world.createQuery({all: [C]});
	});
	return q;
};

//#endregion
