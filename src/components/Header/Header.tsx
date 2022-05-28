import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, Avatar } from "@mui/material";

interface Props {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: Props): React.ReactElement {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link
              to={`/dashboard`}
              style={{ textDecoration: "none", color: "white" }}
            >
              CRYTONIZE
            </Link>
          </Typography>

          {isLoggedIn && (
            <>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
