import type { Employee } from "../types/employee";

const BASE_URL = "http://localhost:3001";

// Try the dev mock API first; if it's not available (for example after
// deployment where the dev server isn't running), fall back to the
// bundled JSON so the app still displays data.
export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/employees`);

    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as { data: Employee[] };
    return json.data;
  } catch (err) {
    // Network or connection error — load local mock data as a graceful fallback.
    // Use a dynamic import so bundlers only include the JSON when needed.
    try {
      const mod = await import("../mock/employees.json");
      // The JSON file is an array of employees.
      return (mod as unknown as { default: Employee[] }).default || (mod as unknown as Employee[]);
    } catch (jsonErr) {
      // Re-throw the original error if both network and local fallback fail.
      throw err;
    }
  }
}
