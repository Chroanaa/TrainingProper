import React from "react";
import { Box, Modal, Button } from "@mui/material";
function AddTableModal({ open, onClose, tableModule }) {
  const [table, setTable] = React.useState();
  const handleClose = () => {
    onClose();
  };
  const handleClick = () => {
    let column = parseInt(table.column);
    let rows = parseInt(table.rows);

    tableModule.insertTable(column, rows);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTable((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border-2 border-black shadow-xl p-4'>
          <label htmlFor='column'>Column:</label>
          <input
            type='number'
            id='column'
            onChange={handleOnChange}
            name='column'
          />
          <label htmlFor='rows'>Rows:</label>
          <input
            type='number'
            id='rows'
            onChange={handleOnChange}
            name='rows'
          />
          <Button onClick={handleClick}>Add Table</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AddTableModal;
