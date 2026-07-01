// ===============================
// Field Types
// ===============================

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "currency"
  | "select"
  | "multiselect"
  | "boolean";

// ===============================
// Option Type
// Used for Select & MultiSelect
// ===============================

export interface FilterOption {
  label: string;
  value: string;
}

// ===============================
// Filter Configuration
// Defines how a filter should behave
// ===============================

export interface FilterConfig {
  key: string;
  label: string;
  type: FieldType;

  options?: FilterOption[];
}

// ===============================
// Filter Operators
// ===============================

export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "doesNotContain"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"
  | "is"
  | "isNot"
  | "in"
  | "notIn";

// ===============================
// One Active Filter
// Example:
// {
//   field: "salary",
//   operator: "greaterThan",
//   value: 50000
// }
// ===============================

export interface FilterCondition {
  id: string;

  field: string;

  operator: FilterOperator;

  value: unknown;
}