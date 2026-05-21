import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: { id: string; name: string };
  lessons: {
    id: string;
    title: string;
    videoUrl: string | null;
    order: number;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: { id: string; name: string };
  }[];
  _count: { enrollments: number };
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch(console.error);
  }, [id]);

  const handleEnroll = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/enrollments", { userId: user.id, courseId: id });
      alert("Enrolled successfully!");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  const handlePayment = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      localStorage.setItem("pendingCourseId", id || "");
      const res = await api.post("/payments/checkout", {
        courseId: id,
        userId: user.id,
      });
      window.location.href = res.data.url;
    } catch (err: any) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  if (!course)
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#e91e63" }}>
        Loading...
      </div>
    );

  return (
    <div style={{ background: "#fce4ec", minHeight: "100vh", padding: "2rem" }}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(233, 30, 99, 0.1)",
        }}
      >
        <h1 style={{ color: "#e91e63", fontSize: "2rem" }}>{course.title}</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          By {course.instructor.name}
        </p>
        <p style={{ color: "#888", marginTop: "1rem", lineHeight: "1.6" }}>
          {course.description}
        </p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <span
            style={{
              background: "#f8c8dc",
              color: "#e91e63",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontSize: "0.9rem",
            }}
          >
            {course._count.enrollments} students
          </span>
          <span
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#e91e63" }}
          >
            ${course.price}
          </span>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          {course.price === 0 ? (
            <button
              onClick={handleEnroll}
              style={{
                background: "#e91e63",
                color: "white",
                border: "none",
                padding: "0.8rem 2rem",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Enroll for Free
            </button>
          ) : (
            <button
              onClick={handlePayment}
              style={{
                background: "#e91e63",
                color: "white",
                border: "none",
                padding: "0.8rem 2rem",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Buy Now - ${course.price}
            </button>
          )}
        </div>

        {/* Lessons */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#e91e63" }}>
            📚 Lessons ({course.lessons.length})
          </h3>
          {course.lessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                padding: "1rem",
                marginTop: "0.5rem",
                background: "#fce4ec",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "#e91e63", fontWeight: 600 }}>
                {lesson.order}.
              </span>
              <span style={{ color: "#666" }}>{lesson.title}</span>
              {lesson.videoUrl && (
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  style={{
                    marginLeft: "auto",
                    color: "#e91e63",
                    fontSize: "0.85rem",
                  }}
                >
                  ▶ Watch
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#e91e63" }}>
            ⭐ Reviews ({course.reviews.length})
          </h3>
          {course.reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "1rem",
                marginTop: "0.5rem",
                border: "1px solid #f8c8dc",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "#666", fontWeight: 600 }}>
                {review.user.name} - {"⭐".repeat(review.rating)}
              </p>
              <p style={{ color: "#888" }}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
