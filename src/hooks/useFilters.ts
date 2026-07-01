import { useCallback, useEffect, useState } from "react";
import type { FilterCondition, FilterOperator } from "../types/filter";
import { operatorMap } from "../config/operators";
import { employeeFilterConfig } from "../config/filterConfig";

const STORAGE_KEY = "dynamic-filter-conditions";

const generateId = () => `filter-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function buildDefaultCondition(): FilterCondition {
  const firstField = employeeFilterConfig[0];
  const firstOperator = operatorMap[firstField.type][0];
  return {
    id: generateId(),
    field: firstField.key,
    operator: firstOperator,
    value: null,
  };
}

function loadFromStorage(): FilterCondition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FilterCondition[];
  } catch {
    return [];
  }
}

export interface UseFiltersReturn {
  conditions: FilterCondition[];
  addCondition: () => void;
  updateCondition: (id: string, patch: Partial<Omit<FilterCondition, "id">>) => void;
  removeCondition: (id: string) => void;
  resetConditions: () => void;
}

export function useFilters(): UseFiltersReturn {
  const [conditions, setConditions] = useState<FilterCondition[]>(() => {
    const persisted = loadFromStorage();
    return persisted.length > 0 ? persisted : [];
  });

  // Persist to localStorage on every change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions));
  }, [conditions]);

  const addCondition = useCallback(() => {
    setConditions((prev) => [...prev, buildDefaultCondition()]);
  }, []);

  const updateCondition = useCallback(
    (id: string, patch: Partial<Omit<FilterCondition, "id">>) => {
      setConditions((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;

          // When the field changes, reset operator to the first valid one
          // for the new field type, and clear the value.
          if (patch.field && patch.field !== c.field) {
            const newFieldConfig = employeeFilterConfig.find(
              (fc) => fc.key === patch.field
            );
            const newOperator: FilterOperator = newFieldConfig
              ? operatorMap[newFieldConfig.type][0]
              : c.operator;
            return { ...c, field: patch.field, operator: newOperator, value: null };
          }

          // When the operator changes, clear the value to avoid stale data
          // from a previous operator's input shape (e.g. string → array).
          if (patch.operator && patch.operator !== c.operator) {
            return { ...c, operator: patch.operator, value: null };
          }

          return { ...c, ...patch };
        })
      );
    },
    []
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const resetConditions = useCallback(() => {
    setConditions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { conditions, addCondition, updateCondition, removeCondition, resetConditions };
}
