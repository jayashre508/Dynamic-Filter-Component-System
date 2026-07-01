import type { Employee } from "../types/employee";

const BASE_URL = "http://localhost:3001";

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${BASE_URL}/api/employees`);

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { data: Employee[] };
  return json.data;
}
