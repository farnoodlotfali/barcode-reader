import { Box } from "@mui/material";

const AppLayout = ({ children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "99dvh",
        bgcolor: "background.default",
      }}
    >
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
