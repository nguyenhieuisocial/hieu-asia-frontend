# @hieu-asia/types

Hand-written TypeScript interfaces mirroring backend Pydantic schemas at
`backend/core/schemas.py`.

## Strategy

Phase 1 (now): hand-written `src/api.ts` matched manually to Pydantic.

Phase 2 (Agent D task): auto-generate via `pydantic2ts` in a pre-commit hook
on the backend repo. Output replaces `src/api.ts`. Manual edits to that file
will be lost.

Until then, when backend schemas change you must:
1. Read `backend/core/schemas.py`.
2. Update matching interface here.
3. Bump this package's version if breaking.

## Public exports

See `src/index.ts`. All types are re-exported from `src/api.ts`.
