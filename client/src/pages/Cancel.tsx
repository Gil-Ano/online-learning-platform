import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        background: "#fce4ec",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(233, 30, 99, 0.15)",
          maxWidth: "500px",
        }}
      >
        <h1
          style={{ color: "#e91e63", fontSize: "2rem", marginBottom: "1rem" }}
        >
          Payment Cancelled
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          No worries! You can try again anytime.
        </p>
        <Link
          to="/"
          style={{
            background: "#e91e63",
            color: "white",
            padding: "0.8rem 2rem",
            borderRadius: "25px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
