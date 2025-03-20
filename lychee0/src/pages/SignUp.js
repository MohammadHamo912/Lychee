import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import "../PagesCss/Auth.css";

const schema = yup.object().shape({
  username: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(8, "Invalid phone number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  dob: yup
    .date()
    .typeError("Date of Birth is required")
    .required("Date of Birth is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please retype your password"),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("User signed up:", data);
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box" id="signUpBox">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Full Name"
            {...register("username")}
          />
          <p className="error">{errors.username?.message}</p>

          <input type="email" placeholder="Email" {...register("email")} />
          <p className="error">{errors.email?.message}</p>

          <input
            type="text"
            placeholder="Phone Number"
            {...register("phone")}
          />
          <p className="error">{errors.phone?.message}</p>

          <input type="date" {...register("dob")} />
          <p className="error">{errors.dob?.message}</p>

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <p className="error">{errors.password?.message}</p>

          <input
            type="password"
            placeholder="Retype Password"
            {...register("confirmPassword")}
          />
          <p className="error">{errors.confirmPassword?.message}</p>

          <button type="submit">Sign Up</button>
        </form>

        {/* Google Sign-Up Button */}
        <div className="google-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
              c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
              C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20
              c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
              c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
              C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
              C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
              C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303
              c-0.792,2.237-2.231,4.166-4.087,5.571
              c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
              C36.971,39.205,44,34,44,24
              C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <span>Sign up with Google</span>
        </div>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
