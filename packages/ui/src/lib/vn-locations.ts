/**
 * Vietnamese administrative locations — post-1-July-2025 reform (2-tier:
 * province → ward/commune; 34 provinces, 3321 wards; the district level was
 * removed by the reform, so there is intentionally no district layer here).
 *
 * Source: thanglequoc/vietnamese-provinces-database (MIT), "vn-only simplified"
 * dataset. The ~220KB JSON is lazy-loaded via dynamic import so it is
 * code-split and never ships in any app's initial bundle.
 */

export interface VnWard {
  /** Official ward/commune code, e.g. "00004". */
  code: string;
  /** Vietnamese full name, e.g. "Phường Ba Đình". */
  name: string;
  /** Parent province code. */
  provinceCode: string;
}

export interface VnProvince {
  /** Official province code, e.g. "01". */
  code: string;
  /** Vietnamese full name, e.g. "Thành phố Hà Nội". */
  name: string;
  wards: VnWard[];
}

interface RawWard {
  Code: string;
  FullName: string;
  ProvinceCode: string;
}
interface RawProvince {
  Code: string;
  FullName: string;
  Wards: RawWard[];
}

let cache: VnProvince[] | null = null;

/** Lazily load + normalize the full province→ward dataset (cached after first call). */
export async function loadVnProvinces(): Promise<VnProvince[]> {
  if (cache) return cache;
  const mod = await import('../data/vn-units.json');
  const raw = (mod.default ?? mod) as unknown as RawProvince[];
  cache = raw.map((p) => ({
    code: p.Code,
    name: p.FullName,
    wards: p.Wards.map((w) => ({
      code: w.Code,
      name: w.FullName,
      provinceCode: w.ProvinceCode,
    })),
  }));
  return cache;
}
