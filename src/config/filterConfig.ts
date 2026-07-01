import type { FilterConfig } from "../types/filter";

export const employeeFilterConfig: FilterConfig[] = [
  {
    key: "name",
    label: "Employee Name",
    type: "text",
  },

  {
    key: "email",
    label: "Email",
    type: "text",
  },

  {
    key: "department",
    label: "Department",
    type: "select",
    options: [
      { label: "Engineering", value: "Engineering" },
      { label: "HR", value: "HR" },
      { label: "Finance", value: "Finance" },
      { label: "Marketing", value: "Marketing" },
      { label: "Sales", value: "Sales" },
    ],
  },

  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "QA Engineer", value: "QA Engineer" },
      { label: "Project Manager", value: "Project Manager" },
      { label: "Designer", value: "Designer" },
    ],
  },

  {
    key: "salary",
    label: "Salary",
    type: "currency",
  },

  {
    key: "joinDate",
    label: "Join Date",
    type: "date",
  },

  {
    key: "projects",
    label: "Projects",
    type: "number",
  },

  {
    key: "performanceRating",
    label: "Performance Rating",
    type: "number",
  },

  {
    key: "skills",
    label: "Skills",
    type: "multiselect",
    options: [
      { label: "React", value: "React" },
      { label: "TypeScript", value: "TypeScript" },
      { label: "Node.js", value: "Node.js" },
      { label: "GraphQL", value: "GraphQL" },
      { label: "Java", value: "Java" },
      { label: "Python", value: "Python" },
    ],
  },

  {
    key: "isActive",
    label: "Active Status",
    type: "boolean",
  },

  {
    key: "address.city",
    label: "City",
    type: "text",
  },
];