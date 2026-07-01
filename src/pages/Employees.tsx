import { useCallback, useState } from "react";
import { Box, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { Users } from "lucide-react";
import { FilterBuilder } from "../components/FilterBuilder/FilterBuilder";
import { EmployeeTable } from "../components/DataTable/EmployeeTable";
import { useFilters } from "../hooks/useFilters";
import { useFilteredData } from "../hooks/useFilteredData";
import { employeeFilterConfig } from "../config/filterConfig";
import type { FilterCondition } from "../types/filter";

export default function EmployeesPage() {
  const {
    conditions,
    addCondition,
    updateCondition,
    removeCondition,
    resetConditions,
  } = useFilters();

  const [debouncedConditions, setDebouncedConditions] = useState<FilterCondition[]>(conditions);

  const handleConditionsChange = useCallback(
    (updated: FilterCondition[]) => setDebouncedConditions(updated),
    []
  );

  const { data, filteredData, loading, error } = useFilteredData(
    debouncedConditions,
    employeeFilterConfig
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Users size={28} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter, sort, and export employee records.
            </Typography>
          </Box>
        </Stack>

        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <FilterBuilder
            conditions={conditions}
            config={employeeFilterConfig}
            filteredData={filteredData}
            totalCount={data.length}
            onAddCondition={addCondition}
            onUpdateCondition={updateCondition}
            onRemoveCondition={removeCondition}
            onResetConditions={resetConditions}
            onConditionsChange={handleConditionsChange}
          />
        </Paper>

        <Divider />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <EmployeeTable rows={filteredData} loading={loading} />
      </Stack>
    </Container>
  );
}
