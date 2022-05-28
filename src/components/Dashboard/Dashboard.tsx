import React, { ReactElement, useEffect, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Favorite } from "@material-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Checkbox,
  FormControlLabel,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

import { BASE_URL } from "../../utils/constants";
import { AddressProps } from "./Address";
import { AddressCreateModal } from "..";

interface Props {
  setLoggedIn: (val: boolean) => void;
}

export function Dashboard({ setLoggedIn }: Props): ReactElement {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortByFave, setSortByFave] = useState(false);
  const handleOpen = () => setOpen(true);

  const [addresses, setAddresses] = React.useState<AddressProps[]>([]);
  const [addressesUnsorted, setAddressesUnsorted] = useState<AddressProps[]>(
    []
  );
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/address/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(data);
      setIsLoading(false);
    } catch {
      setLoggedIn(false);
      setIsLoading(false);
      navigate("/");
    }
  }, [navigate, setLoggedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (sortByFave && !addressesUnsorted.length) {
      setAddressesUnsorted([...addresses]);
      addresses.sort(function (x, y) {
        return x.fave === y.fave ? 0 : x.fave ? -1 : 1;
      });
    }

    if (!sortByFave && addressesUnsorted.length) {
      setAddresses(addressesUnsorted);
      setAddressesUnsorted([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByFave]);

  const handleClose = () => {
    fetchData();
    setOpen(false);
  };

  if (isLoading)
    return (
      <Box textAlign="center" style={{ marginTop: "1rem" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Container style={{ marginTop: "1rem" }}>
        <Box textAlign="center">
          <Button variant="contained" onClick={handleOpen}>
            Add New Wallet
          </Button>
        </Box>
      </Container>
      <AddressCreateModal open={open} handleClose={handleClose} />
      <FormControlLabel
        label="Sort by Favorite"
        style={{ marginLeft: "1rem" }}
        control={
          <Checkbox
            checked={sortByFave}
            onChange={() => setSortByFave(!sortByFave)}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />
      <Container>
        <Grid container spacing={3} marginTop={2}>
          {addresses.length ? (
            addresses.map((address) => {
              const linkTo = `${address._id}`;
              return (
                <Grid item xs={12} md={12} key={address._id}>
                  <CardActionArea style={{ position: "relative" }}>
                    {address.fave && (
                      <div
                        style={{ position: "absolute", top: "0", left: "0" }}
                      >
                        <Favorite color="secondary" fontSize="small" />
                      </div>
                    )}
                    <Link
                      to={linkTo}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <Card sx={{ display: "flex" }}>
                        <CardContent sx={{ flex: 1 }}>
                          <Typography component="h2" variant="h5">
                            {address.title}
                          </Typography>
                        </CardContent>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 160,
                            display: { xs: "none", sm: "block" },
                          }}
                          image={`https://res.cloudinary.com/seva32/image/upload/v1653485403/jievani-weerasinghe-ix9KDnqJNjA-unsplash_oht3ay.jpg`}
                          alt="ethereum"
                        />
                      </Card>
                    </Link>
                  </CardActionArea>
                </Grid>
              );
            })
          ) : (
            <Typography component="h2" variant="h5">
              No address to list here, add one!
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}
