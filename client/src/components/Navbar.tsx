import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "white",
        borderBottom: "2px solid #f8c8dc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(248, 200, 220, 0.3)",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#e91e63",
          textDecoration: "none",
          fontSize: "1.8rem",
          fontWeight: "bold",
          letterSpacing: "-1px",
        }}
      >
        🌸 GirlyGeek
      </Link>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link
          to="/"
          style={{ color: "#e91e63", textDecoration: "none", fontWeight: 500 }}
        >
          Courses
        </Link>
        {token ? (
          <>
            <Link
              to="/dashboard"
              style={{
                color: "#e91e63",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Dashboard
            </Link>
            <span style={{ color: "#666" }}>Hi, {user.name}</span>
            <button
              onClick={logout}
              style={{
                background: "#e91e63",
                color: "white",
                border: "none",
                padding: "0.5rem 1.2rem",
                cursor: "pointer",
                borderRadius: "20px",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "#e91e63",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: "#e91e63",
                color: "white",
                padding: "0.5rem 1.2rem",
                borderRadius: "20px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
