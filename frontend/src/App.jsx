import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [showSignup, setShowSignup] = useState(false);

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
        onLogin={() => setLoggedIn(true)}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setLoggedIn(false);
      }}
    />
  );
}

export default App;