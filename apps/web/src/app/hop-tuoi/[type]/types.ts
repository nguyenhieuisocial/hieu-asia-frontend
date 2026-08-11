// Shared between page.tsx (server) and HopTuoiClient.tsx (client) so neither
// has to import the other — page.tsx previously exported `HopTuoiType` and
// HopTuoiClient.tsx imported it back, a type-only circular import GitNexus
// flags as a dependency cycle. Harmless at runtime (erased by TS), but easy
// to break: single source of truth here instead.
export const TYPES = ['wedding', 'business', 'birth-child', 'xong-dat'] as const;
export type HopTuoiType = (typeof TYPES)[number];
