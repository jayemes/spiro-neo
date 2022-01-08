import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { Router } from "@reach/router";
import App from "./components/Components/App";
import { initializeApp } from "firebase/app";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App path="*" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

window.firebaseApp = initializeApp({
  apiKey: "AIzaSyBdLQ0BX2sBRJMD2uGoPPnZYnCS8GAIJ_Y",
  authDomain: "spiro-jayemes.firebaseapp.com",
  databaseURL: "https://spiro-jayemes.firebaseio.com",
  projectId: "spiro-jayemes",
});
