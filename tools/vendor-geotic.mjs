// Regenerates src/00_libraries/01_geotic.js from the installed geotic
// package. geotic's dist (build/index.js) is a single self-contained
// ES module — all internals and the camelcase dep are already inlined,
// and it ends with one `export { Component, Engine };` line. So the
// whole "bundle" is just an IIFE wrapper: no esbuild, no rollup.
// Run: yarn vendor-geotic   (yarn add geotic@latest first to upgrade)

import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const src = readFileSync(
	resolve('node_modules/geotic/build/index.js'),
	'utf8'
);

// Strip the trailing export statement (and its sourcemap comment) —
// we return the names from the IIFE instead.
const body = src.replace(/\nexport \{[^}]*\};[\s\S]*$/, '');

const out = `// Vendored geotic (MIT — https://github.com/ddmills/geotic).
// build/index.js wrapped as an IIFE so it defines the Geotic global
// without modules. Regenerate: yarn vendor-geotic.
//#region 00_libraries/01_geotic.js ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

const Geotic = (() => {
	'use strict';
	// The game's Map scene class shadows the builtin at module scope —
	// pin the real one here so new Map() inside geotic still works.
	const Map = globalThis.Map;
${body}
	return {Component, Engine};
})();

//#endregion
`;

writeFileSync('src/00_libraries/01_geotic.js', out);
console.log('wrote src/00_libraries/01_geotic.js');
