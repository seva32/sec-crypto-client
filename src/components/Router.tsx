import { Signin, Signup, Header, Dashboard, Address } from ".";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { ReactElement, Dispatch, SetStateAction } from "react";

interface Props {
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export function Router(props: Props): ReactElement {
  const { isLoggedIn, setLoggedIn } = props;

  return (
    <div>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} />
        {isLoggedIn ? (
          <Routes>
            <Route
              path="dashboard/*"
              element={<Dashboard setLoggedIn={setLoggedIn} />}
            ></Route>
            <Route
              path="/dashboard/:id"
              element={<Address setLoggedIn={setLoggedIn} />}
            ></Route>
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Signin setIsLoggedIn={setLoggedIn} />}
            ></Route>
            <Route path="/signup" element={<Signup />}></Route>
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}
