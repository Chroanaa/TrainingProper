import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

function CoursePrepTabs({ value, setValue, handleChange }) {
  const allyProps = (index) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
  };
  return (
    <div className="w-full px-3">
      <Box>
        <Tabs
          value={value}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
          onChange={handleChange}
        >
          <Tab label='Upload Material' {...allyProps(0)} />
          <Tab label='Set Schedule' {...allyProps(1)} />
          <Tab label='View Schedules' {...allyProps(2)} />
        </Tabs>
      </Box>
    </div>
  );
}

export default CoursePrepTabs;
