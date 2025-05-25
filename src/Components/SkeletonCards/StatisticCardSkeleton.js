import { Stack } from "@mui/material";

export default function StatisticCardSkeleton() {
    return (
        <Stack
            flexDirection="row"
            gap="10px"
            alignItems="center"
            sx={{
                width: "310px",
                height: "70px",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:"var(--sec-color-acc-2)",
            }}
            elevation={0}
        ></Stack>
    );
}