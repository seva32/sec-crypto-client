import React, {
  FormEvent,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constansts";

interface Props {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const theme = createTheme();

export function Signin(props: Props): ReactElement {
  const { setIsLoggedIn } = props;
  const [errrorMessage, setErrorMessage] = React.useState<string>("");
  let navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    const formData = new FormData(event.currentTarget);
    const form = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const { data } = await axios.post(`${BASE_URL}/user/auth/signin`, form);
    if (data.status === parseInt("401") || data.status === parseInt("404")) {
      setErrorMessage(data.response);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.user);
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Typography component="p" variant="body1" color="red">
              {errrorMessage}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href="SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}