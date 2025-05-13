import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
