//#region 01_global/los.js /////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Line-of-sight against wall tiles. "Raycast by sampling": walk the
// segment in half-tile steps and ask the collision layer whether a
// wall tile sits under each point. Skips both endpoints — entities
// stand on walkable tiles, and a target hugging a wall shouldn't be
// blocked by the wall behind it.
const hasLineOfSight = (x0, y0, x1, y1, layer) => {
	if (!layer) return true; // the map has no wall layer yet
	const length = dist(x0, y0, x1, y1);
	const steps = Math.max(1, Math.ceil(length / 8)); // half a tile
	for (let i = 1; i < steps; i++) {
		const t = i / steps;
		const tile = layer.getTileAtWorldXY(
			x0 + (x1 - x0) * t,
			y0 + (y1 - y0) * t
		);
		if (tile?.collides) return false;
	}
	return true;
};

//#endregion
