import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { Router } from "@reach/router";
import App from "./components/Components/App";
import firebase from "firebase";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App path="*" />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

firebase.initializeApp({
  apiKey: "AIzaSyBdLQ0BX2sBRJMD2uGoPPnZYnCS8GAIJ_Y",
  authDomain: "spiro-jayemes.firebaseapp.com",
  databaseURL: "https://spiro-jayemes.firebaseio.com",
  projectId: "spiro-jayemes",
});
