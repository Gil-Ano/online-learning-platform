import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Enrollment {
  id: string;
  courseId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string;
  };
}

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    api
      .get(`/enrollments/${user.id}`)
      .then((res) => setEnrollments(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ background: "#fce4ec", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{ color: "#e91e63", fontSize: "2rem", marginBottom: "1.5rem" }}
        >
          ✨ Welcome, {user.name}!
        </h1>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(233, 30, 99, 0.1)",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#e91e63", marginBottom: "1rem" }}>
            📊 Your Progress
          </h3>
          <p style={{ color: "#666" }}>
            {enrollments.length} course{enrollments.length !== 1 ? "s" : ""}{" "}
            enrolled
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(233, 30, 99, 0.1)",
          }}
        >
          <h3 style={{ color: "#e91e63", marginBottom: "1rem" }}>
            📚 My Courses
          </h3>
          {enrollments.length === 0 ? (
            <p style={{ color: "#888" }}>
              No courses yet.{" "}
              <a href="/" style={{ color: "#e91e63" }}>
                Browse courses
              </a>
            </p>
          ) : (
            enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                style={{
                  padding: "1rem",
                  marginTop: "0.5rem",
                  border: "1px solid #f8c8dc",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ color: "#666", fontWeight: 600 }}>
                    {enrollment.course.title}
                  </p>
                  <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
                    Enrolled:{" "}
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/course/${enrollment.courseId}`)}
                  style={{
                    background: "#fce4ec",
                    color: "#e91e63",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View Course
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
