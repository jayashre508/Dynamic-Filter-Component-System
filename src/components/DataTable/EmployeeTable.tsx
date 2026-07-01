import { memo, useMemo } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import type { Employee } from "../../types/employee";

interface EmployeeTableProps {
  rows: Employee[];
  loading: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatDate = (iso: string) => {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return iso;
  }
};

const columns: GridColDef<Employee>[] = [
  {
    field: "name",
    headerName: "Name",
    width: 180,
    renderCell: (params: GridRenderCellParams<Employee, string>) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {params.value}
      </Typography>
    ),
  },
  { field: "email", headerName: "Email", width: 220 },
  { field: "department", headerName: "Department", width: 130 },
  { field: "role", headerName: "Role", width: 160 },
  {
    field: "salary",
    headerName: "Salary",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => currencyFormatter.format(value),
  },
  {
    field: "joinDate",
    headerName: "Join Date",
    width: 120,
    valueFormatter: (value: string) => formatDate(value),
  },
  {
    field: "isActive",
    headerName: "Status",
    width: 100,
    renderCell: (params: GridRenderCellParams<Employee, boolean>) => (
      <Chip
        label={params.value ? "Active" : "Inactive"}
        color={params.value ? "success" : "default"}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: "skills",
    headerName: "Skills",
    width: 220,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Employee, string[]>) => (
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
        {(params.value ?? []).map((skill) => (
          <Chip key={skill} label={skill} size="small" variant="outlined" />
        ))}
      </Stack>
    ),
  },
  {
    field: "performanceRating",
    headerName: "Rating",
    width: 80,
    type: "number",
    valueFormatter: (value: number) => `${value.toFixed(1)} ★`,
  },
  { field: "projects", headerName: "Projects", width: 90, type: "number" },
  {
    field: "address",
    headerName: "City",
    width: 120,
    sortable: false,
    valueGetter: (_value: unknown, row: Employee) => row.address.city,
  },
];

function NoRowsOverlay() {
  return (
    <Stack
      sx={{ height: "100%", alignItems: "center", justifyContent: "center" }}
      spacing={1}
    >
      <Typography variant="body1" color="text.secondary">
        No employees match the current filters.
      </Typography>
      <Typography variant="caption" color="text.disabled">
        Try adjusting or removing some filters.
      </Typography>
    </Stack>
  );
}

export const EmployeeTable = memo(function EmployeeTable({
  rows,
  loading,
}: EmployeeTableProps) {
  const slots = useMemo(() => ({ noRowsOverlay: NoRowsOverlay }), []);

  return (
    <Box sx={{ width: "100%", height: 520 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        slots={slots}
        disableRowSelectionOnClick
        density="compact"
        aria-label="Employee data table"
        sx={{
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "grey.50" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
        }}
      />
    </Box>
  );
});
