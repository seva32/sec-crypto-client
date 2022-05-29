import React, { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { conversionURL, ethprice } from "../../utils/apis";
import { usdToEurConversor } from "../../utils/helpers";
import { usePrevious } from "../../utils/usePrevious";
import { useAppSelector, useAppDispatch } from "../../store/storeHooks";
import {
  addUserAddress,
  selectAddAddressStatus,
  selectGetTransactionsByAddressStatus,
  resetStatuses,
} from "../../features/address/addressSlice";
import { Alert } from "..";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const bluredInitialState = {
  title: false,
  address: false,
  fave: false,
};

export function AddressCreateModal({ open, handleClose }: Props) {
  const [address, setAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isFave, setIsFave] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<string>("");
  const [blured, setBlured] = useState<{ title: boolean; address: boolean }>(
    bluredInitialState
  );
  const [submitStarted, setSubmitStarted] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAddAddressStatus);
  const prevStatus = usePrevious(status);
  const txByAddressStatus = useAppSelector(
    selectGetTransactionsByAddressStatus
  );

  useEffect(() => {
    if (
      submitStarted &&
      (status === "failed" || txByAddressStatus === "failed")
    ) {
      const errorMessage =
        status === "failed"
          ? "This wallet address already exists in your account."
          : "We could not process your request, please verify if the address is valid and try again.";
      dispatch(resetStatuses());
      setBlured(bluredInitialState);
      setSubmitStarted(false);
      setShowAlert(errorMessage);
    } else if (submitStarted && status === "idle" && prevStatus === "loading") {
      dispatch(resetStatuses());
      setBlured(bluredInitialState);
      setSubmitStarted(false);
      handleClose();
    }
  }, [
    status,
    txByAddressStatus,
    submitStarted,
    handleClose,
    dispatch,
    prevStatus,
  ]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const endpoints = [conversionURL, ethprice];
      const [{ data: usd2eur }, { data: eth2usd }] = await Promise.all(
        endpoints.map((endpoint) =>
          axios.get(endpoint, { withCredentials: true })
        )
      );
      const usdToEur = usd2eur?.usd;
      const ethusd = Number(eth2usd.result?.ethusd);
      if (!usdToEur || isNaN(ethusd)) {
        setShowAlert("We could not process your request, please try again.");
        return;
      }
      const formData = {
        title,
        address,
        fave: isFave,
        eur: usdToEurConversor(ethusd, usdToEur).toString(),
        usd: ethusd.toString(),
      };
      setSubmitStarted(true);
      dispatch(addUserAddress(formData));
    } catch (error: any) {
      setShowAlert(
        error.response?.data?.message ||
          "We could not process your request, please try again."
      );
      setSubmitStarted(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert("");
    setBlured(bluredInitialState);
    handleClose();
  };

  const alertProps = {
    handleClose: handleCloseAlert,
    titleCopy: "Error",
    bodyCopy: showAlert,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onBackdropClick={() => setBlured(bluredInitialState)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Box
              component="form"
              onSubmit={submitForm}
              noValidate
              sx={{ mt: 1 }}
            >
              <label>Title:</label>
              <TextField
                error={!title && blured.title}
                helperText="Required"
                margin="normal"
                required
                fullWidth
                id="title"
                name="title"
                onBlur={() => setBlured((prev) => ({ ...prev, title: true }))}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Address:</label>
              <TextField
                error={!address && blured.address}
                helperText={"Required"}
                margin="normal"
                required
                fullWidth
                id="address"
                name="address"
                onBlur={() => setBlured((prev) => ({ ...prev, address: true }))}
                onChange={(e) => setAddress(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isFave}
                    onChange={() => setIsFave(!isFave)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Mark as favorite"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Address
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
      {!!showAlert && <Alert {...alertProps} />}
    </>
  );
}
