import React from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
function LogoutModal({ open, handleClose, handleLeaveEvent }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Logout</DialogTitle>
        <DialogContent>
          <p>Are you sure you're leaving? Make sure to save your work</p>
        </DialogContent>
        <Button onClick={handleLeaveEvent} color='primary' autoFocus>
          Logout
        </Button>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
      </Dialog>
    </div>
  );
}

export default LogoutModal;
