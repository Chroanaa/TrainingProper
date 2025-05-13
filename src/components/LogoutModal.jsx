import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";

function LogoutModal({ open, handleClose, handleLeaveEvent }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title">Logout</DialogTitle>
      <DialogContent>
        <Typography variant="body1" id="alert-dialog-description">
          Are you sure you're leaving? Make sure to save your work.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleLeaveEvent} variant="contained" color="primary" autoFocus>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutModal;
