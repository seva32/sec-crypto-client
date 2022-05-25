import React, { FormEvent, useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { BASE_URL, ETH_KEY, ETH_URL } from "../../utils/constansts";
import { Alert } from "..";
import { weiToEth, isOldWallet } from "../../utils/helpers";

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

const app = axios.create({
  headers: {
    // "Access-Control-Allow-Origin": "*",
    // "Content-Type": "application/json",
  },
  withCredentials: false,
});

export function AddressCreateModal({ open, handleClose }: Props) {
  const [address, setAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isFave, setIsFave] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<string>("");
  const [blured, setBlured] = useState<{ title: boolean; address: boolean }>(
    bluredInitialState
  );

  const urlnow =
    "https://api.etherscan.io/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=earliest&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY";

  const urlnow2 =
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY";

  const urlnow3 =
    "https://api.etherscan.io/api?module=account&action=txlist&address=0x1A2D3f4CE82eF3bcF153F37f7c154c719604D563&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY";

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await app.get(urlnow3);
      console.log(
        data.result?.forEach((val: any) =>
          console.log(isOldWallet(val.timeStamp || ""))
        )
      );
    } catch (e) {
      console.error("wtf ", e);
    }
    const formData = {
      title,
      address,
      fave: isFave,
    };
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${BASE_URL}/address/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlured(bluredInitialState);
      handleClose();
    } catch (error: any) {
      setShowAlert(
        error.response?.data?.message ||
          "We could not process your request, please try again."
      );
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
