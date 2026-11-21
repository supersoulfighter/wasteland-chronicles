//#region 01_global/ecs.js /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// The one Geotic engine for the whole game. Component classes
// self-register onto it at file-load (`ECS.registerComponent`), and
// each level run builds a fresh `world` from it (see Playing).
const ECS = new Geotic.Engine();

// Where the current level run keeps its world, query table, and
// wall/hazard layers. Playing.create calls bindWorld/bindLevel;
// commands and helpers read them here so nothing has to thread a
// scene reference through every call.
let world = null;
let queries = null;
let walls = null;
let hazards = null;
let grounds = null;

const bindWorld = (newWorld, newQueries) => {
	world = newWorld;
	queries = newQueries;
};

const bindLevel = ({wallLayer, hazardLayer, groundLayer}) => {
	walls = wallLayer;
	hazards = hazardLayer ?? null;
	grounds = groundLayer ?? null;
};

const getWorld = () => world;
const getQueries = () => queries;
const getWalls = () => walls;
const getHazardLayer = () => hazards;
const getGroundLayer = () => grounds;

// The current level's map-wide ground def (Terrains.grounds) —
// every consumer of a terrain effect reads it through here.
const getGroundDef = () =>
	Terrains.grounds[
		game.scene.getScene('Playing')?.level?.def?.terrain
	] ?? null;

// Sprite → entity lookup used by every collision callback. Sprites
// carry their entity id as data (written by the spawn commands).
const entityOf = (sprite) => {
	const eid = sprite?.getData('eid');
	return eid ? world.getEntity(eid) : null;
};

// Geotic mounts each component at the decapitalized class name —
// Damageable → entity.damageable. There is no entity.get(class), so
// flag queries that hold the class itself resolve it through here.
const accessor = (C) =>
	C.name[0].toLowerCase() + C.name.slice(1);

//#endregion
