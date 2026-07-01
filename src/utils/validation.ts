import type { FilterCondition, FilterConfig, FieldType } from "../types/filter";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Empty value guard ────────────────────────────────────────────────────────
// Used by filterEngine to skip incomplete filter rows.

export function isFilterValueEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) {
    // between tuple: [null, null] or ["", ""] counts as empty
    if (value.length === 0) return true;
    return value.every((v) => v === null || v === undefined || v === "");
  }
  return false;
}

// ─── Single condition validator ───────────────────────────────────────────────

export function validateCondition(
  condition: FilterCondition,
  config: FilterConfig[]
): ValidationResult {
  const fieldConfig = config.find((c) => c.key === condition.field);
  if (!fieldConfig) return { valid: false, error: "Unknown field." };

  if (isFilterValueEmpty(condition.value)) {
    return { valid: false, error: "Value is required." };
  }

  return validateByType(fieldConfig.type, condition.value);
}

// ─── Type-specific validation ─────────────────────────────────────────────────

function validateByType(type: FieldType, value: unknown): ValidationResult {
  switch (type) {
    case "number":
    case "currency": {
      if (type === "currency" || Array.isArray(value)) {
        return validateBetween(value, "amount");
      }
      if (isNaN(Number(value))) {
        return { valid: false, error: "Must be a valid number." };
      }
      return { valid: true };
    }

    case "date":
      return validateBetween(value, "date");

    case "multiselect": {
      if (!Array.isArray(value) || value.length === 0) {
        return { valid: false, error: "Select at least one option." };
      }
      return { valid: true };
    }

    default:
      return { valid: true };
  }
}

function validateBetween(
  value: unknown,
  kind: "amount" | "date"
): ValidationResult {
  if (!Array.isArray(value) || value.length !== 2) {
    return { valid: false, error: `Provide a valid ${kind} range.` };
  }

  const [from, to] = value as [unknown, unknown];

  if (from == null && to == null) {
    return { valid: false, error: "At least one range value is required." };
  }

  if (kind === "amount") {
    if (from != null && isNaN(Number(from))) {
      return { valid: false, error: "From value must be a valid number." };
    }
    if (to != null && isNaN(Number(to))) {
      return { valid: false, error: "To value must be a valid number." };
    }
    if (from != null && to != null && Number(from) > Number(to)) {
      return { valid: false, error: "From must be less than or equal to To." };
    }
  }

  if (kind === "date") {
    if (from != null && to != null && String(from) > String(to)) {
      return { valid: false, error: "Start date must be before end date." };
    }
  }

  return { valid: true };
}

// ─── Full list validator ──────────────────────────────────────────────────────
// Returns a map of conditionId → ValidationResult for O(1) UI lookup.

export function validateConditions(
  conditions: FilterCondition[],
  config: FilterConfig[]
): Map<string, ValidationResult> {
  return new Map(
    conditions.map((c) => [c.id, validateCondition(c, config)])
  );
}
