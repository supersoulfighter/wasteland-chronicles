import { defineConfig } from 'vite';
import fs from 'node:fs';
import { resolve } from 'node:path';
import { globSync } from 'tinyglobby';

// Desktop build — emits ONLY dist/wasteland-chronicles.js: every
// src/**/*.js file concatenated verbatim in alphabetical path order
// (the 00_/01_/02_ folder prefixes control load order).
// Phaser Desktop runs plain script files in one shared global scope,
// so unlike the web build we skip bundling, minify, hashing, HTML,
// and public/ assets entirely. Emitting as an asset (not a chunk)
// means rolldown never rewrites the code — comments and formatting
// survive byte-for-byte for students to read.
const concatDesktop = () => {
    let root;

    return {
        name: 'concat-desktop',
        configResolved(config) {
            root = config.root;
        },
        generateBundle(options, bundle) {
            // The entry chunk exists only to give rolldown an input —
            // drop it and emit the verbatim concat as an asset instead.
            for (const name of Object.keys(bundle)) {
                if (bundle[name].type === 'chunk') {
                    delete bundle[name];
                }
            }

            const files = globSync('src/**/*.js', { cwd: root }).sort();
            const source = files
                .map((file) => fs.readFileSync(resolve(root, file), 'utf8'))
                .join('\n');

            this.emitFile({
                type: 'asset',
                fileName: 'wasteland-chronicles.js',
                source
            });
        }
    };
};

export default defineConfig({
    base: './',
    logLevel: 'warn',
    publicDir: false,   // don't copy public/ — Desktop gets assets separately
    build: {
        rollupOptions: {
            // Entry is the concat stub file, not index.html — keeps
            // rolldown happy while the plugin above replaces its
            // output with the verbatim concatenation.
            input: 'wasteland-chronicles.js'
        }
    },
    plugins: [concatDesktop()]
});
