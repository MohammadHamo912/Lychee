import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from 'react-router-dom';

<BrowserRouter basename={process.env.PUBLIC_URL}>
  <App />
</BrowserRouter>


reportWebVitals();
