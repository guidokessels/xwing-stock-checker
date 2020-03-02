import React from "react";
import "./App.css";
import data from "./data.json";
import { Routes } from "./router";

const App = () => {
  return (
    <div className="container">
      <h1>
        X-Wing Stock Checker
        <sup>⚡</sup>
      </h1>
      <div className="update-notice">
        Updated every hour.
        <br />
        Last update: {new Date(data.timestamp).toLocaleString("sv")}
      </div>
      <Routes />
    </div>
  );
};

export default App;
