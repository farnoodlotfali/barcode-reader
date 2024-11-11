"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "var(--font-vazir)",
  },
  palette: {
    mode: "light",
    background: {
      default: "#f8f8f8",
      paper: "#fff",
    },
  },
});

export default theme;
