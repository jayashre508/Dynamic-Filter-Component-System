import { memo, useCallback } from "react";
import { Badge, Button, Stack, Tooltip, Typography } from "@mui/material";
import { Download, FilterX, Plus } from "lucide-react";
import type { Employee } from "../../types/employee";

interface FilterToolbarProps {
  activeFilterCount: number;
  totalCount: number;
  filteredCount: number;
  filteredData: Employee[];
  onAddFilter: () => void;
  onReset: () => void;
}

function exportToCsv(data: Employee[], filename = "employees.csv") {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]) as (keyof Employee)[];
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = h === "address" ? JSON.stringify(row[h]) : row[h];
        const str = Array.isArray(val) ? val.join("; ") : String(val ?? "");
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      })
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const FilterToolbar = memo(function FilterToolbar({
  activeFilterCount,
  totalCount,
  filteredCount,
  filteredData,
  onAddFilter,
  onReset,
}: FilterToolbarProps) {
  const handleExport = useCallback(() => exportToCsv(filteredData), [filteredData]);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Badge badgeContent={activeFilterCount} color="primary" showZero={false}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={onAddFilter}
            aria-label="Add filter"
          >
            Add Filter
          </Button>
        </Badge>

        {activeFilterCount > 0 && (
          <Tooltip title="Clear all filters">
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<FilterX size={16} />}
              onClick={onReset}
              aria-label="Reset all filters"
            >
              Reset
            </Button>
          </Tooltip>
        )}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> records
        </Typography>

        <Tooltip title="Export visible rows as CSV">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            onClick={handleExport}
            disabled={filteredCount === 0}
            aria-label="Export to CSV"
          >
            Export CSV
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
});
