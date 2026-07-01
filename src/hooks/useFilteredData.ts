import { useEffect, useMemo, useState } from "react";
import type { Employee } from "../types/employee";
import type { FilterCondition, FilterConfig } from "../types/filter";
import { getEmployees } from "../services/employeeApi";
import { applyFilters } from "../utils/filterEngine";

interface UseFilteredDataReturn {
  data: Employee[];
  filteredData: Employee[];
  loading: boolean;
  error: string | null;
}

export function useFilteredData(
  conditions: FilterCondition[],
  config: FilterConfig[]
): UseFilteredDataReturn {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEmployees()
      .then((employees) => {
        if (!cancelled) {
          setData(employees);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load employee data.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // applyFilters is a pure function — useMemo ensures it only re-runs
  // when data or conditions actually change, not on every render.
  const filteredData = useMemo(
    () => applyFilters(data, conditions, config),
    [data, conditions, config]
  );

  return { data, filteredData, loading, error };
}
