// import React, {Fragment} from 'react';
// import Header from './components/Layout/Header';
// import PostList from './components/Pages/PostListI';

// function App() {
//   return (
//     <Fragment>
//       <Header/>
//       <PostList/>
//     </Fragment>
//   );
// }

import React, { useState } from "react";
import Index from "./components/Index";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Index isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
    </>
  );
}

export default App;
