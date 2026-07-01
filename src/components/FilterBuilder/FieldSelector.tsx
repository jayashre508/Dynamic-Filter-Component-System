import { memo } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { FilterConfig } from "../../types/filter";

interface FieldSelectorProps {
  value: string;
  config: FilterConfig[];
  onChange: (field: string) => void;
}

export const FieldSelector = memo(function FieldSelector({
  value,
  config,
  onChange,
}: FieldSelectorProps) {
  const handleChange = (e: SelectChangeEvent) => onChange(e.target.value);

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="field-selector-label">Field</InputLabel>
      <Select
        labelId="field-selector-label"
        label="Field"
        value={value}
        onChange={handleChange}
      >
        {config.map((field) => (
          <MenuItem key={field.key} value={field.key}>
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
