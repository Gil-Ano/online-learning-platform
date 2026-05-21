import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  instructor: { id: string; name: string };
  _count: { enrollments: number; lessons: number; reviews: number };
}

const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ background: "#fce4ec", minHeight: "100vh", padding: "2rem" }}>
      <h1
        style={{
          color: "#e91e63",
          textAlign: "center",
          fontSize: "2.2rem",
          marginBottom: "2rem",
        }}
      >
        ✦ Explore Our Courses ✦
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {courses.map((course) => (
          <Link
            to={`/course/${course.id}`}
            key={course.id}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid #f8c8dc",
                boxShadow: "0 4px 15px rgba(233, 30, 99, 0.1)",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
            >
              <h3 style={{ color: "#e91e63", marginBottom: "0.5rem" }}>
                {course.title}
              </h3>
              <p
                style={{
                  color: "#888",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {course.description?.substring(0, 100)}...
              </p>
              <p style={{ color: "#666", fontSize: "0.85rem" }}>
                <strong>By:</strong> {course.instructor.name}
              </p>
              <span
                style={{
                  display: "inline-block",
                  background: "#f8c8dc",
                  color: "#e91e63",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  margin: "0.5rem 0",
                }}
              >
                {course.category}
              </span>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#e91e63",
                  marginTop: "0.5rem",
                }}
              >
                ${course.price}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginTop: "0.5rem",
                }}
              >
                <span>📚 {course._count.lessons} lessons</span>
                <span>👥 {course._count.enrollments} students</span>
                <span>⭐ {course._count.reviews} reviews</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
