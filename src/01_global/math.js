//#region 01_global/math.js ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Small math helpers shared by systems, commands, and attacklib.

// Distance between two points.
const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

// Angle in radians from point a to point b. Screen space: +y is
// down, 0 points right, PI/2 points down.
const angleTo = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);

// Shortest signed difference between two angles, wrapped to
// (-PI, PI]. Cone checks use it to ask "is the target within X
// degrees of the aim direction?".
const angleDiff = (a, b) => {
	let d = (b - a) % (Math.PI * 2);
	if (d > Math.PI) d -= Math.PI * 2;
	if (d <= -Math.PI) d += Math.PI * 2;
	return d;
};

// Snap a vector to one of the 4 facing names used everywhere.
// Animation rows are down/right/up — 'left' is 'right' + flipX.
const dir4 = (x, y) => {
	if (Math.abs(x) > Math.abs(y)) return x < 0 ? 'left' : 'right';
	return y < 0 ? 'up' : 'down';
};

//#endregion
