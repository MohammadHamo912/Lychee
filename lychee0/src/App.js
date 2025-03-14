<<<<<<< HEAD
import logo from "./logo.svg";
import "./App.css";
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
>>>>>>> 869fbeefe7aabce933e4d49db7a3341f7cc7c501

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
