import type { ModuleSource } from "./types.ts"
import moduleOne from "./modules/01-first-program.ts"
import moduleTwo from "./modules/02-values-and-functions.ts"
import moduleThree from "./modules/03-decisions.ts"
import moduleFour from "./modules/04-loops.ts"
import moduleFive from "./modules/05-collections.ts"
import moduleSix from "./modules/06-program-design.ts"
import moduleSeven from "./modules/07-debugging.ts"
import moduleEight from "./modules/08-modules.ts"
import moduleNine from "./modules/09-testing.ts"
import moduleTen from "./modules/10-files.ts"
import moduleEleven from "./modules/11-regex.ts"
import moduleTwelve from "./modules/12-classes.ts"
import moduleThirteen from "./modules/13-capstone.ts"

/**
 * The course, in order. Module, lesson, and stage IDs are derived from position
 * in these arrays by `scripts/build-curriculum.ts`, so reordering this list
 * renumbers the course consistently.
 */
export const curriculum: ModuleSource[] = [moduleOne, moduleTwo, moduleThree, moduleFour, moduleFive, moduleSix, moduleSeven, moduleEight, moduleNine, moduleTen, moduleEleven, moduleTwelve, moduleThirteen]
