import { Stack } from "@mui/material";
import "./loading.css";

export default function PageSkeleton() {
  return (
    <Stack
      width="100%"
      height="100%"
      minHeight="90vh"
      margin="0 auto"
      maxWidth="1200px"
      justifyContent="center"
      alignItems="center"
    >
      <div className="loader"></div>
    </Stack>
  );
}
