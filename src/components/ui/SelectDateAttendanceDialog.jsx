import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";

function SelectDateAttendanceDialog({
  onClose,
  onSubmit,
  open,
  onChange,
  Dates,
  selectedDate,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select Date</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <FormControl fullWidth variant="outlined" size="medium">
            <InputLabel id="select-date-label">Select Date</InputLabel>
            <Select
              labelId="select-date-label"
              label="Select Date"
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

          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            sx={{ alignSelf: "flex-end" }}
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SelectDateAttendanceDialog;
