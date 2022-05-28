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
  handleAccept?: (() => void) | null;
  titleCopy: string;
  bodyCopy: string;
}

export function Alert({
  handleClose,
  titleCopy,
  bodyCopy,
  handleAccept = null,
}: Props) {
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
        {handleAccept && (
          <Button onClick={handleAccept} autoFocus>
            Accept
          </Button>
        )}
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
