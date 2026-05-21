import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        background: "#fce4ec",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(233, 30, 99, 0.15)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "#e91e63",
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "1.8rem",
          }}
        >
          ✨ Welcome Back
        </h2>
        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}
          >
            {error}
          </p>
        )}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{ color: "#666", display: "block", marginBottom: "0.3rem" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "2px solid #f8c8dc",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{ color: "#666", display: "block", marginBottom: "0.3rem" }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "2px solid #f8c8dc",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#e91e63",
            color: "white",
            border: "none",
            borderRadius: "25px",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#888" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e91e63", fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
