# Dynamic Filter Component System

A reusable, configuration-driven filtering system built with **React**, **TypeScript**, **Vite**, and **Material UI**. The application demonstrates a scalable frontend architecture where the same filter builder can be reused across different data tables simply by changing the configuration.

---

## Live Demo

> Add deployed link here

---

## Features

### Dynamic Filter Builder

- Add multiple filter conditions
- Remove individual filters
- Clear all filters
- Dynamic field selection
- Dynamic operator selection based on field type
- Dynamic input rendering

### Supported Field Types

- Text
- Number
- Currency
- Date
- Single Select
- Multi Select
- Boolean

### Supported Operators

#### Text

- Equals
- Contains
- Starts With
- Ends With
- Does Not Contain

#### Number

- Equals
- Greater Than
- Greater Than or Equal
- Less Than
- Less Than or Equal

#### Currency

- Between

#### Date

- Between

#### Single Select

- Is
- Is Not

#### Multi Select

- In
- Not In

#### Boolean

- Is

---

## Employee Table

- Material UI DataGrid
- Sorting
- Pagination
- Record Count
- CSV Export
- Responsive Layout

---

## Filtering Logic

The filtering system is completely configuration driven.

Instead of hardcoding employee fields inside components, every filter is generated using configuration objects.

This makes the component reusable for different tables such as:

- Employees
- Transactions
- Users
- Reimbursements

without modifying the internal implementation.

### Filtering Rules

- AND between different fields
- OR within the same field
- Case-insensitive text search
- Nested object filtering
- Multi-select array filtering
- Date range filtering
- Currency range filtering

---

## Project Structure

```text
src/
│
├── components/
│   ├── DataTable/
│   └── FilterBuilder/
│
├── config/
│
├── hooks/
│
├── mock/
│
├── pages/
│
├── services/
│
├── types/
│
├── utils/
│
├── App.tsx
└── main.tsx
```

---

## Tech Stack

- React
- TypeScript
- Vite
- Material UI
- MUI DataGrid
- Lucide React

---

## Architecture

The project follows a modular architecture.

```
Employee Data
        │
        ▼
Filter Configuration
        │
        ▼
Dynamic Filter Builder
        │
        ▼
Filtering Engine
        │
        ▼
Filtered Dataset
        │
        ▼
Material UI Data Table
```

The filtering engine is independent from the UI and can be reused with any dataset by changing the filter configuration.

---

## Performance Optimizations

- Memoized filtering
- Reusable components
- Type-safe interfaces
- Configuration-driven rendering
- Separation of UI and filtering logic

---

## Installation

```bash
git clone <repository-url>

cd dynamic-filter-system

npm install

npm run dev
```

---

## Build

```bash
npm run build
```

---

## Future Improvements

- Server-side filtering
- Saved filter presets
- Advanced date operators
- Regex search
- Dynamic API schema generation

---

# AI Usage Disclosure

AI was used as a development assistant during this assessment.

AI assistance included:

- Discussing application architecture
- Explaining TypeScript concepts
- Reviewing component organization
- Suggesting performance improvements
- Assisting with debugging
- Improving documentation

All implementation decisions, integration, testing, debugging, and final verification were completed by me. I reviewed and understood the generated suggestions before incorporating them into the project.
