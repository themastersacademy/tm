"use client";

import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import { CircularProgress, styled } from "@mui/material";
import { GoalProvider } from "@/src/app/context/GoalProvider";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "var(--primary-color)",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "var(--delete-color)",
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: "var(--info-color)",
    // color: "#B5C7EB",
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: "var(--sec-color-acc-2)",
    color: "var(--sec-color)",
  },
  "&.notistack-MuiContent-loading": {
    backgroundColor: "var(--primary-color-acc-2)",
    color: "var(--primary-color)",
  },
}));

export default function ClientProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        iconVariant={{
          loading: (
            <CircularProgress
              size={20}
              sx={{ marginRight: "10px" }}
              color="inherit"
            />
          ),
        }}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
          loading: StyledMaterialDesignContent,
          warning: StyledMaterialDesignContent,
          info: StyledMaterialDesignContent,
        }}
      >
        <GoalProvider>{children}</GoalProvider>
      </SnackbarProvider>
    </SessionProvider>
  );
}
