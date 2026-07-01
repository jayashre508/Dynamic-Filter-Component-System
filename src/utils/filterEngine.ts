import type { FilterCondition, FilterConfig } from "../types/filter";
import { filterMatchers } from "./filterMatchers";
import { getNestedValue } from "./getNestedValue";
import { isFilterValueEmpty } from "./validation";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Core ─────────────────────────────────────────────────────────────────────

/**
 * Applies a list of FilterConditions against a dataset.
 *
 * Logic:
 *   - Conditions on DIFFERENT fields are AND-ed (record must satisfy all fields)
 *   - Conditions on the SAME field are OR-ed (any one match is sufficient)
 *
 * This mirrors how real filter UIs work: "department = Engineering OR Sales"
 * combined with "salary > 50000" means both constraints must hold, but either
 * department value is acceptable.
 */
export function applyFilters<T extends object>(
  data: T[],
  conditions: FilterCondition[],
  _config: FilterConfig[]
): T[] {
  // Skip conditions that have no usable value yet (incomplete filter rows).
  const active = conditions.filter((c) => !isFilterValueEmpty(c.value));

  if (active.length === 0) return data;

  // Group by field so we can apply OR logic within the same field.
  const byField = groupByField(active);

  return data.filter((record) =>
    // AND across all fields that have at least one active condition.
    [...byField.entries()].every(([field, fieldConditions]) =>
      // OR within the same field.
      fieldConditions.some((condition) => {
        const recordValue = getNestedValue(record as Record<string, unknown>, field);
        const matcher = filterMatchers[condition.operator];
        return matcher(recordValue, condition.value);
      })
    )
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByField(
  conditions: FilterCondition[]
): Map<string, FilterCondition[]> {
  return conditions.reduce((map, condition) => {
    const existing = map.get(condition.field);
    if (existing) {
      existing.push(condition);
    } else {
      map.set(condition.field, [condition]);
    }
    return map;
  }, new Map<string, FilterCondition[]>());
}
