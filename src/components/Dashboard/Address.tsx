import React, { ReactElement, useState } from "react";
import Typography from "@mui/material/Typography";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constansts";
import InfoPanel from "../InfoPanel/InfoPanel";

interface Props {
  setLoggedIn: (val: boolean) => void;
}

export type AddressProps = {
  title: string;
  address: string;
  fave?: boolean;
  _id: string;
};

export function Address({ setLoggedIn }: Props): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addressId] = useState(id);
  const [addressData, setAddressData] = React.useState<AddressProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${BASE_URL}/address/address/${addressId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        setAddressData(data);
      } catch {
        setIsLoading(false);
        setLoggedIn(false);
        navigate("/");
      }
    }
    fetchData();
  }, [addressId, navigate, setLoggedIn]);

  if (isLoading)
    return (
      <Box textAlign="center" style={{ marginTop: "1rem" }}>
        <CircularProgress />
      </Box>
    );

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
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          ) : (
            <>{addressData?.title}</>
          )}
        </Typography>
      </Box>
      <Box margin={"1rem"}>
        <InfoPanel bodyCopy="Wallet is old!" />
      </Box>
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
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                  />
                ) : (
                  "Exchange Rate"
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
                  label="Age"
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ maxWidth: "50%" }}
                >
                  <MenuItem value={"eur"}>EUR</MenuItem>
                  <MenuItem value={"usd"}>USD</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <CardContent sx={{ position: "absolute", bottom: "0" }}>
              <Typography component="h2" variant="h5">
                Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
