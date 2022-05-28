import React, { useState, useEffect } from "react";
import { Router } from "./components";

function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (["/", "/SignUp"].includes(window.location.pathname)) {
      setLoggedIn(false);
      localStorage.removeItem("token");
    } else if (token) setLoggedIn(true);
  }, []);

  return (
    <>
      <Router isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
    </>
  );
}

export default App;
