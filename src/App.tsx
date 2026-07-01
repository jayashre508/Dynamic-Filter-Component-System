import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import EmployeesPage from "./pages/Employees";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f7fa" },
  },
  shape: { borderRadius: 8 },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmployeesPage />
    </ThemeProvider>
  );
}
