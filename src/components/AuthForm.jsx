
// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css"; // import the CSS

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // login, signup, forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // for navigation after login

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError(""); // reset errors when switching mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      // Call backend login API
      try {
        const response = await fetch("http://localhost:8082/auth-service/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }


        const result = await response.json();
        // assuming backend returns { success: true/false }
        if (result.success) {
          console.log("Login successful");
          localStorage.setItem("email", email);
          navigate("/dashboard"); // navigate to FileUpload page
        } else {
          setError("Invalid email or password");
        }
      } catch (err) {
        console.error(err);
        setError("Login failed. Please try again.");
      }

    } else if (mode === "signup") {
      // Signup API call
      try {
        const response = await fetch("http://localhost:8082/auth-service/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json(); // backend returns true or false

        if (result === true) {
          console.log("Registration successful");
          toggleMode("login"); // switch back to login
        } else {
          setError("Email already exists. Try Forgot Password.");
        }

      } catch (err) {
        console.error(err);
        setError("Signup failed. Please try again.");
      }

    } else {
      console.log(mode, "form submitted");
      // forgot password logic can be added here later

      const response = await fetch("http://localhost:8082/auth-service/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json(); // backend returns true or false

        if (result === true) {
          console.log("Registration successful");
          alert("Password reset link sent to email");
          toggleMode("login"); // switch back to login
        } else {
          setError("Email already exists. Try Forgot Password.");
        }


      


    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          {mode === "login" && "Login"}
          {mode === "signup" && "Sign Up"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <input type="text" placeholder="Full Name" className="auth-input" />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              required
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="auth-input"
            />
          )}

          <button type="submit" className="auth-button">
            {mode === "login" && "Login"}
            {mode === "signup" && "Sign Up"}
            {mode === "forgot" && "Send Reset Link"}
          </button>
        </form>

        <div className="auth-footer">
          {mode !== "signup" && (
            <button onClick={() => toggleMode("signup")} className="auth-link">
              Sign Up
            </button>
          )}
          {mode !== "login" && (
            <button onClick={() => toggleMode("login")} className="auth-link">
              Login
            </button>
          )}
          {mode !== "forgot" && (
            <button onClick={() => toggleMode("forgot")} className="auth-link">
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

