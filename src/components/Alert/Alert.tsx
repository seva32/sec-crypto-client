import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props {
  handleClose: () => void;
  titleCopy: string;
  bodyCopy: string;
}

export function Alert({ handleClose, titleCopy, bodyCopy }: Props) {
  return (
    <Dialog
      open
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{titleCopy}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {bodyCopy}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
