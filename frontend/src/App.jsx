import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showSignup, setShowSignup] = useState(false);

  // User is not logged in
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

  // User is logged in
  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("analysis_id");

        setLoggedIn(false);
      }}
    />
  );
}

export default App;