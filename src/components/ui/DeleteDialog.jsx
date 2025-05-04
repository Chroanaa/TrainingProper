import React from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
function DeleteDialog({ open, onClose, onDelete, title, item }) {
  const handleDelete = () => {
    onDelete();
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this {item}?</p>
          <Button variant='contained' color='primary' onClick={handleDelete}>
            Delete
          </Button>
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteDialog;
