import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./main.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store = {store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
);