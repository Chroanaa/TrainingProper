import React from "react";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
<<<<<<< HEAD
      className='border-2 border-gray-300 rounded-lg p-4 container '
=======
      class='shadow-lg rounded-lg p-4 container '
>>>>>>> dff33c68c90632c1f2d86d2124d9e1c8836629bc
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <div className='flex flex-col'>{children}</div>}
    </div>
  );
}

export default CustomTabPanel;
