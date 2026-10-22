---
trigger: always_on
description: 
globs: 
---

# Code Style

## Context

- Teaching project for a high school game-dev class — students may have
  little or no coding experience. Optimize for readability over cleverness.
- Must stay portable to Phaser's Desktop web-only app, which runs all JS
  files in one shared global scope.

## Rules

- **No imports or modules** — every file is a script-tag global (required
  for Phaser Desktop portability).
- **Comments** — err toward extra comments. Explain
  steps and Phaser API calls a beginner wouldn't know.
- **Short functions** — prefer many small functions over long ones.
- **Simple syntax** — use terse/advanced syntax sparingly; clear beats
  clever for this audience.
- **K&R braces** — opening brace on the same line as the statement.
- **Line length** — split entities that have sequences of items, like objects, arrays, parameter lists, and chained
  calls, across multiple lines, one item per line, but not if the whole line fits in ~60 chars. 
- **Formatting** — tabs for indentation, single quotes, semicolons.
- **Line spacing** — use 1 empty lines between fields, 2 between functions and fields; 3 between classes or regions
- **IDE Regions** — use //#region RegionName ... //#endregion to organize long sections of code. Standard regions, in order:
  -Files: Each js file shoulld have a region for its whole contents so
    that when it is merged into the single js file, that file's regions can
    be collapsed by source file.
  - Scenes: Configuration (static config fields) → Constructor →
    Events (lifecycle methods init/preload/create/update plus event
    and timer handlers) → Internals.
  - Classes: Configuration → Constructor → Public API →
    Internals → named feature regions (Icons, Focus, Typing...)
    when a subsystem grows big enough to deserve its own.
  - Helper methods belong in Internals unless a more specific named
    region fits better.
  Region headers are a banner ending at column 80 (76 chars + tab):
  `//#region Name` padded with `/` to 76 chars, then a line of 76 `/`,
  then a blank line before the content.

## File organization & naming

- **One symbol per file** — one class or function per file; the filename
  matches the symbol exactly (`resolveHitCmd.js`, `Rendered.js`).
- **Folders carry two-digit numeric prefixes** — they declare script
  load order (`03_data/`, `04_systems/`); nested subfolders follow the
  same scheme (`04_systems/01_queries/`).
- **Components are adjectives** — describing what the entity IS
  (`Rendered`, `Damageable`, `StatusCarrying`); the geotic accessor is
  the decapitalized form (`entity.statusCarrying`).
- **Commands** — `verbCmd(payload)` globals, one per file, filename =
  function name.
- **Managers** — every file under `02_managers/` ends `*Manager.js`.
- **Data elements self-register** — one file per table row, named for
  the key it assigns (`rat.js` → `Enemies.rat`), into a PascalCase
  table file created first in the subfolder.
- **No load-time cross-file refs** — at file-load time a file may only
  define its symbol and self-register into an already-loaded table;
  sibling symbols resolve at call time, never at load time.
- **Exceptions** — helper data-structure classes may live with their
  main class (e.g. the Timed flag markers + `FLAG_COMPONENTS` in
  `Timed.js`); helper functions in `01_global/` and `02_config/` may
  group loosely.