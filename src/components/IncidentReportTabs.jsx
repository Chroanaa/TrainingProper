import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

function IncidentReportTabs({ value, handleChange }) {
  const allyProps = (index) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
  };

  return (
    <div>
      <div className='w-full px-3'>
        <Box>
          <Tabs
            value={value}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            onChange={handleChange}
          >
            <Tab label='Report List' {...allyProps(0)} />
            <Tab label='Make Report' {...allyProps(1)} />
          </Tabs>
        </Box>
      </div>
    </div>
  );
}

export default IncidentReportTabs;
