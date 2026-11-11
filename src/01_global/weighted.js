//#region 01_global/weighted.js ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// Weighted random pick. `weightOf` reads each item's weight —
// defaults to the `{w: n}` field shape used by AI choices and boss
// attack tables. Returns null on an empty list or when every weight
// is 0.
const weightedPick = (items, weightOf = (item) => item.w ?? 1) => {
	let total = 0;
	for (const item of items) total += Math.max(0, weightOf(item));
	if (total <= 0) return null;

	let roll = Math.random() * total;
	for (const item of items) {
		roll -= Math.max(0, weightOf(item));
		if (roll <= 0) return item;
	}
	return items[items.length - 1]; // float-rounding safety net
};

//#endregion
