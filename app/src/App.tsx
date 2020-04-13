import React from "react";
import "./App.css";
// import data from "./data.json";
import { Routes } from "./router";

const App = () => {
  return (
    <div className="container">
      <h1>
        X-Wing Stock Checker
        <span className="spark" role="img" aria-hidden>
          ⚡
        </span>
      </h1>
      <div className="update-notice">
        Updated every 15 minutes.
        {/* <br />
        Last update: {new Date(data.timestamp).toLocaleString("sv")} */}
        <br />
        <em>Please support your local game store</em>
      </div>
      <Routes />
    </div>
  );
};

export default App;
