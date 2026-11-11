//#region 02_components/Launchable.js //////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Marker — Green's kick can turn this entity into a projectile.
// Absent on size ≥ 3 enemies and on bosses (the recipe just doesn't
// add it), so launchEntityCmd only has to ask `entity.has(Launchable)`.
class Launchable extends Geotic.Component {}

ECS.registerComponent(Launchable);

//#endregion
