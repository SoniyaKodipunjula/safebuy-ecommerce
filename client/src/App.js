import React from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const token = localStorage.getItem("token");
  return (
    <div className="App">
      {token ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;