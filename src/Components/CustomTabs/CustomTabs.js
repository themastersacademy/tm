"use client";
import { useState } from "react";
import { Tabs, Tab, Box, Stack } from "@mui/material";
import { styled } from "@mui/system";

const StyledTabs = styled(Tabs)(({ customstyles }) => ({
  backgroundColor: "var(--white)",
  borderRadius: "10px",
  padding: "4px",
  width: "208px",
  minHeight: "40px",
  ...customstyles?.tabs,
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

const StyledTab = styled(Tab)(({ customstyles }) => ({
  textTransform: "none",
  fontFamily: "Lato",
  fontWeight: 600,
  borderRadius: "8px",
  width: "100px",
  transition: "all 0.4s ease",
  minHeight: "32px",
  padding: "0px",
  "&.Mui-selected": {
    color: "var(--sec-color)",
    backgroundColor: "var(--sec-color-acc-1)",
  },
  ...customstyles?.tab,
}));

export default function CustomTabs({
  tabs,
  defaultIndex = 0,
  width,
  customstyles,
}) {
  const [activeTab, setActiveTab] = useState(defaultIndex);

  return (
    <Box sx={{ width: "100%" }}>
      <StyledTabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        width={width}
        customstyles={customstyles}
      >
        {tabs.map((tab, index) => (
          <StyledTab key={index} label={tab.label} />
        ))}
      </StyledTabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
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
