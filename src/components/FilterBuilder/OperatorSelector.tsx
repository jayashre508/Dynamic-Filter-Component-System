import { memo } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { FilterOperator, FieldType } from "../../types/filter";
import { operatorMap } from "../../config/operators";

// Human-readable labels for each operator value.
const operatorLabels: Record<FilterOperator, string> = {
  equals: "Equals",
  contains: "Contains",
  startsWith: "Starts with",
  endsWith: "Ends with",
  doesNotContain: "Does not contain",
  greaterThan: "Greater than",
  greaterThanOrEqual: "Greater than or equal",
  lessThan: "Less than",
  lessThanOrEqual: "Less than or equal",
  between: "Between",
  is: "Is",
  isNot: "Is not",
  in: "Includes",
  notIn: "Excludes",
};

interface OperatorSelectorProps {
  value: FilterOperator;
  fieldType: FieldType;
  onChange: (operator: FilterOperator) => void;
}

export const OperatorSelector = memo(function OperatorSelector({
  value,
  fieldType,
  onChange,
}: OperatorSelectorProps) {
  const operators = operatorMap[fieldType];
  const handleChange = (e: SelectChangeEvent) =>
    onChange(e.target.value as FilterOperator);

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="operator-selector-label">Operator</InputLabel>
      <Select
        labelId="operator-selector-label"
        label="Operator"
        value={value}
        onChange={handleChange}
      >
        {operators.map((op) => (
          <MenuItem key={op} value={op}>
            {operatorLabels[op]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
