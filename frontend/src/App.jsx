import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showSignup, setShowSignup] = useState(false);

  console.log("APP RENDER");
  console.log("Token:", localStorage.getItem("token"));
  console.log("Logged In:", loggedIn);

  if (!loggedIn) {
    if (showSignup) {
      return (
        <Signup
          onSignup={() => setShowSignup(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => {
          console.log("APP: LOGIN SUCCESS");
          setLoggedIn(true);
        }}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => {
        console.log("APP: LOGOUT");

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("analysis_id");

        setLoggedIn(false);
      }}
    />
  );
}

export default App;