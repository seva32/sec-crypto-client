import React, { ReactElement, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Favorite, Delete } from "@material-ui/icons";

import { useAppSelector, useAppDispatch } from "../../store/storeHooks";
import {
  getAddressData,
  selectAddress,
  selectGetAddressStatus,
  selectGetBalanceMultiStatus,
  selectGetTransactionsByAddressStatus,
  updateAddressAsync,
  selectUpdateAddressStatus,
} from "../../features/address/addressSlice";
import { BASE_URL } from "../../utils/constants";
import { txlist, balancemulti } from "../../utils/apis";
import { isOldWallet, weiToEth, fixedPoint } from "../../utils/helpers";
import { Alert, InfoPanel } from "..";
import { usePrevious } from "../../utils/usePrevious";

interface Props {
  setLoggedIn: (val: boolean) => void;
}

export type AddressProps = {
  _id?: string;
  title: string;
  address: string;
  fave?: boolean;
  usd?: string;
  eur?: string;
};

export function Address({ setLoggedIn }: Props): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addressId] = useState(id);
  const [currency, setCurrency] = useState<"usd" | "eur">("usd");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<string>("");
  const [editFields, setEditFields] = useState<{
    title?: string;
    rate?: number;
    currencyField?: string;
    fave?: boolean;
  }>();
  const dispatch = useAppDispatch();
  const addressData = useAppSelector(selectAddress);
  const getAddressStatus = useAppSelector(selectGetAddressStatus);
  const getBalanceStatus = useAppSelector(selectGetBalanceMultiStatus);
  const updateStatus = useAppSelector(selectUpdateAddressStatus);
  const getTransactionsStatus = useAppSelector(
    selectGetTransactionsByAddressStatus
  );
  const prevUpdateStatus = usePrevious(updateStatus);

  useEffect(() => {
    if (addressId) {
      dispatch(getAddressData(addressId));
    }
  }, [addressId, dispatch]);

  useEffect(() => {
    if (prevUpdateStatus === "loading" && updateStatus === "idle") {
      dispatch(getAddressData(addressId as string));
    }
  }, [prevUpdateStatus, updateStatus, addressId, dispatch]);

  useEffect(() => {
    const updateAddress = async () => {
      try {
        let addressUpdate = {
          ...addressData,
          title: editFields?.title || "",
          fave: editFields?.fave,
          [editFields?.currencyField as string]: editFields?.rate?.toString(),
        };
        dispatch(updateAddressAsync(addressUpdate));
      } catch (e) {
        console.error(e);
      } finally {
        setIsEditing(false);
      }
    };
    if (editMode) {
      setEditFields({
        title: addressData?.title || "",
        rate:
          Number(currency === "usd" ? addressData?.usd : addressData?.eur) || 0,
        currencyField: currency,
        fave: addressData?.fave,
      });
      setIsEditing(true);
    }
    if (!editMode && isEditing) {
      updateAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  function handleDelete() {
    setShowAlert("This action will delete this Wallet from your account");
  }

  function handleAcceptDelete() {
    const token = localStorage.getItem("token");
    axios
      .delete(`${BASE_URL}/address/delete/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setShowAlert("");
        navigate("/dashboard");
      })
      .catch(() => {
        setShowAlert("We could not process your request");
      });
  }

  const alertProps = {
    handleClose: () => setShowAlert(""),
    handleAccept: handleAcceptDelete,
    titleCopy: "Warning",
    bodyCopy: showAlert,
  };

  if (
    getAddressStatus === "failed" ||
    getBalanceStatus === "failed" ||
    getTransactionsStatus === "failed" ||
    updateStatus === "failed"
  ) {
    setLoggedIn(false);
    navigate("/");
  }

  if (
    getAddressStatus === "loading" ||
    getBalanceStatus === "loading" ||
    getTransactionsStatus === "loading" ||
    updateStatus === "loading"
  )
    return (
      <Box textAlign="center" style={{ marginTop: "1rem" }}>
        <CircularProgress />
      </Box>
    );

  const conversionRate =
    currency === "usd" ? addressData?.usd : addressData?.eur;
  const balance =
    addressData.currentBalance !== undefined &&
    addressData.currentBalance !== null
      ? fixedPoint(addressData.currentBalance * Number(conversionRate)).toFixed(
          2
        )
      : "Balance unavailable";
  const exchangeRate = Number(
    currency === "usd" ? addressData?.usd : addressData?.eur
  ).toFixed(2);

  return (
    <Container style={{ position: "relative" }}>
      <Button
        variant="contained"
        onClick={() => setEditMode(!editMode)}
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          marginTop: "1rem",
        }}
      >
        {editMode ? "Finish" : "Edit Wallet"}
      </Button>
      <Box margin="1rem" textAlign="center">
        <Typography component="h2" variant="h2">
          Wallet:{" "}
          {editMode ? (
            <>
              <TextField
                id="title"
                label="Title"
                variant="outlined"
                InputProps={{
                  style: {
                    fontSize: 50,
                    maxHeight: "4rem",
                    boxSizing: "border-box",
                  },
                }}
                value={editFields?.title || ""}
                onChange={(e) =>
                  setEditFields((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <FormControlLabel
                label="Favorite"
                style={{ marginLeft: "1rem" }}
                control={
                  <Checkbox
                    checked={editFields?.fave || false}
                    onChange={() =>
                      setEditFields((prev) => ({ ...prev, fave: !prev?.fave }))
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete}>
                  <Delete fontSize="large" color="error" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {addressData?.title}{" "}
              {addressData?.fave && (
                <Tooltip title="Favorite wallet" style={{ cursor: "pointer" }}>
                  <Favorite color="secondary" fontSize="large" />
                </Tooltip>
              )}
            </>
          )}
        </Typography>
      </Box>
      {addressData.isOld && (
        <Box margin={"1rem"}>
          <InfoPanel bodyCopy="Wallet is old!" />
        </Box>
      )}
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              display: "flex",
              minHeight: "250px",
              position: "relative",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ position: "absolute", top: "0" }}>
              <Typography component="h2" variant="h5">
                Exchange Rate
              </Typography>
            </CardContent>
            <CardContent>
              <Typography component="h2" variant="h5">
                {editMode ? (
                  <TextField
                    id="rate"
                    label="Rate"
                    variant="outlined"
                    type="number"
                    value={editFields?.rate}
                    onChange={(e) =>
                      setEditFields((prev) => ({
                        ...prev,
                        rate: e.target.value as unknown as number,
                      }))
                    }
                  />
                ) : (
                  exchangeRate
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              display: "flex",
              minHeight: "250px",
              position: "relative",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ position: "absolute", top: "0" }}>
              <Typography component="h2" variant="h5">
                Balance
              </Typography>
            </CardContent>
            <CardContent sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Currency</InputLabel>
                <Select
                  labelId="select-label"
                  id="currency-select"
                  value={currency}
                  label="Currency"
                  onChange={(e) => setCurrency(e.target.value as "usd" | "eur")}
                  style={{ maxWidth: "50%" }}
                >
                  <MenuItem value={"eur"}>EUR</MenuItem>
                  <MenuItem value={"usd"}>USD</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <CardContent sx={{ position: "absolute", bottom: "0" }}>
              <Typography component="h2" variant="h5">
                {balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {!!showAlert && <Alert {...alertProps} />}
    </Container>
  );
}
