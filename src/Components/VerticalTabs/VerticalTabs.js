import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const VerticalTabs = ({ tabs }) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: isMobile ? "auto" : "100%",
        overflow: "hidden",
      }}
    >
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{
          borderRight: isMobile ? "none" : "1px solid var(--border-color)",
          minWidth: isMobile ? "100%" : 100,
          height: isMobile ? "auto" : "100%",
          alignSelf: isMobile ? "stretch" : "flex-start",
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: "var(--primary-color)",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            sx={{
              color: "var(--text3)",
              textTransform: "none",
              "&.Mui-selected": {
                color: "var(--primary-color)",
              },
              alignItems: "flex-start",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ p: 2, flex: 1 }}>
        <Typography
          component="div"
          sx={{ fontSize: "16px", fontWeight: "400", fontFamily: "Lato" }}
        >
          {tabs[value].content}
        </Typography>
      </Box>
    </Box>
  );
};

export default VerticalTabs;
