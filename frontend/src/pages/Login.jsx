import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await api.post(
        "/users/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (err) {

  console.log("FULL ERROR:", err);

  console.log("RESPONSE:", err.response);

  console.log("DATA:", err.response?.data);

  setError(
    err.response?.data?.message ||
    "Login Failed"
  );

    }

  };

  return (

    <div className="login-container">

      <div className="login-left">

        <div className="brand-section">

          <div className="logo-circle">
            🛡️
          </div>

          <h1>Employee IAM Portal</h1>

          <p>
            Secure Identity & Access Management System
          </p>

        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p>Sign in to continue</p>

          {error && (
            <div
              className="alert alert-danger"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="btn login-btn"
            >
              Sign In
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Login;