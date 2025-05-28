import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useUser } from "../context/UserContext"; // ✅ context hook
import "../PagesCss/Auth.css";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password too short").required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ use context to update global user state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8081/api/users/login", data);
      const user = response.data;

      login(user); // ✅ context login function
      alert(`Welcome, ${user.name}`);

      // Redirect based on role (optional refinement)
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="auth-container">
        <div className="auth-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Email" {...register("email")} />
            <p className="error">{errors.email?.message}</p>

            <input type="password" placeholder="Password" {...register("password")} />
            <p className="error">{errors.password?.message}</p>

            <button type="submit">Login</button>
          </form>
          <p>Don’t have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </>
  );
};

export default Login;
