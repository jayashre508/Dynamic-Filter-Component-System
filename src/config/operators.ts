import type { FieldType, FilterOperator } from "../types/filter";

export const operatorMap: Record<FieldType, FilterOperator[]> = {
  text: [
    "equals",
    "contains",
    "startsWith",
    "endsWith",
    "doesNotContain",
  ],

  number: [
    "equals",
    "greaterThan",
    "greaterThanOrEqual",
    "lessThan",
    "lessThanOrEqual",
  ],

  currency: [
    "between",
  ],

  date: [
    "between",
  ],

  select: [
    "is",
    "isNot",
  ],

  multiselect: [
    "in",
    "notIn",
  ],

  boolean: [
    "is",
  ],
};