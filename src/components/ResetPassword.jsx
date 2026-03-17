import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = async () => {
    const response = await fetch("http://localhost:8082/auth-service/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    });
    const result = await response.json();

    if (result === true) {
      alert("Password reset successful!");
      navigate("/dashboard");
      // optionally redirect to login page
    } else if (result === false) {
      alert("Invalid token or token expired.");
    } else {
      alert("Unexpected response from server.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;