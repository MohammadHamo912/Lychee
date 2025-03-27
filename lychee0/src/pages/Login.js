import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import "../PagesCss/Auth.css";
import NavBar from "../components/NavBar";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("User logged in:", data);
    navigate("/dashboard");
  };

  const handleGuestLogin = () => {
    console.log("Guest login");
    navigate("/dashboard");
  };

  return (
    <>
      <NavBar />
      <div className="auth-container">
        <div className="auth-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            <p className="error">{errors.email?.message}</p>

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <p className="error">{errors.password?.message}</p>

            <button type="submit">Login</button>
          </form>

          {/* Guest Login Button */}
          <button className="guest-btn" onClick={handleGuestLogin}>
            Continue as Guest
          </button>

          {/* Google Sign-In Button */}
          <div className="google-btn">
            <svg /* svg content... */></svg>
            <span>Sign in with Google</span>
          </div>

          <p>
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
