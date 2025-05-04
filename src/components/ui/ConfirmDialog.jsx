import React from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>{message}</p>
          <Button variant='contained' color='primary' onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;
