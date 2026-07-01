import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

// ─── Mock Server Vite Plugin ──────────────────────────────────────────────────
// Runs mock-json-api as a Node.js Express server inside the Vite dev process.
// This keeps all Node-only modules (fs, http, path, express) out of the browser
// bundle entirely — they never get imported by the React app.
//
// The React app fetches from http://localhost:3001/api/employees via the
// standard fetch API, exactly as it would against a real backend.

function mockServerPlugin(): Plugin {
  return {
    name: "mock-json-api-server",
    async configureServer() {
      const mock = (await import("mock-json-api")).default;

      const firstNames = ["Aarav", "Aditi", "Aman", "Ananya", "Arjun", "Bhavya", "Chetan", "Deepa", "Divya", "Ishaan", "Jasmine", "Karan", "Kavya", "Meera", "Nikhil", "Pooja", "Pranav", "Riya", "Rohan", "Sanjay", "Shreya", "Sneha", "Tanvi", "Varun", "Yash"]; 
      const lastNames = ["Agarwal", "Bhatia", "Chopra", "Desai", "Gupta", "Iyer", "Jain", "Kapoor", "Kulkarni", "Malhotra", "Mehta", "Nair", "Patel", "Rao", "Sharma", "Singh", "Soni", "Thakur", "Verma", "Vyas"];
      const departments = ["Engineering", "HR", "Finance", "Marketing", "Sales"];
      const roles = ["Junior Developer", "Senior Developer", "QA Engineer", "Project Manager", "Designer", "HR Manager", "Financial Analyst"];
      const skillsPool = ["React", "TypeScript", "Node.js", "GraphQL", "Java", "Python", "Excel", "Communication"];
      const cities = ["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi", "Kolkata"];

      const employees = Array.from({ length: 60 }, (_: unknown, index: number) => {
        const firstName = firstNames[index % firstNames.length];
        const lastName = lastNames[(index + 7) % lastNames.length];
        const department = departments[index % departments.length];
        const role = roles[(index + 2) % roles.length];
        const skillCount = 2 + (index % 3);
        const skills = skillsPool.filter((_, skillIndex) => (index + skillIndex) % 4 < skillCount);
        const salary = 30000 + (index * 1500) + ((index % 5) * 2500);
        const joinDate = new Date(2020, (index % 12), (index % 28) + 1).toISOString();
        const lastReview = new Date(2024, (index % 12), (index % 28) + 1).toISOString();

        return {
          id: index + 1,
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
          department,
          role,
          salary,
          joinDate,
          isActive: index % 3 !== 0,
          skills,
          address: {
            city: cities[index % cities.length],
            state: index % 2 === 0 ? "Karnataka" : "Maharashtra",
            country: "India",
          },
          projects: 1 + (index % 8),
          lastReview,
          performanceRating: Number((3.2 + (index % 8) * 0.2).toFixed(1)),
        };
      });

      const mockApi = mock({
        logging: true,
        mockRoutes: [
          {
            name: "getEmployees",
            mockRoute: "^/api/employees$",
            method: "GET",
            testScope: "success",
            latency: "100-300",
            jsonTemplate: () => JSON.stringify({ data: employees }),
          },
        ],
      });

      const app = mockApi.createServer();
      app.listen(3001, () => {
        console.log("[mock-json-api] Mock server → http://localhost:3001");
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mockServerPlugin()],
  optimizeDeps: {
    exclude: ["mock-json-api"],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
