import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

function CDCtabs({ value, handleChange }) {
  const allyProps = (index) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
  };
  return (
    <div className='w-full px-3'>
      <Box>
        <Tabs
          value={value}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
          onChange={handleChange}
        >
          <Tab label='Request For Reports' {...allyProps(0)} />
          <Tab label='Send Excuse Letter' {...allyProps(1)} />
          
        </Tabs>
      </Box>
    </div>
  );
}

export default CDCtabs;
