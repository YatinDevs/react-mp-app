import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { showToast } from "../api/toastService";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { loading, error, checkLogin } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await checkLogin(credentials);
      if (response.success) {
        showToast("Login successful");
        navigate("/home");
      } else {
        showToast(response.message || "Login failed", { type: "error" });
      }
    } catch (err) {
      showToast("Login error", { type: "error" });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
