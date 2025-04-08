import React from "react";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className='flex flex-col justify-center items-center mt-10'>
          {children}
        </div>
      )}
    </div>
  );
}

export default CustomTabPanel;
