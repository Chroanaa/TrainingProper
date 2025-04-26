import React from "react";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      class='border-2 border-gray-300 rounded-lg p-4 container '
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className='flex flex-col'>
          {children}
        </div>
      )}
    </div>
  );
}

export default CustomTabPanel;
