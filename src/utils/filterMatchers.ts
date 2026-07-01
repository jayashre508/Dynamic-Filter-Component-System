import type { FilterOperator } from "../types/filter";

type MatcherFn = (recordValue: unknown, filterValue: unknown) => boolean;

// ─── Text helpers ────────────────────────────────────────────────────────────

const str = (v: unknown) => String(v ?? "").toLowerCase();

// ─── Between helper ──────────────────────────────────────────────────────────
// Handles both numeric ranges and ISO date ranges uniformly.

const inRange = (
  recordValue: unknown,
  filterValue: unknown
): boolean => {
  if (!Array.isArray(filterValue) || filterValue.length !== 2) return true;
  const [from, to] = filterValue as [unknown, unknown];
  if (from == null && to == null) return true;

  // Date range: compare ISO strings lexicographically (valid because ISO 8601
  // sorts correctly as strings, avoiding timezone-sensitive Date construction).
  if (typeof recordValue === "string") {
    const rv = recordValue;
    if (from != null && rv < String(from)) return false;
    if (to != null && rv > String(to)) return false;
    return true;
  }

  const num = Number(recordValue);
  if (isNaN(num)) return false;
  if (from != null && num < Number(from)) return false;
  if (to != null && num > Number(to)) return false;
  return true;
};

// ─── Matcher map ─────────────────────────────────────────────────────────────
// Keyed by FilterOperator — engine dispatches via lookup, no switch needed.

export const filterMatchers: Record<FilterOperator, MatcherFn> = {
  // Text
  equals: (rv, fv) => str(rv) === str(fv),
  contains: (rv, fv) => str(rv).includes(str(fv)),
  startsWith: (rv, fv) => str(rv).startsWith(str(fv)),
  endsWith: (rv, fv) => str(rv).endsWith(str(fv)),
  doesNotContain: (rv, fv) => !str(rv).includes(str(fv)),

  // Number
  greaterThan: (rv, fv) => Number(rv) > Number(fv),
  greaterThanOrEqual: (rv, fv) => Number(rv) >= Number(fv),
  lessThan: (rv, fv) => Number(rv) < Number(fv),
  lessThanOrEqual: (rv, fv) => Number(rv) <= Number(fv),

  // Range (date & currency)
  between: inRange,

  // Select / Boolean
  is: (rv, fv) => {
    if (typeof rv === "boolean") return rv === (fv === "true" || fv === true);
    return str(rv) === str(fv);
  },
  isNot: (rv, fv) => str(rv) !== str(fv),

  // MultiSelect — recordValue is string[]; filterValue is string[]
  in: (rv, fv) => {
    if (!Array.isArray(fv) || fv.length === 0) return true;
    if (Array.isArray(rv)) return (fv as string[]).some((f) => rv.includes(f));
    return (fv as string[]).includes(String(rv));
  },
  notIn: (rv, fv) => {
    if (!Array.isArray(fv) || fv.length === 0) return true;
    if (Array.isArray(rv)) return !(fv as string[]).some((f) => rv.includes(f));
    return !(fv as string[]).includes(String(rv));
  },
};
