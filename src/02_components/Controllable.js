//#region 02_components/Controllable.js ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Marker — the entity the player drives. Its only job is giving the
// `player` query something to filter on.
class Controllable extends Geotic.Component {}

ECS.registerComponent(Controllable);

//#endregion
