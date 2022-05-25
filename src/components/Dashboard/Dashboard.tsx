import React, { ReactElement, useEffect, useCallback, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, CircularProgress, Container } from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Address, AddressProps } from "./Address";
import { BASE_URL } from "../../utils/constansts";
import { AddressCreateModal } from "..";

interface Props {
  setLoggedIn: (val: boolean) => void;
}

export function Dashboard({ setLoggedIn }: Props): ReactElement {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setOpen(true);

  const [addresses, setAddresses] = React.useState<AddressProps[]>([]);
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
            Add New Address
          </Button>
        </Box>
      </Container>
      <AddressCreateModal open={open} handleClose={handleClose} />
      <Container>
        <Grid container spacing={3} marginTop={2}>
          {addresses.length ? (
            addresses.map((address) => {
              const linkTo = `${address._id}`;
              return (
                <Grid item xs={12} md={12} key={address._id}>
                  <CardActionArea>
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
