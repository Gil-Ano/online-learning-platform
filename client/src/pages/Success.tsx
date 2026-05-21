import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Processing your payment...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const courseId = localStorage.getItem("pendingCourseId");
    const userId = localStorage.getItem("userId");

    if (sessionId && courseId && userId) {
      // Auto-enroll the user
      api
        .post("/enrollments", { userId, courseId })
        .then(() => {
          setStatus("Payment successful! You are now enrolled. 🎉");
          localStorage.removeItem("pendingCourseId");
        })
        .catch((err) => {
          if (err.response?.data?.message === "Already enrolled") {
            setStatus("Payment successful! You are already enrolled. 🎉");
          } else {
            setStatus("Payment successful! Redirecting to your course...");
          }
        });
    }
  }, [searchParams]);

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
          ✨ {status}
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          You now have access to all course content.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            to="/dashboard"
            style={{
              background: "#e91e63",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "25px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            style={{
              border: "2px solid #e91e63",
              color: "#e91e63",
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
    </div>
  );
};

export default Success;
