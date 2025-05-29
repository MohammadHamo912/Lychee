import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import "../PagesCss/Auth.css";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]+$/, "Must be numeric"),
  password: yup.string().min(6).required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Retype your password"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const newUser = {
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        passwordHash: data.password, // backend will hash
        phone: data.phone,
        role: "customer",
      };

      await axios.post("http://localhost:8081/api/users/signup", newUser);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        alert("Email already registered.");
      } else if (err.response?.status === 400) {
        alert("Missing or invalid data.");
      } else {
        alert("Signup failed. Please try again.");
      }
    }

  };

  return (
    <>
      <NavBar />
      <div className="auth-container">
        <div className="auth-box" id="signUpBox">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="name-row">
              <input placeholder="First Name" {...register("first_name")} />
              <input placeholder="Last Name" {...register("last_name")} />
            </div>
            <p className="error">{errors.first_name?.message}</p>
            <p className="error">{errors.last_name?.message}</p>

            <input placeholder="Email" {...register("email")} />
            <p className="error">{errors.email?.message}</p>

            <input placeholder="Phone Number" {...register("phone")} />
            <p className="error">{errors.phone?.message}</p>

            <input placeholder="Password" type="password" {...register("password")} />
            <p className="error">{errors.password?.message}</p>

            <input placeholder="Retype Password" type="password" {...register("confirmPassword")} />
            <p className="error">{errors.confirmPassword?.message}</p>

            <button type="submit">Sign Up</button>
          </form>

          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
