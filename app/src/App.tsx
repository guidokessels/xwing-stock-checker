import React from "react";
import "./App.css";
import data from "./data.json";
import { Router } from "./router";

const App = () => {
  return (
    <>
      <h1>
        X-Wing Stock Checker
        <sup>⚡</sup>
      </h1>
      <div className="update-notice">
        Updated every 15 minutes.
        <br />
        Last update: {new Date(data.timestamp).toLocaleString("sv")}
      </div>
      <Router />
    </>
  );
};

export default App;
