import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";

function SelectDateDialog({
  onClose,
  onSubmit,
  open,
  onChange,
  Dates,
  selectedDate,
}) {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              label='Select Date'
              value={selectedDate}
              onChange={onChange}
            >
              {Dates.map((date, index) => (
                <MenuItem key={index} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant='contained' color='primary' onClick={onSubmit}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SelectDateDialog;
