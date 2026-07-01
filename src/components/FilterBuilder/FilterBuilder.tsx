import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Stack, Typography } from "@mui/material";
import type { FilterCondition, FilterConfig } from "../../types/filter";
import type { Employee } from "../../types/employee";
import { validateConditions } from "../../utils/validation";
import { FilterToolbar } from "./FilterToolbar";
import { FilterRow } from "./FilterRow";

interface FilterBuilderProps {
  conditions: FilterCondition[];
  config: FilterConfig[];
  filteredData: Employee[];
  totalCount: number;
  onAddCondition: () => void;
  onUpdateCondition: (id: string, patch: Partial<Omit<FilterCondition, "id">>) => void;
  onRemoveCondition: (id: string) => void;
  onResetConditions: () => void;
  /** Called with debounced conditions — drives the table. */
  onConditionsChange: (conditions: FilterCondition[]) => void;
  debounceMs?: number;
}

export const FilterBuilder = memo(function FilterBuilder({
  conditions,
  config,
  filteredData,
  totalCount,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onResetConditions,
  onConditionsChange,
  debounceMs = 300,
}: FilterBuilderProps) {
  // Debounce: only propagate conditions to the table after the user
  // stops typing for `debounceMs` ms — avoids filtering on every keystroke.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onConditionsChange(conditions);
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [conditions, debounceMs, onConditionsChange]);

  // Validation map: conditionId → ValidationResult
  const validationMap = useMemo(
    () => validateConditions(conditions, config),
    [conditions, config]
  );

  const activeFilterCount = useMemo(
    () => conditions.filter((c) => c.value !== null && c.value !== "").length,
    [conditions]
  );

  const handleUpdate = useCallback(
    (id: string, patch: Partial<Omit<FilterCondition, "id">>) =>
      onUpdateCondition(id, patch),
    [onUpdateCondition]
  );

  const handleRemove = useCallback(
    (id: string) => onRemoveCondition(id),
    [onRemoveCondition]
  );

  return (
    <Stack spacing={2}>
      <FilterToolbar
        activeFilterCount={activeFilterCount}
        totalCount={totalCount}
        filteredCount={filteredData.length}
        filteredData={filteredData}
        onAddFilter={onAddCondition}
        onReset={onResetConditions}
      />

      {conditions.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
            Filters on different fields are combined with AND. Multiple filters
            on the same field are combined with OR.
          </Typography>

          {conditions.map((condition) => (
            <FilterRow
              key={condition.id}
              condition={condition}
              config={config}
              validation={validationMap.get(condition.id)}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
});
