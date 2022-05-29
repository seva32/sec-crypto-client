import React, { ReactElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { useAppSelector, useAppDispatch } from "../../store/storeHooks";
import {
  getAddressesAsync,
  selectUserAddresses,
  selectStatus,
} from "../../features/address/addressSlice";
import { AddressProps } from "./AddressEditor";
import { AddressCreateModal } from "..";

interface Props {
  setLoggedIn: (val: boolean) => void;
}

export function Dashboard({ setLoggedIn }: Props): ReactElement {
  const [open, setOpen] = useState(false);
  const [sortByFave, setSortByFave] = useState(false);
  const addresses = useAppSelector(selectUserAddresses);
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();

  const [addressesSorted, setAddressesSorted] = useState<AddressProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAddressesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (sortByFave && !addressesSorted.length) {
      setAddressesSorted(
        [...addresses].sort(function (x, y) {
          return x.fave === y.fave ? 0 : x.fave ? -1 : 1;
        })
      );
    }

    if (!sortByFave && addressesSorted.length) {
      setAddressesSorted([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByFave]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    dispatch(getAddressesAsync);
    setOpen(false);
  };

  if (status === "failed") {
    setLoggedIn(false);
    navigate("/");
  }

  if (status === "loading")
    return (
      <Box textAlign="center" style={{ marginTop: "1rem" }}>
        <CircularProgress />
      </Box>
    );

  function renderAddressCards(addresses: AddressProps[]) {
    return addresses.map((address) => {
      const linkTo = `${address._id}`;
      return (
        <Grid item xs={12} md={12} key={address._id}>
          <CardActionArea style={{ position: "relative" }}>
            {address.fave && (
              <div style={{ position: "absolute", top: "0", left: "0" }}>
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
    });
  }

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
            renderAddressCards(sortByFave ? addressesSorted : addresses)
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
