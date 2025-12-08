"use client";
import { Stack, Typography, Box } from "@mui/material";
import {
  Description,
  Support,
  Share,
  DeleteForever,
  Receipt,
  CardGiftcard,
} from "@mui/icons-material";

export default function QuickActions({ onAction }) {
  const actions = [
    {
      id: "certificates",
      label: "Certificates",
      icon: CardGiftcard,
      color: "#4CAF50",
      bgColor: "#E8F5E9",
      description: "View & download",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: Receipt,
      color: "#2196F3",
      bgColor: "#E3F2FD",
      description: "Payment history",
    },
    {
      id: "support",
      label: "Support",
      icon: Support,
      color: "#FF9800",
      bgColor: "#FFF3E0",
      description: "Get help",
    },
    {
      id: "refer",
      label: "Refer Friend",
      icon: Share,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
      description: "Earn rewards",
    },
  ];

  return (
    <Stack gap="16px">
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--text1)",
        }}
      >
        Quick Actions
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap="12px">
        {actions.map((action) => {
          const IconComponent = action.icon;

          return (
            <Box
              key={action.id}
              onClick={() => onAction && onAction(action.id)}
              sx={{
                flex: { xs: "1 1 calc(50% - 6px)", sm: "1 1 calc(25% - 9px)" },
                minWidth: "140px",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  borderColor: action.color,
                },
              }}
            >
              <Stack gap="12px" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: action.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent sx={{ fontSize: 24, color: action.color }} />
                </Box>

                <Stack gap="4px">
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    {action.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "var(--text3)",
                    }}
                  >
                    {action.description}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
