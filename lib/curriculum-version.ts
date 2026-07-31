/**
 * Version of the curriculum bundled in `lib/lessons.json`.
 *
 * The application can also serve a curriculum stored in Firestore, which is how
 * teacher edits persist. That remote document is only trusted when it was
 * written against the current bundled version. A document with a missing or
 * older version belongs to a superseded course and is ignored in favour of the
 * bundled curriculum, so shipping a new course cannot be silently overridden by
 * whatever happens to be in the database.
 *
 * Raise this number whenever `lib/lessons.json` is replaced with a course that
 * teacher edits should not be carried across. Never lower it.
 */
export const CURRICULUM_VERSION = 2
