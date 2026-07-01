import { memo, useCallback } from "react";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import type { FilterConfig } from "../../types/filter";

interface ValueInputProps {
  fieldConfig: FilterConfig;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export const ValueInput = memo(function ValueInput({
  fieldConfig,
  value,
  error,
  onChange,
}: ValueInputProps) {
  const { type, options = [] } = fieldConfig;

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  const handleSelectChange = useCallback(
    (e: SelectChangeEvent) => onChange(e.target.value),
    [onChange]
  );

  if (type === "boolean") {
    const checked = value === true || value === "true";
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            size="small"
          />
        }
        label="Active"
        sx={{ ml: 0 }}
      />
    );
  }

  if (type === "select") {
    return (
      <FormControl size="small" sx={{ minWidth: 160 }} error={!!error}>
        <InputLabel>Value</InputLabel>
        <Select
          label="Value"
          value={typeof value === "string" ? value : ""}
          onChange={handleSelectChange}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (type === "multiselect") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Autocomplete
        multiple
        size="small"
        options={options.map((o) => o.value)}
        getOptionLabel={(opt) => options.find((o) => o.value === opt)?.label ?? opt}
        value={selected}
        onChange={(_, newValue) => onChange(newValue)}
        sx={{ minWidth: 220 }}
        renderInput={(params) => (
          <TextField {...params} label="Values" error={!!error} helperText={error} />
        )}
      />
    );
  }

  if (type === "date") {
    const range = Array.isArray(value) ? value : [null, null];
    const [from, to] = range as [string | null, string | null];

    const handleFrom = (d: Dayjs | null) =>
      onChange([d ? d.toISOString() : null, to]);
    const handleTo = (d: Dayjs | null) =>
      onChange([from, d ? d.toISOString() : null]);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <DatePicker
            label="From"
            value={from ? dayjs(from) : null}
            onChange={handleFrom}
            slotProps={{
              textField: { size: "small", error: !!error, sx: { width: 150 } },
            }}
          />
          <DatePicker
            label="To"
            value={to ? dayjs(to) : null}
            onChange={handleTo}
            slotProps={{
              textField: { size: "small", error: !!error, sx: { width: 150 } },
            }}
          />
        </Stack>
      </LocalizationProvider>
    );
  }

  if (type === "currency") {
    const range = Array.isArray(value) ? value : [null, null];
    const [from, to] = range as [string | null, string | null];

    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <TextField
          label="Min ($)"
          size="small"
          type="number"
          value={from ?? ""}
          onChange={(e) => onChange([e.target.value || null, to])}
          error={!!error}
          sx={{ width: 120 }}
        />
        <TextField
          label="Max ($)"
          size="small"
          type="number"
          value={to ?? ""}
          onChange={(e) => onChange([from, e.target.value || null])}
          error={!!error}
          helperText={error}
          sx={{ width: 120 }}
        />
      </Stack>
    );
  }

  // text / number fallback
  return (
    <TextField
      label="Value"
      size="small"
      type={type === "number" ? "number" : "text"}
      value={typeof value === "string" || typeof value === "number" ? value : ""}
      onChange={handleTextChange}
      error={!!error}
      helperText={error}
      sx={{ minWidth: 160 }}
    />
  );
});
