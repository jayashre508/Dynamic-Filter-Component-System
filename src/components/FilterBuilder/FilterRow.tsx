import { memo, useCallback } from "react";
import { IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { X } from "lucide-react";
import type { FilterCondition, FilterConfig, FilterOperator } from "../../types/filter";
import type { ValidationResult } from "../../utils/validation";
import { FieldSelector } from "./FieldSelector";
import { OperatorSelector } from "./OperatorSelector";
import { ValueInput } from "./ValueInput";

interface FilterRowProps {
  condition: FilterCondition;
  config: FilterConfig[];
  validation: ValidationResult | undefined;
  onUpdate: (id: string, patch: Partial<Omit<FilterCondition, "id">>) => void;
  onRemove: (id: string) => void;
}

export const FilterRow = memo(function FilterRow({
  condition,
  config,
  validation,
  onUpdate,
  onRemove,
}: FilterRowProps) {
  const fieldConfig = config.find((c) => c.key === condition.field) ?? config[0];

  const handleFieldChange = useCallback(
    (field: string) => onUpdate(condition.id, { field }),
    [condition.id, onUpdate]
  );

  const handleOperatorChange = useCallback(
    (operator: FilterOperator) => onUpdate(condition.id, { operator }),
    [condition.id, onUpdate]
  );

  const handleValueChange = useCallback(
    (value: unknown) => onUpdate(condition.id, { value }),
    [condition.id, onUpdate]
  );

  const handleRemove = useCallback(
    () => onRemove(condition.id),
    [condition.id, onRemove]
  );

  return (
    <Paper
      variant="outlined"
      sx={{ px: 2, py: 1.5, borderRadius: 2 }}
      role="group"
      aria-label={`Filter on ${fieldConfig.label}`}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        <FieldSelector
          value={condition.field}
          config={config}
          onChange={handleFieldChange}
        />

        <OperatorSelector
          value={condition.operator}
          fieldType={fieldConfig.type}
          onChange={handleOperatorChange}
        />

        <ValueInput
          fieldConfig={fieldConfig}
          value={condition.value}
          error={validation && !validation.valid ? validation.error : undefined}
          onChange={handleValueChange}
        />

        <Tooltip title="Remove filter">
          <IconButton
            size="small"
            onClick={handleRemove}
            aria-label={`Remove filter on ${fieldConfig.label}`}
          >
            <X size={16} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
});
