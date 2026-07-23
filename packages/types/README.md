# @hieu-asia/types

Hand-written TypeScript interfaces mirroring the shapes the backend actually
returns.

## Where the shapes come from

The Python/FastAPI backend this package was originally written against is
**retired** — `backend/core/schemas.py` no longer exists, and neither does the
`pydantic2ts` auto-generation plan that used to be Phase 2 here.

Today the backend is the Cloudflare Worker in the sibling `backend` repo:

```
backend/infra/cloudflare/workers/api-gateway/src/index.ts   (+ src/content, src/daily, src/admin, src/llm, src/tools)
```

That worker has **no runtime schema library** (no zod / valibot / ajv), so there
is nothing to generate from: the response shapes live inline in the route
handlers and are mirrored **by hand** in `src/api.ts`.

## When a backend response changes

1. Read the matching handler in the worker source above.
2. Update the interface in `src/api.ts`.
3. Bump this package's version if the change is breaking.

There is no automated check that the two sides agree — drift is caught only at
runtime. Closing that gap (one shared, validated contract used by both the
worker and the apps) is tracked as its own piece of work; it needs a schema
library added on the worker side first, so it cannot be done from this repo
alone.

## Public exports

See `src/index.ts`. All types are re-exported from `src/api.ts`.
