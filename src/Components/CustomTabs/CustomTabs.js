"use client";
import { useState } from "react";
import { Tabs, Tab, Box, Stack } from "@mui/material";
import { styled } from "@mui/system";

const StyledTabs = styled(Tabs)(({ customstyles }) => ({
  backgroundColor: "var(--white)",
  borderRadius: "10px",
  padding: "4px",
  width: "100%",
  minHeight: "40px",
  ...customstyles?.tabs,
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTabs-flexContainer": {
    gap: "8px",
  },
}));

const StyledTab = styled(Tab)(({ customstyles }) => ({
  textTransform: "none",
  fontFamily: "Lato",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "8px 16px",
  minWidth: "auto",
  transition: "all 0.4s ease",
  minHeight: "32px",
  "&.Mui-selected": {
    color: "var(--sec-color)",
    backgroundColor: "var(--sec-color-acc-1)",
  },
  ...customstyles?.tab,
}));

export default function CustomTabs({
  tabs,
  defaultIndex = 0,
  activeIndex,
  onTabChange,
  width,
  customstyles,
}) {
  const [localActiveTab, setLocalActiveTab] = useState(defaultIndex);

  const currentTab = activeIndex !== undefined ? activeIndex : localActiveTab;

  const handleTabChange = (e, newValue) => {
    if (onTabChange) {
      onTabChange(newValue);
    } else {
      setLocalActiveTab(newValue);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        width={width}
        customstyles={customstyles}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{
          "& .MuiTabs-scrollButtons": {
            "&.Mui-disabled": {
              opacity: 0.3,
            },
          },
        }}
      >
        {tabs.map((tab, index) => (
          <StyledTab key={index} label={tab.label} />
        ))}
      </StyledTabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={currentTab} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <Stack hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </Stack>
  );
}
